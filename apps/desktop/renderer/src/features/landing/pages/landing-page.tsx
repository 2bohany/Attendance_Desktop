import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CalendarCheck2,
  Fingerprint,
  Languages,
  LogIn,
  MonitorSmartphone,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { t, type TranslationKey } from '@/lib/i18n';
import { formatDayCount } from '@/lib/format';
import { hrefFor, linkHandler, LOGIN_PATH } from '@/lib/router';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/brand-mark';
import { PublicControls } from '@/components/public-controls';
import { buttonVariants } from '@/components/ui/button';
import {
  BilingualVisual,
  ExportVisual,
  FloatingCard,
  LeaveSnippet,
  RolesSnippet,
  RosterSnippet,
  ThemeVisual,
  TodaySnippet,
  WideDashboardPreview,
} from '../components/product-preview';

function scrollToId(id: string) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

function Rings({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 600"
      className={cn('pointer-events-none absolute', className)}
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
  );
}

const FACTS: { icon: typeof Languages; key: TranslationKey }[] = [
  { icon: Languages, key: 'landing.fact.languages' },
  { icon: MonitorSmartphone, key: 'landing.fact.devices' },
  { icon: Fingerprint, key: 'landing.fact.roles' },
  { icon: ScrollText, key: 'landing.fact.audit' },
];

const STEPS: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'landing.step1.title', body: 'landing.step1.body' },
  { title: 'landing.step2.title', body: 'landing.step2.body' },
  { title: 'landing.step3.title', body: 'landing.step3.body' },
];

