import { API_PREFIX, APP_NAME } from '@attendance/config';
import type { AppInfo, BackendRequest, BackendResponse, DatabaseInfo } from '@attendance/shared';

const API_ORIGIN = import.meta.env.VITE_API_URL ?? '';
const TOKEN_KEY = 'attendance.accessToken';

function readErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object' || !('message' in data)) {
    return undefined;
  }

  const message = (data as { message?: unknown }).message;
  if (typeof message === 'string') {
    return message;
  }
  if (Array.isArray(message)) {
    return message.map(String).join(', ');
  }
  return undefined;
}

function installBrowserElectronApi(): void {
  if (window.electronAPI) {
    return;
  }

  let authToken = sessionStorage.getItem(TOKEN_KEY);

  window.electronAPI = {
    getAppInfo: async (): Promise<AppInfo> => ({
      name: APP_NAME,
      version: '0.1.0',
      environment: 'development',
    }),
    getDatabaseInfo: async (): Promise<DatabaseInfo> => ({
      path: 'MongoDB Atlas',
      exists: true,
      initialized: true,
    }),
    backendRequest: async <T = unknown>(request: BackendRequest): Promise<BackendResponse<T>> => {
      const reqPath = request.path.startsWith('/') ? request.path : `/${request.path}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      try {
        const response = await fetch(`${API_ORIGIN}${API_PREFIX}${reqPath}`, {
          method: request.method,
          headers,
          body: request.body !== undefined ? JSON.stringify(request.body) : undefined,
        });

        const data: unknown = await response.json();

        return {
          success: response.ok,
          data: data as T,
          status: response.status,
          error: response.ok ? undefined : readErrorMessage(data),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Request failed';
        return {
          success: false,
          error: message,
          status: 503,
        };
      }
    },
    setAuthToken: async (token: string): Promise<void> => {
      authToken = token;
      sessionStorage.setItem(TOKEN_KEY, token);
    },
    clearAuthToken: async (): Promise<void> => {
      authToken = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  };
}

installBrowserElectronApi();
