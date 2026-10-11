import { Injectable } from '@nestjs/common';
import { Prisma, type Employee } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const employeeWithDepartmentInclude = {
  department: true,
} satisfies Prisma.EmployeeInclude;

export type EmployeeWithDepartment = Prisma.EmployeeGetPayload<{
  include: typeof employeeWithDepartmentInclude;
}>;

type EmployeeWriteData = {
  fullName: string;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  hireDate: Date;
  notes: string | null;
  departmentId: string | null;
};

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  count(): Promise<number> {
    return this.prisma.employee.count();
  }

  findMany(): Promise<EmployeeWithDepartment[]> {
    return this.prisma.employee.findMany({
      include: employeeWithDepartmentInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(id: string): Promise<EmployeeWithDepartment | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: employeeWithDepartmentInclude,
    });
  }

  create(employeeCode: string, data: EmployeeWriteData): Promise<EmployeeWithDepartment> {
    return this.prisma.employee.create({
      data: { ...data, employeeCode },
      include: employeeWithDepartmentInclude,
    });
  }

  update(id: string, data: EmployeeWriteData): Promise<EmployeeWithDepartment> {
    return this.prisma.employee.update({
      where: { id },
      data,
      include: employeeWithDepartmentInclude,
    });
  }

  setActive(id: string, isActive: boolean): Promise<Employee> {
    return this.prisma.employee.update({ where: { id }, data: { isActive } });
  }
}
