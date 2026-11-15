import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { bootstrapAdminSchema, type BootstrapAdminInput } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useBootstrapAdmin } from '../hooks/use-auth';
import { AuthLayout, FieldError, FormError, PasswordInput } from '../components/auth-layout';

export function SetupPage() {
  const locale = useAppStore((state) => state.locale);
  const bootstrapMutation = useBootstrapAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BootstrapAdminInput>({ resolver: zodResolver(bootstrapAdminSchema) });

  return (
    <AuthLayout title={t(locale, 'auth.setup.title')} description={t(locale, 'auth.setup.description')}>
      <form onSubmit={handleSubmit((values) => bootstrapMutation.mutate(values))} className="space-y-5" noValidate>
        <FormError message={bootstrapMutation.isError ? (bootstrapMutation.error as Error).message : undefined} />

        <div className="space-y-2">
          <Label htmlFor="fullName">{t(locale, 'auth.field.fullName')}</Label>
          <Input id="fullName" autoFocus autoComplete="name" {...register('fullName')} />
          <FieldError message={errors.fullName?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">{t(locale, 'auth.field.username')}</Label>
            <Input
              id="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              {...register('username')}
            />
            <FieldError message={errors.username?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t(locale, 'auth.field.email')}</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t(locale, 'auth.field.password')}</Label>
          <PasswordInput id="password" autoComplete="new-password" {...register('password')} />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" disabled={bootstrapMutation.isPending}>
          {bootstrapMutation.isPending && <Loader2 className="animate-spin" />}
          {t(locale, 'auth.action.createAccount')}
        </Button>
      </form>
    </AuthLayout>
  );
}
