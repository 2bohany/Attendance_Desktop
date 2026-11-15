import { forwardRef, useState } from 'react';
import { Check, Eye, EyeOff, Languages, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { Input, type InputProps } from '@/components/ui/input';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  const { locale, resolvedTheme, setLocale, setTheme } = useAppStore();

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Concentric rings: a quiet echo of the clock mark. */}
        <svg
          aria-hidden
          viewBox="0 0 600 600"
          className="pointer-events-none absolute -bottom-40 -end-40 h-[560px] w-[560px] text-primary-foreground/10"
        >
          {[290, 230, 170, 110].map((r) => (
            <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
          ))}
        </svg>

        <div className="relative flex items-center gap-3">
          <svg viewBox="0 0 32 32" aria-hidden className="h-9 w-9">
            <rect width="32" height="32" rx="8" className="fill-primary-foreground/15" />
            <path d="M23.5 11.2A9 9 0 1 0 25 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            <path d="m11.6 16.2 3.4 3.3 10-10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-lg font-semibold">{t(locale, 'app.name')}</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">{t(locale, 'auth.brand.headline')}</h2>
          <p className="mt-4 text-base text-primary-foreground/80">{t(locale, 'auth.brand.body')}</p>
          <ul className="mt-8 space-y-3">
            {(['auth.brand.point1', 'auth.brand.point2', 'auth.brand.point3'] as const).map((key) => (
              <li key={key} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {t(locale, key)}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/60">{t(locale, 'app.tagline')}</p>
      </aside>

      <main className="flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:invisible">
            <BrandMark className="h-7 w-7" />
            <span className="font-semibold">{t(locale, 'app.name')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              aria-label={t(locale, 'topbar.toggleLanguage')}
            >
              <Languages />
              {locale === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label={t(locale, 'topbar.toggleTheme')}
            >
              {resolvedTheme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const locale = useAppStore((state) => state.locale);
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input ref={ref} type={visible ? 'text' : 'password'} className={cn('pe-10', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={t(locale, visible ? 'common.hidePassword' : 'common.showPassword')}
        aria-pressed={visible}
        className="absolute end-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
      {message}
    </div>
  );
}
