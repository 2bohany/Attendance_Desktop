import type { AuthUser, Role, UserListItem } from '@attendance/shared';
import type { RoleWithPermissions } from './roles.repository';
import type { UserWithRole } from './users.repository';

export function toRole(role: RoleWithPermissions): Role {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isSystem: role.isSystem,
    permissions: role.permissions.map((rolePermission) => ({
      id: rolePermission.permission.id,
      key: rolePermission.permission.key,
      description: rolePermission.permission.description,
    })),
  };
}

export function toAuthUser(user: UserWithRole): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    isActive: user.isActive,
    role: toRole(user.role),
  };
}

export function toUserListItem(user: UserWithRole): UserListItem {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
    role: { id: user.role.id, name: user.role.name },
  };
}
