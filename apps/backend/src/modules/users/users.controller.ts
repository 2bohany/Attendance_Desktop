import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { UserListItem } from '@attendance/shared';
import { RequirePermissions } from '../../common/decorators';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('users.view')
  list(): Promise<UserListItem[]> {
    return this.usersService.list();
  }

  @Post()
  @RequirePermissions('users.create')
  create(@Body() dto: CreateUserDto): Promise<UserListItem> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('users.edit')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserListItem> {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/role')
  @RequirePermissions('users.edit')
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto): Promise<UserListItem> {
    return this.usersService.updateRole(id, dto.roleId);
  }

  @Patch(':id/status')
  @RequirePermissions('users.edit')
  setActive(@Param('id') id: string, @Body() dto: UpdateUserStatusDto): Promise<UserListItem> {
    return this.usersService.setActive(id, dto.isActive);
  }
}
