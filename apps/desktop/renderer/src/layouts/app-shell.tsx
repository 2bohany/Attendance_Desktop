import { useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DirectionProvider } from '@radix-ui/react-direction';
import { X } from 'lucide-react';
import type { NavItemId } from '@attendance/shared';
import { TopBar } from '@/layouts/top-bar';
import { Sidebar, SidebarBrand, SidebarNav } from '@/layouts/sidebar';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';

type AppShellProps = {
  children: React.ReactNode;
  activePage: NavItemId;
};

function MobileNav({ activePage }: { activePage: NavItemId }) {
  const { locale, mobileNavOpen, setMobileNavOpen } = useAppStore();

  return (
    <DialogPrimitive.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 start-0 z-50 flex w-72 max-w-[85vw] flex-col border-e bg-sidebar shadow-lifted duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-right lg:hidden"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">{t(locale, 'app.name')}</DialogPrimitive.Title>
          <div className="flex items-center justify-between pe-2">
            <SidebarBrand />
            <DialogPrimitive.Close
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t(locale, 'common.closeMenu')}
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>
          <SidebarNav activePage={activePage} onNavigate={() => setMobileNavOpen(false)} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function AppShell({ children, activePage }: AppShellProps) {
  const direction = useAppStore((state) => state.direction);

  // New page, new reading position.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activePage]);

  return (
    <DirectionProvider dir={direction}>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh bg-background">
        <Sidebar activePage={activePage} />
        <MobileNav activePage={activePage} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DirectionProvider>
  );
}
