import { contextBridge, ipcRenderer } from 'electron';
import type { AppInfo, BackendRequest, BackendResponse, DatabaseInfo } from '@attendance/shared';

const electronAPI = {
  getAppInfo: (): Promise<AppInfo> => ipcRenderer.invoke('app:get-info'),
  getDatabaseInfo: (): Promise<DatabaseInfo> => ipcRenderer.invoke('app:get-database-info'),
  backendRequest: <T = unknown>(request: BackendRequest): Promise<BackendResponse<T>> =>
    ipcRenderer.invoke('backend:request', request),
  setAuthToken: (token: string): Promise<void> => ipcRenderer.invoke('auth:set-token', token),
  clearAuthToken: (): Promise<void> => ipcRenderer.invoke('auth:clear-token'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
