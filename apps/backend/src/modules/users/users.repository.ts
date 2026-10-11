import { Injectable } from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const userWithRoleInclude = {
  role: {
    include: {
      permissions: { include: { permission: true } },
    },
  },
} satisfies Prisma.UserInclude;

export type UserWithRole = Prisma.UserGetPayload<{ include: typeof userWithRoleInclude }>;

type CreateUserData = {
  username: string;
  email: string | null;
  fullName: string;
  passwordHash: string;
  roleId: string;
};

type UpdateProfileData = {
  username: string;
  email: string | null;
  fullName: string;
  passwordHash?: string;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  count(): Promise<number> {
    return this.prisma.user.count();
  }

  countActiveByRole(roleId: string): Promise<number> {
    return this.prisma.user.count({ where: { roleId, isActive: true } });
  }

  findByUsernameWithRole(username: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({ where: { username }, include: userWithRoleInclude });
  }

  findByIdWithRole(id: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({ where: { id }, include: userWithRoleInclude });
  }

  findMany(): Promise<UserWithRole[]> {
    return this.prisma.user.findMany({
      include: userWithRoleInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }

  updateProfile(id: string, data: UpdateProfileData): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  updateRole(id: string, roleId: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { roleId } });
  }

  setActive(id: string, isActive: boolean): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { isActive } });
  }

  touchLastLogin(id: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
  }
}
