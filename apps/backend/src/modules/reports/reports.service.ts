import { Injectable } from '@nestjs/common';
import type { ReportsSummary } from '@attendance/shared';
import { ReportsRepository } from './reports.repository';

const UPCOMING_HOLIDAYS_LIMIT = 5;

function today(): Date {
  return new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
}

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getSummary(): Promise<ReportsSummary> {
    const date = today();

    const [
      totalEmployees,
      activeEmployees,
      presentToday,
      onLeaveToday,
      upcomingHolidays,
      employeesByDepartment,
    ] = await Promise.all([
      this.reportsRepository.countEmployees(),
      this.reportsRepository.countActiveEmployees(),
      this.reportsRepository.countAttendanceForDate(date),
      this.reportsRepository.countApprovedLeavesOnDate(date),
      this.reportsRepository.upcomingHolidays(date, UPCOMING_HOLIDAYS_LIMIT),
      this.reportsRepository.employeesByDepartment(),
    ]);

    return {
      totalEmployees,
      activeEmployees,
      presentToday,
      onLeaveToday,
      upcomingHolidays: upcomingHolidays.map((holiday) => ({
        id: holiday.id,
        name: holiday.name,
        date: holiday.date.toISOString(),
        description: holiday.description,
      })),
      employeesByDepartment,
    };
  }
}
