import { useSyncExternalStore } from 'react';
import type React from 'react';
import { NAV_ITEMS, type NavItemId } from '@attendance/shared';

/**
 * Minimal router: one path per nav item. The web build uses real paths
 * (Vercel rewrites every non-API path to index.html); the packaged Electron
 * app loads from file://, where only hash routes survive a reload.
 */
const useHash = typeof window !== 'undefined' && window.location.protocol === 'file:';

/** The packaged desktop app (file://) has no public landing page. */
export const isDesktopShell = useHash;

/** Public, signed-out routes. */
export const LOGIN_PATH = '/login';

const NAV_IDS = new Set<string>(NAV_ITEMS.map((item) => item.id));
const NAVIGATE_EVENT = 'attendance:navigate';

export function pathForPage(page: NavItemId): string {
  return page === 'dashboard' ? '/' : `/${page}`;
}

function currentPath(): string {
  if (useHash) return window.location.hash.replace(/^#/, '') || '/';
  return window.location.pathname || '/';
}

/** Returns the page for the current URL, or null when the URL is unknown. */
export function pageFromPath(path: string): NavItemId | null {
  const segment = path.replace(/^\/+/, '').split('/')[0] ?? '';
  if (segment === '') return 'dashboard';
  return NAV_IDS.has(segment) ? (segment as NavItemId) : null;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange);
  window.addEventListener('hashchange', onChange);
  window.addEventListener(NAVIGATE_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener(NAVIGATE_EVENT, onChange);
  };
}

export function navigate(page: NavItemId, options: { replace?: boolean } = {}): void {
  navigateTo(pathForPage(page), options);
}

export function navigateTo(target: string, options: { replace?: boolean } = {}): void {
  if (target === currentPath()) return;

  if (useHash) {
    const url = `#${target}`;
    if (options.replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  } else if (options.replace) {
    window.history.replaceState(null, '', target);
  } else {
    window.history.pushState(null, '', target);
  }
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function usePath(): string {
  return useSyncExternalStore(subscribe, currentPath, () => '/');
}

/** Builds an href for anchors so middle-click / open-in-new-tab work. */
export function hrefForPage(page: NavItemId): string {
  return hrefFor(pathForPage(page));
}

export function hrefFor(path: string): string {
  return useHash ? `#${path}` : path;
}

/** onClick for <a href> that keeps modifier-clicks (new tab) working. */
export function linkHandler(path: string) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigateTo(path);
  };
}
