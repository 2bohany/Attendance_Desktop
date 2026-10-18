import { registerAs } from '@nestjs/config';
import { DEFAULT_APP_PORT } from '@attendance/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT ?? String(DEFAULT_APP_PORT), 10),
  environment: process.env.APP_ENV ?? (process.env.VERCEL ? 'production' : 'development'),
  companyName: process.env.COMPANY_NAME ?? '',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  backupDirectory: process.env.BACKUP_DIRECTORY ?? '',
}));
