import { Injectable } from '@nestjs/common';
import type { Holiday } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  countEmployees(): Promise<number> {
    return this.prisma.employee.count();
  }

  countActiveEmployees(): Promise<number> {
    return this.prisma.employee.count({ where: { isActive: true } });
  }

  countAttendanceForDate(date: Date): Promise<number> {
    return this.prisma.attendanceRecord.count({ where: { date } });
  }

  countApprovedLeavesOnDate(date: Date): Promise<number> {
    return this.prisma.leave.count({
      where: { status: 'APPROVED', startDate: { lte: date }, endDate: { gte: date } },
    });
  }

  upcomingHolidays(from: Date, limit: number): Promise<Holiday[]> {
    return this.prisma.holiday.findMany({
      where: { date: { gte: from } },
      orderBy: { date: 'asc' },
      take: limit,
    });
  }

  async employeesByDepartment(): Promise<{ department: string; count: number }[]> {
    const departments = await this.prisma.department.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { name: 'asc' },
    });

    const unassigned = await this.prisma.employee.count({ where: { departmentId: null } });

    const results = departments.map((department) => ({
      department: department.name,
      count: department._count.employees,
    }));

    if (unassigned > 0) {
      results.push({ department: 'Unassigned', count: unassigned });
    }

    return results;
  }
}
