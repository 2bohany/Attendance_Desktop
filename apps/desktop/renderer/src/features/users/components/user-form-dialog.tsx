import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserSchema,
  updateUserSchema,
  type Role,
  type UpdateUserInput,
  type UserListItem,
} from '@attendance/shared';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateUser, useUpdateUser, useUpdateUserRole } from '../hooks/use-users';

type UserFormDialogProps = {
  roles: Role[];
  trigger: React.ReactNode;
  user?: UserListItem;
};

export function UserFormDialog({ roles, trigger, user }: UserFormDialogProps) {
  const locale = useAppStore((state) => state.locale);
  const [open, setOpen] = useState(false);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const updateUserRole = useUpdateUserRole();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const refreshCurrentUser = useAuthStore((state) => state.refreshCurrentUser);
  const isEdit = Boolean(user);
  const isPending = createUser.isPending || updateUser.isPending || updateUserRole.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: user
      ? {
          username: user.username,
          email: user.email ?? '',
          fullName: user.fullName,
          password: '',
          roleId: user.role.id,
        }
      : undefined,
  });

  const onSubmit = async (values: UpdateUserInput) => {
    const { roleId, ...profileFields } = values;

    try {
      if (isEdit && user) {
        await updateUser.mutateAsync({ id: user.id, input: profileFields });
        if (roleId !== user.role.id) {
          await updateUserRole.mutateAsync({ id: user.id, roleId });
        }
        if (user.id === currentUserId) {
          await refreshCurrentUser();
        }
      } else {
        await createUser.mutateAsync({ ...profileFields, password: profileFields.password ?? '', roleId });
      }
      setOpen(false);
      reset();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(locale, isEdit ? 'users.editDialog.title' : 'users.createDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t(locale, isEdit ? 'users.editDialog.description' : 'users.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t(locale, 'auth.field.fullName')}</Label>
            <Input id="fullName" {...register('fullName')} />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">{t(locale, 'auth.field.username')}</Label>
            <Input id="username" {...register('username')} />
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t(locale, 'auth.field.email')}</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t(locale, isEdit ? 'users.field.newPassword' : 'auth.field.password')}
            </Label>
            <Input id="password" type="password" {...register('password')} />
            {isEdit && (
              <p className="text-xs text-muted-foreground">{t(locale, 'users.editDialog.passwordHint')}</p>
            )}
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleId">{t(locale, 'auth.field.role')}</Label>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="roleId">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.roleId && <p className="text-xs text-destructive">{errors.roleId.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t(locale, 'common.loading')
                : t(locale, isEdit ? 'common.save' : 'common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
