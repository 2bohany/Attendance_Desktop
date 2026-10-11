import type { CreateRoleInput, Permission, Role } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function listRoles(): Promise<Role[]> {
  const response = await apiRequest<Role[]>({ method: 'GET', path: '/roles' });
  return unwrap(response);
}

export async function listPermissions(): Promise<Permission[]> {
  const response = await apiRequest<Permission[]>({ method: 'GET', path: '/roles/permissions' });
  return unwrap(response);
}

export async function createRole(input: CreateRoleInput): Promise<Role> {
  const response = await apiRequest<Role>({ method: 'POST', path: '/roles', body: input });
  return unwrap(response);
}

export async function updateRolePermissions(id: string, permissionKeys: string[]): Promise<Role> {
  const response = await apiRequest<Role>({
    method: 'PATCH',
    path: `/roles/${id}/permissions`,
    body: { permissionKeys },
  });
  return unwrap(response);
}
