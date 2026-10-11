import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDepartmentSchema, type CreateDepartmentInput } from '@attendance/shared';
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
import { useCreateDepartment } from '../hooks/use-departments';

type CreateDepartmentDialogProps = {
  trigger: React.ReactNode;
};

export function CreateDepartmentDialog({ trigger }: CreateDepartmentDialogProps) {
  const locale = useAppStore((state) => state.locale);
  const createDepartment = useCreateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentInput>({ resolver: zodResolver(createDepartmentSchema) });

  const onSubmit = (values: CreateDepartmentInput) => {
    createDepartment.mutate(values, {
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
          <DialogTitle>{t(locale, 'departments.createDialog.title')}</DialogTitle>
          <DialogDescription>{t(locale, 'departments.createDialog.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t(locale, 'departments.field.name')}</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t(locale, 'departments.field.description')}</Label>
            <Input id="description" {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createDepartment.isPending}>
              {createDepartment.isPending ? t(locale, 'common.loading') : t(locale, 'common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
