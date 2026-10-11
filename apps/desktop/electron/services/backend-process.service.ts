import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { app } from 'electron';
import { DEFAULT_APP_PORT, DEFAULT_JWT_EXPIRES_IN } from '@attendance/config';
import { resolveBackendRoot } from './database-path.service';

export class BackendProcessService {
  private process: ChildProcess | null = null;
  private port: number = DEFAULT_APP_PORT;
  private authToken: string | null = null;

  getPort(): number {
    return this.port;
  }

  getBaseUrl(): string {
    return `http://127.0.0.1:${this.port}`;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  getAuthHeader(): string | undefined {
    return this.authToken ? `Bearer ${this.authToken}` : undefined;
  }

  async start(databaseUrl: string, jwtSecret: string, backupDirectory: string): Promise<void> {
    this.port = parseInt(process.env.APP_PORT ?? String(DEFAULT_APP_PORT), 10);

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      DATABASE_URL: databaseUrl,
      APP_PORT: String(this.port),
      APP_ENV: process.env.APP_ENV ?? 'development',
      JWT_SECRET: jwtSecret,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN,
      BACKUP_DIRECTORY: backupDirectory,
    };

    await this.startProcess(env);
  }

  private startProcess(env: NodeJS.ProcessEnv): Promise<void> {
    return new Promise((resolve, reject) => {
      const backendRoot = resolveBackendRoot();
      const entryPoint = app.isPackaged
        ? path.join(backendRoot, 'main.js')
        : path.join(backendRoot, 'dist', 'main.js');

      this.process = spawn(process.execPath, [entryPoint], {
        env: {
          ...env,
          ELECTRON_RUN_AS_NODE: '1',
        },
        cwd: backendRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      this.attachListeners(resolve, reject);
    });
  }

  private attachListeners(resolve: () => void, reject: (error: Error) => void): void {
    if (!this.process) return;

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        started = true;
        resolve();
      }
    }, 5000);

    this.process.stdout?.on('data', (data: Buffer) => {
      const output = data.toString();
      if (!started && output.includes('Backend running')) {
        started = true;
        clearTimeout(timeout);
        resolve();
      }
    });

    this.process.stderr?.on('data', (data: Buffer) => {
      console.error('[Backend]', data.toString());
    });

    this.process.on('error', (error) => {
      clearTimeout(timeout);
      if (!started) {
        reject(error);
      }
    });

    this.process.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`Backend process exited with code ${code}`);
      }
    });
  }

  stop(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}
