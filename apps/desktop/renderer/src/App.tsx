import { lazy, Suspense, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { NAV_ITEMS, type NavItemId } from '@attendance/shared';
import { AppShell } from '@/layouts/app-shell';
import { DashboardPage } from '@/features/dashboard';
import { LoginPage, SetupPage, useSetupStatus } from '@/features/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { UNAUTHORIZED_EVENT } from '@/services/api-client';
import { isDesktopShell, LOGIN_PATH, navigate, pageFromPath, usePath } from '@/lib/router';
import { LandingPage } from '@/features/landing';
import { isNavItemVisible } from '@/lib/permissions';
import { t, type TranslationKey } from '@/lib/i18n';
import { BrandMark } from '@/components/brand-mark';

// The dashboard ships in the main bundle; every other page loads on first visit.
const pageMap: Record<NavItemId, React.ComponentType> = {
  dashboard: DashboardPage,
  employees: lazy(() => import('@/features/employees').then((m) => ({ default: m.EmployeesPage }))),
  attendance: lazy(() =>
    import('@/features/attendance').then((m) => ({ default: m.AttendancePage })),
  ),
  users: lazy(() => import('@/features/users').then((m) => ({ default: m.UsersPage }))),
  leaves: lazy(() => import('@/features/leaves').then((m) => ({ default: m.LeavesPage }))),
  holidays: lazy(() => import('@/features/holidays').then((m) => ({ default: m.HolidaysPage }))),
  reports: lazy(() => import('@/features/reports').then((m) => ({ default: m.ReportsPage }))),
  settings: lazy(() => import('@/features/settings').then((m) => ({ default: m.SettingsPage }))),
  backup: lazy(() => import('@/features/backup').then((m) => ({ default: m.BackupPage }))),
};

function PageFallback() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-muted/70" />
    </div>
  );
}

function FullScreenLoader() {
  const locale = useAppStore((state) => state.locale);
  return (
    <div
      className="flex h-dvh flex-col items-center justify-center gap-4 bg-background"
      role="status"
      aria-live="polite"
    >
      <BrandMark className="h-10 w-10 animate-pulse" />
      <p className="text-sm text-muted-foreground">{t(locale, 'common.loading')}</p>
    </div>
  );
}

/** `undefined` leaves the title to another component (parent effects run after children's). */
function useDocumentTitle(titleKey: TranslationKey | null | undefined) {
  const locale = useAppStore((state) => state.locale);
  useEffect(() => {
    if (titleKey === undefined) return;
    const appName = t(locale, 'app.name');
    const pageTitle = titleKey ? t(locale, titleKey) : appName;
    document.title = pageTitle === appName ? appName : `${pageTitle} · ${appName}`;
  }, [locale, titleKey]);
}

function AuthenticatedApp() {
  const path = usePath();
  const locale = useAppStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const user = useAuthStore((state) => state.user);

  const requested = pageFromPath(path);
  const allowed = requested && isNavItemVisible(requested, hasPermission) ? requested : null;
  const activePage: NavItemId = allowed ?? 'dashboard';

  useEffect(() => {
    if (allowed) return;
    // Arriving from the sign-in screen is not an unknown page.
    if (requested === null && path !== LOGIN_PATH) toast.info(t(locale, 'error.notFound'));
    navigate('dashboard', { replace: true });
    // Only react to URL / permission changes, not to locale switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, requested, user, path]);

  const navItem = NAV_ITEMS.find((item) => item.id === activePage);
  useDocumentTitle((navItem?.labelKey as TranslationKey | undefined) ?? null);

  const PageComponent = pageMap[activePage];
  return (
    <AppShell activePage={activePage}>
      <Suspense fallback={<PageFallback />}>
        <PageComponent key={activePage} />
      </Suspense>
    </AppShell>
  );
}

export function App() {
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const initialize = useAppStore((state) => state.initialize);
  const queryClient = useQueryClient();
  const { data: setupStatus } = useSetupStatus(status === 'anonymous');
  const previousStatus = useRef(status);
  const path = usePath();
  const showLanding = status === 'anonymous' && !isDesktopShell && path === '/';

  useEffect(() => initialize(), [initialize]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const onUnauthorized = () => {
      if (useAuthStore.getState().status !== 'authenticated') return;
      void clearSession();
      toast.error(t(useAppStore.getState().locale, 'session.expired'), { id: 'session-expired' });
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [clearSession]);

  // Never leak one user's cached data to the next person who signs in.
  useEffect(() => {
    if (previousStatus.current === 'authenticated' && status === 'anonymous') {
      queryClient.clear();
    }
    previousStatus.current = status;
  }, [status, queryClient]);

  useDocumentTitle(
    showLanding
      ? null
      : status === 'anonymous'
        ? setupStatus?.needsSetup
          ? 'auth.setup.title'
          : 'auth.login.title'
        : status === 'restoring'
          ? null
          : undefined,
  );

  if (status === 'restoring') {
    return <FullScreenLoader />;
  }

  if (status === 'authenticated') {
    return <AuthenticatedApp />;
  }

  // Signed-out visitors land on the public home page first.
  if (showLanding) {
    return <LandingPage needsSetup={setupStatus?.needsSetup} />;
  }

  if (!setupStatus) {
    // Covers the initial fetch and a transient error awaiting the next poll.
    return <FullScreenLoader />;
  }

  return setupStatus.needsSetup ? <SetupPage /> : <LoginPage />;
}
