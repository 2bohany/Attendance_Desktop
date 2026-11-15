import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, LogIn, LogOut, Info, Users } from 'lucide-react';
import type { AttendanceRecord, Employee, Locale } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import {
  formatDay,
  formatDuration,
  formatTime,
  localIsoDay,
  matchesSearch,
  shiftIsoDay,
} from '@/lib/format';
import { PageHeader } from '@/components/page-header';
import { SearchInput, Segmented } from '@/components/search-input';
import { EmployeeAvatar } from '@/components/employee-avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/table-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { useAttendance, useCheckIn, useCheckOut } from '../hooks/use-attendance';

type RowStatus = 'in' | 'out' | 'absent';
type Filter = 'all' | RowStatus;

type Row = {
  employee: Pick<Employee, 'id' | 'fullName' | 'employeeCode'> & { jobTitle?: string | null };
  record?: AttendanceRecord;
  status: RowStatus;
};

function statusOf(record?: AttendanceRecord): RowStatus {
  if (!record?.checkIn) return 'absent';
  return record.checkOut ? 'out' : 'in';
}

export function AttendancePage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('attendance.create'));
  const canEdit = useAuthStore((state) => state.hasPermission('attendance.edit'));

  const today = localIsoDay();
  const [day, setDay] = useState(today);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const isToday = day === today;

  const employeesQuery = useEmployees();
  const attendanceQuery = useAttendance(isToday ? undefined : day);
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const rows = useMemo<Row[]>(() => {
    const records = attendanceQuery.data ?? [];
    const byEmployee = new Map(records.map((record) => [record.employee.id, record]));
    const dayEnd = Date.parse(`${day}T23:59:59.999Z`);

    const roster: Row[] = (employeesQuery.data ?? [])
      .filter((employee) => employee.isActive && Date.parse(employee.hireDate) <= dayEnd)
      .map((employee) => {
        const record = byEmployee.get(employee.id);
        byEmployee.delete(employee.id);
        return { employee, record, status: statusOf(record) };
      });

    // Records for employees since deactivated still belong in the day's log.
    for (const record of byEmployee.values()) {
      roster.push({ employee: record.employee, record, status: statusOf(record) });
    }

    return roster.sort((a, b) => a.employee.fullName.localeCompare(b.employee.fullName, locale));
  }, [attendanceQuery.data, employeesQuery.data, day, locale]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      in: rows.filter((row) => row.status === 'in').length,
      out: rows.filter((row) => row.status === 'out').length,
      absent: rows.filter((row) => row.status === 'absent').length,
    }),
    [rows],
  );

  const visibleRows = rows.filter(
    (row) =>
      (filter === 'all' || row.status === filter) &&
      matchesSearch(search, row.employee.fullName, row.employee.employeeCode, row.employee.jobTitle),
  );

  const runCheckIn = (row: Row) =>
    checkIn.mutate(row.employee.id, {
      onSuccess: () => toast.success(t(locale, 'attendance.checkedIn', { name: row.employee.fullName })),
      onError: (error) => toast.error((error as Error).message),
    });

  const runCheckOut = (row: Row) =>
    checkOut.mutate(row.employee.id, {
      onSuccess: () => toast.success(t(locale, 'attendance.checkedOut', { name: row.employee.fullName })),
      onError: (error) => toast.error((error as Error).message),
    });

  const showActions = isToday && (canCreate || canEdit);
  const isLoading = attendanceQuery.isLoading || employeesQuery.isLoading;

  return (
    <div>
      <PageHeader
        title={t(locale, 'attendance.title')}
        description={t(locale, 'attendance.description')}
        actions={
          <div className="flex items-center gap-1 rounded-md border bg-card p-0.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDay(shiftIsoDay(day, -1))}
              aria-label={t(locale, 'common.previousDay')}
            >
              <ChevronLeft className="rtl:-scale-x-100" />
            </Button>
            <label className="relative">
              <span className="sr-only">{t(locale, 'attendance.pickDate')}</span>
              <input
                type="date"
                value={day}
                max={today}
                onChange={(event) => event.target.value && setDay(event.target.value)}
                className="tabular h-8 rounded-sm bg-transparent px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isToday}
              onClick={() => setDay(shiftIsoDay(day, 1))}
              aria-label={t(locale, 'common.nextDay')}
            >
              <ChevronRight className="rtl:-scale-x-100" />
            </Button>
            {!isToday && (
              <Button variant="secondary" size="sm" className="h-8" onClick={() => setDay(today)}>
                {t(locale, 'common.today')}
              </Button>
            )}
          </div>
        }
      />

      {!isToday && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-info/25 bg-info-soft px-3 py-2.5 text-sm text-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
          <p>
            <span className="font-medium">{formatDay(locale, `${day}T00:00:00.000Z`, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {' · '}
            {t(locale, 'attendance.pastDayNotice')}
          </p>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Segmented
          label={t(locale, 'attendance.table.status')}
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: t(locale, 'common.all'), count: counts.all },
            { value: 'in', label: t(locale, 'attendance.filter.in'), count: counts.in },
            { value: 'out', label: t(locale, 'attendance.filter.out'), count: counts.out },
            { value: 'absent', label: t(locale, 'attendance.filter.absent'), count: counts.absent },
          ]}
        />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t(locale, 'attendance.searchPlaceholder')}
        />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : attendanceQuery.isError || employeesQuery.isError ? (
        <ErrorState
          title={t(locale, 'error.title')}
          description={
            ((attendanceQuery.error ?? employeesQuery.error) as Error | null)?.message ??
            t(locale, 'error.description')
          }
          onRetry={() => {
            void attendanceQuery.refetch();
            void employeesQuery.refetch();
          }}
          retryLabel={t(locale, 'error.retry')}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title={isToday ? t(locale, 'attendance.empty.title') : t(locale, 'attendance.noRecords')}
          description={isToday ? t(locale, 'attendance.empty.description') : undefined}
        />
      ) : visibleRows.length === 0 ? (
        <EmptyState
          title={t(locale, 'common.noResults')}
          description={t(locale, 'common.noResultsDescription')}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(locale, 'attendance.table.employee')}</TableHead>
                <TableHead className="hidden md:table-cell">{t(locale, 'attendance.table.checkIn')}</TableHead>
                <TableHead className="hidden md:table-cell">{t(locale, 'attendance.table.checkOut')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t(locale, 'attendance.table.hours')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t(locale, 'attendance.table.status')}</TableHead>
                {showActions && (
                  <TableHead className="text-end">
                    <span className="sr-only">{t(locale, 'attendance.table.action')}</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((row) => {
                const { record } = row;
                const busyIn = checkIn.isPending && checkIn.variables === row.employee.id;
                const busyOut = checkOut.isPending && checkOut.variables === row.employee.id;
                return (
                  <TableRow key={row.employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar name={row.employee.fullName} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{row.employee.fullName}</p>
                          <p className="tabular truncate text-xs text-muted-foreground">
                            {row.employee.employeeCode}
                            {row.employee.jobTitle ? ` · ${row.employee.jobTitle}` : ''}
                          </p>
                          {/* Phones: times and status live under the name so the action stays in view. */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 md:hidden">
                            <span className="sm:hidden">
                              <StatusBadge status={row.status} locale={locale} />
                            </span>
                            {record?.checkIn && (
                              <span className="tabular text-xs text-muted-foreground">
                                {formatTime(locale, record.checkIn)}
                                {' – '}
                                {record.checkOut ? formatTime(locale, record.checkOut) : '…'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="tabular hidden md:table-cell">
                      {record?.checkIn ? formatTime(locale, record.checkIn) : <Dash />}
                    </TableCell>
                    <TableCell className="tabular hidden md:table-cell">
                      {record?.checkOut ? formatTime(locale, record.checkOut) : <Dash />}
                    </TableCell>
                    <TableCell className="tabular hidden text-muted-foreground lg:table-cell">
                      {record?.checkIn && (record.checkOut || isToday) ? (
                        formatDuration(locale, record.checkIn, record.checkOut ?? new Date().toISOString())
                      ) : (
                        <Dash />
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusBadge status={row.status} locale={locale} />
                    </TableCell>
                    {showActions && (
                      <TableCell className="w-px whitespace-nowrap text-end">
                        {row.status === 'absent' && canCreate && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyIn}
                            onClick={() => runCheckIn(row)}
                            aria-label={`${t(locale, 'attendance.action.checkIn')}: ${row.employee.fullName}`}
                          >
                            <LogIn className="rtl:-scale-x-100" />
                            <span className="hidden sm:inline">{t(locale, 'attendance.action.checkIn')}</span>
                          </Button>
                        )}
                        {row.status === 'in' && canEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyOut}
                            onClick={() => runCheckOut(row)}
                            aria-label={`${t(locale, 'attendance.action.checkOut')}: ${row.employee.fullName}`}
                          >
                            <LogOut className="rtl:-scale-x-100" />
                            <span className="hidden sm:inline">{t(locale, 'attendance.action.checkOut')}</span>
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, locale }: { status: RowStatus; locale: Locale }) {
  if (status === 'in')
    return (
      <Badge variant="success" dot>
        {t(locale, 'attendance.status.incomplete')}
      </Badge>
    );
  if (status === 'out')
    return (
      <Badge variant="secondary" dot>
        {t(locale, 'attendance.status.checkedOut')}
      </Badge>
    );
  return (
    <Badge variant="outline" dot>
      {t(locale, 'attendance.status.notIn')}
    </Badge>
  );
}

function Dash() {
  return <span className="text-muted-foreground/60">—</span>;
}
