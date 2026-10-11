import { spawn } from 'child_process';
import path from 'path';
import {
  DatabasePathService,
  resolvePrismaCliPath,
  resolvePrismaDirectory,
} from './database-path.service';

export class DatabaseInitService {
  constructor(private readonly databasePathService: DatabasePathService) {}

  async initialize(): Promise<void> {
    this.databasePathService.ensureDirectories();

    const databaseUrl = this.databasePathService.getDatabaseUrl();
    process.env.DATABASE_URL = databaseUrl;

    await this.runMigrations(databaseUrl);
  }

  private runMigrations(databaseUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const prismaDir = resolvePrismaDirectory();
      const prismaCli = resolvePrismaCliPath();
      const schemaPath = path.join(prismaDir, 'schema.prisma');

      const args = ['migrate', 'deploy', '--schema', schemaPath];

      const child = spawn(process.execPath, [prismaCli, ...args], {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
          ELECTRON_RUN_AS_NODE: '1',
        },
        cwd: prismaDir,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(`Migration failed (code ${code}): ${stderr || stdout || 'Unknown error'}`),
          );
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}
