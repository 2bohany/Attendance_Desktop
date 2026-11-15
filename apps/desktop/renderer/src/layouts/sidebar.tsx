import {
  LayoutDashboard,
  Users,
  Clock,
  UserCog,
  CalendarOff,
  CalendarDays,
  BarChart3,
  Settings,
  DatabaseBackup,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { NAV_ITEMS, type NavItemId } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t, type TranslationKey } from '@/lib/i18n';
import { hrefForPage, navigate } from '@/lib/router';
import { cn } from '@/lib/utils';
import { isNavItemVisible } from '@/lib/permissions';
import { BrandMark } from '@/components/brand-mark';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Clock,
  UserCog,
  CalendarOff,
  CalendarDays,
  BarChart3,
  Settings,
  Database: DatabaseBackup,
};

const NAV_GROUPS: { labelKey: TranslationKey; ids: NavItemId[] }[] = [
  {
    labelKey: 'nav.group.workspace',
    ids: ['dashboard', 'attendance', 'employees', 'leaves', 'holidays', 'reports'],
  },
  { labelKey: 'nav.group.admin', ids: ['users', 'settings', 'backup'] },
];

type SidebarNavProps = {
  activePage: NavItemId;
  collapsed?: boolean;
  onNavigate?: () => void;
};

/** Navigation list shared by the desktop rail and the mobile sheet. */
export function SidebarNav({ activePage, collapsed = false, onNavigate }: SidebarNavProps) {
  const locale = useAppStore((state) => state.locale);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const isVisible = (id: NavItemId) => isNavItemVisible(id, hasPermission);

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label={t(locale, 'app.name')}>
      {NAV_GROUPS.map((group) => {
        const items = group.ids
          .filter(isVisible)
          .map((id) => NAV_ITEMS.find((item) => item.id === id)!)
          .filter(Boolean);
        if (items.length === 0) return null;

        return (
          <div key={group.labelKey} className="space-y-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 rtl:tracking-normal">
                {t(locale, group.labelKey)}
              </p>
            )}
            {items.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = activePage === item.id;
              const label = t(locale, item.labelKey as TranslationKey);

              const link = (
                <a
                  key={item.id}
                  href={hrefForPage(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                    event.preventDefault();
                    navigate(item.id);
                    onNavigate?.();
                  }}
                  className={cn(
                    'group relative flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-muted hover:text-foreground',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-sidebar-primary"
                    />
                  )}
                  {Icon && <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />}
                  {collapsed ? <span className="sr-only">{label}</span> : <span>{label}</span>}
                </a>
              );

              if (!collapsed) return link;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side={locale === 'ar' ? 'left' : 'right'}>{label}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

export function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  const locale = useAppStore((state) => state.locale);
  return (
    <div className={cn('flex h-14 items-center gap-2.5 px-4', collapsed && 'justify-center px-0')}>
      <BrandMark className="h-7 w-7" />
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-foreground">{t(locale, 'app.name')}</p>
          <p className="truncate text-xs text-muted-foreground">{t(locale, 'app.tagline')}</p>
        </div>
      )}
    </div>
  );
}

/** Persistent rail for large screens. */
export function Sidebar({ activePage }: { activePage: NavItemId }) {
  const { locale, sidebarCollapsed, toggleSidebar } = useAppStore();
  const CollapseIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col border-e border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out lg:flex',
        sidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      <SidebarBrand collapsed={sidebarCollapsed} />
      <SidebarNav activePage={activePage} collapsed={sidebarCollapsed} />
      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-expanded={!sidebarCollapsed}
          className={cn(
            'flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
            sidebarCollapsed && 'justify-center px-0',
          )}
        >
          <CollapseIcon className="h-[18px] w-[18px] shrink-0 rtl:-scale-x-100" strokeWidth={1.75} />
          {sidebarCollapsed ? (
            <span className="sr-only">{t(locale, 'topbar.toggleSidebar')}</span>
          ) : (
            <span>{t(locale, 'topbar.toggleSidebar')}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
