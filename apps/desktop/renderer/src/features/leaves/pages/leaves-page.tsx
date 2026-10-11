import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { useLeaveTypes, useLeaves, useUpdateLeaveStatus } from '../hooks/use-leaves';
import { CreateLeaveDialog } from '../components/create-leave-dialog';
import { CreateLeaveTypeDialog } from '../components/create-leave-type-dialog';

const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

export function LeavesPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('leaves.create'));
  const canEdit = useAuthStore((state) => state.hasPermission('leaves.edit'));

  const employeesQuery = useEmployees();
  const leaveTypesQuery = useLeaveTypes();
  const leavesQuery = useLeaves();
  const updateStatus = useUpdateLeaveStatus();

  const activeEmployees = (employeesQuery.data ?? []).filter((employee) => employee.isActive);
  const leaveTypes = leaveTypesQuery.data ?? [];

  const statusLabel = (status: string) =>
    status === 'PENDING'
      ? t(locale, 'leaves.status.pending')
      : status === 'APPROVED'
        ? t(locale, 'leaves.status.approved')
        : t(locale, 'leaves.status.rejected');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'leaves.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'leaves.description')}</p>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">{t(locale, 'leaves.tab.requests')}</TabsTrigger>
          <TabsTrigger value="types">{t(locale, 'leaves.tab.types')}</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {canCreate && (
            <div className="flex justify-end">
              <CreateLeaveDialog
                employees={activeEmployees}
                leaveTypes={leaveTypes}
                trigger={
                  <Button size="sm">
                    <Plus className="me-2 h-4 w-4" />
                    {t(locale, 'leaves.action.request')}
                  </Button>
                }
              />
            </div>
          )}

          {leavesQuery.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : leavesQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={t(locale, 'error.description')}
              onRetry={() => leavesQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : leavesQuery.data && leavesQuery.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(locale, 'leaves.table.employee')}</TableHead>
                  <TableHead>{t(locale, 'leaves.table.type')}</TableHead>
                  <TableHead>{t(locale, 'leaves.table.startDate')}</TableHead>
                  <TableHead>{t(locale, 'leaves.table.endDate')}</TableHead>
                  <TableHead>{t(locale, 'leaves.table.status')}</TableHead>
                  {canEdit && (
                    <TableHead className="text-end">{t(locale, 'leaves.table.actions')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leavesQuery.data.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.employee.fullName}</TableCell>
                    <TableCell>{leave.leaveType.name}</TableCell>
                    <TableCell>{new Date(leave.startDate).toLocaleDateString(locale)}</TableCell>
                    <TableCell>{new Date(leave.endDate).toLocaleDateString(locale)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[leave.status]}>{statusLabel(leave.status)}</Badge>
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-end space-x-2 rtl:space-x-reverse">
                        {leave.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                updateStatus.mutate(
                                  { id: leave.id, status: 'APPROVED' },
                                  { onError: (error) => toast.error((error as Error).message) },
                                )
                              }
                            >
                              {t(locale, 'leaves.action.approve')}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                updateStatus.mutate(
                                  { id: leave.id, status: 'REJECTED' },
                                  { onError: (error) => toast.error((error as Error).message) },
                                )
                              }
                            >
                              {t(locale, 'leaves.action.reject')}
                            </Button>
                          </>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title={t(locale, 'leaves.empty.title')}
              description={t(locale, 'leaves.empty.description')}
            />
          )}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {canCreate && (
            <div className="flex justify-end">
              <CreateLeaveTypeDialog
                trigger={
                  <Button size="sm">
                    <Plus className="me-2 h-4 w-4" />
                    {t(locale, 'leaves.action.createType')}
                  </Button>
                }
              />
            </div>
          )}

          {leaveTypesQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : leaveTypes.length > 0 ? (
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
                    <TableCell>{leaveType.description ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title={t(locale, 'empty.title')} description={t(locale, 'empty.description')} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
