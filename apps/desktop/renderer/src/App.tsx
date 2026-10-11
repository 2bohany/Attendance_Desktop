import { useState } from 'react';
import { NAV_ITEMS, type NavItemId } from '@attendance/shared';
import { AppShell } from '@/layouts/app-shell';
import { DashboardPage } from '@/features/dashboard';
import { UsersPage } from '@/features/users';
import { EmployeesPage } from '@/features/employees';
import { AttendancePage } from '@/features/attendance';
import { LeavesPage } from '@/features/leaves';
import { HolidaysPage } from '@/features/holidays';
import { ReportsPage } from '@/features/reports';
import { SettingsPage } from '@/features/settings';
import { BackupPage } from '@/features/backup';
import { LoginPage, SetupPage, useSetupStatus } from '@/features/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import type { TranslationKeys } from '@/lib/i18n';

const pageMap: Record<
  NavItemId,
  { component: React.ComponentType; titleKey?: keyof TranslationKeys }
> = {
  dashboard: { component: DashboardPage },
  employees: { component: EmployeesPage },
  attendance: { component: AttendancePage },
  users: { component: UsersPage },
  leaves: { component: LeavesPage },
  holidays: { component: HolidaysPage },
  reports: { component: ReportsPage },
  settings: { component: SettingsPage },
  backup: { component: BackupPage },
};

function isNavItemVisible(id: NavItemId, hasPermission: (key: string) => boolean): boolean {
  const item = NAV_ITEMS.find((navItem) => navItem.id === id);
  if (!item?.permission) return true;
  const required = Array.isArray(item.permission) ? item.permission : [item.permission];
  return required.some((key) => hasPermission(key));
}

function FullScreenLoader() {
  const locale = useAppStore((state) => state.locale);
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">{t(locale, 'common.loading')}</p>
    </div>
  );
}

export function App() {
  const [activePage, setActivePage] = useState<NavItemId>('dashboard');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const { data: setupStatus } = useSetupStatus();

  if (isAuthenticated) {
    const effectivePage = isNavItemVisible(activePage, hasPermission) ? activePage : 'dashboard';
    const PageComponent = pageMap[effectivePage].component;
    return (
      <AppShell activePage={effectivePage} onNavigate={setActivePage}>
        <PageComponent />
      </AppShell>
    );
  }

  if (!setupStatus) {
    // Covers both the initial fetch and a transient error awaiting the next poll
    // (see useSetupStatus) - never guess Login before we actually know the answer.
    return <FullScreenLoader />;
  }

  if (setupStatus.needsSetup) {
    return <SetupPage />;
  }

  return <LoginPage />;
}
