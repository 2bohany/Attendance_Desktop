import type { CreateUserInput, UpdateUserInput, UserListItem } from '@attendance/shared';

type UpdateUserProfileInput = Omit<UpdateUserInput, 'roleId'>;
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function listUsers(): Promise<UserListItem[]> {
  const response = await apiRequest<UserListItem[]>({ method: 'GET', path: '/users' });
  return unwrap(response);
}

export async function createUser(input: CreateUserInput): Promise<UserListItem> {
  const response = await apiRequest<UserListItem>({
    method: 'POST',
    path: '/users',
    body: { ...input, email: input.email || undefined },
  });
  return unwrap(response);
}

export async function updateUser(id: string, input: UpdateUserProfileInput): Promise<UserListItem> {
  const response = await apiRequest<UserListItem>({
    method: 'PATCH',
    path: `/users/${id}`,
    body: { ...input, email: input.email || undefined, password: input.password || undefined },
  });
  return unwrap(response);
}

export async function updateUserRole(id: string, roleId: string): Promise<UserListItem> {
  const response = await apiRequest<UserListItem>({
    method: 'PATCH',
    path: `/users/${id}/role`,
    body: { roleId },
  });
  return unwrap(response);
}

export async function setUserActive(id: string, isActive: boolean): Promise<UserListItem> {
  const response = await apiRequest<UserListItem>({
    method: 'PATCH',
    path: `/users/${id}/status`,
    body: { isActive },
  });
  return unwrap(response);
}
