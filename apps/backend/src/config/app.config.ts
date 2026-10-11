import { registerAs } from '@nestjs/config';
import { DEFAULT_APP_PORT } from '@attendance/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT ?? String(DEFAULT_APP_PORT), 10),
  environment: process.env.APP_ENV ?? 'development',
  companyName: process.env.COMPANY_NAME ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '',
  backupDirectory: process.env.BACKUP_DIRECTORY ?? '',
}));
