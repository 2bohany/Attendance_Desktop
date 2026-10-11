import { Injectable } from '@nestjs/common';
import type { AppSettings } from '@attendance/shared';
import { SettingsRepository } from './settings.repository';
import type { UpdateSettingsDto } from './dto/update-settings.dto';

const KEYS = {
  companyName: 'settings.companyName',
  defaultWorkStartTime: 'settings.defaultWorkStartTime',
  defaultWorkEndTime: 'settings.defaultWorkEndTime',
} as const;

const DEFAULTS: AppSettings = {
  companyName: '',
  defaultWorkStartTime: '09:00',
  defaultWorkEndTime: '17:00',
};

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async get(): Promise<AppSettings> {
    const [companyName, defaultWorkStartTime, defaultWorkEndTime] = await Promise.all([
      this.settingsRepository.getValue(KEYS.companyName),
      this.settingsRepository.getValue(KEYS.defaultWorkStartTime),
      this.settingsRepository.getValue(KEYS.defaultWorkEndTime),
    ]);

    return {
      companyName: companyName ?? DEFAULTS.companyName,
      defaultWorkStartTime: defaultWorkStartTime ?? DEFAULTS.defaultWorkStartTime,
      defaultWorkEndTime: defaultWorkEndTime ?? DEFAULTS.defaultWorkEndTime,
    };
  }

  async update(dto: UpdateSettingsDto): Promise<AppSettings> {
    if (dto.companyName !== undefined) {
      await this.settingsRepository.setValue(KEYS.companyName, dto.companyName);
    }
    if (dto.defaultWorkStartTime !== undefined) {
      await this.settingsRepository.setValue(KEYS.defaultWorkStartTime, dto.defaultWorkStartTime);
    }
    if (dto.defaultWorkEndTime !== undefined) {
      await this.settingsRepository.setValue(KEYS.defaultWorkEndTime, dto.defaultWorkEndTime);
    }

    return this.get();
  }
}
