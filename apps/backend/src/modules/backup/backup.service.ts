import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { BackupFile } from '@attendance/shared';
import { BackupRepository } from './backup.repository';
import { AuditLogService } from '../../database/audit-log.service';

@Injectable()
export class BackupService {
  constructor(
    private readonly backupRepository: BackupRepository,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(actorUserId: string): Promise<BackupFile> {
    const directory = this.getBackupDirectory();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `attendance-backup-${timestamp}.db`;

    await this.backupRepository.createSnapshot(directory, fileName);
    await this.auditLogService.record({
      action: 'backup.create',
      entityType: 'Backup',
      entityId: fileName,
      userId: actorUserId,
    });

    const snapshots = await this.backupRepository.listSnapshots(directory);
    const created = snapshots.find((snapshot) => snapshot.fileName === fileName);

    return {
      fileName,
      sizeBytes: created?.sizeBytes ?? 0,
      createdAt: (created?.createdAt ?? new Date()).toISOString(),
    };
  }

  async list(): Promise<BackupFile[]> {
    const directory = this.getBackupDirectory();
    const snapshots = await this.backupRepository.listSnapshots(directory);
    return snapshots.map((snapshot) => ({
      fileName: snapshot.fileName,
      sizeBytes: snapshot.sizeBytes,
      createdAt: snapshot.createdAt.toISOString(),
    }));
  }

  private getBackupDirectory(): string {
    const directory = this.configService.get<string>('app.backupDirectory');
    if (!directory) {
      throw new InternalServerErrorException('Backup directory is not configured');
    }
    return directory;
  }
}
