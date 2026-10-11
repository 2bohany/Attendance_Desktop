import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { AppSettings } from '@attendance/shared';
import { RequirePermissions } from '../../common/decorators';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @RequirePermissions('settings.view')
  get(): Promise<AppSettings> {
    return this.settingsService.get();
  }

  @Patch()
  @RequirePermissions('settings.edit')
  update(@Body() dto: UpdateSettingsDto): Promise<AppSettings> {
    return this.settingsService.update(dto);
  }
}