function BentoTile({
  title,
  body,
  points,
  children,
  className,
  visualClassName,
}: {
  title: string;
  body: string;
  points?: string[];
  children: React.ReactNode;
  className?: string;
  visualClassName?: string;
}) {
  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow duration-300 hover:shadow-lifted',
        className,
      )}
    >
      <div className="p-6 sm:p-7">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
        {points && (
          <ul className="mt-4 space-y-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        className={cn(
          'mt-auto flex flex-1 flex-col justify-center border-t bg-gradient-to-b from-muted/60 to-primary-soft/40 p-5 sm:p-6',
          visualClassName,
        )}
      >
        {children}
      </div>
    </article>
  );
}

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
  const sample = locale === 'ar' ? ['ليلى إبراهيم', 'أحمد صالح'] : ['Layla Ibrahim', 'Ahmed Saleh'];

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground">
      {/* Navigation */}
      <header
        className={cn(
          'sticky top-0 z-40 transition-[background-color,border-color] duration-200',
          scrolled
            ? 'border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65'
            : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
          <a href={hrefFor('/')} className="flex items-center gap-2.5 font-semibold tracking-tight">
            <BrandMark className="h-8 w-8" />
            <span className="text-base">{t(locale, 'app.name')}</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
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
            <a
              href={hrefFor(LOGIN_PATH)}
              onClick={linkHandler(LOGIN_PATH)}
              className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-4')}
            >
              {t(locale, 'landing.nav.signIn')}
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[880px] overflow-hidden"
          >
            <div className="absolute inset-0 [background-image:linear-gradient(hsl(var(--border)/0.65)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.65)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_10%,black,transparent)]" />
            <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.22),transparent)]" />
            <div className="absolute end-[-10%] top-32 h-[380px] w-[480px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--info)/0.12),transparent)]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
            <h1 className="mx-auto max-w-4xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl rtl:tracking-normal">
              {t(locale, 'landing.hero.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t(locale, 'landing.hero.body')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={hrefFor(LOGIN_PATH)}
                onClick={linkHandler(LOGIN_PATH)}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group h-12 w-full rounded-full px-7 text-base shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.6)] sm:w-auto',
                )}
              >
                {primaryLabel}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </a>
              <a
                href="#features"
                onClick={scrollToId('features')}
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'h-12 w-full rounded-full bg-card/80 px-7 text-base backdrop-blur sm:w-auto',
                )}
              >
                {t(locale, 'landing.hero.secondary')}
              </a>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              {t(locale, 'landing.hero.note')}
            </p>
          </div>

          {/* Product window with floating notifications */}
          <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-6">
            <div className="landing-rise relative">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent sm:-inset-5"
              />
              <WideDashboardPreview locale={locale} className="relative" />
              <FloatingCard
                className="landing-float absolute -start-6 top-24 hidden w-64 lg:flex"
                tone="success"
                icon={<Check strokeWidth={2.5} />}
                title={t(locale, 'landing.float.approved')}
                detail={`${sample[0]} · ${formatDayCount(locale, 5)}`}
              />
              <FloatingCard
                className="landing-float-delayed absolute -end-6 bottom-16 hidden w-60 lg:flex"
                icon={<LogIn className="rtl:-scale-x-100" />}
                title={t(locale, 'landing.float.checkedIn')}
                detail={`${sample[1]} · 08:02`}
              />
            </div>
          </div>

          {/* Facts strip */}
          <div className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4">
              {FACTS.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="flex items-center gap-3 bg-card px-5 py-5 text-sm font-medium"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                  {t(locale, key)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features (bento) */}
        <section id="features" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.025em] sm:text-4xl rtl:tracking-normal">
                {t(locale, 'landing.features.title')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t(locale, 'landing.features.body')}
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-6">
              <BentoTile
                className="lg:col-span-4 lg:row-span-2"
                title={t(locale, 'landing.f1.title')}
                body={t(locale, 'landing.f1.body')}
                points={[t(locale, 'landing.f1.point1'), t(locale, 'landing.f1.point2')]}
                visualClassName="p-5 sm:p-8"
              >
                <div className="space-y-3">
                  <TodaySnippet locale={locale} />
                  <RosterSnippet locale={locale} className="w-full shadow-lifted" />
                </div>
              </BentoTile>

              <BentoTile
                className="lg:col-span-2"
                title={t(locale, 'landing.f2.title')}
                body={t(locale, 'landing.f2.body')}
              >
                <LeaveSnippet locale={locale} />
              </BentoTile>

              <BentoTile
                className="lg:col-span-2"
                title={t(locale, 'landing.f3.title')}
                body={t(locale, 'landing.f3.body')}
              >
                <RolesSnippet locale={locale} />
              </BentoTile>

              <BentoTile
                className="lg:col-span-2"
                title={t(locale, 'landing.bento.bilingual.title')}
                body={t(locale, 'landing.bento.bilingual.body')}
              >
                <BilingualVisual />
              </BentoTile>

              <BentoTile
                className="lg:col-span-2"
                title={t(locale, 'landing.bento.theme.title')}
                body={t(locale, 'landing.bento.theme.body')}
              >
                <ThemeVisual locale={locale} />
              </BentoTile>

              <BentoTile
                className="lg:col-span-2"
                title={t(locale, 'landing.bento.export.title')}
                body={t(locale, 'landing.bento.export.body')}
              >
                <ExportVisual />
              </BentoTile>
            </div>
          </div>
        </section>

        {/* How it works: a dark band for rhythm */}
        <section id="how" className="dark scroll-mt-20 bg-background text-foreground">
          <div className="relative overflow-hidden">
            <Rings className="-top-64 end-[-12rem] h-[640px] w-[640px] text-primary/15" />
            <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">
              <div className="grid gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.025em] sm:text-4xl rtl:tracking-normal">
                    {t(locale, 'landing.steps.title')}
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    {t(locale, 'landing.cta.body')}
                  </p>
                  <a
                    href={hrefFor(LOGIN_PATH)}
                    onClick={linkHandler(LOGIN_PATH)}
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'mt-8 h-12 rounded-full px-7 text-base',
                    )}
                  >
                    {primaryLabel}
                    <ArrowRight className="rtl:-scale-x-100" />
                  </a>
                </div>
                <ol className="relative space-y-4">
                  {STEPS.map((step, index) => (
                    <li key={step.title} className="flex gap-5 rounded-2xl border bg-card/60 p-6">
                      <span className="tabular flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold">{t(locale, step.title)}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {t(locale, step.body)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="px-4 py-24 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-lifted sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(0_0%_100%/0.16),transparent)]"
            />
            <Rings className="-bottom-64 -start-48 h-[600px] w-[600px] text-primary-foreground/10" />
            <Rings className="-top-72 -end-56 h-[600px] w-[600px] text-primary-foreground/10" />
            <div className="relative">
              <CalendarCheck2 className="mx-auto h-10 w-10 opacity-90" strokeWidth={1.5} />
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.025em] sm:text-5xl rtl:tracking-normal">
                {t(locale, 'landing.cta.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                {t(locale, 'landing.cta.body')}
              </p>
              <a
                href={hrefFor(LOGIN_PATH)}
                onClick={linkHandler(LOGIN_PATH)}
                className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-foreground px-8 text-base font-semibold text-primary shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-7 w-7" />
              <span className="font-semibold">{t(locale, 'app.name')}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {t(locale, 'landing.footer')}
            </p>
          </div>
          <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground md:items-end">
            <a href="#features" onClick={scrollToId('features')} className="hover:text-foreground">
              {t(locale, 'landing.nav.features')}
            </a>
            <a href="#how" onClick={scrollToId('how')} className="hover:text-foreground">
              {t(locale, 'landing.nav.howItWorks')}
            </a>
            <a
              href={hrefFor(LOGIN_PATH)}
              onClick={linkHandler(LOGIN_PATH)}
              className="hover:text-foreground"
            >
              {t(locale, 'landing.nav.signIn')}
            </a>
          </nav>
        </div>
        <div className="border-t">
          <p className="tabular mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
            © {new Date().getFullYear()} {t(locale, 'app.name')}
          </p>
        </div>
      </footer>
    </div>
  );
}
