import { Users, UserCheck, CalendarCheck, CalendarOff } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { useReportsSummary } from '../hooks/use-reports';

export function ReportsPage() {
  const locale = useAppStore((state) => state.locale);
  const summaryQuery = useReportsSummary();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'reports.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'reports.description')}</p>
      </div>

      {summaryQuery.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : summaryQuery.isError ? (
        <ErrorState
          title={t(locale, 'error.title')}
          description={t(locale, 'error.description')}
          onRetry={() => summaryQuery.refetch()}
          retryLabel={t(locale, 'error.retry')}
        />
      ) : summaryQuery.data ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(locale, 'reports.card.totalEmployees')}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">{summaryQuery.data.totalEmployees}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(locale, 'reports.card.activeEmployees')}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">{summaryQuery.data.activeEmployees}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(locale, 'reports.card.presentToday')}
                </CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">{summaryQuery.data.presentToday}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t(locale, 'reports.card.onLeaveToday')}
                </CardTitle>
                <CalendarOff className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">{summaryQuery.data.onLeaveToday}</CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t(locale, 'reports.byDepartment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {summaryQuery.data.employeesByDepartment.map((row) => (
                      <TableRow key={row.department}>
                        <TableCell>{row.department}</TableCell>
                        <TableCell className="text-end">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t(locale, 'reports.upcomingHolidays')}</CardTitle>
              </CardHeader>
              <CardContent>
                {summaryQuery.data.upcomingHolidays.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t(locale, 'holidays.table.name')}</TableHead>
                        <TableHead>{t(locale, 'holidays.table.date')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryQuery.data.upcomingHolidays.map((holiday) => (
                        <TableRow key={holiday.id}>
                          <TableCell>{holiday.name}</TableCell>
                          <TableCell>{new Date(holiday.date).toLocaleDateString(locale)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t(locale, 'reports.noUpcomingHolidays')}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
