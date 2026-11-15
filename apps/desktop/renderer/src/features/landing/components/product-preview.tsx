import {
  Check,
  LogIn,
  LogOut,
  X,
  LayoutDashboard,
  Clock,
  Users,
  CalendarOff,
  BarChart3,
} from 'lucide-react';
import type { Locale } from '@attendance/shared';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/brand-mark';
import { EmployeeAvatar } from '@/components/employee-avatar';

/*
 * Illustrative product previews built from the live design tokens (not
 * screenshots), so they always match the current theme and language.
 * The people shown are sample data.
 */

const SAMPLE = {
  en: ['Ahmed Saleh', 'Sara Mostafa', 'Omar Khaled', 'Layla Ibrahim', 'Karim Nabil'],
  ar: ['أحمد صالح', 'سارة مصطفى', 'عمر خالد', 'ليلى إبراهيم', 'كريم نبيل'],
};

type RowState = 'in' | 'out' | 'absent';
const ROWS: { state: RowState; checkIn?: string; checkOut?: string }[] = [
  { state: 'in', checkIn: '08:02' },
  { state: 'in', checkIn: '08:15' },
  { state: 'out', checkIn: '08:41', checkOut: '13:05' },
  { state: 'absent' },
  { state: 'in', checkIn: '08:58' },
];

function names(locale: Locale) {
  return SAMPLE[locale];
}

function StatusPill({ state, locale }: { state: RowState; locale: Locale }) {
  const styles = {
    in: 'bg-success-soft text-success',
    out: 'bg-secondary text-muted-foreground',
    absent: 'border text-muted-foreground',
  }[state];
  const label = {
    in: t(locale, 'attendance.status.incomplete'),
    out: t(locale, 'attendance.status.checkedOut'),
    absent: t(locale, 'attendance.status.notIn'),
  }[state];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] font-medium',
        styles,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {label}
    </span>
  );
}

function MiniButton({ state }: { state: RowState }) {
  if (state === 'out') return <span className="w-6" />;
  const Icon = state === 'in' ? LogOut : LogIn;
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded border bg-card text-foreground shadow-sm">
      <Icon className="h-3 w-3 rtl:-scale-x-100" />
    </span>
  );
}

/** Roster rows: the daily attendance list. */
export function RosterSnippet({
  locale,
  rows = 5,
  className,
}: {
  locale: Locale;
  rows?: number;
  className?: string;
}) {
  const people = names(locale);
  return (
    <div className={cn('divide-y overflow-hidden rounded-lg border bg-card text-start', className)}>
      {ROWS.slice(0, rows).map((row, index) => (
        <div key={index} className="flex items-center gap-2.5 px-3 py-2">
          <EmployeeAvatar name={people[index] ?? ''} className="h-6 w-6 text-[9px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-foreground">
              {people[index] ?? ''}
            </p>
            <p className="tabular text-[10px] text-muted-foreground">
              {row.checkIn ?? '—'}
              {row.checkOut ? ` – ${row.checkOut}` : ''}
            </p>
          </div>
          <StatusPill state={row.state} locale={locale} />
          <MiniButton state={row.state} />
        </div>
      ))}
    </div>
  );
}

