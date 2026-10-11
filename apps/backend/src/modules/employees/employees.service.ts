import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Employee } from '@attendance/shared';
import { EmployeesRepository } from './employees.repository';
import { DepartmentsRepository } from './departments.repository';
import { toEmployee } from './employees.mapper';
import type { EmployeeFormDto } from './dto/employee-form.dto';

const EMPLOYEE_CODE_PREFIX = 'EMP-';
const EMPLOYEE_CODE_PADDING = 4;

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly departmentsRepository: DepartmentsRepository,
  ) {}

  async list(): Promise<Employee[]> {
    const employees = await this.employeesRepository.findMany();
    return employees.map(toEmployee);
  }

  async create(dto: EmployeeFormDto): Promise<Employee> {
    await this.assertDepartmentExists(dto.departmentId);
    const employeeCode = await this.generateEmployeeCode();

    try {
      const employee = await this.employeesRepository.create(employeeCode, this.toWriteData(dto));
      return toEmployee(employee);
    } catch (error) {
      throw this.mapWriteError(error);
    }
  }

  async update(id: string, dto: EmployeeFormDto): Promise<Employee> {
    const existing = await this.employeesRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Employee not found');
    }

    await this.assertDepartmentExists(dto.departmentId);

    try {
      const employee = await this.employeesRepository.update(id, this.toWriteData(dto));
      return toEmployee(employee);
    } catch (error) {
      throw this.mapWriteError(error);
    }
  }

  async setActive(id: string, isActive: boolean): Promise<Employee> {
    const existing = await this.employeesRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Employee not found');
    }

    await this.employeesRepository.setActive(id, isActive);
    const updated = await this.employeesRepository.findById(id);
    return toEmployee(updated!);
  }

  private toWriteData(dto: EmployeeFormDto) {
    return {
      fullName: dto.fullName,
      email: dto.email || null,
      phone: dto.phone || null,
      jobTitle: dto.jobTitle || null,
      hireDate: new Date(dto.hireDate),
      notes: dto.notes || null,
      departmentId: dto.departmentId || null,
    };
  }

  private async assertDepartmentExists(departmentId?: string): Promise<void> {
    if (!departmentId) {
      return;
    }
    const department = await this.departmentsRepository.findById(departmentId);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
  }

  private async generateEmployeeCode(): Promise<string> {
    const count = await this.employeesRepository.count();
    return `${EMPLOYEE_CODE_PREFIX}${String(count + 1).padStart(EMPLOYEE_CODE_PADDING, '0')}`;
  }

  private mapWriteError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new ConflictException('An employee with this email already exists');
    }
    return error as Error;
  }
}
