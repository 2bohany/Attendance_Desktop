import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';

@Injectable()
export class BackupRepository {
  async createSnapshot(directory: string, fileName: string): Promise<void> {
    if (process.env.VERCEL || process.env.DATABASE_URL?.startsWith('mongodb')) {
      throw new ServiceUnavailableException(
        'File backups are not available with MongoDB Atlas. Use Atlas backups instead.',
      );
    }

    await fs.mkdir(directory, { recursive: true });
    const destination = path.join(directory, fileName).replace(/\\/g, '/');
    // Local SQLite-only path retained for desktop builds that still configure BACKUP_DIRECTORY.
    throw new ServiceUnavailableException(
      `Snapshot creation is unavailable for the current database configuration (${destination}).`,
    );
  }

  async listSnapshots(directory: string): Promise<{ fileName: string; sizeBytes: number; createdAt: Date }[]> {
    if (process.env.VERCEL || process.env.DATABASE_URL?.startsWith('mongodb')) {
      return [];
    }

    try {
      await fs.mkdir(directory, { recursive: true });
      const entries = await fs.readdir(directory);
      const dbFiles = entries.filter((entry) => entry.endsWith('.db'));

      const stats = await Promise.all(
        dbFiles.map(async (fileName) => {
          const stat = await fs.stat(path.join(directory, fileName));
          return { fileName, sizeBytes: stat.size, createdAt: stat.birthtime };
        }),
      );

      return stats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch {
      return [];
    }
  }
}
