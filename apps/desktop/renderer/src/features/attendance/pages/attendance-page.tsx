import { useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { useCheckIn, useCheckOut, useTodayAttendance } from '../hooks/use-attendance';

export function AttendancePage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('attendance.create'));
  const canEdit = useAuthStore((state) => state.hasPermission('attendance.edit'));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const employeesQuery = useEmployees();
  const attendanceQuery = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const activeEmployees = (employeesQuery.data ?? []).filter((employee) => employee.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'attendance.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'attendance.description')}</p>
      </div>

      {(canCreate || canEdit) && (
        <Card>
          <CardContent className="flex items-end gap-3 pt-6">
            <div className="w-64 space-y-2">
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder={t(locale, 'attendance.selectEmployee')} />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.fullName} ({employee.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {canCreate && (
              <Button
                disabled={!selectedEmployeeId || checkInMutation.isPending}
                onClick={() =>
                  checkInMutation.mutate(selectedEmployeeId, {
                    onError: (error) => toast.error((error as Error).message),
                  })
                }
              >
                {t(locale, 'attendance.action.checkIn')}
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                disabled={!selectedEmployeeId || checkOutMutation.isPending}
                onClick={() =>
                  checkOutMutation.mutate(selectedEmployeeId, {
                    onError: (error) => toast.error((error as Error).message),
                  })
                }
              >
                {t(locale, 'attendance.action.checkOut')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {attendanceQuery.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : attendanceQuery.isError ? (
        <ErrorState
          title={t(locale, 'error.title')}
          description={t(locale, 'error.description')}
          onRetry={() => attendanceQuery.refetch()}
          retryLabel={t(locale, 'error.retry')}
        />
      ) : attendanceQuery.data && attendanceQuery.data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(locale, 'attendance.table.employee')}</TableHead>
              <TableHead>{t(locale, 'attendance.table.checkIn')}</TableHead>
              <TableHead>{t(locale, 'attendance.table.checkOut')}</TableHead>
              <TableHead>{t(locale, 'attendance.table.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceQuery.data.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.employee.fullName}</TableCell>
                <TableCell>
                  {record.checkIn ? new Date(record.checkIn).toLocaleTimeString(locale) : '—'}
                </TableCell>
                <TableCell>
                  {record.checkOut ? new Date(record.checkOut).toLocaleTimeString(locale) : '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={record.status === 'PRESENT' ? 'success' : 'warning'}>
                    {record.status === 'PRESENT'
                      ? t(locale, 'attendance.status.present')
                      : t(locale, 'attendance.status.incomplete')}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          title={t(locale, 'attendance.empty.title')}
          description={t(locale, 'attendance.empty.description')}
        />
      )}
    </div>
  );
}
