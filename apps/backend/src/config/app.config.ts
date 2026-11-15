import { registerAs } from '@nestjs/config';
import { DEFAULT_APP_PORT } from '@attendance/config';

function env(name: string, fallback = ''): string {
  return (process.env[name] ?? fallback).trim();
}

function resolveJwtSecret(): string {
  const secret = env('JWT_SECRET');
  if (secret) return secret;
  if (process.env.VERCEL || env('APP_ENV') === 'production') {
    // A missing secret in production would let anyone forge tokens signed with
    // the public development default, so refuse to start instead.
    throw new Error('JWT_SECRET must be set in production');
  }
  return 'insecure-development-secret';
}

export const appConfig = registerAs('app', () => ({
  port: parseInt(env('APP_PORT', String(DEFAULT_APP_PORT)), 10),
  environment: env('APP_ENV', process.env.VERCEL ? 'production' : 'development'),
  companyName: env('COMPANY_NAME'),
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: env('JWT_EXPIRES_IN', '12h'),
  backupDirectory: env('BACKUP_DIRECTORY'),
  timeZone: env('APP_TIMEZONE', 'UTC'),
}));
