import { Menu, LogOut, Moon, Sun, Monitor, Languages, Check, CloudOff } from 'lucide-react';
import type { ThemeMode } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { useHealthCheck } from '@/hooks/use-health-check';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/brand-mark';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  );
}

const THEME_OPTIONS: { value: ThemeMode; icon: typeof Sun; key: 'topbar.theme.light' | 'topbar.theme.dark' | 'topbar.theme.system' }[] = [
  { value: 'light', icon: Sun, key: 'topbar.theme.light' },
  { value: 'dark', icon: Moon, key: 'topbar.theme.dark' },
  { value: 'system', icon: Monitor, key: 'topbar.theme.system' },
];

export function TopBar() {
  const { locale, theme, resolvedTheme, setLocale, setTheme, setMobileNavOpen } = useAppStore();
  const { user, clearSession } = useAuthStore();
  const { data: health, isError } = useHealthCheck();

  const isDisconnected = isError || (health && !health.database.connected);
  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="-ms-2 lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label={t(locale, 'common.openMenu')}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2 lg:hidden">
        <BrandMark className="h-6 w-6" />
        <span className="text-sm font-semibold">{t(locale, 'app.name')}</span>
      </div>

      <div className="ms-auto flex items-center gap-1">
        {isDisconnected && (
          <span
            role="status"
            className="me-2 inline-flex items-center gap-1.5 rounded-full bg-destructive-soft px-2.5 py-1 text-xs font-medium text-destructive"
          >
            <CloudOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t(locale, 'status.disconnected')}</span>
          </span>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              aria-label={t(locale, 'topbar.toggleLanguage')}
            >
              <Languages className="h-[18px] w-[18px]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{locale === 'en' ? 'العربية' : 'English'}</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t(locale, 'topbar.theme')}>
                  <ThemeIcon className="h-[18px] w-[18px]" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>{t(locale, 'topbar.theme')}</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-40">
            {THEME_OPTIONS.map((option) => (
              <DropdownMenuItem key={option.value} onSelect={() => setTheme(option.value)}>
                <option.icon className="me-2 h-4 w-4" />
                {t(locale, option.key)}
                {theme === option.value && <Check className="ms-auto h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="ms-1 flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:rounded-md sm:py-1 sm:pe-2.5 sm:ps-1"
                aria-label={t(locale, 'auth.loggedInAs') + ' ' + user.fullName}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                  {initialsOf(user.fullName)}
                </span>
                <span className="hidden max-w-[10rem] text-start leading-tight sm:block">
                  <span className="block truncate text-sm font-medium">{user.fullName}</span>
                  <span className="block truncate text-xs text-muted-foreground">{user.role.name}</span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-xs text-muted-foreground">{t(locale, 'auth.loggedInAs')}</p>
                <p className="truncate text-sm font-medium">{user.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void clearSession()}>
                <LogOut className="me-2 h-4 w-4 rtl:-scale-x-100" />
                {t(locale, 'auth.action.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
