import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import type { LeavesRepository } from './leaves.repository';
import type { LeaveTypesRepository } from './leave-types.repository';
import type { AuditLogService } from '../../database/audit-log.service';
import type { Leave } from '@prisma/client';

describe('LeavesService', () => {
  let leavesRepository: Pick<LeavesRepository, 'findById' | 'updateStatus' | 'create'>;
  let leaveTypesRepository: Pick<LeaveTypesRepository, 'findById'>;
  let auditLogService: Pick<AuditLogService, 'record'>;
  let service: LeavesService;

  beforeEach(() => {
    leavesRepository = { findById: vi.fn(), updateStatus: vi.fn(), create: vi.fn() };
    leaveTypesRepository = { findById: vi.fn() };
    auditLogService = { record: vi.fn() };

    service = new LeavesService(
      leavesRepository as unknown as LeavesRepository,
      leaveTypesRepository as unknown as LeaveTypesRepository,
      auditLogService as unknown as AuditLogService,
    );
  });

  it('rejects reviewing a leave request that no longer exists', async () => {
    vi.mocked(leavesRepository.findById).mockResolvedValue(null);

    await expect(service.updateStatus('missing', 'APPROVED', 'user-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects reviewing a leave request that was already decided', async () => {
    vi.mocked(leavesRepository.findById).mockResolvedValue({ status: 'APPROVED' } as Leave);

    await expect(service.updateStatus('leave-1', 'REJECTED', 'user-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(leavesRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('rejects creating a leave request against a non-existent leave type', async () => {
    vi.mocked(leaveTypesRepository.findById).mockResolvedValue(null);

    await expect(
      service.create({
        employeeId: 'emp-1',
        leaveTypeId: 'missing-type',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
