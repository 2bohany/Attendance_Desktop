import { forwardRef, useState } from 'react';
import { ArrowBigUp, ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/brand-mark';
import { PublicControls } from '@/components/public-controls';
import { hrefFor, isDesktopShell, linkHandler } from '@/lib/router';
import { RosterSnippet, TodaySnippet } from '@/features/landing/components/product-preview';
import { Input, type InputProps } from '@/components/ui/input';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  const locale = useAppStore((state) => state.locale);

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:p-12 xl:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(hsl(var(--primary-foreground)/0.07)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary-foreground)/0.07)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_70%_at_30%_20%,black,transparent)]"
        />
        <svg
          aria-hidden
          viewBox="0 0 600 600"
          className="pointer-events-none absolute -bottom-48 -end-48 h-[600px] w-[600px] text-primary-foreground/10"
        >
          {[290, 230, 170, 110].map((r) => (
            <circle
              key={r}
              cx="300"
              cy="300"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        <a
          href={hrefFor('/')}
          onClick={isDesktopShell ? undefined : linkHandler('/')}
          className="relative flex w-fit items-center gap-3"
        >
          <svg viewBox="0 0 32 32" aria-hidden className="h-9 w-9">
            <rect width="32" height="32" rx="8" className="fill-primary-foreground/15" />
            <path
              d="M23.5 11.2A9 9 0 1 0 25 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="m11.6 16.2 3.4 3.3 10-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-semibold">{t(locale, 'app.name')}</span>
        </a>

        <div className="relative mt-16 max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            {t(locale, 'auth.brand.headline')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/80">
            {t(locale, 'auth.brand.body')}
          </p>
        </div>

        {/* Product preview, rendered in the light card palette on the brand surface. */}
        <div className="relative mt-auto pt-12">
          <div className="max-w-md space-y-3 rounded-xl bg-background/95 p-3 text-foreground shadow-lifted ring-1 ring-black/5">
            <TodaySnippet locale={locale} animate />
            <RosterSnippet locale={locale} rows={3} />
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
            {(['auth.brand.point1', 'auth.brand.point2', 'auth.brand.point3'] as const).map(
              (key) => (
                <li key={key} className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  {t(locale, key)}
                </li>
              ),
            )}
          </ul>
        </div>
      </aside>

      <main className="flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          {isDesktopShell ? (
            <div className="flex items-center gap-2 lg:invisible">
              <BrandMark className="h-7 w-7" />
              <span className="font-semibold">{t(locale, 'app.name')}</span>
            </div>
          ) : (
            <a
              href={hrefFor('/')}
              onClick={linkHandler('/')}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
              {t(locale, 'auth.backHome')}
            </a>
          )}
          <PublicControls />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <BrandMark className="mb-8 h-10 w-10 lg:hidden" />
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t(locale, 'app.name')} · {t(locale, 'app.tagline')}
        </p>
      </main>
    </div>
  );
}

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, onKeyUp, onBlur, ...props }, ref) => {
    const locale = useAppStore((state) => state.locale);
    const [visible, setVisible] = useState(false);
    const [capsLock, setCapsLock] = useState(false);
    return (
      <div>
        <div className="relative">
          <Input
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={cn('pe-10', className)}
            onKeyUp={(event) => {
              setCapsLock(event.getModifierState('CapsLock'));
              onKeyUp?.(event);
            }}
            onBlur={(event) => {
              setCapsLock(false);
              onBlur?.(event);
            }}
            {...props}
          />
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
        {capsLock && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-warning" role="status">
            <ArrowBigUp className="h-3.5 w-3.5" />
            {t(locale, 'auth.capsLock')}
          </p>
        )}
      </div>
    );
  },
);
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
    <div
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm text-destructive"
    >
      {message}
    </div>
  );
}
