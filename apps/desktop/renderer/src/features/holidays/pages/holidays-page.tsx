import { toast } from 'sonner';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import type { Holiday } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { daysUntil, formatDay, formatRelativeDays } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { TableSkeleton } from '@/components/table-skeleton';
import { useConfirm } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
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
  const { confirm, dialog } = useConfirm();

  const holidays = [...(holidaysQuery.data ?? [])].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const upcoming = holidays.filter((holiday) => daysUntil(holiday.date) >= 0);
  const past = holidays.filter((holiday) => daysUntil(holiday.date) < 0).reverse();

  const action = canCreate && (
    <CreateHolidayDialog
      trigger={
        <Button>
          <Plus />
          {t(locale, 'holidays.action.create')}
        </Button>
      }
    />
  );

  const remove = (holiday: Holiday) =>
    confirm({
      title: t(locale, 'holidays.confirmDelete.title', { name: holiday.name }),
      description: t(locale, 'common.irreversible'),
      confirmLabel: t(locale, 'common.delete'),
      variant: 'destructive',
      onConfirm: () =>
        deleteHoliday.mutate(holiday.id, { onError: (error) => toast.error((error as Error).message) }),
    });

  const renderList = (items: Holiday[], muted = false) => (
    <ul className="divide-y overflow-hidden rounded-lg border bg-card shadow-soft">
      {items.map((holiday) => {
        const days = daysUntil(holiday.date);
        return (
          <li key={holiday.id} className={cn('flex items-center gap-4 px-4 py-3.5', muted && 'text-muted-foreground')}>
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md border bg-background leading-none">
              <span className={cn('text-[10px] font-medium uppercase', muted ? 'text-muted-foreground' : 'text-primary')}>
                {formatDay(locale, holiday.date, { month: 'short' })}
              </span>
              <span className="tabular mt-0.5 text-lg font-semibold text-foreground">
                {formatDay(locale, holiday.date, { day: 'numeric' })}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn('truncate font-medium', !muted && 'text-foreground')}>{holiday.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {formatDay(locale, holiday.date, { weekday: 'long', year: 'numeric' })}
                {holiday.description ? ` · ${holiday.description}` : ''}
              </p>
            </div>
            {!muted && (
              <span className="hidden shrink-0 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary-soft-foreground sm:inline">
                {formatRelativeDays(locale, days)}
              </span>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={`${t(locale, 'common.delete')} ${holiday.name}`}
                disabled={deleteHoliday.isPending}
                onClick={() => remove(holiday)}
              >
                <Trash2 />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <PageHeader
        title={t(locale, 'holidays.title')}
        description={t(locale, 'holidays.description')}
        actions={action || undefined}
      />

      {holidaysQuery.isLoading ? (
        <TableSkeleton rows={4} />
      ) : holidaysQuery.isError ? (
        <ErrorState
          title={t(locale, 'error.title')}
          description={(holidaysQuery.error as Error).message}
          onRetry={() => holidaysQuery.refetch()}
          retryLabel={t(locale, 'error.retry')}
        />
      ) : holidays.length === 0 ? (
        <EmptyState
          icon={<CalendarDays />}
          title={t(locale, 'holidays.empty.title')}
          description={t(locale, 'holidays.empty.description')}
          action={action || undefined}
        />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold">{t(locale, 'holidays.section.upcoming')}</h2>
            {upcoming.length > 0 ? (
              renderList(upcoming)
            ) : (
              <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                {t(locale, 'reports.noUpcomingHolidays')}
              </p>
            )}
          </section>
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{t(locale, 'holidays.section.past')}</h2>
              {renderList(past, true)}
            </section>
          )}
        </div>
      )}
      {dialog}
    </div>
  );
}
