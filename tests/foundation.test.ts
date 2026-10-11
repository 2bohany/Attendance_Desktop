import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  DATABASE_FILENAME,
  DATA_DIRECTORY,
  BACKUP_DIRECTORY_NAME,
  LOGS_DIRECTORY_NAME,
  PERMISSION_KEYS,
  ADMIN_ROLE_NAME,
} from '@attendance/config';

describe('Database path configuration', () => {
  it('should define correct app name', () => {
    expect(APP_NAME).toBe('AttendanceApp');
  });

  it('should define correct database filename', () => {
    expect(DATABASE_FILENAME).toBe('attendance.db');
  });

  it('should define data, backup, and logs directories', () => {
    expect(DATA_DIRECTORY).toBe('data');
    expect(BACKUP_DIRECTORY_NAME).toBe('backups');
    expect(LOGS_DIRECTORY_NAME).toBe('logs');
  });
});

describe('Shared types', () => {
  it('should validate backend request schema', async () => {
    const { backendRequestSchema } = await import('@attendance/shared');
    const result = backendRequestSchema.safeParse({
      method: 'GET',
      path: '/health',
    });
    expect(result.success).toBe(true);
  });

  it('should validate the login schema', async () => {
    const { loginSchema } = await import('@attendance/shared');
    const result = loginSchema.safeParse({ username: 'admin', password: 'secret' });
    expect(result.success).toBe(true);
  });
});

describe('Auth / RBAC configuration', () => {
  it('should define a non-empty, unique permission catalog', () => {
    expect(PERMISSION_KEYS.length).toBeGreaterThan(0);
    expect(new Set(PERMISSION_KEYS).size).toBe(PERMISSION_KEYS.length);
  });

  it('should define the default administrator role name', () => {
    expect(ADMIN_ROLE_NAME).toBe('Admin');
  });
});
