import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { PERMISSION_KEYS, ADMIN_ROLE_NAME } from '@attendance/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PermissionsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PermissionsSeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap(): Promise<void> {
    for (const key of PERMISSION_KEYS) {
      await this.prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
      });
    }

    const removed = await this.prisma.permission.deleteMany({
      where: { key: { notIn: [...PERMISSION_KEYS] } },
    });
    if (removed.count > 0) {
      this.logger.log(`Removed ${removed.count} stale permission key(s) no longer in the catalog`);
    }

    const adminRole = await this.prisma.role.upsert({
      where: { name: ADMIN_ROLE_NAME },
      update: {},
      create: { name: ADMIN_ROLE_NAME, description: 'Full system access', isSystem: true },
    });

    const permissions = await this.prisma.permission.findMany();
    for (const permission of permissions) {
      await this.prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: permission.id },
      });
    }

    this.logger.log(
      `Seeded ${permissions.length} permissions and ensured "${ADMIN_ROLE_NAME}" role has full access`,
    );
  }
}
