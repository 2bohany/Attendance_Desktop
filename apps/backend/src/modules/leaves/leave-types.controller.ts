import { Body, Controller, Get, Post } from '@nestjs/common';
import type { LeaveType } from '@prisma/client';
import { RequirePermissions } from '../../common/decorators';
import { LeaveTypesService } from './leave-types.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';

@Controller('leave-types')
export class LeaveTypesController {
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  @Get()
  @RequirePermissions('leaves.view')
  list(): Promise<LeaveType[]> {
    return this.leaveTypesService.list();
  }

  @Post()
  @RequirePermissions('leaves.create')
  create(@Body() dto: CreateLeaveTypeDto): Promise<LeaveType> {
    return this.leaveTypesService.create(dto);
  }
}
