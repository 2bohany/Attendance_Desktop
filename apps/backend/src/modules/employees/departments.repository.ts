import { Injectable } from '@nestjs/common';
import { Prisma, type Department } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export type DepartmentWithCount = Department & { _count: { employees: number } };

const departmentWithCountArgs = {
  include: { _count: { select: { employees: true } } },
} satisfies Prisma.DepartmentDefaultArgs;

type CreateDepartmentData = {
  name: string;
  description: string | null;
};

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(): Promise<DepartmentWithCount[]> {
    return this.prisma.department.findMany({
      ...departmentWithCountArgs,
      orderBy: { name: 'asc' },
    });
  }

  findById(id: string): Promise<Department | null> {
    return this.prisma.department.findUnique({ where: { id } });
  }

  create(data: CreateDepartmentData): Promise<DepartmentWithCount> {
    return this.prisma.department.create({ data, ...departmentWithCountArgs });
  }

  update(id: string, data: CreateDepartmentData): Promise<DepartmentWithCount> {
    return this.prisma.department.update({ where: { id }, data, ...departmentWithCountArgs });
  }

  delete(id: string): Promise<Department> {
    return this.prisma.department.delete({ where: { id } });
  }
}
