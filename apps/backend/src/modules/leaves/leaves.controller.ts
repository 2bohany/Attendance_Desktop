import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { Leave } from '@attendance/shared';
import { CurrentUser, RequirePermissions } from '../../common/decorators';
import type { RequestUser } from '../../common/types/request-user.type';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get()
  @RequirePermissions('leaves.view')
  list(): Promise<Leave[]> {
    return this.leavesService.list();
  }

  @Post()
  @RequirePermissions('leaves.create')
  create(@Body() dto: CreateLeaveDto): Promise<Leave> {
    return this.leavesService.create(dto);
  }

  @Patch(':id/status')
  @RequirePermissions('leaves.edit')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
    @CurrentUser() user: RequestUser,
  ): Promise<Leave> {
    return this.leavesService.updateStatus(id, dto.status, user.id);
  }
}
