import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class HealthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkConnection(): Promise<boolean> {
    return this.prisma.ping();
  }
}
