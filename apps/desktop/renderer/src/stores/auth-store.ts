import { create } from 'zustand';
import type { AuthUser } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';
import { hasStoredSession } from '@/services/browser-electron-api';

/**
 * `restoring`: checking whether a stored token is still valid (page refresh).
 * The UI shows a loader instead of flashing the login screen.
 */
type AuthStatus = 'restoring' | 'authenticated' | 'anonymous';

/*
 * The signed-in profile is cached so a page load can render the app at once
 * instead of waiting on /auth/me, which can take a long time while a
 * serverless function cold-starts. The server still authorizes every request;
 * the cache only drives what the UI shows, and is revalidated in the background.
 */
const USER_CACHE_KEY = 'attendance.user';

function readCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: AuthUser | null): void {
  try {
    if (user) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    // Storage unavailable: fall back to waiting on the server.
  }
}

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
    writeCachedUser(user);
    set({ user, status: 'authenticated', isAuthenticated: true });
  },

  clearSession: async () => {
    await window.electronAPI.clearAuthToken();
    writeCachedUser(null);
    set({ user: null, status: 'anonymous', isAuthenticated: false });
  },

  restoreSession: async () => {
    const stored = hasStoredSession();
    if (stored === false) {
      writeCachedUser(null);
      set({ user: null, status: 'anonymous', isAuthenticated: false });
      return;
    }

    // Optimistic: render immediately with the cached profile, then revalidate.
    const cached = stored ? readCachedUser() : null;
    if (cached) set({ user: cached, status: 'authenticated', isAuthenticated: true });

    const response = await apiRequest<AuthUser>({ method: 'GET', path: '/auth/me' });
    if (response.success && response.data) {
      writeCachedUser(response.data);
      set({ user: response.data, status: 'authenticated', isAuthenticated: true });
      return;
    }
    if (response.status === 401 || response.status === 403) {
      await window.electronAPI.clearAuthToken();
      writeCachedUser(null);
      set({ user: null, status: 'anonymous', isAuthenticated: false });
      return;
    }
    // Network trouble: keep a cached session rather than signing the user out.
    if (!cached) set({ user: null, status: 'anonymous', isAuthenticated: false });
  },

  hasPermission: (permissionKey) => {
    const user = get().user;
    return user
      ? user.role.permissions.some((permission) => permission.key === permissionKey)
      : false;
  },

  refreshCurrentUser: async () => {
    const response = await apiRequest<AuthUser>({ method: 'GET', path: '/auth/me' });
    if (response.success && response.data) {
      writeCachedUser(response.data);
      set({ user: response.data });
    }
  },
}));
