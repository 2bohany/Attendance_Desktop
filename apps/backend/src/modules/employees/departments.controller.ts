import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import type { Department } from '@attendance/shared';
import { RequirePermissions } from '../../common/decorators';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @RequirePermissions('employees.view')
  list(): Promise<Department[]> {
    return this.departmentsService.list();
  }

  @Post()
  @RequirePermissions('employees.create')
  create(@Body() dto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('employees.edit')
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto): Promise<Department> {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('employees.delete')
  delete(@Param('id') id: string): Promise<void> {
    return this.departmentsService.delete(id);
  }
}
