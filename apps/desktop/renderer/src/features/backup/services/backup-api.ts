import type { BackupFile } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

function unwrap<T>(response: { success: boolean; data?: T; error?: string }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.error ?? 'Request failed');
  }
  return response.data;
}

export async function listBackups(): Promise<BackupFile[]> {
  const response = await apiRequest<BackupFile[]>({ method: 'GET', path: '/backup' });
  return unwrap(response);
}

export async function createBackup(): Promise<BackupFile> {
  const response = await apiRequest<BackupFile>({ method: 'POST', path: '/backup' });
  return unwrap(response);
}
