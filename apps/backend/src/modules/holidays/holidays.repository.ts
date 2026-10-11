import { Injectable } from '@nestjs/common';
import type { Holiday } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class HolidaysRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(): Promise<Holiday[]> {
    return this.prisma.holiday.findMany({ orderBy: { date: 'asc' } });
  }

  findUpcoming(from: Date, limit: number): Promise<Holiday[]> {
    return this.prisma.holiday.findMany({
      where: { date: { gte: from } },
      orderBy: { date: 'asc' },
      take: limit,
    });
  }

  create(name: string, date: Date, description: string | null): Promise<Holiday> {
    return this.prisma.holiday.create({ data: { name, date, description } });
  }

  delete(id: string): Promise<Holiday> {
    return this.prisma.holiday.delete({ where: { id } });
  }
}
