import type { BackendRequest, BackendResponse } from '@attendance/shared';

export async function apiRequest<T = unknown>(
  request: BackendRequest,
): Promise<BackendResponse<T>> {
  return window.electronAPI.backendRequest<T>(request);
}
