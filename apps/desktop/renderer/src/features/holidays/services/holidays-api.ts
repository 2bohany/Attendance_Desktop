import type { Holiday, HolidayInput } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function listHolidays(): Promise<Holiday[]> {
  const response = await apiRequest<Holiday[]>({ method: 'GET', path: '/holidays' });
  return unwrap(response);
}

export async function createHoliday(input: HolidayInput): Promise<Holiday> {
  const response = await apiRequest<Holiday>({
    method: 'POST',
    path: '/holidays',
    body: { ...input, description: input.description || undefined },
  });
  return unwrap(response);
}

export async function deleteHoliday(id: string): Promise<void> {
  const response = await apiRequest<void>({ method: 'DELETE', path: `/holidays/${id}` });
  if (!response.success) {
    throw new Error(response.error ?? 'Request failed');
  }
}
