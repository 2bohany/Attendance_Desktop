import { Injectable } from '@nestjs/common';
import type { AuditLog } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const EXPORT_ACTION = 'backup.create';

@Injectable()
export class BackupRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Reads every business collection. Password hashes are never exported. */
  async readAllData(): Promise<Record<string, unknown[]>> {
    const [
      settings,
      roles,
      permissions,
      rolePermissions,
      users,
      departments,
      employees,
      attendanceRecords,
      leaveTypes,
      leaves,
      holidays,
    ] = await Promise.all([
      this.prisma.appMeta.findMany(),
      this.prisma.role.findMany(),
      this.prisma.permission.findMany(),
      this.prisma.rolePermission.findMany(),
      this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          isActive: true,
          roleId: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.department.findMany(),
      this.prisma.employee.findMany(),
      this.prisma.attendanceRecord.findMany(),
      this.prisma.leaveType.findMany(),
      this.prisma.leave.findMany(),
      this.prisma.holiday.findMany(),
    ]);

    return {
      settings,
      roles,
      permissions,
      rolePermissions,
      users,
      departments,
      employees,
      attendanceRecords,
      leaveTypes,
      leaves,
      holidays,
    };
  }

  findRecentExports(limit: number): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { action: EXPORT_ACTION },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
