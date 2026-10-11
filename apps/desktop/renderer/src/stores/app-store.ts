import { create } from 'zustand';
import type { Locale, ThemeMode, Direction } from '@attendance/shared';

type AppState = {
  locale: Locale;
  theme: ThemeMode;
  direction: Direction;
  sidebarCollapsed: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  locale: 'en',
  theme: 'system',
  direction: 'ltr',
  sidebarCollapsed: false,

  setLocale: (locale: Locale) => {
    const direction: Direction = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    set({ locale, direction });
  },

  setTheme: (theme: ThemeMode) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }

    set({ theme });
  },

  toggleSidebar: () => {
    set({ sidebarCollapsed: !get().sidebarCollapsed });
  },
}));
