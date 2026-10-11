import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

type RecordAuditEntry = {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async record(entry: RecordAuditEntry): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        userId: entry.userId,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
      },
    });
  }
}
