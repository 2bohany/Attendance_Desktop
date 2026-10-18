import type { IncomingMessage, ServerResponse } from 'http';
import type { INestApplication } from '@nestjs/common';
import { createApp } from './create-app';

type ExpressHandler = (req: IncomingMessage, res: ServerResponse) => void;

let cachedHandler: ExpressHandler | undefined;
let cachedApp: INestApplication | undefined;

async function getHandler(): Promise<ExpressHandler> {
  if (cachedHandler) {
    return cachedHandler;
  }

  const app = await createApp();
  await app.init();
  cachedApp = app;
  cachedHandler = app.getHttpAdapter().getInstance() as ExpressHandler;
  return cachedHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const expressHandler = await getHandler();
  expressHandler(req, res);
}

export { cachedApp };
