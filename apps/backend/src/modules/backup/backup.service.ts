import { Injectable } from '@nestjs/common';
import type { BackupExport, BackupFile } from '@attendance/shared';
import { BackupRepository } from './backup.repository';
import { AuditLogService } from '../../database/audit-log.service';

const HISTORY_LIMIT = 20;
const EXPORT_FORMAT_VERSION = 1;

type ExportMetadata = { fileName?: string; sizeBytes?: number };

function parseMetadata(raw: string | null): ExportMetadata {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ExportMetadata;
  } catch {
    return {};
  }
}

@Injectable()
export class BackupService {
  constructor(
    private readonly backupRepository: BackupRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Builds a full JSON export of the company's data. The server keeps no file;
   * the browser downloads the payload. Database-level backups are handled by
   * MongoDB Atlas.
   */
  async create(actorUserId: string): Promise<BackupExport> {
    const exportedAt = new Date().toISOString();
    const fileName = `attendance-backup-${exportedAt.replace(/[:.]/g, '-')}.json`;
    const data = await this.backupRepository.readAllData();

    const payload = { format: 'attendance-backup' as const, version: EXPORT_FORMAT_VERSION, exportedAt, data };
    const sizeBytes = Buffer.byteLength(JSON.stringify(payload), 'utf8');

    await this.auditLogService.record({
      action: 'backup.create',
      entityType: 'Backup',
      entityId: fileName,
      userId: actorUserId,
      metadata: { fileName, sizeBytes },
    });

    return { ...payload, fileName, sizeBytes };
  }

  async list(): Promise<BackupFile[]> {
    const entries = await this.backupRepository.findRecentExports(HISTORY_LIMIT);
    return entries.map((entry) => {
      const metadata = parseMetadata(entry.metadata);
      return {
        fileName: metadata.fileName ?? entry.entityId ?? 'attendance-backup.json',
        sizeBytes: metadata.sizeBytes ?? 0,
        createdAt: entry.createdAt.toISOString(),
      };
    });
  }
}
