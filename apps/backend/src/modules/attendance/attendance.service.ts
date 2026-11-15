import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { AttendanceRecord, AttendanceStatus } from '@attendance/shared';
import { AttendanceRepository, type AttendanceRecordWithEmployee } from './attendance.repository';
import { AuditLogService } from '../../database/audit-log.service';
import { businessDay } from '../../common/utils/business-day';


function toAttendanceRecord(record: AttendanceRecordWithEmployee): AttendanceRecord {
  const status: AttendanceStatus = record.checkOut ? 'PRESENT' : 'INCOMPLETE';
  return {
    id: record.id,
    date: record.date.toISOString(),
    checkIn: record.checkIn ? record.checkIn.toISOString() : null,
    checkOut: record.checkOut ? record.checkOut.toISOString() : null,
    notes: record.notes,
    status,
    employee: record.employee,
  };
}

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async listForDate(date?: string): Promise<AttendanceRecord[]> {
    const records = await this.attendanceRepository.findByDate(businessDay(date));
    return records.map(toAttendanceRecord);
  }

  async checkIn(employeeId: string, actorUserId: string): Promise<void> {
    const today = businessDay();
    const existing = await this.attendanceRepository.findByEmployeeAndDate(employeeId, today);
    if (existing) {
      throw new ConflictException('Employee has already checked in today');
    }

    await this.attendanceRepository.create(employeeId, today, new Date());
    await this.auditLogService.record({
      action: 'attendance.check-in',
      entityType: 'Employee',
      entityId: employeeId,
      userId: actorUserId,
    });
  }

  async checkOut(employeeId: string, actorUserId: string): Promise<void> {
    const today = businessDay();
    const existing = await this.attendanceRepository.findByEmployeeAndDate(employeeId, today);
    if (!existing) {
      throw new NotFoundException('Employee has not checked in today');
    }
    if (existing.checkOut) {
      throw new ConflictException('Employee has already checked out today');
    }

    await this.attendanceRepository.setCheckOut(existing.id, new Date());
    await this.auditLogService.record({
      action: 'attendance.check-out',
      entityType: 'Employee',
      entityId: employeeId,
      userId: actorUserId,
    });
  }
}
