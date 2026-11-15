import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { loginSchema, type LoginInput } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLogin } from '../hooks/use-auth';
import { AuthLayout, FieldError, FormError, PasswordInput } from '../components/auth-layout';

export function LoginPage() {
  const locale = useAppStore((state) => state.locale);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <AuthLayout title={t(locale, 'auth.login.title')} description={t(locale, 'auth.login.description')}>
      <form onSubmit={handleSubmit((values) => loginMutation.mutate(values))} className="space-y-5" noValidate>
        <FormError message={loginMutation.isError ? (loginMutation.error as Error).message : undefined} />

        <div className="space-y-2">
          <Label htmlFor="username">{t(locale, 'auth.field.username')}</Label>
          <Input
            id="username"
            autoFocus
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={Boolean(errors.username)}
            {...register('username')}
          />
          <FieldError message={errors.username?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t(locale, 'auth.field.password')}</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending && <Loader2 className="animate-spin" />}
          {t(locale, 'auth.action.signIn')}
        </Button>
      </form>
    </AuthLayout>
  );
}
