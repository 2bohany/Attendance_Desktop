import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import {
  APP_NAME,
  DATA_DIRECTORY,
  DATABASE_FILENAME,
  BACKUP_DIRECTORY_NAME,
  LOGS_DIRECTORY_NAME,
} from '@attendance/config';

export class DatabasePathService {
  private readonly userDataPath: string;

  constructor() {
    this.userDataPath = app.getPath('userData');
  }

  getUserDataPath(): string {
    return this.userDataPath;
  }

  getDataDirectory(): string {
    return path.join(this.userDataPath, DATA_DIRECTORY);
  }

  getBackupDirectory(): string {
    return path.join(this.getDataDirectory(), BACKUP_DIRECTORY_NAME);
  }

  getLogsDirectory(): string {
    return path.join(this.getUserDataPath(), LOGS_DIRECTORY_NAME);
  }

  getDatabasePath(): string {
    return path.join(this.getDataDirectory(), DATABASE_FILENAME);
  }

  getDatabaseUrl(): string {
    const dbPath = this.getDatabasePath().replace(/\\/g, '/');
    return `file:${dbPath}`;
  }

  ensureDirectories(): void {
    const dataDir = this.getDataDirectory();
    const backupDir = this.getBackupDirectory();
    const logsDir = this.getLogsDirectory();

    for (const dir of [dataDir, backupDir, logsDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  databaseExists(): boolean {
    return fs.existsSync(this.getDatabasePath());
  }

  getAppInfo(): { name: string; version: string; environment: string } {
    return {
      name: APP_NAME,
      version: app.getVersion(),
      environment: process.env.APP_ENV ?? 'development',
    };
  }

  getDatabaseInfo(): { path: string; exists: boolean; initialized: boolean } {
    const dbPath = this.getDatabasePath();
    const exists = this.databaseExists();

    return {
      path: dbPath,
      exists,
      initialized: exists,
    };
  }
}

export function resolveBackendRoot(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend');
  }
  return path.join(app.getAppPath(), '../backend');
}

export function resolvePrismaDirectory(): string {
  return path.join(resolveBackendRoot(), 'prisma');
}

export function resolvePrismaCliPath(): string {
  const backendRoot = resolveBackendRoot();
  const candidates = [
    path.join(backendRoot, 'node_modules', 'prisma', 'build', 'index.js'),
    path.join(backendRoot, '..', '..', 'node_modules', 'prisma', 'build', 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0]!;
}
