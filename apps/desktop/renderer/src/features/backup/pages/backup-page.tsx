import { toast } from 'sonner';
import { DatabaseBackup } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useBackups, useCreateBackup } from '../hooks/use-backup';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BackupPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('backup.create'));

  const backupsQuery = useBackups();
  const createBackup = useCreateBackup();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'backup.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'backup.description')}</p>
      </div>

      {canCreate && (
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={createBackup.isPending}
            onClick={() =>
              createBackup.mutate(undefined, {
                onError: (error) => toast.error((error as Error).message),
              })
            }
          >
            <DatabaseBackup className="me-2 h-4 w-4" />
            {createBackup.isPending ? t(locale, 'common.loading') : t(locale, 'backup.action.create')}
          </Button>
        </div>
      )}

      {backupsQuery.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : backupsQuery.isError ? (
        <ErrorState
          title={t(locale, 'error.title')}
          description={t(locale, 'error.description')}
          onRetry={() => backupsQuery.refetch()}
          retryLabel={t(locale, 'error.retry')}
        />
      ) : backupsQuery.data && backupsQuery.data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(locale, 'backup.table.file')}</TableHead>
              <TableHead>{t(locale, 'backup.table.size')}</TableHead>
              <TableHead>{t(locale, 'backup.table.createdAt')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backupsQuery.data.map((backup) => (
              <TableRow key={backup.fileName}>
                <TableCell className="font-mono text-xs">{backup.fileName}</TableCell>
                <TableCell>{formatBytes(backup.sizeBytes)}</TableCell>
                <TableCell>{new Date(backup.createdAt).toLocaleString(locale)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          title={t(locale, 'backup.empty.title')}
          description={t(locale, 'backup.empty.description')}
        />
      )}
    </div>
  );
}
