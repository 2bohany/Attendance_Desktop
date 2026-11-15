import { toast } from 'sonner';
import { Download, FileJson, ShieldCheck, History } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { formatBytes, formatDateTime } from '@/lib/format';
import { PageHeader } from '@/components/page-header';
import { TableSkeleton } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useBackups, useCreateBackup } from '../hooks/use-backup';

function downloadJson(fileName: string, payload: unknown): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function BackupPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('backup.create'));

  const backupsQuery = useBackups();
  const createBackup = useCreateBackup();

  const runExport = () =>
    createBackup.mutate(undefined, {
      onSuccess: (backup) => {
        const { format, version, exportedAt, data, fileName } = backup;
        downloadJson(fileName, { format, version, exportedAt, data });
        toast.success(t(locale, 'backup.downloaded'), { description: fileName });
      },
      onError: (error) => toast.error((error as Error).message),
    });

  return (
    <div>
      <PageHeader title={t(locale, 'backup.title')} description={t(locale, 'backup.description')} />

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-lg border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
            <FileJson className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold">{t(locale, 'backup.export.title')}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{t(locale, 'backup.export.body')}</p>
          {canCreate && (
            <Button className="mt-5 w-full sm:w-auto" disabled={createBackup.isPending} onClick={runExport}>
              <Download />
              {createBackup.isPending ? t(locale, 'common.loading') : t(locale, 'backup.action.create')}
            </Button>
          )}
          <p className="mt-5 flex items-start gap-2 border-t pt-4 text-xs text-muted-foreground">
            <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-success" />
            {t(locale, 'backup.atlasNote')}
          </p>
        </section>

        <section className="lg:col-span-3">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <History className="h-4 w-4 text-muted-foreground" />
            {t(locale, 'backup.history')}
          </h2>
          {backupsQuery.isLoading ? (
            <TableSkeleton rows={3} />
          ) : backupsQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={(backupsQuery.error as Error).message}
              onRetry={() => backupsQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : backupsQuery.data && backupsQuery.data.length > 0 ? (
            <ul className="divide-y overflow-hidden rounded-lg border bg-card shadow-soft">
              {backupsQuery.data.map((backup) => (
                <li key={`${backup.fileName}-${backup.createdAt}`} className="flex items-center gap-3 px-4 py-3">
                  <FileJson className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" dir="ltr">
                      {backup.fileName}
                    </p>
                    <p className="tabular text-xs text-muted-foreground">
                      {formatDateTime(locale, backup.createdAt)}
                    </p>
                  </div>
                  {backup.sizeBytes > 0 && (
                    <span className="tabular shrink-0 text-xs text-muted-foreground">
                      {formatBytes(backup.sizeBytes)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<History />}
              title={t(locale, 'backup.empty.title')}
              description={t(locale, 'backup.empty.description')}
            />
          )}
        </section>
      </div>
    </div>
  );
}
