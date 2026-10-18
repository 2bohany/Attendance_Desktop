import { registerAs } from '@nestjs/config';
import { DEFAULT_APP_PORT } from '@attendance/config';

function env(name: string, fallback = ''): string {
  return (process.env[name] ?? fallback).trim();
}

export const appConfig = registerAs('app', () => ({
  port: parseInt(env('APP_PORT', String(DEFAULT_APP_PORT)), 10),
  environment: env('APP_ENV', process.env.VERCEL ? 'production' : 'development'),
  companyName: env('COMPANY_NAME'),
  jwtSecret: env('JWT_SECRET', 'change-me-in-production'),
  jwtExpiresIn: env('JWT_EXPIRES_IN', '12h'),
  backupDirectory: env('BACKUP_DIRECTORY'),
}));
