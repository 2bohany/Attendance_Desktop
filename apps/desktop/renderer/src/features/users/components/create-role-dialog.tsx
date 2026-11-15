import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoleSchema, type CreateRoleInput, type Permission } from '@attendance/shared';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';
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
import { useCreateRole } from '../hooks/use-roles';

type CreateRoleDialogProps = {
  permissions: Permission[];
  trigger: React.ReactNode;
};

export function CreateRoleDialog({ permissions, trigger }: CreateRoleDialogProps) {
  const locale = useAppStore((state) => state.locale);
  const createRoleMutation = useCreateRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { permissionKeys: [] },
  });

  const onSubmit = (values: CreateRoleInput) => {
    createRoleMutation.mutate(values, {
      onSuccess: () => reset(),
      onError: (error) => toast.error((error as Error).message),
    });
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(locale, 'roles.createDialog.title')}</DialogTitle>
          <DialogDescription>{t(locale, 'roles.createDialog.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t(locale, 'roles.field.name')}</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t(locale, 'roles.field.description')}</Label>
            <Input id="description" {...register('description')} />
          </div>

          <div className="space-y-2">
            <Label>{t(locale, 'roles.field.permissions')}</Label>
            <div className="grid max-h-56 gap-2 sm:grid-cols-2 overflow-y-auto rounded-md border p-3">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={permission.key}
                    className="h-4 w-4 rounded border-input accent-primary"
                    {...register('permissionKeys')}
                  />
                  {permission.key}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createRoleMutation.isPending}>
              {createRoleMutation.isPending ? t(locale, 'common.loading') : t(locale, 'common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
