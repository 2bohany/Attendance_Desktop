import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DepartmentsRepository } from './departments.repository';

@Module({
  controllers: [EmployeesController, DepartmentsController],
  providers: [
    EmployeesService,
    EmployeesRepository,
    DepartmentsService,
    DepartmentsRepository,
  ],
})
export class EmployeesModule {}
