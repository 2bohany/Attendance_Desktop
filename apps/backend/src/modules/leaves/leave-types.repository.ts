import { Injectable } from '@nestjs/common';
import type { LeaveType } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LeaveTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(): Promise<LeaveType[]> {
    return this.prisma.leaveType.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string): Promise<LeaveType | null> {
    return this.prisma.leaveType.findUnique({ where: { id } });
  }

  create(name: string, description: string | null): Promise<LeaveType> {
    return this.prisma.leaveType.create({ data: { name, description } });
  }
}
