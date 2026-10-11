import type { PermissionKey } from '@attendance/config';

export const NAV_ITEMS = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: 'LayoutDashboard', permission: undefined },
  { id: 'employees', labelKey: 'nav.employees', icon: 'Users', permission: 'employees.view' },
  { id: 'attendance', labelKey: 'nav.attendance', icon: 'Clock', permission: 'attendance.view' },
  { id: 'users', labelKey: 'nav.users', icon: 'UserCog', permission: ['users.view', 'roles.view'] },
  { id: 'leaves', labelKey: 'nav.leaves', icon: 'CalendarOff', permission: 'leaves.view' },
  { id: 'holidays', labelKey: 'nav.holidays', icon: 'CalendarDays', permission: 'holidays.view' },
  { id: 'reports', labelKey: 'nav.reports', icon: 'BarChart3', permission: 'reports.view' },
  { id: 'settings', labelKey: 'nav.settings', icon: 'Settings', permission: 'settings.view' },
  { id: 'backup', labelKey: 'nav.backup', icon: 'Database', permission: 'backup.view' },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: string;
  icon: string;
  permission?: PermissionKey | readonly PermissionKey[];
}>;

export type NavItemId = (typeof NAV_ITEMS)[number]['id'];
