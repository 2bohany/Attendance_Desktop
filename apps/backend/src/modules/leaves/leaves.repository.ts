import { Injectable } from '@nestjs/common';
import { Prisma, type Leave } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const leaveWithRelationsInclude = {
  employee: { select: { id: true, employeeCode: true, fullName: true } },
  leaveType: { select: { id: true, name: true } },
} satisfies Prisma.LeaveInclude;

export type LeaveWithRelations = Prisma.LeaveGetPayload<{
  include: typeof leaveWithRelationsInclude;
}>;

type CreateLeaveData = {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason: string | null;
};

@Injectable()
export class LeavesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(): Promise<LeaveWithRelations[]> {
    return this.prisma.leave.findMany({
      include: leaveWithRelationsInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<Leave | null> {
    return this.prisma.leave.findUnique({ where: { id } });
  }

  create(data: CreateLeaveData): Promise<LeaveWithRelations> {
    return this.prisma.leave.create({ data, include: leaveWithRelationsInclude });
  }

  updateStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<LeaveWithRelations> {
    return this.prisma.leave.update({
      where: { id },
      data: { status },
      include: leaveWithRelationsInclude,
    });
  }

  countApprovedOnDate(date: Date): Promise<number> {
    return this.prisma.leave.count({
      where: { status: 'APPROVED', startDate: { lte: date }, endDate: { gte: date } },
    });
  }
}
