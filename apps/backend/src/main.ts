import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_PREFIX } from '@attendance/config';
import { createApp } from './create-app';

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const configService = new ConfigService();
  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('APP_PORT', 3847);
  const host = process.env.APP_HOST ?? '127.0.0.1';

  await app.listen(port, host);
  logger.log(`Backend running on http://${host}:${port}${API_PREFIX}`);
  logger.log(`Environment: ${configService.get<string>('APP_ENV', 'development')}`);
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Failed to start backend: ${message}`);
  process.exit(1);
});
