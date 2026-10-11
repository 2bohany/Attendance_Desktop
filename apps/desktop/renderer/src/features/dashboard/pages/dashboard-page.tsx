import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { useHealthCheck, useDatabaseInfo } from '@/hooks/use-health-check';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Shield, WifiOff } from 'lucide-react';

export function DashboardPage() {
  const locale = useAppStore((state) => state.locale);
  const { data: health, isLoading: healthLoading } = useHealthCheck();
  const { data: dbInfo, isLoading: dbLoading } = useDatabaseInfo();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'page.dashboard.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'page.dashboard.description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <Badge variant={health?.database.connected ? 'success' : 'destructive'}>
                {health?.database.connected ? 'Connected' : 'Disconnected'}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Mode</CardTitle>
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="success">Active</Badge>
            <p className="mt-2 text-xs text-muted-foreground">No internet required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">IPC Secured</Badge>
            <p className="mt-2 text-xs text-muted-foreground">Context isolation enabled</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Local database configuration (Phase 0)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {dbLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database Path</span>
                <span className="max-w-md truncate font-mono text-xs">{dbInfo?.path ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database Exists</span>
                <span>{dbInfo?.exists ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Initialized</span>
                <span>{dbInfo?.initialized ? 'Yes' : 'No'}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
