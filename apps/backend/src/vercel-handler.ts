import type { IncomingMessage, ServerResponse } from 'http';
import type { INestApplication } from '@nestjs/common';
import { createApp } from './create-app';

type VercelRequest = IncomingMessage & {
  body?: unknown;
  _body?: boolean;
};

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

export default async function handler(req: VercelRequest, res: ServerResponse): Promise<void> {
  // Vercel pre-parses JSON into req.body. Mark the body as already consumed so
  // Express body-parser does not replace it with an empty object.
  if (req.body !== undefined && req._body !== true) {
    req._body = true;
  }

  const expressHandler = await getHandler();
  expressHandler(req, res);
}

export { cachedApp };
