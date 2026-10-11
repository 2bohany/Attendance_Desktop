import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { PermissionsSeedService } from './permissions-seed.service';

@Module({
  controllers: [UsersController, RolesController],
  providers: [
    UsersService,
    UsersRepository,
    RolesService,
    RolesRepository,
    PermissionsSeedService,
  ],
  exports: [UsersRepository, RolesRepository],
})
export class UsersModule {}
