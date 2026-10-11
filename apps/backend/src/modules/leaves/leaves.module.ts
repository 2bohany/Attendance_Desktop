import { Module } from '@nestjs/common';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { LeavesRepository } from './leaves.repository';
import { LeaveTypesController } from './leave-types.controller';
import { LeaveTypesService } from './leave-types.service';
import { LeaveTypesRepository } from './leave-types.repository';

@Module({
  controllers: [LeavesController, LeaveTypesController],
  providers: [LeavesService, LeavesRepository, LeaveTypesService, LeaveTypesRepository],
  exports: [LeavesRepository],
})
export class LeavesModule {}
