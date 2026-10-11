import {
  LayoutDashboard,
  Users,
  Clock,
  UserCog,
  CalendarOff,
  CalendarDays,
  BarChart3,
  Settings,
  Database,
  type LucideIcon,
} from 'lucide-react';
import { NAV_ITEMS, type NavItemId } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Clock,
  UserCog,
  CalendarOff,
  CalendarDays,
  BarChart3,
  Settings,
  Database,
};

type SidebarProps = {
  activePage?: NavItemId;
  onNavigate?: (page: NavItemId) => void;
};

export function Sidebar({ activePage = 'dashboard', onNavigate }: SidebarProps) {
  const { locale, sidebarCollapsed } = useAppStore();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.permission) return true;
    const required = Array.isArray(item.permission) ? item.permission : [item.permission];
    return required.some((key) => hasPermission(key));
  });

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200',
          sidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        <nav className="flex-1 space-y-1 p-3">
          {visibleItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = activePage === item.id;
            const label = t(locale, item.labelKey as Parameters<typeof t>[1]);

            const button = (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                  sidebarCollapsed && 'justify-center px-2',
                )}
              >
                {Icon && <Icon className="h-5 w-5 shrink-0" />}
                {!sidebarCollapsed && <span>{label}</span>}
              </button>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
