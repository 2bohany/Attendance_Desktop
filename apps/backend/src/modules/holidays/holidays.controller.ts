import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import type { Holiday } from '@prisma/client';
import { RequirePermissions } from '../../common/decorators';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  @RequirePermissions('holidays.view')
  list(): Promise<Holiday[]> {
    return this.holidaysService.list();
  }

  @Post()
  @RequirePermissions('holidays.create')
  create(@Body() dto: CreateHolidayDto): Promise<Holiday> {
    return this.holidaysService.create(dto);
  }

  @Delete(':id')
  @RequirePermissions('holidays.delete')
  delete(@Param('id') id: string): Promise<void> {
    return this.holidaysService.delete(id);
  }
}
