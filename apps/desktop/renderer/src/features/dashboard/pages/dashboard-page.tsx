import { toast } from 'sonner';
import { ArrowRight, Check, X, LayoutGrid } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { formatDay, formatDayCount, formatLongToday, formatTime, inclusiveDays } from '@/lib/format';
import { hrefForPage, navigate } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmployeeAvatar } from '@/components/employee-avatar';
import { useConfirm } from '@/components/confirm-dialog';
import { useReportsSummary } from '@/features/reports/hooks/use-reports';
import { useTodayAttendance } from '@/features/attendance/hooks/use-attendance';
import { useLeaves, useUpdateLeaveStatus } from '@/features/leaves/hooks/use-leaves';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { DepartmentBars, HolidayList, Panel, TodayBar, type TodayBreakdown } from '../components/overview-blocks';

function greetingKey(hour: number) {
  if (hour < 12) return 'dashboard.greeting.morning' as const;
  if (hour < 18) return 'dashboard.greeting.afternoon' as const;
  return 'dashboard.greeting.evening' as const;
}

function ViewAllLink({ page, label }: { page: 'attendance' | 'leaves'; label: string }) {
  return (
    <a
      href={hrefForPage(page)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.button !== 0) return;
        event.preventDefault();
        navigate(page);
      }}
      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
    </a>
  );
}

