import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Holiday } from '@prisma/client';
import { HolidaysRepository } from './holidays.repository';
import type { CreateHolidayDto } from './dto/create-holiday.dto';

@Injectable()
export class HolidaysService {
  constructor(private readonly holidaysRepository: HolidaysRepository) {}

  list(): Promise<Holiday[]> {
    return this.holidaysRepository.findMany();
  }

  async create(dto: CreateHolidayDto): Promise<Holiday> {
    try {
      return await this.holidaysRepository.create(
        dto.name,
        new Date(dto.date),
        dto.description || null,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A holiday already exists on this date');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.holidaysRepository.delete(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Holiday not found');
      }
      throw error;
    }
  }
}
