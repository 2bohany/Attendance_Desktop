import { Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class BackupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSnapshot(directory: string, fileName: string): Promise<void> {
    await fs.mkdir(directory, { recursive: true });
    const destination = path.join(directory, fileName).replace(/\\/g, '/');
    await this.prisma.$executeRawUnsafe(`VACUUM INTO '${destination}'`);
  }

  async listSnapshots(directory: string): Promise<{ fileName: string; sizeBytes: number; createdAt: Date }[]> {
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
  }
}
