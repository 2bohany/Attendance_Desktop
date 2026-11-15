import { Controller, Get, Post } from '@nestjs/common';
import type { BackupExport, BackupFile } from '@attendance/shared';
import { CurrentUser, RequirePermissions } from '../../common/decorators';
import type { RequestUser } from '../../common/types/request-user.type';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get()
  @RequirePermissions('backup.view')
  list(): Promise<BackupFile[]> {
    return this.backupService.list();
  }

  @Post()
  @RequirePermissions('backup.create')
  create(@CurrentUser() user: RequestUser): Promise<BackupExport> {
    return this.backupService.create(user.id);
  }
}
