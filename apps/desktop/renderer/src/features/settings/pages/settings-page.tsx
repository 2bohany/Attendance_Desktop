import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSettingsSchema, type UpdateSettingsInput } from '@attendance/shared';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings, useUpdateSettings } from '../hooks/use-settings';

export function SettingsPage() {
  const locale = useAppStore((state) => state.locale);
  const canEdit = useAuthStore((state) => state.hasPermission('settings.edit'));
  const settingsQuery = useSettings();
  const updateSettings = useUpdateSettings();

  const { register, handleSubmit } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    values: settingsQuery.data,
  });

  const onSubmit = (values: UpdateSettingsInput) => {
    updateSettings.mutate(values, {
      onSuccess: () => toast.success(t(locale, 'settings.saved')),
      onError: (error) => toast.error((error as Error).message),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'settings.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'settings.description')}</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">{t(locale, 'settings.title')}</CardTitle>
          <CardDescription>{t(locale, 'settings.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {settingsQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">{t(locale, 'settings.field.companyName')}</Label>
                <Input id="companyName" disabled={!canEdit} {...register('companyName')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultWorkStartTime">{t(locale, 'settings.field.workStart')}</Label>
                  <Input
                    id="defaultWorkStartTime"
                    type="time"
                    disabled={!canEdit}
                    {...register('defaultWorkStartTime')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultWorkEndTime">{t(locale, 'settings.field.workEnd')}</Label>
                  <Input
                    id="defaultWorkEndTime"
                    type="time"
                    disabled={!canEdit}
                    {...register('defaultWorkEndTime')}
                  />
                </div>
              </div>

              {canEdit && (
                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? t(locale, 'common.loading') : t(locale, 'common.save')}
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
