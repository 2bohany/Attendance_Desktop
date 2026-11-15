import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Languages,
  MonitorSmartphone,
  SunMoon,
  CalendarDays,
  BarChart3,
  Download,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { t, type TranslationKey } from '@/lib/i18n';
import { hrefFor, linkHandler, LOGIN_PATH } from '@/lib/router';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/brand-mark';
import { PublicControls } from '@/components/public-controls';
import { buttonVariants } from '@/components/ui/button';
import {
  DashboardPreview,
  LeaveSnippet,
  RolesSnippet,
  RosterSnippet,
} from '../components/product-preview';

function SignInLink({
  children,
  className,
  size = 'default',
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}) {
  return (
    <a
      href={hrefFor(LOGIN_PATH)}
      onClick={linkHandler(LOGIN_PATH)}
      className={cn(buttonVariants({ size, variant }), className)}
    >
      {children}
    </a>
  );
}

function scrollToId(id: string) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

const FEATURES: {
  title: TranslationKey;
  body: TranslationKey;
  points: [TranslationKey, TranslationKey];
  visual: 'roster' | 'leave' | 'roles';
}[] = [
  {
    title: 'landing.f1.title',
    body: 'landing.f1.body',
    points: ['landing.f1.point1', 'landing.f1.point2'],
    visual: 'roster',
  },
  {
    title: 'landing.f2.title',
    body: 'landing.f2.body',
    points: ['landing.f2.point1', 'landing.f2.point2'],
    visual: 'leave',
  },
  {
    title: 'landing.f3.title',
    body: 'landing.f3.body',
    points: ['landing.f3.point1', 'landing.f3.point2'],
    visual: 'roles',
  },
];

const MORE: { icon: typeof Languages; key: TranslationKey }[] = [
  { icon: Languages, key: 'landing.more.bilingual' },
  { icon: MonitorSmartphone, key: 'landing.more.devices' },
  { icon: SunMoon, key: 'landing.more.theme' },
  { icon: CalendarDays, key: 'landing.more.holidays' },
  { icon: BarChart3, key: 'landing.more.reports' },
  { icon: Download, key: 'landing.more.export' },
];

const STEPS: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'landing.step1.title', body: 'landing.step1.body' },
  { title: 'landing.step2.title', body: 'landing.step2.body' },
  { title: 'landing.step3.title', body: 'landing.step3.body' },
];

export function LandingPage({ needsSetup }: { needsSetup?: boolean }) {
  const locale = useAppStore((state) => state.locale);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primaryLabel = needsSetup
    ? t(locale, 'landing.hero.setup')
    : t(locale, 'landing.hero.primary');

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header
        className={cn(
          'sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-200',
          scrolled
            ? 'border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70'
            : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <a href={hrefFor('/')} className="flex items-center gap-2.5 font-semibold">
            <BrandMark className="h-7 w-7" />
            {t(locale, 'app.name')}
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a
              href="#features"
              onClick={scrollToId('features')}
              className="transition-colors hover:text-foreground"
            >
              {t(locale, 'landing.nav.features')}
            </a>
            <a
              href="#how"
              onClick={scrollToId('how')}
              className="transition-colors hover:text-foreground"
            >
              {t(locale, 'landing.nav.howItWorks')}
            </a>
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <PublicControls />
            <SignInLink size="sm">{t(locale, 'landing.nav.signIn')}</SignInLink>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(hsl(var(--border)/0.7)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.7)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 start-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl rtl:translate-x-1/2"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-28 lg:pt-20">
            <div>
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                {t(locale, 'landing.hero.title')}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {t(locale, 'landing.hero.body')}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <SignInLink size="lg" className="px-6">
                  {primaryLabel}
                  <ArrowRight className="rtl:-scale-x-100" />
                </SignInLink>
                <a
                  href="#features"
                  onClick={scrollToId('features')}
                  className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'bg-card px-6')}
                >
                  {t(locale, 'landing.hero.secondary')}
                </a>
              </div>
              <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {t(locale, 'landing.hero.note')}
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[1.25rem] bg-primary/5 sm:-inset-6"
              />
              <DashboardPreview locale={locale} className="landing-rise relative" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 border-t bg-card/40">
          <div className="mx-auto max-w-6xl space-y-20 px-4 py-20 sm:px-6 lg:space-y-28 lg:py-28">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={cn(index % 2 === 1 && 'lg:order-2')}>
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                    {t(locale, feature.title)}
                  </h2>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                    {t(locale, feature.body)}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-soft-foreground">
                          <Check className="h-3 w-3" strokeWidth={2.5} />
                        </span>
                        {t(locale, point)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={cn(
                    'rounded-2xl border bg-gradient-to-br from-primary-soft/70 to-background p-6 sm:p-10',
                    index % 2 === 1 && 'lg:order-1',
                  )}
                >
                  <div className="mx-auto max-w-md">
                    {feature.visual === 'roster' && (
                      <RosterSnippet locale={locale} className="shadow-lifted" />
                    )}
                    {feature.visual === 'leave' && <LeaveSnippet locale={locale} />}
                    {feature.visual === 'roles' && <RolesSnippet locale={locale} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Everything else */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight">
              {t(locale, 'landing.more.title')}
            </h2>
            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {MORE.map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-start gap-4 border-t pt-6">
                  <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <span className="text-sm leading-relaxed">{t(locale, key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 border-t bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t(locale, 'landing.steps.title')}
            </h2>
            <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              <div
                aria-hidden
                className="absolute inset-x-0 top-5 hidden h-px bg-border md:block"
              />
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="tabular relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{t(locale, step.title)}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {t(locale, step.body)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="px-4 py-20 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 sm:py-16">
            <svg
              aria-hidden
              viewBox="0 0 600 600"
              className="pointer-events-none absolute -bottom-56 -end-40 h-[520px] w-[520px] text-primary-foreground/10"
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
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {t(locale, 'landing.cta.title')}
                </h2>
                <p className="mt-3 text-primary-foreground/80">{t(locale, 'landing.cta.body')}</p>
              </div>
              <a
                href={hrefFor(LOGIN_PATH)}
                onClick={linkHandler(LOGIN_PATH)}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary-foreground px-6 text-sm font-semibold text-primary shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-5 w-5" />
            <span className="font-medium text-foreground">{t(locale, 'app.name')}</span>
            <span>· {t(locale, 'landing.footer')}</span>
          </div>
          <span className="tabular">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
