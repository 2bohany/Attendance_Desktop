import type { AppSettings, UpdateSettingsInput } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function getSettings(): Promise<AppSettings> {
  const response = await apiRequest<AppSettings>({ method: 'GET', path: '/settings' });
  return unwrap(response);
}

export async function updateSettings(input: UpdateSettingsInput): Promise<AppSettings> {
  const response = await apiRequest<AppSettings>({ method: 'PATCH', path: '/settings', body: input });
  return unwrap(response);
}
