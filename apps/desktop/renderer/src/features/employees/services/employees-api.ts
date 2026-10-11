import type { Employee, EmployeeFormInput } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

function toRequestBody(input: EmployeeFormInput) {
  return {
    ...input,
    email: input.email || undefined,
    phone: input.phone || undefined,
    jobTitle: input.jobTitle || undefined,
    notes: input.notes || undefined,
    departmentId: input.departmentId || undefined,
  };
}

export async function listEmployees(): Promise<Employee[]> {
  const response = await apiRequest<Employee[]>({ method: 'GET', path: '/employees' });
  return unwrap(response);
}

export async function createEmployee(input: EmployeeFormInput): Promise<Employee> {
  const response = await apiRequest<Employee>({
    method: 'POST',
    path: '/employees',
    body: toRequestBody(input),
  });
  return unwrap(response);
}

export async function updateEmployee(id: string, input: EmployeeFormInput): Promise<Employee> {
  const response = await apiRequest<Employee>({
    method: 'PATCH',
    path: `/employees/${id}`,
    body: toRequestBody(input),
  });
  return unwrap(response);
}

export async function setEmployeeActive(id: string, isActive: boolean): Promise<Employee> {
  const response = await apiRequest<Employee>({
    method: 'PATCH',
    path: `/employees/${id}/status`,
    body: { isActive },
  });
  return unwrap(response);
}
