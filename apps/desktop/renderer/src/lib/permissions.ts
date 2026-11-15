import { NAV_ITEMS, type NavItemId } from '@attendance/shared';

/** A nav item is visible when the user holds any of its permissions (or it needs none). */
export function isNavItemVisible(id: NavItemId, hasPermission: (key: string) => boolean): boolean {
  const item = NAV_ITEMS.find((navItem) => navItem.id === id);
  const permission: string | readonly string[] | undefined = item?.permission;
  if (!permission) return true;
  const required = typeof permission === 'string' ? [permission] : permission;
  return required.some((key) => hasPermission(key));
}
