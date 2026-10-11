import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Leave } from '@attendance/shared';
import { LeavesRepository } from './leaves.repository';
import { LeaveTypesRepository } from './leave-types.repository';
import { toLeave } from './leaves.mapper';
import { AuditLogService } from '../../database/audit-log.service';
import type { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeavesService {
  constructor(
    private readonly leavesRepository: LeavesRepository,
    private readonly leaveTypesRepository: LeaveTypesRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async list(): Promise<Leave[]> {
    const leaves = await this.leavesRepository.findMany();
    return leaves.map(toLeave);
  }

  async create(dto: CreateLeaveDto): Promise<Leave> {
    const leaveType = await this.leaveTypesRepository.findById(dto.leaveTypeId);
    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    const leave = await this.leavesRepository.create({
      employeeId: dto.employeeId,
      leaveTypeId: dto.leaveTypeId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      reason: dto.reason || null,
    });

    return toLeave(leave);
  }

  async updateStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    actorUserId: string,
  ): Promise<Leave> {
    const existing = await this.leavesRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Leave request not found');
    }
    if (existing.status !== 'PENDING') {
      throw new ConflictException('This leave request has already been reviewed');
    }

    const updated = await this.leavesRepository.updateStatus(id, status);
    await this.auditLogService.record({
      action: `leave.${status.toLowerCase()}`,
      entityType: 'Leave',
      entityId: id,
      userId: actorUserId,
    });

    return toLeave(updated);
  }
}
