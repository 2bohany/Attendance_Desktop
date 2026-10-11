import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Permission } from '@prisma/client';
import type { Role } from '@attendance/shared';
import { RolesRepository } from './roles.repository';
import { toRole } from './users.mapper';
import type { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async list(): Promise<Role[]> {
    const roles = await this.rolesRepository.findMany();
    return roles.map(toRole);
  }

  listPermissions(): Promise<Permission[]> {
    return this.rolesRepository.listPermissions();
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    try {
      const role = await this.rolesRepository.create({
        name: dto.name,
        description: dto.description || null,
        permissionKeys: dto.permissionKeys,
      });
      return toRole(role);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A role with this name already exists');
      }
      throw error;
    }
  }

  async updatePermissions(roleId: string, permissionKeys: string[]): Promise<Role> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be modified');
    }

    const updated = await this.rolesRepository.setPermissions(roleId, permissionKeys);
    return toRole(updated);
  }
}
