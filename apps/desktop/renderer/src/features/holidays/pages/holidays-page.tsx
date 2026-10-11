import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useDeleteHoliday, useHolidays } from '../hooks/use-holidays';
import { CreateHolidayDialog } from '../components/create-holiday-dialog';

export function HolidaysPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('holidays.create'));
  const canDelete = useAuthStore((state) => state.hasPermission('holidays.delete'));

  const holidaysQuery = useHolidays();
  const deleteHoliday = useDeleteHoliday();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'holidays.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'holidays.description')}</p>
      </div>

      {canCreate && (
        <div className="flex justify-end">
          <CreateHolidayDialog
            trigger={
              <Button size="sm">
                <Plus className="me-2 h-4 w-4" />
                {t(locale, 'holidays.action.create')}
              </Button>
            }
          />
        </div>
      )}

      {holidaysQuery.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : holidaysQuery.isError ? (
        <ErrorState
          title={t(locale, 'error.title')}
          description={t(locale, 'error.description')}
          onRetry={() => holidaysQuery.refetch()}
          retryLabel={t(locale, 'error.retry')}
        />
      ) : holidaysQuery.data && holidaysQuery.data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(locale, 'holidays.table.name')}</TableHead>
              <TableHead>{t(locale, 'holidays.table.date')}</TableHead>
              <TableHead>{t(locale, 'holidays.table.description')}</TableHead>
              {canDelete && (
                <TableHead className="text-end">{t(locale, 'holidays.table.actions')}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidaysQuery.data.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium">{holiday.name}</TableCell>
                <TableCell>{new Date(holiday.date).toLocaleDateString(locale)}</TableCell>
                <TableCell>{holiday.description ?? '—'}</TableCell>
                {canDelete && (
                  <TableCell className="text-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deleteHoliday.isPending}
                      onClick={() =>
                        deleteHoliday.mutate(holiday.id, {
                          onError: (error) => toast.error((error as Error).message),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          title={t(locale, 'holidays.empty.title')}
          description={t(locale, 'holidays.empty.description')}
        />
      )}
    </div>
  );
}
