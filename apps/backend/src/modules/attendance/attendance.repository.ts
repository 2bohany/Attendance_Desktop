import { Injectable } from '@nestjs/common';
import { Prisma, type AttendanceRecord } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const attendanceWithEmployeeInclude = {
  employee: { select: { id: true, employeeCode: true, fullName: true } },
} satisfies Prisma.AttendanceRecordInclude;

export type AttendanceRecordWithEmployee = Prisma.AttendanceRecordGetPayload<{
  include: typeof attendanceWithEmployeeInclude;
}>;

@Injectable()
export class AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmployeeAndDate(employeeId: string, date: Date): Promise<AttendanceRecord | null> {
    return this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId, date } },
    });
  }

  findByDate(date: Date): Promise<AttendanceRecordWithEmployee[]> {
    return this.prisma.attendanceRecord.findMany({
      where: { date },
      include: attendanceWithEmployeeInclude,
      orderBy: { employee: { fullName: 'asc' } },
    });
  }

  create(employeeId: string, date: Date, checkIn: Date): Promise<AttendanceRecord> {
    return this.prisma.attendanceRecord.create({
      data: { employeeId, date, checkIn },
    });
  }

  setCheckOut(id: string, checkOut: Date): Promise<AttendanceRecord> {
    return this.prisma.attendanceRecord.update({ where: { id }, data: { checkOut } });
  }
}
