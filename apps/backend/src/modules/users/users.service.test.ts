import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import type { UsersRepository } from './users.repository';
import type { RolesRepository } from './roles.repository';
import type { UserWithRole } from './users.repository';

describe('UsersService.update', () => {
  let usersRepository: Pick<UsersRepository, 'findByIdWithRole' | 'updateProfile'>;
  let rolesRepository: Pick<RolesRepository, 'findById'>;
  let service: UsersService;

  const existingUser = {
    id: 'user-1',
    username: 'original',
    email: null,
    fullName: 'Original Name',
    passwordHash: 'old-hash',
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    role: { id: 'role-1', name: 'Staff' },
  } as unknown as UserWithRole;

  beforeEach(() => {
    usersRepository = { findByIdWithRole: vi.fn(), updateProfile: vi.fn() };
    rolesRepository = { findById: vi.fn() };

    service = new UsersService(
      usersRepository as unknown as UsersRepository,
      rolesRepository as unknown as RolesRepository,
    );
  });

  it('rejects updating a user that does not exist', async () => {
    vi.mocked(usersRepository.findByIdWithRole).mockResolvedValue(null);

    await expect(
      service.update('missing', { username: 'a', fullName: 'A' } as never),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(usersRepository.updateProfile).not.toHaveBeenCalled();
  });

  it('does not rehash the password when none is provided', async () => {
    vi.mocked(usersRepository.findByIdWithRole)
      .mockResolvedValueOnce(existingUser)
      .mockResolvedValueOnce(existingUser);

    await service.update('user-1', { username: 'renamed', fullName: 'Renamed' } as never);

    expect(usersRepository.updateProfile).toHaveBeenCalledWith(
      'user-1',
      expect.not.objectContaining({ passwordHash: expect.anything() }),
    );
  });

  it('hashes and forwards a new password when provided', async () => {
    vi.mocked(usersRepository.findByIdWithRole)
      .mockResolvedValueOnce(existingUser)
      .mockResolvedValueOnce(existingUser);

    await service.update('user-1', {
      username: 'renamed',
      fullName: 'Renamed',
      password: 'brand-new-password',
    } as never);

    const call = vi.mocked(usersRepository.updateProfile).mock.calls[0]?.[1];
    expect(call?.passwordHash).toBeDefined();
    await expect(bcrypt.compare('brand-new-password', call!.passwordHash!)).resolves.toBe(true);
  });
});
