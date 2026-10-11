import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { Permission } from '@prisma/client';
import type { Role } from '@attendance/shared';
import { RequirePermissions } from '../../common/decorators';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('roles.view')
  list(): Promise<Role[]> {
    return this.rolesService.list();
  }

  @Get('permissions')
  @RequirePermissions('roles.view')
  listPermissions(): Promise<Permission[]> {
    return this.rolesService.listPermissions();
  }

  @Post()
  @RequirePermissions('roles.create')
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(dto);
  }

  @Patch(':id/permissions')
  @RequirePermissions('roles.edit')
  updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdateRolePermissionsDto,
  ): Promise<Role> {
    return this.rolesService.updatePermissions(id, dto.permissionKeys);
  }
}
