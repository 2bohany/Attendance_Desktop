import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getValue(key: string): Promise<string | null> {
    const meta = await this.prisma.appMeta.findUnique({ where: { key } });
    return meta?.value ?? null;
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.prisma.appMeta.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
