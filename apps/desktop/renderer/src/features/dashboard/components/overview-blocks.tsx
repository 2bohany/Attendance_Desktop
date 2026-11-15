import type { Locale, ReportsSummary } from '@attendance/shared';
import { t } from '@/lib/i18n';
import { daysUntil, formatDay, formatRelativeDays } from '@/lib/format';
import { cn } from '@/lib/utils';

export type TodayBreakdown = {
  present: number;
  completed: number;
  onLeave: number | null;
  notIn: number;
  total: number;
};

const SEGMENTS = [
  { key: 'present', labelKey: 'dashboard.metric.present', bar: 'bg-primary', dot: 'bg-primary' },
  { key: 'completed', labelKey: 'dashboard.metric.completed', bar: 'bg-primary/45', dot: 'bg-primary/45' },
  { key: 'onLeave', labelKey: 'dashboard.metric.onLeave', bar: 'bg-warning/70', dot: 'bg-warning/70' },
  { key: 'notIn', labelKey: 'dashboard.metric.notIn', bar: 'bg-muted', dot: 'bg-muted-foreground/40' },
] as const;

/** Today's workforce split as one proportional bar plus a legend that carries the numbers. */
export function TodayBar({ locale, data }: { locale: Locale; data: TodayBreakdown }) {
  const total = Math.max(1, data.total);
  const segments = SEGMENTS.filter((segment) => data[segment.key] !== null);

  return (
    <div>
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={segments
          .map((segment) => `${t(locale, segment.labelKey)}: ${data[segment.key] ?? 0}`)
          .join(', ')}
      >
        {segments.map((segment) => {
          const value = data[segment.key] ?? 0;
          if (value === 0 || segment.key === 'notIn') return null;
          return (
            <div
              key={segment.key}
              className={cn('bar-grow h-full', segment.bar)}
              style={{ width: `${(value / total) * 100}%` }}
            />
          );
        })}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {segments.map((segment) => (
          <div key={segment.key} className="min-w-0">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <span aria-hidden className={cn('h-2 w-2 shrink-0 rounded-full', segment.dot)} />
              <span className="truncate">{t(locale, segment.labelKey)}</span>
            </dt>
            <dd className="tabular mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {data[segment.key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function HolidayList({
  locale,
  holidays,
}: {
  locale: Locale;
  holidays: ReportsSummary['upcomingHolidays'];
}) {
  if (holidays.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{t(locale, 'reports.noUpcomingHolidays')}</p>;
  }

  return (
    <ul className="divide-y">
      {holidays.map((holiday) => {
        const days = daysUntil(holiday.date);
        return (
          <li key={holiday.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md border bg-background leading-none">
              <span className="text-[10px] font-medium uppercase text-primary">
                {formatDay(locale, holiday.date, { month: 'short' })}
              </span>
              <span className="tabular mt-0.5 text-base font-semibold">
                {formatDay(locale, holiday.date, { day: 'numeric' })}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{holiday.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDay(locale, holiday.date, { weekday: 'long' })}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {formatRelativeDays(locale, days)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function DepartmentBars({
  rows,
}: {
  rows: ReportsSummary['employeesByDepartment'];
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  const sorted = [...rows].sort((a, b) => b.count - a.count);

  return (
    <ul className="space-y-3">
      {sorted.map((row) => (
        <li key={row.department}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{row.department}</span>
            <span className="tabular font-medium">{row.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary/70" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-lg border bg-card shadow-soft', className)}>
      <header className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

