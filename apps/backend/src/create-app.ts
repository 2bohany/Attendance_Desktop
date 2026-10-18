import { NestFactory } from '@nestjs/core';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppLoggerService } from './common/logging/app-logger.service';
import { API_PREFIX } from '@attendance/config';

function resolveCorsOrigins(): true | string[] {
  const configured = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured && configured.length > 0) {
    return configured;
  }

  if (process.env.VERCEL_URL) {
    return [`https://${process.env.VERCEL_URL}`, 'http://localhost:5173', 'http://127.0.0.1:5173'];
  }

  return ['http://localhost:5173', 'http://127.0.0.1:5173'];
}

export async function createApp(): Promise<INestApplication> {
  const configService = new ConfigService();
  const environment = configService.get<string>('APP_ENV', process.env.VERCEL ? 'production' : 'development');

  const app = await NestFactory.create(AppModule, {
    logger: AppLoggerService.getLogLevels(environment),
  });

  app.enableCors({
    origin: resolveCorsOrigins(),
    credentials: true,
  });
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  return app;
}
