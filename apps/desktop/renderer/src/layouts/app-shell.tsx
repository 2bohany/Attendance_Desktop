import type { NavItemId } from '@attendance/shared';
import { TopBar } from '@/layouts/top-bar';
import { Sidebar } from '@/layouts/sidebar';
import { cn } from '@/lib/utils';

type AppShellProps = {
  children: React.ReactNode;
  activePage: NavItemId;
  onNavigate: (page: NavItemId) => void;
};

export function AppShell({ children, activePage, onNavigate }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <main className={cn('flex-1 overflow-auto transition-all duration-200')}>
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
