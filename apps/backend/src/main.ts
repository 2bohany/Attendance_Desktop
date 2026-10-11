import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppLoggerService } from './common/logging/app-logger.service';
import { API_PREFIX } from '@attendance/config';

async function bootstrap(): Promise<void> {
  const configService = new ConfigService();
  const environment = configService.get<string>('APP_ENV', 'development');

  const app = await NestFactory.create(AppModule, {
    logger: AppLoggerService.getLogLevels(environment),
  });

  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('APP_PORT', 3847);

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

  await app.listen(port, '127.0.0.1');
  logger.log(`Backend running on http://127.0.0.1:${port}${API_PREFIX}`);
  logger.log(`Environment: ${environment}`);
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Failed to start backend: ${message}`);
  process.exit(1);
});
