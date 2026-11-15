import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Check, X, CalendarOff, Tags } from 'lucide-react';
import type { LeaveStatus } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { formatDay, inclusiveDays, matchesSearch } from '@/lib/format';
import { PageHeader } from '@/components/page-header';
import { SearchInput, Segmented } from '@/components/search-input';
import { EmployeeAvatar } from '@/components/employee-avatar';
import { TableSkeleton } from '@/components/table-skeleton';
import { useConfirm } from '@/components/confirm-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { useLeaveTypes, useLeaves, useUpdateLeaveStatus } from '../hooks/use-leaves';
import { CreateLeaveDialog } from '../components/create-leave-dialog';
import { CreateLeaveTypeDialog } from '../components/create-leave-type-dialog';

const STATUS_VARIANT: Record<LeaveStatus, BadgeProps['variant']> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

type Filter = 'all' | LeaveStatus;

export function LeavesPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('leaves.create'));
  const canEdit = useAuthStore((state) => state.hasPermission('leaves.edit'));
  const canSeeEmployees = useAuthStore((state) => state.hasPermission('employees.view'));

  const [tab, setTab] = useState('requests');
  const [filter, setFilter] = useState<Filter>('PENDING');
  const [search, setSearch] = useState('');

  const employeesQuery = useEmployees(canSeeEmployees && canCreate);
  const leaveTypesQuery = useLeaveTypes();
  const leavesQuery = useLeaves();
  const updateStatus = useUpdateLeaveStatus();
  const { confirm, dialog } = useConfirm();

  const activeEmployees = (employeesQuery.data ?? []).filter((employee) => employee.isActive);
  const leaveTypes = leaveTypesQuery.data ?? [];
  const leaves = useMemo(() => leavesQuery.data ?? [], [leavesQuery.data]);

  const counts = useMemo(
    () => ({
      all: leaves.length,
      PENDING: leaves.filter((leave) => leave.status === 'PENDING').length,
      APPROVED: leaves.filter((leave) => leave.status === 'APPROVED').length,
      REJECTED: leaves.filter((leave) => leave.status === 'REJECTED').length,
    }),
    [leaves],
  );

  const visible = leaves
    .filter(
      (leave) =>
        (filter === 'all' || leave.status === filter) &&
        matchesSearch(search, leave.employee.fullName, leave.employee.employeeCode, leave.leaveType.name),
    )
    .sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));

  const statusLabel = (status: LeaveStatus) =>
    status === 'PENDING'
      ? t(locale, 'leaves.status.pending')
      : status === 'APPROVED'
        ? t(locale, 'leaves.status.approved')
        : t(locale, 'leaves.status.rejected');

  const decide = (id: string, status: 'APPROVED' | 'REJECTED') =>
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () =>
          toast.success(t(locale, status === 'APPROVED' ? 'leaves.approvedToast' : 'leaves.rejectedToast')),
        onError: (error) => toast.error((error as Error).message),
      },
    );

  const headerAction =
    canCreate &&
    (tab === 'requests' ? (
      <CreateLeaveDialog
        employees={activeEmployees}
        leaveTypes={leaveTypes}
        trigger={
          <Button>
            <Plus />
            {t(locale, 'leaves.action.request')}
          </Button>
        }
      />
    ) : (
      <CreateLeaveTypeDialog
        trigger={
          <Button>
            <Plus />
            {t(locale, 'leaves.action.createType')}
          </Button>
        }
      />
    ));

  return (
    <div>
      <PageHeader
        title={t(locale, 'leaves.title')}
        description={t(locale, 'leaves.description')}
        actions={headerAction || undefined}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="requests">
            {t(locale, 'leaves.tab.requests')}
            {counts.PENDING > 0 && (
              <span className="tabular rounded-full bg-warning-soft px-1.5 text-xs text-warning">
                {counts.PENDING}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="types">{t(locale, 'leaves.tab.types')}</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Segmented
              label={t(locale, 'leaves.table.status')}
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'PENDING', label: t(locale, 'leaves.status.pending'), count: counts.PENDING },
                { value: 'APPROVED', label: t(locale, 'leaves.status.approved'), count: counts.APPROVED },
                { value: 'REJECTED', label: t(locale, 'leaves.status.rejected'), count: counts.REJECTED },
                { value: 'all', label: t(locale, 'common.all'), count: counts.all },
              ]}
            />
            <SearchInput value={search} onChange={setSearch} placeholder={t(locale, 'attendance.searchPlaceholder')} />
          </div>

          {leavesQuery.isLoading ? (
            <TableSkeleton />
          ) : leavesQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={(leavesQuery.error as Error).message}
              onRetry={() => leavesQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : leaves.length === 0 ? (
            <EmptyState
              icon={<CalendarOff />}
              title={t(locale, 'leaves.empty.title')}
              description={t(locale, 'leaves.empty.description')}
              action={headerAction || undefined}
            />
          ) : visible.length === 0 ? (
            <EmptyState
              title={filter === 'PENDING' && !search ? t(locale, 'dashboard.pending.empty') : t(locale, 'common.noResults')}
              description={filter === 'PENDING' && !search ? undefined : t(locale, 'common.noResultsDescription')}
            />
          ) : (
            <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t(locale, 'leaves.table.employee')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t(locale, 'leaves.table.type')}</TableHead>
                    <TableHead>{t(locale, 'leaves.table.startDate')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t(locale, 'leaves.table.days')}</TableHead>
                    <TableHead>{t(locale, 'leaves.table.status')}</TableHead>
                    {canEdit && (
                      <TableHead className="text-end">
                        <span className="sr-only">{t(locale, 'leaves.table.actions')}</span>
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((leave) => {
                    const days = inclusiveDays(leave.startDate, leave.endDate);
                    const busy = updateStatus.isPending && updateStatus.variables?.id === leave.id;
                    return (
                      <TableRow key={leave.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <EmployeeAvatar name={leave.employee.fullName} />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{leave.employee.fullName}</p>
                              <p className="truncate text-xs text-muted-foreground md:hidden">{leave.leaveType.name}</p>
                              {leave.reason && (
                                <p className="hidden max-w-xs truncate text-xs text-muted-foreground md:block" title={leave.reason}>
                                  {leave.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{leave.leaveType.name}</TableCell>
                        <TableCell className="tabular whitespace-nowrap">
                          {formatDay(locale, leave.startDate, { day: 'numeric', month: 'short' })}
                          {days > 1 && (
                            <span className="text-muted-foreground">
                              {' – '}
                              {formatDay(locale, leave.endDate)}
                            </span>
                          )}
                          {days === 1 && (
                            <span className="text-muted-foreground">
                              {' '}
                              {formatDay(locale, leave.startDate, { year: 'numeric' })}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="tabular hidden sm:table-cell">{days}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[leave.status]} dot>
                            {statusLabel(leave.status)}
                          </Badge>
                        </TableCell>
                        {canEdit && (
                          <TableCell className="text-end">
                            {leave.status === 'PENDING' && (
                              <div className="inline-flex gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={busy}
                                  aria-label={t(locale, 'leaves.action.reject')}
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
                                  <span className="hidden lg:inline">{t(locale, 'leaves.action.reject')}</span>
                                </Button>
                                <Button size="sm" disabled={busy} onClick={() => decide(leave.id, 'APPROVED')}>
                                  <Check />
                                  <span className="hidden sm:inline">{t(locale, 'leaves.action.approve')}</span>
                                </Button>
                              </div>
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
        </TabsContent>

        <TabsContent value="types">
          {leaveTypesQuery.isLoading ? (
            <TableSkeleton rows={3} />
          ) : leaveTypes.length > 0 ? (
            <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t(locale, 'leaves.field.typeName')}</TableHead>
                    <TableHead>{t(locale, 'departments.table.description')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveTypes.map((leaveType) => (
                    <TableRow key={leaveType.id}>
                      <TableCell className="font-medium">{leaveType.name}</TableCell>
                      <TableCell className="text-muted-foreground">{leaveType.description ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={<Tags />}
              title={t(locale, 'empty.title')}
              description={t(locale, 'empty.description')}
              action={headerAction || undefined}
            />
          )}
        </TabsContent>
      </Tabs>
      {dialog}
    </div>
  );
}
