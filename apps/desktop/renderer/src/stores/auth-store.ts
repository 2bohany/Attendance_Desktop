import { create } from 'zustand';
import type { AuthUser } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (user: AuthUser, accessToken: string) => Promise<void>;
  clearSession: () => Promise<void>;
  hasPermission: (permissionKey: string) => boolean;
  refreshCurrentUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  setSession: async (user, accessToken) => {
    await window.electronAPI.setAuthToken(accessToken);
    set({ user, isAuthenticated: true });
  },

  clearSession: async () => {
    await window.electronAPI.clearAuthToken();
    set({ user: null, isAuthenticated: false });
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
