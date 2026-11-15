import { create } from 'zustand';
import type { AuthUser } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';
import { hasStoredSession } from '@/services/browser-electron-api';

/**
 * `restoring`: checking whether a stored token is still valid (page refresh).
 * The UI shows a loader instead of flashing the login screen.
 */
type AuthStatus = 'restoring' | 'authenticated' | 'anonymous';

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, accessToken: string) => Promise<void>;
  clearSession: () => Promise<void>;
  restoreSession: () => Promise<void>;
  hasPermission: (permissionKey: string) => boolean;
  refreshCurrentUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'restoring',
  isAuthenticated: false,

  setSession: async (user, accessToken) => {
    await window.electronAPI.setAuthToken(accessToken);
    set({ user, status: 'authenticated', isAuthenticated: true });
  },

  clearSession: async () => {
    await window.electronAPI.clearAuthToken();
    set({ user: null, status: 'anonymous', isAuthenticated: false });
  },

  restoreSession: async () => {
    if (hasStoredSession() === false) {
      set({ user: null, status: 'anonymous', isAuthenticated: false });
      return;
    }
    const response = await apiRequest<AuthUser>({ method: 'GET', path: '/auth/me' });
    if (response.success && response.data) {
      set({ user: response.data, status: 'authenticated', isAuthenticated: true });
      return;
    }
    if (response.status === 401 || response.status === 403) {
      await window.electronAPI.clearAuthToken();
    }
    set({ user: null, status: 'anonymous', isAuthenticated: false });
  },

  hasPermission: (permissionKey) => {
    const user = get().user;
    return user ? user.role.permissions.some((permission) => permission.key === permissionKey) : false;
  },

  refreshCurrentUser: async () => {
    const response = await apiRequest<AuthUser>({ method: 'GET', path: '/auth/me' });
    if (response.success && response.data) {
      set({ user: response.data });
    }
  },
}));
