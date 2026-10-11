import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import type { AttendanceRepository } from './attendance.repository';
import type { AuditLogService } from '../../database/audit-log.service';
import type { AttendanceRecord } from '@prisma/client';

describe('AttendanceService', () => {
  let attendanceRepository: Pick<
    AttendanceRepository,
    'findByEmployeeAndDate' | 'create' | 'setCheckOut'
  >;
  let auditLogService: Pick<AuditLogService, 'record'>;
  let service: AttendanceService;

  beforeEach(() => {
    attendanceRepository = {
      findByEmployeeAndDate: vi.fn(),
      create: vi.fn(),
      setCheckOut: vi.fn(),
    };
    auditLogService = { record: vi.fn() };

    service = new AttendanceService(
      attendanceRepository as unknown as AttendanceRepository,
      auditLogService as unknown as AuditLogService,
    );
  });

  it('rejects a second check-in for the same employee on the same day', async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue({
      id: 'rec-1',
    } as AttendanceRecord);

    await expect(service.checkIn('emp-1', 'user-1')).rejects.toBeInstanceOf(ConflictException);
    expect(attendanceRepository.create).not.toHaveBeenCalled();
  });

  it('rejects check-out when the employee never checked in today', async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue(null);

    await expect(service.checkOut('emp-1', 'user-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects a second check-out for the same day', async () => {
    vi.mocked(attendanceRepository.findByEmployeeAndDate).mockResolvedValue({
      id: 'rec-1',
      checkOut: new Date(),
    } as AttendanceRecord);

    await expect(service.checkOut('emp-1', 'user-1')).rejects.toBeInstanceOf(ConflictException);
  });
});
