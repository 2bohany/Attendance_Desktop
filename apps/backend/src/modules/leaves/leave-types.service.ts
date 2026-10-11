import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, type LeaveType } from '@prisma/client';
import { LeaveTypesRepository } from './leave-types.repository';
import type { CreateLeaveTypeDto } from './dto/create-leave-type.dto';

@Injectable()
export class LeaveTypesService {
  constructor(private readonly leaveTypesRepository: LeaveTypesRepository) {}

  list(): Promise<LeaveType[]> {
    return this.leaveTypesRepository.findMany();
  }

  async create(dto: CreateLeaveTypeDto): Promise<LeaveType> {
    try {
      return await this.leaveTypesRepository.create(dto.name, dto.description || null);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A leave type with this name already exists');
      }
      throw error;
    }
  }
}