export function DashboardPage() {
  const locale = useAppStore((state) => state.locale);
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canAttendance = hasPermission('attendance.view');
  const canReports = hasPermission('reports.view');
  const canLeaves = hasPermission('leaves.view');
  const canApprove = hasPermission('leaves.edit');
  const canEmployees = hasPermission('employees.view');

  const reports = useReportsSummary(canReports);
  const attendance = useTodayAttendance(canAttendance);
  const leaves = useLeaves(canLeaves);
  const employees = useEmployees(canEmployees && !canReports);
  const updateStatus = useUpdateLeaveStatus();
  const { confirm, dialog } = useConfirm();

  const firstName = user?.fullName.split(/\s+/)[0] ?? '';
  const records = attendance.data ?? [];
  const activeTotal =
    reports.data?.activeEmployees ??
    (employees.data ? employees.data.filter((employee) => employee.isActive).length : null);

  const today: TodayBreakdown | null =
    canAttendance && activeTotal !== null && attendance.data
      ? (() => {
          const present = records.filter((record) => record.checkIn && !record.checkOut).length;
          const completed = records.filter((record) => record.checkOut).length;
          const onLeave = reports.data ? reports.data.onLeaveToday : null;
          const notIn = Math.max(0, activeTotal - present - completed - (onLeave ?? 0));
          return { present, completed, onLeave, notIn, total: activeTotal };
        })()
      : null;

  const pending = (leaves.data ?? []).filter((leave) => leave.status === 'PENDING');
  const latest = [...records]
    .filter((record) => record.checkIn)
    .sort((a, b) => Date.parse(b.checkIn!) - Date.parse(a.checkIn!))
    .slice(0, 6);

  const decide = (id: string, status: 'APPROVED' | 'REJECTED') =>
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () =>
          toast.success(t(locale, status === 'APPROVED' ? 'leaves.approvedToast' : 'leaves.rejectedToast')),
        onError: (error) => toast.error((error as Error).message),
      },
    );

  const nothingVisible = !canAttendance && !canReports && !canLeaves;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{formatLongToday(locale)}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {t(locale, greetingKey(new Date().getHours()), { name: firstName })}
          </h1>
        </div>
        {canAttendance && (
          <Button onClick={() => navigate('attendance')}>
            {t(locale, 'dashboard.openAttendance')}
            <ArrowRight className="rtl:-scale-x-100" />
          </Button>
        )}
      </div>

      {nothingVisible && (
        <div className="flex items-start gap-3 rounded-lg border bg-card p-5 text-sm text-muted-foreground shadow-soft">
          <LayoutGrid className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>{t(locale, 'dashboard.limitedAccess')}</p>
        </div>
      )}

      {canAttendance && (
        <section className="rounded-lg border bg-card p-5 shadow-soft sm:p-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold">{t(locale, 'dashboard.todayTitle')}</h2>
            {today && (
              <p className="text-sm text-muted-foreground">
                {t(locale, 'dashboard.metric.summary', {
                  present: today.present + today.completed,
                  total: today.total,
                })}
              </p>
            )}
          </div>
          {today ? (
            <TodayBar locale={locale} data={today} />
          ) : attendance.isError ? (
            <p className="text-sm text-destructive">{(attendance.error as Error).message}</p>
          ) : (
            <div className="space-y-5">
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-7 w-10" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {(canLeaves || canAttendance) && (
        <div className="grid items-start gap-6 lg:grid-cols-5">
          {canLeaves && (
            <Panel
              className={canAttendance ? 'lg:col-span-3' : 'lg:col-span-5'}
              title={`${t(locale, 'dashboard.pending.title')}${pending.length ? ` · ${pending.length}` : ''}`}
              action={<ViewAllLink page="leaves" label={t(locale, 'common.viewAll')} />}
            >
              {leaves.isLoading ? (
                <ListSkeleton />
              ) : pending.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {t(locale, 'dashboard.pending.empty')}
                </p>
              ) : (
                <ul className="-my-3 divide-y">
                  {pending.slice(0, 5).map((leave) => {
                    const days = inclusiveDays(leave.startDate, leave.endDate);
                    return (
                      <li key={leave.id} className="flex flex-wrap items-center gap-3 py-3">
                        <EmployeeAvatar name={leave.employee.fullName} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{leave.employee.fullName}</p>
                          <p className="tabular truncate text-xs text-muted-foreground">
                            {leave.leaveType.name} · {formatDay(locale, leave.startDate, { day: 'numeric', month: 'short' })}
                            {days > 1 && ` – ${formatDay(locale, leave.endDate, { day: 'numeric', month: 'short' })}`}
                            {' · '}
                            {formatDayCount(locale, days)}
                          </p>
                        </div>
                        {canApprove && (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                confirm({
                                  title: t(locale, 'leaves.confirmReject.title'),
                                  description: t(locale, 'leaves.confirmReject.description', {
                                    name: leave.employee.fullName,
                                  }),
                                  confirmLabel: t(locale, 'leaves.action.reject'),
                                  variant: 'destructive',
                                  onConfirm: () => decide(leave.id, 'REJECTED'),
                                })
                              }
                            >
                              <X />
                              <span className="sr-only sm:not-sr-only">{t(locale, 'leaves.action.reject')}</span>
                            </Button>
                            <Button size="sm" disabled={updateStatus.isPending} onClick={() => decide(leave.id, 'APPROVED')}>
                              <Check />
                              {t(locale, 'leaves.action.approve')}
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          )}

          {canAttendance && (
            <Panel
              className={canLeaves ? 'lg:col-span-2' : 'lg:col-span-5'}
              title={t(locale, 'dashboard.recent.title')}
              action={<ViewAllLink page="attendance" label={t(locale, 'common.viewAll')} />}
            >
              {attendance.isLoading ? (
                <ListSkeleton />
              ) : latest.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {t(locale, 'dashboard.recent.empty')}
                </p>
              ) : (
                <ul className="-my-2.5 divide-y">
                  {latest.map((record) => (
                    <li key={record.id} className="flex items-center gap-3 py-2.5">
                      <EmployeeAvatar name={record.employee.fullName} className="h-7 w-7 text-[11px]" />
                      <p className="min-w-0 flex-1 truncate text-sm">{record.employee.fullName}</p>
                      <span className="tabular text-sm text-muted-foreground">
                        {formatTime(locale, record.checkIn!)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>
      )}

      {canReports && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Panel title={t(locale, 'dashboard.holidays.title')}>
            {reports.data ? (
              <HolidayList locale={locale} holidays={reports.data.upcomingHolidays} />
            ) : (
              <ListSkeleton />
            )}
          </Panel>
          <Panel title={t(locale, 'dashboard.departments.title')}>
            {reports.data ? (
              reports.data.employeesByDepartment.length > 0 ? (
                <DepartmentBars rows={reports.data.employeesByDepartment} />
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {t(locale, 'departments.empty.title')}
                </p>
              )
            ) : (
              <ListSkeleton />
            )}
          </Panel>
        </div>
      )}
      {dialog}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
