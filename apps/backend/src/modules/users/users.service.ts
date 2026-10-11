import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { ADMIN_ROLE_NAME } from '@attendance/config';
import type { UserListItem } from '@attendance/shared';
import { UsersRepository } from './users.repository';
import { RolesRepository } from './roles.repository';
import { toUserListItem } from './users.mapper';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

const PASSWORD_SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async list(): Promise<UserListItem[]> {
    const users = await this.usersRepository.findMany();
    return users.map(toUserListItem);
  }

  async create(dto: CreateUserDto): Promise<UserListItem> {
    const role = await this.rolesRepository.findById(dto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    try {
      const user = await this.usersRepository.create({
        username: dto.username,
        email: dto.email || null,
        fullName: dto.fullName,
        passwordHash,
        roleId: dto.roleId,
      });

      const withRole = await this.usersRepository.findByIdWithRole(user.id);
      return toUserListItem(withRole!);
    } catch (error) {
      throw this.mapWriteError(error);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserListItem> {
    const existing = await this.usersRepository.findByIdWithRole(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS)
      : undefined;

    try {
      await this.usersRepository.updateProfile(id, {
        username: dto.username,
        email: dto.email || null,
        fullName: dto.fullName,
        ...(passwordHash ? { passwordHash } : {}),
      });
    } catch (error) {
      throw this.mapWriteError(error);
    }

    const withRole = await this.usersRepository.findByIdWithRole(id);
    return toUserListItem(withRole!);
  }

  async updateRole(id: string, roleId: string): Promise<UserListItem> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.assertNotLastActiveAdmin(id);
    await this.usersRepository.updateRole(id, roleId);

    const withRole = await this.usersRepository.findByIdWithRole(id);
    return toUserListItem(withRole!);
  }

  async setActive(id: string, isActive: boolean): Promise<UserListItem> {
    if (!isActive) {
      await this.assertNotLastActiveAdmin(id);
    }

    await this.usersRepository.setActive(id, isActive);
    const withRole = await this.usersRepository.findByIdWithRole(id);
    return toUserListItem(withRole!);
  }

  private async assertNotLastActiveAdmin(userId: string): Promise<void> {
    const user = await this.usersRepository.findByIdWithRole(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role.name !== ADMIN_ROLE_NAME) {
      return;
    }

    const activeAdmins = await this.usersRepository.countActiveByRole(user.roleId);
    if (activeAdmins <= 1) {
      throw new ForbiddenException('At least one active administrator must remain');
    }
  }

  private mapWriteError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new ConflictException('Username or email already exists');
    }
    return error as Error;
  }
}
