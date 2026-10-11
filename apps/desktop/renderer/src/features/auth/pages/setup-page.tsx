import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bootstrapAdminSchema, type BootstrapAdminInput } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useBootstrapAdmin } from '../hooks/use-auth';

export function SetupPage() {
  const locale = useAppStore((state) => state.locale);
  const bootstrapMutation = useBootstrapAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BootstrapAdminInput>({ resolver: zodResolver(bootstrapAdminSchema) });

  return (
    <div className="flex h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t(locale, 'auth.setup.title')}</CardTitle>
          <CardDescription>{t(locale, 'auth.setup.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((values) => bootstrapMutation.mutate(values))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">{t(locale, 'auth.field.fullName')}</Label>
              <Input id="fullName" autoFocus {...register('fullName')} />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">{t(locale, 'auth.field.username')}</Label>
              <Input id="username" {...register('username')} />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t(locale, 'auth.field.email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t(locale, 'auth.field.password')}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {bootstrapMutation.isError && (
              <p className="text-sm text-destructive">
                {(bootstrapMutation.error as Error).message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={bootstrapMutation.isPending}>
              {bootstrapMutation.isPending
                ? t(locale, 'common.loading')
                : t(locale, 'auth.action.createAccount')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
