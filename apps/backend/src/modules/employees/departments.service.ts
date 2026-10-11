import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Department } from '@attendance/shared';
import { DepartmentsRepository } from './departments.repository';
import { toDepartment } from './employees.mapper';
import type { CreateDepartmentDto } from './dto/create-department.dto';
import type { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  async list(): Promise<Department[]> {
    const departments = await this.departmentsRepository.findMany();
    return departments.map(toDepartment);
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    try {
      const department = await this.departmentsRepository.create({
        name: dto.name,
        description: dto.description || null,
      });
      return toDepartment(department);
    } catch (error) {
      throw this.mapWriteError(error);
    }
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const existing = await this.departmentsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    try {
      const department = await this.departmentsRepository.update(id, {
        name: dto.name,
        description: dto.description || null,
      });
      return toDepartment(department);
    } catch (error) {
      throw this.mapWriteError(error);
    }
  }

  async delete(id: string): Promise<void> {
    const existing = await this.departmentsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    await this.departmentsRepository.delete(id);
  }

  private mapWriteError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new ConflictException('A department with this name already exists');
    }
    return error as Error;
  }
}
