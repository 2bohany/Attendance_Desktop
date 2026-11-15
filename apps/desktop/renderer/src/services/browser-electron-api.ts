import { API_PREFIX, APP_NAME } from '@attendance/config';
import type { AppInfo, BackendRequest, BackendResponse, DatabaseInfo } from '@attendance/shared';

/**
 * Browser implementation of the bridge the Electron preload exposes as
 * `window.electronAPI`. On the web (Vercel) it talks to the API over fetch.
 */

const API_ORIGIN = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
const TOKEN_KEY = 'attendance.accessToken';
// Above the serverless maxDuration (60s) so a slow cold start is not reported as a failure.
const REQUEST_TIMEOUT_MS = 65_000;

function readStoredToken(): string | null {
  try {
    // Migrate tokens stored by older builds in sessionStorage.
    const legacy = sessionStorage.getItem(TOKEN_KEY);
    if (legacy) {
      localStorage.setItem(TOKEN_KEY, legacy);
      sessionStorage.removeItem(TOKEN_KEY);
    }
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage can be unavailable (private mode); the in-memory token still works.
  }
}

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

/**
 * Void endpoints (check-in, deletes, ...) answer with an empty body, and an
 * upstream proxy error can answer with HTML. Never let body parsing turn a
 * successful request into a failure.
 */
async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return response.ok ? text : { message: `Server error (${response.status})` };
  }
}

let browserBridge = false;

/**
 * Web only: whether a token is stored, so signed-out visitors skip the session
 * check. Returns null under Electron, whose main process owns the token.
 */
export function hasStoredSession(): boolean | null {
  return browserBridge ? readStoredToken() !== null : null;
}

function installBrowserElectronApi(): void {
  if (window.electronAPI) {
    return;
  }
  browserBridge = true;

  let authToken = readStoredToken();

  window.electronAPI = {
    getAppInfo: async (): Promise<AppInfo> => ({
      name: APP_NAME,
      version: '0.1.0',
      environment: import.meta.env.MODE === 'production' ? 'production' : 'development',
    }),
    getDatabaseInfo: async (): Promise<DatabaseInfo> => ({
      path: 'MongoDB Atlas',
      exists: true,
      initialized: true,
    }),
    backendRequest: async <T = unknown>(request: BackendRequest): Promise<BackendResponse<T>> => {
      const reqPath = request.path.startsWith('/') ? request.path : `/${request.path}`;
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (request.body !== undefined) {
        headers['Content-Type'] = 'application/json';
      }
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(`${API_ORIGIN}${API_PREFIX}${reqPath}`, {
          method: request.method,
          headers,
          body: request.body !== undefined ? JSON.stringify(request.body) : undefined,
          signal: controller.signal,
        });

        const data = await parseBody(response);

        return {
          success: response.ok,
          data: data as T,
          status: response.status,
          error: response.ok ? undefined : (readErrorMessage(data) ?? response.statusText),
        };
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === 'AbortError';
        return {
          success: false,
          error: aborted ? 'The server took too long to respond.' : 'NETWORK_ERROR',
          status: aborted ? 504 : 0,
        };
      } finally {
        window.clearTimeout(timeout);
      }
    },
    setAuthToken: async (token: string): Promise<void> => {
      authToken = token;
      writeStoredToken(token);
    },
    clearAuthToken: async (): Promise<void> => {
      authToken = null;
      writeStoredToken(null);
    },
  };
}

installBrowserElectronApi();
