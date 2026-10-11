import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { DatabasePathService } from './database-path.service';

const SECRET_FILENAME = '.auth-secret';

export class SecretsService {
  constructor(private readonly databasePathService: DatabasePathService) {}

  getOrCreateJwtSecret(): string {
    const secretPath = path.join(this.databasePathService.getDataDirectory(), SECRET_FILENAME);

    if (fs.existsSync(secretPath)) {
      const existing = fs.readFileSync(secretPath, 'utf-8').trim();
      if (existing) {
        return existing;
      }
    }

    const secret = crypto.randomBytes(48).toString('hex');
    fs.writeFileSync(secretPath, secret, { mode: 0o600 });
    return secret;
  }
}