/** Proportional "today" bar with legend. */
export function TodaySnippet({ locale, animate = false }: { locale: Locale; animate?: boolean }) {
  const parts = [
    { key: 'dashboard.metric.present', value: 9, bar: 'bg-primary', dot: 'bg-primary' },
    { key: 'dashboard.metric.completed', value: 3, bar: 'bg-primary/45', dot: 'bg-primary/45' },
    { key: 'dashboard.metric.onLeave', value: 1, bar: 'bg-warning/70', dot: 'bg-warning/70' },
    { key: 'dashboard.metric.notIn', value: 2, bar: '', dot: 'bg-muted-foreground/40' },
  ] as const;
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  return (
    <div className="rounded-lg border bg-card p-3 text-start">
      <p className="text-[11px] font-semibold text-foreground">
        {t(locale, 'dashboard.todayTitle')}
      </p>
      <div className="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-muted">
        {parts.map((part) =>
          part.bar ? (
            <div
              key={part.key}
              className={cn('h-full', part.bar, animate && 'bar-grow')}
              style={{ width: `${(part.value / total) * 100}%` }}
            />
          ) : null,
        )}
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {parts.map((part) => (
          <div key={part.key} className="min-w-0">
            <p className="flex items-center gap-1 truncate text-[9px] text-muted-foreground">
              <span className={cn('h-1 w-1 shrink-0 rounded-full', part.dot)} />
              <span className="truncate">{t(locale, part.key)}</span>
            </p>
            <p className="tabular text-sm font-semibold text-foreground">{part.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A pending leave request with its approve / reject actions. */
export function LeaveSnippet({ locale }: { locale: Locale }) {
  const people = names(locale);
  const requests = [
    {
      name: people[3] ?? '',
      type: locale === 'ar' ? 'سنوية' : 'Annual',
      range: locale === 'ar' ? '18 – 22 نوفمبر' : '18 – 22 Nov',
    },
    {
      name: people[4] ?? '',
      type: locale === 'ar' ? 'مرضية' : 'Sick',
      range: locale === 'ar' ? '16 نوفمبر' : '16 Nov',
    },
  ];
  return (
    <div className="space-y-2.5">
      {requests.map((request, index) => (
        <div
          key={request.name}
          className={cn(
            'flex items-center gap-3 rounded-lg border bg-card p-3 text-start shadow-soft',
            index === 1 && 'opacity-80',
          )}
        >
          <EmployeeAvatar name={request.name} className="h-8 w-8" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{request.name}</p>
            <p className="tabular truncate text-xs text-muted-foreground">
              {request.type} · {request.range}
            </p>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-md border text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </span>
          <span className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground">
            <Check className="h-3.5 w-3.5" />
            {t(locale, 'leaves.action.approve')}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Role card with permission toggles. */
export function RolesSnippet({ locale }: { locale: Locale }) {
  const perms = [
    ['attendance.create', true],
    ['attendance.edit', true],
    ['leaves.edit', true],
    ['employees.view', true],
    ['users.edit', false],
    ['settings.edit', false],
  ] as const;
  return (
    <div className="rounded-lg border bg-card p-4 text-start shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {locale === 'ar' ? 'موظف موارد بشرية' : 'HR Officer'}
        </p>
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary-soft-foreground">
          {locale === 'ar' ? '4 صلاحيات' : '4 permissions'}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2" dir="ltr">
        {perms.map(([key, on]) => (
          <div key={key} className="flex items-center gap-2 text-[11px]">
            <span
              className={cn(
                'flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border',
                on ? 'border-primary bg-primary text-primary-foreground' : 'bg-background',
              )}
            >
              {on && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            <span className={on ? 'text-foreground' : 'text-muted-foreground'}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full app-window preview used in the hero. */
export function DashboardPreview({ locale, className }: { locale: Locale; className?: string }) {
  const nav = [LayoutDashboard, Clock, Users, CalendarOff, BarChart3];
  return (
    <div
      role="img"
      aria-label={t(locale, 'landing.preview.label')}
      className={cn('overflow-hidden rounded-xl border bg-background shadow-lifted', className)}
    >
      <div className="flex items-center gap-2 border-b bg-card px-3 py-2">
        <BrandMark className="h-4 w-4" />
        <span className="text-[11px] font-semibold text-foreground">{t(locale, 'app.name')}</span>
        <span className="ms-auto h-5 w-5 rounded-full bg-primary-soft" />
      </div>
      <div className="flex" aria-hidden>
        <div className="hidden w-10 shrink-0 flex-col items-center gap-2.5 border-e bg-card py-3 sm:flex">
          {nav.map((Icon, index) => (
            <span
              key={index}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded',
                index === 1 ? 'bg-sidebar-accent text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-2.5 p-3">
          <TodaySnippet locale={locale} animate />
          <RosterSnippet locale={locale} />
        </div>
      </div>
    </div>
  );
}

/** Floating notification used around the hero window. */
export function FloatingCard({
  icon,
  title,
  detail,
  tone = 'primary',
  className,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  tone?: 'primary' | 'success' | 'warning';
  className?: string;
}) {
  const toneClass = {
    primary: 'bg-primary-soft text-primary-soft-foreground',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
  }[tone];
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center gap-3 rounded-xl border bg-card/95 px-3.5 py-3 text-start shadow-lifted backdrop-blur',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4',
          toneClass,
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="tabular truncate text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

/** Wide app window: sidebar, today panel, roster and pending approvals. */
export function WideDashboardPreview({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const nav = [LayoutDashboard, Clock, Users, CalendarOff, BarChart3];
  const people = names(locale);
  return (
    <div
      role="img"
      aria-label={t(locale, 'landing.preview.label')}
      className={cn(
        'overflow-hidden rounded-2xl border bg-background shadow-lifted ring-1 ring-black/5',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b bg-card px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md bg-muted px-3 py-1 text-[10px] text-muted-foreground">
          <BrandMark className="h-3 w-3" />
          {t(locale, 'app.name')} · {t(locale, 'nav.dashboard')}
        </span>
      </div>
      <div className="flex" aria-hidden>
        <div className="hidden w-44 shrink-0 flex-col gap-1 border-e bg-card p-3 md:flex">
          <div className="mb-2 flex items-center gap-2 px-1">
            <BrandMark className="h-5 w-5" />
            <span className="text-xs font-semibold text-foreground">{t(locale, 'app.name')}</span>
          </div>
          {nav.map((Icon, index) => (
            <span
              key={index}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]',
                index === 0
                  ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {t(
                locale,
                (
                  [
                    'nav.dashboard',
                    'nav.attendance',
                    'nav.employees',
                    'nav.leaves',
                    'nav.reports',
                  ] as const
                )[index]!,
              )}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-3 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">
                {locale === 'ar' ? 'الأحد، 15 نوفمبر' : 'Sunday, 15 November'}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {t(locale, 'dashboard.greeting.morning', {
                  name: locale === 'ar' ? 'منى' : 'Mona',
                })}
              </p>
            </div>
            <span className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-medium text-primary-foreground">
              {t(locale, 'dashboard.openAttendance')}
            </span>
          </div>
          <TodaySnippet locale={locale} animate />
          <div className="grid gap-3 lg:grid-cols-5">
            <RosterSnippet locale={locale} rows={4} className="lg:col-span-3" />
            <div className="hidden rounded-lg border bg-card p-3 text-start lg:col-span-2 lg:block">
              <p className="text-[11px] font-semibold text-foreground">
                {t(locale, 'dashboard.pending.title')} · 2
              </p>
              {[3, 4].map((index) => (
                <div key={index} className="mt-2.5 flex items-center gap-2">
                  <EmployeeAvatar name={people[index] ?? ''} className="h-6 w-6 text-[9px]" />
                  <p className="min-w-0 flex-1 truncate text-[11px] text-foreground">
                    {people[index]}
                  </p>
                  <span className="flex h-5 w-5 items-center justify-center rounded border text-muted-foreground">
                    <X className="h-2.5 w-2.5" />
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Same screen in both languages. */
export function BilingualVisual() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-3">
      {[
        { dir: 'ltr' as const, locale: 'en' as const },
        { dir: 'rtl' as const, locale: 'ar' as const },
      ].map(({ dir, locale }) => (
        <div
          key={dir}
          dir={dir}
          className={cn(
            'rounded-lg border bg-card p-3 text-start shadow-soft',
            dir === 'rtl' && 'font-arabic',
          )}
        >
          <p className="text-[11px] font-semibold text-foreground">{t(locale, 'nav.attendance')}</p>
          <div className="mt-2 space-y-1.5">
            {SAMPLE[locale].slice(0, 3).map((name, index) => (
              <div key={name} className="flex items-center gap-1.5">
                <EmployeeAvatar name={name} className="h-4 w-4 text-[7px]" />
                <span className="min-w-0 flex-1 truncate text-[10px] text-foreground">{name}</span>
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    index === 2 ? 'bg-muted-foreground/40' : 'bg-success',
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The same card rendered in the light and dark palettes. */
export function ThemeVisual({ locale }: { locale: Locale }) {
  return (
    <div aria-hidden className="grid grid-cols-2 overflow-hidden rounded-lg border shadow-soft">
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} className={cn(theme, 'bg-background p-3 text-foreground')}>
          <p className="text-[10px] text-muted-foreground">{t(locale, `topbar.theme.${theme}`)}</p>
          <div className="mt-2 rounded-md border bg-card p-2">
            <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="w-3/5 bg-primary" />
              <div className="w-1/5 bg-primary/45" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-primary-soft" />
              <span className="h-1.5 flex-1 rounded-full bg-muted" />
              <span className="rounded-full bg-success-soft px-1.5 text-[8px] text-success">●</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** A downloaded export file. */
export function ExportVisual() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-3 rounded-lg border bg-card p-3 text-start shadow-soft"
      dir="ltr"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft font-mono text-[10px] font-semibold text-primary-soft-foreground">
        JSON
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">attendance-backup.json</p>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full bg-success" />
        </div>
      </div>
      <Check className="h-4 w-4 shrink-0 text-success" />
    </div>
  );
}
