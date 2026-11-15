import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { DepartmentBars, HolidayList, Panel } from '@/features/dashboard/components/overview-blocks';
import { useReportsSummary } from '../hooks/use-reports';

export function ReportsPage() {
  const locale = useAppStore((state) => state.locale);
  const summaryQuery = useReportsSummary();
  const data = summaryQuery.data;

  const stats = data
    ? [
        { label: t(locale, 'reports.card.totalEmployees'), value: data.totalEmployees },
        { label: t(locale, 'reports.card.activeEmployees'), value: data.activeEmployees },
        {
          label: t(locale, 'reports.card.presentToday'),
          value: data.presentToday,
          hint: data.activeEmployees
            ? `${Math.round((data.presentToday / data.activeEmployees) * 100)}%`
            : undefined,
        },
        { label: t(locale, 'reports.card.onLeaveToday'), value: data.onLeaveToday },
      ]
    : [];

  return (
    <div>
      <PageHeader title={t(locale, 'reports.title')} description={t(locale, 'reports.description')} />

      {summaryQuery.isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-28 w-full rounded-lg" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      ) : summaryQuery.isError ? (
        <ErrorState
          title={t(locale, 'error.title')}
          description={(summaryQuery.error as Error).message}
          onRetry={() => summaryQuery.refetch()}
          retryLabel={t(locale, 'error.retry')}
        />
      ) : data ? (
        <div className="space-y-6">
          <dl className="grid grid-cols-2 divide-border overflow-hidden rounded-lg border bg-card shadow-soft lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  'p-5 ' +
                  (index % 2 === 0 ? 'border-e lg:border-e-0 ' : '') +
                  (index < 2 ? 'border-b lg:border-b-0' : '')
                }
              >
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1.5 flex items-baseline gap-2">
                  <span className="tabular text-3xl font-semibold tracking-tight">{stat.value}</span>
                  {stat.hint && <span className="tabular text-sm text-muted-foreground">{stat.hint}</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title={t(locale, 'reports.byDepartment')}>
              {data.employeesByDepartment.length > 0 ? (
                <DepartmentBars rows={data.employeesByDepartment} />
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {t(locale, 'departments.empty.title')}
                </p>
              )}
            </Panel>
            <Panel title={t(locale, 'reports.upcomingHolidays')}>
              <HolidayList locale={locale} holidays={data.upcomingHolidays} />
            </Panel>
          </div>
        </div>
      ) : null}
    </div>
  );
}
