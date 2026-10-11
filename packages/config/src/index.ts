export const APP_NAME = 'AttendanceApp' as const;

export const API_PREFIX = '/api' as const;

export const DEFAULT_APP_PORT = 3847;

export const DATABASE_FILENAME = 'attendance.db' as const;

export const DATA_DIRECTORY = 'data' as const;

export const BACKUP_DIRECTORY_NAME = 'backups' as const;

export const LOGS_DIRECTORY_NAME = 'logs' as const;

export const SUPPORTED_LOCALES = ['en', 'ar'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const PERMISSION_KEYS = [
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'roles.view',
  'roles.create',
  'roles.edit',
  'roles.delete',
  'employees.view',
  'employees.create',
  'employees.edit',
  'employees.delete',
  'attendance.view',
  'attendance.create',
  'attendance.edit',
  'attendance.delete',
  'leaves.view',
  'leaves.create',
  'leaves.edit',
  'leaves.delete',
  'holidays.view',
  'holidays.create',
  'holidays.edit',
  'holidays.delete',
  'reports.view',
  'settings.view',
  'settings.edit',
  'backup.view',
  'backup.create',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const ADMIN_ROLE_NAME = 'Admin' as const;

export const DEFAULT_JWT_EXPIRES_IN = '12h' as const;
