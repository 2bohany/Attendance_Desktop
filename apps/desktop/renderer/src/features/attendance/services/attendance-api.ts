import type { AttendanceRecord } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function listAttendance(date?: string): Promise<AttendanceRecord[]> {
  const path = date ? `/attendance?date=${encodeURIComponent(date)}` : '/attendance';
  const response = await apiRequest<AttendanceRecord[]>({ method: 'GET', path });
  return unwrap(response);
}

export async function checkIn(employeeId: string): Promise<void> {
  const response = await apiRequest<void>({
    method: 'POST',
    path: '/attendance/check-in',
    body: { employeeId },
  });
  if (!response.success) {
    throw new Error(response.error ?? 'Request failed');
  }
}

export async function checkOut(employeeId: string): Promise<void> {
  const response = await apiRequest<void>({
    method: 'POST',
    path: '/attendance/check-out',
    body: { employeeId },
  });
  if (!response.success) {
    throw new Error(response.error ?? 'Request failed');
  }
}
