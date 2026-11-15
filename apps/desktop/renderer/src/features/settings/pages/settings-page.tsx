import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSettingsSchema, type Locale, type ThemeMode, type UpdateSettingsInput } from '@attendance/shared';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { PageHeader } from '@/components/page-header';
import { Segmented } from '@/components/search-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { useSettings, useUpdateSettings } from '../hooks/use-settings';

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-b py-8 first:pt-0 last:border-0 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border bg-card p-5 shadow-soft sm:p-6">{children}</div>
    </section>
  );
}

export function SettingsPage() {
  const { locale, theme, setLocale, setTheme } = useAppStore();
  const canEdit = useAuthStore((state) => state.hasPermission('settings.edit'));
  const settingsQuery = useSettings();
  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateSettingsInput>({
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
    <div>
      <PageHeader title={t(locale, 'settings.title')} description={t(locale, 'settings.description')} />

      <div className="max-w-4xl">
        <Section
          title={t(locale, 'settings.section.company')}
          description={t(locale, 'settings.section.companyDescription')}
        >
          {settingsQuery.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : settingsQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={(settingsQuery.error as Error).message}
              onRetry={() => settingsQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {!canEdit && (
                <p className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  {t(locale, 'settings.readOnly')}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="companyName">{t(locale, 'settings.field.companyName')}</Label>
                <Input id="companyName" disabled={!canEdit} {...register('companyName')} />
                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultWorkStartTime">{t(locale, 'settings.field.workStart')}</Label>
                  <Input
                    id="defaultWorkStartTime"
                    type="time"
                    className="tabular"
                    disabled={!canEdit}
                    {...register('defaultWorkStartTime')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultWorkEndTime">{t(locale, 'settings.field.workEnd')}</Label>
                  <Input
                    id="defaultWorkEndTime"
                    type="time"
                    className="tabular"
                    disabled={!canEdit}
                    {...register('defaultWorkEndTime')}
                  />
                </div>
              </div>

              {canEdit && (
                <div className="flex justify-end">
                  <Button type="submit" disabled={!isDirty || updateSettings.isPending}>
                    {updateSettings.isPending ? t(locale, 'common.loading') : t(locale, 'common.save')}
                  </Button>
                </div>
              )}
            </form>
          )}
        </Section>

        <Section
          title={t(locale, 'settings.section.appearance')}
          description={t(locale, 'settings.section.appearanceDescription')}
        >
          <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium">{t(locale, 'topbar.theme')}</span>
              <Segmented<ThemeMode>
                label={t(locale, 'topbar.theme')}
                value={theme}
                onChange={setTheme}
                options={[
                  { value: 'light', label: t(locale, 'topbar.theme.light') },
                  { value: 'dark', label: t(locale, 'topbar.theme.dark') },
                  { value: 'system', label: t(locale, 'topbar.theme.system') },
                ]}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium">{t(locale, 'topbar.language')}</span>
              <Segmented<Locale>
                label={t(locale, 'topbar.language')}
                value={locale}
                onChange={setLocale}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'ar', label: 'العربية' },
                ]}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
