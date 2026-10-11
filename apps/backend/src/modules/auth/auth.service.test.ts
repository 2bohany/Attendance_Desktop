import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import type { UsersRepository, UserWithRole } from '../users/users.repository';
import type { RolesRepository, RoleWithPermissions } from '../users/roles.repository';

function buildUser(overrides: Partial<UserWithRole> = {}): UserWithRole {
  return {
    id: 'user-1',
    username: 'admin',
    email: null,
    fullName: 'Admin User',
    isActive: true,
    roleId: 'role-1',
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    passwordHash: '',
    role: {
      id: 'role-1',
      name: 'Admin',
      description: null,
      isSystem: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: [],
    },
    ...overrides,
  };
}

function buildRole(overrides: Partial<RoleWithPermissions> = {}): RoleWithPermissions {
  return {
    id: 'role-1',
    name: 'Admin',
    description: null,
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [],
    ...overrides,
  };
}

describe('AuthService', () => {
  let usersRepository: Pick<
    UsersRepository,
    'findByUsernameWithRole' | 'findByIdWithRole' | 'touchLastLogin' | 'count' | 'create'
  >;
  let rolesRepository: Pick<RolesRepository, 'findByName'>;
  let jwtService: { sign: ReturnType<typeof vi.fn> };
  let authService: AuthService;

  beforeEach(() => {
    usersRepository = {
      findByUsernameWithRole: vi.fn(),
      findByIdWithRole: vi.fn(),
      touchLastLogin: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    };
    rolesRepository = { findByName: vi.fn() };
    jwtService = { sign: vi.fn(() => 'signed-token') };

    authService = new AuthService(
      usersRepository as unknown as UsersRepository,
      rolesRepository as unknown as RolesRepository,
      jwtService as never,
    );
  });

  it('rejects login with an incorrect password', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 4);
    vi.mocked(usersRepository.findByUsernameWithRole).mockResolvedValue(
      buildUser({ passwordHash }),
    );

    await expect(authService.login('admin', 'wrong-password')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('issues a token for correct credentials', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 4);
    vi.mocked(usersRepository.findByUsernameWithRole).mockResolvedValue(
      buildUser({ passwordHash }),
    );

    const result = await authService.login('admin', 'correct-password');

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.username).toBe('admin');
    expect(usersRepository.touchLastLogin).toHaveBeenCalledWith('user-1');
  });

  it('blocks bootstrap setup once a user already exists', async () => {
    vi.mocked(usersRepository.count).mockResolvedValue(1);

    await expect(
      authService.bootstrapAdmin({
        username: 'second-admin',
        fullName: 'Second Admin',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('creates the first admin user against the seeded Admin role', async () => {
    vi.mocked(usersRepository.count).mockResolvedValue(0);
    vi.mocked(rolesRepository.findByName).mockResolvedValue(buildRole());
    vi.mocked(usersRepository.create).mockResolvedValue(buildUser());
    vi.mocked(usersRepository.findByIdWithRole).mockResolvedValue(buildUser());

    const result = await authService.bootstrapAdmin({
      username: 'admin',
      fullName: 'Admin User',
      password: 'password123',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(usersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'admin', roleId: 'role-1' }),
    );
  });
});
