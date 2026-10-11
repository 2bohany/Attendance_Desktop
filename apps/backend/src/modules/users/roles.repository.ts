import { Injectable } from '@nestjs/common';
import { Prisma, type Permission } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const roleWithPermissionsInclude = {
  permissions: { include: { permission: true } },
} satisfies Prisma.RoleInclude;

export type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: typeof roleWithPermissionsInclude;
}>;

type CreateRoleData = {
  name: string;
  description: string | null;
  permissionKeys: string[];
};

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByName(name: string): Promise<RoleWithPermissions | null> {
    return this.prisma.role.findUnique({ where: { name }, include: roleWithPermissionsInclude });
  }

  findById(id: string): Promise<RoleWithPermissions | null> {
    return this.prisma.role.findUnique({ where: { id }, include: roleWithPermissionsInclude });
  }

  findMany(): Promise<RoleWithPermissions[]> {
    return this.prisma.role.findMany({
      include: roleWithPermissionsInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  listPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({ orderBy: { key: 'asc' } });
  }

  async create(data: CreateRoleData): Promise<RoleWithPermissions> {
    const role = await this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          create: data.permissionKeys.map((key) => ({ permission: { connect: { key } } })),
        },
      },
      include: roleWithPermissionsInclude,
    });

    return role;
  }

  async setPermissions(roleId: string, permissionKeys: string[]): Promise<RoleWithPermissions> {
    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: permissionKeys } },
    });

    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId } }),
      this.prisma.rolePermission.createMany({
        data: permissions.map((permission) => ({ roleId, permissionId: permission.id })),
      }),
    ]);

    const updated = await this.findById(roleId);
    if (!updated) {
      throw new Error(`Role ${roleId} was deleted during permission update`);
    }

    return updated;
  }
}
