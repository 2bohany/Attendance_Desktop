import type { CreateDepartmentInput, Department } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function listDepartments(): Promise<Department[]> {
  const response = await apiRequest<Department[]>({ method: 'GET', path: '/departments' });
  return unwrap(response);
}

export async function createDepartment(input: CreateDepartmentInput): Promise<Department> {
  const response = await apiRequest<Department>({
    method: 'POST',
    path: '/departments',
    body: { ...input, description: input.description || undefined },
  });
  return unwrap(response);
}

export async function deleteDepartment(id: string): Promise<void> {
  const response = await apiRequest<void>({ method: 'DELETE', path: `/departments/${id}` });
  if (!response.success) {
    throw new Error(response.error ?? 'Request failed');
  }
}
