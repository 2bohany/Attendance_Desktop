import { create } from 'zustand';
import type { Locale, ThemeMode, Direction } from '@attendance/shared';

const PREFS_KEY = 'attendance.preferences';
const SIDEBAR_KEY = 'attendance.sidebarCollapsed';

type StoredPreferences = { locale?: Locale; theme?: ThemeMode };

function readPreferences(): StoredPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? (JSON.parse(raw) as StoredPreferences) : {};
  } catch {
    return {};
  }
}

function writePreferences(patch: StoredPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...readPreferences(), ...patch }));
  } catch {
    // Preferences are a convenience; ignore unavailable storage.
  }
}

function readSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === '1';
  } catch {
    return false;
  }
}

const darkQuery = (): MediaQueryList | undefined =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : undefined;

function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') return darkQuery()?.matches ? 'dark' : 'light';
  return theme;
}

function applyTheme(resolved: 'light' | 'dark'): void {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolved === 'dark' ? '#0d1218' : '#f6f8fa');
}

function applyLocale(locale: Locale): Direction {
  const direction: Direction = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
  document.documentElement.dir = direction;
  return direction;
}

type AppState = {
  locale: Locale;
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  direction: Direction;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  /** Applies stored preferences to the document and follows OS theme changes. */
  initialize: () => () => void;
};

export const useAppStore = create<AppState>((set, get) => {
  const stored = readPreferences();
  const locale: Locale = stored.locale === 'ar' ? 'ar' : 'en';
  const theme: ThemeMode = stored.theme ?? 'system';

  return {
    locale,
    theme,
    resolvedTheme: resolveTheme(theme),
    direction: locale === 'ar' ? 'rtl' : 'ltr',
    sidebarCollapsed: readSidebarCollapsed(),
    mobileNavOpen: false,

    setLocale: (next) => {
      const direction = applyLocale(next);
      writePreferences({ locale: next });
      set({ locale: next, direction });
    },

    setTheme: (next) => {
      const resolved = resolveTheme(next);
      applyTheme(resolved);
      writePreferences({ theme: next });
      set({ theme: next, resolvedTheme: resolved });
    },

    toggleSidebar: () => {
      const collapsed = !get().sidebarCollapsed;
      try {
        localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
      } catch {
        // ignore
      }
      set({ sidebarCollapsed: collapsed });
    },

    setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

    initialize: () => {
      const state = get();
      applyLocale(state.locale);
      applyTheme(state.resolvedTheme);

      const query = darkQuery();
      const onChange = () => {
        if (get().theme !== 'system') return;
        const resolved = resolveTheme('system');
        applyTheme(resolved);
        set({ resolvedTheme: resolved });
      };
      query?.addEventListener('change', onChange);
      return () => query?.removeEventListener('change', onChange);
    },
  };
});
