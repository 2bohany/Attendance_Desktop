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
            index === 1 && 'ms-6 opacity-80',
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
