import type { CreateLeaveInput, Leave, LeaveStatus, LeaveType, LeaveTypeInput } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function listLeaves(): Promise<Leave[]> {
  const response = await apiRequest<Leave[]>({ method: 'GET', path: '/leaves' });
  return unwrap(response);
}

export async function createLeave(input: CreateLeaveInput): Promise<Leave> {
  const response = await apiRequest<Leave>({
    method: 'POST',
    path: '/leaves',
    body: { ...input, reason: input.reason || undefined },
  });
  return unwrap(response);
}

export async function updateLeaveStatus(id: string, status: LeaveStatus): Promise<Leave> {
  const response = await apiRequest<Leave>({
    method: 'PATCH',
    path: `/leaves/${id}/status`,
    body: { status },
  });
  return unwrap(response);
}

export async function listLeaveTypes(): Promise<LeaveType[]> {
  const response = await apiRequest<LeaveType[]>({ method: 'GET', path: '/leave-types' });
  return unwrap(response);
}

export async function createLeaveType(input: LeaveTypeInput): Promise<LeaveType> {
  const response = await apiRequest<LeaveType>({
    method: 'POST',
    path: '/leave-types',
    body: { ...input, description: input.description || undefined },
  });
  return unwrap(response);
}
