import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { backendRequestSchema } from '@attendance/shared';
import type { BackendRequest, BackendResponse } from '@attendance/shared';
import { DatabasePathService } from '../services/database-path.service';
import { BackendProcessService } from '../services/backend-process.service';
import { API_PREFIX } from '@attendance/config';

export function registerIpcHandlers(
  databasePathService: DatabasePathService,
  backendProcessService: BackendProcessService,
): void {
  ipcMain.handle('app:get-info', () => {
    return databasePathService.getAppInfo();
  });

  ipcMain.handle('app:get-database-info', () => {
    return databasePathService.getDatabaseInfo();
  });

  ipcMain.handle(
    'backend:request',
    async (_event: IpcMainInvokeEvent, request: BackendRequest): Promise<BackendResponse> => {
      const parsed = backendRequestSchema.safeParse(request);
      if (!parsed.success) {
        return {
          success: false,
          error: 'Invalid request format',
          status: 400,
        };
      }

      const { method, path: reqPath, body } = parsed.data;
      const baseUrl = backendProcessService.getBaseUrl();
      const url = `${baseUrl}${API_PREFIX}${reqPath.startsWith('/') ? reqPath : `/${reqPath}`}`;
      const authHeader = backendProcessService.getAuthHeader();

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        return {
          success: response.ok,
          data,
          status: response.status,
          error: response.ok ? undefined : (data as { message?: string }).message,
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
  );

  ipcMain.handle('auth:set-token', (_event: IpcMainInvokeEvent, token: string) => {
    backendProcessService.setAuthToken(token);
  });

  ipcMain.handle('auth:clear-token', () => {
    backendProcessService.clearAuthToken();
  });
}
