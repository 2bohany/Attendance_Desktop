import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLogin } from '../hooks/use-auth';

export function LoginPage() {
  const locale = useAppStore((state) => state.locale);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="flex h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t(locale, 'auth.login.title')}</CardTitle>
          <CardDescription>{t(locale, 'auth.login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">{t(locale, 'auth.field.username')}</Label>
              <Input id="username" autoFocus {...register('username')} />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t(locale, 'auth.field.password')}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {loginMutation.isError && (
              <p className="text-sm text-destructive">{(loginMutation.error as Error).message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? t(locale, 'common.loading') : t(locale, 'auth.action.signIn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
