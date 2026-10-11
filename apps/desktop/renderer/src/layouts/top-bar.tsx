import { useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, Languages, PanelLeftClose, PanelLeft, LogOut, User } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { useHealthCheck } from '@/hooks/use-health-check';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopBar() {
  const { locale, theme, sidebarCollapsed, setLocale, setTheme, toggleSidebar } = useAppStore();
  const { user, clearSession } = useAuthStore();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await clearSession();
    // needsSetup is cached from before login and never refetched while authenticated;
    // without this, logging out shortly after first launch can show the setup wizard
    // again instead of the login screen.
    void queryClient.invalidateQueries({ queryKey: ['auth', 'setup-status'] });
  };
  const { data: health, isLoading } = useHealthCheck();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  const isConnected = health?.status === 'ok' && health.database.connected;

  return (
    <TooltipProvider>
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                {sidebarCollapsed ? (
                  <PanelLeft className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle sidebar</TooltipContent>
          </Tooltip>

          <div>
            <h1 className="text-lg font-semibold">{t(locale, 'app.name')}</h1>
            <p className="text-xs text-muted-foreground">{t(locale, 'app.tagline')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isLoading ? 'warning' : isConnected ? 'success' : 'destructive'}>
            {isLoading
              ? t(locale, 'status.checking')
              : isConnected
                ? t(locale, 'status.connected')
                : t(locale, 'status.disconnected')}
          </Badge>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleLanguage}>
                <Languages className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t(locale, 'topbar.toggleLanguage')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t(locale, 'topbar.toggleTheme')}</TooltipContent>
          </Tooltip>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.fullName}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.role.name}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="me-2 h-4 w-4" />
                  {t(locale, 'auth.action.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
