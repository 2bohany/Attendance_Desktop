import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { Employee } from '@attendance/shared';
import { RequirePermissions } from '../../common/decorators';
import { EmployeesService } from './employees.service';
import { EmployeeFormDto } from './dto/employee-form.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @RequirePermissions('employees.view')
  list(): Promise<Employee[]> {
    return this.employeesService.list();
  }

  @Post()
  @RequirePermissions('employees.create')
  create(@Body() dto: EmployeeFormDto): Promise<Employee> {
    return this.employeesService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('employees.edit')
  update(@Param('id') id: string, @Body() dto: EmployeeFormDto): Promise<Employee> {
    return this.employeesService.update(id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('employees.edit')
  setActive(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeStatusDto,
  ): Promise<Employee> {
    return this.employeesService.setActive(id, dto.isActive);
  }
}
