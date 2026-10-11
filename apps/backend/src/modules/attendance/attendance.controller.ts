import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import type { AttendanceRecord } from '@attendance/shared';
import { CurrentUser, RequirePermissions } from '../../common/decorators';
import type { RequestUser } from '../../common/types/request-user.type';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @RequirePermissions('attendance.view')
  list(@Query('date') date?: string): Promise<AttendanceRecord[]> {
    return this.attendanceService.listForDate(date);
  }

  @Post('check-in')
  @RequirePermissions('attendance.create')
  checkIn(@Body() dto: CheckInDto, @CurrentUser() user: RequestUser): Promise<void> {
    return this.attendanceService.checkIn(dto.employeeId, user.id);
  }

  @Post('check-out')
  @RequirePermissions('attendance.edit')
  checkOut(@Body() dto: CheckInDto, @CurrentUser() user: RequestUser): Promise<void> {
    return this.attendanceService.checkOut(dto.employeeId, user.id);
  }
}
