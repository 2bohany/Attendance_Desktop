import type { BackendRequest, BackendResponse } from '@attendance/shared';
import { t } from '@/lib/i18n';
import { useAppStore } from '@/stores/app-store';

export const UNAUTHORIZED_EVENT = 'attendance:unauthorized';

/** Auth endpoints answer 401 for bad credentials; that is not an expired session. */
const SESSION_EXEMPT_PATHS = ['/auth/login', '/auth/setup', '/auth/me'];

export async function apiRequest<T = unknown>(
  request: BackendRequest,
): Promise<BackendResponse<T>> {
  const response = await window.electronAPI.backendRequest<T>(request);

  if (response.status === 401 && !SESSION_EXEMPT_PATHS.includes(request.path)) {
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }

  if (!response.success && (response.error === 'NETWORK_ERROR' || response.status === 0)) {
    return { ...response, error: t(useAppStore.getState().locale, 'error.network') };
  }

  return response;
}
