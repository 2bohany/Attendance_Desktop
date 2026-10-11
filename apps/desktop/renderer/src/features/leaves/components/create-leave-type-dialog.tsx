import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaveTypeSchema, type LeaveTypeInput } from '@attendance/shared';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreateLeaveType } from '../hooks/use-leaves';

type CreateLeaveTypeDialogProps = {
  trigger: React.ReactNode;
};

export function CreateLeaveTypeDialog({ trigger }: CreateLeaveTypeDialogProps) {
  const locale = useAppStore((state) => state.locale);
  const createLeaveType = useCreateLeaveType();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveTypeInput>({ resolver: zodResolver(leaveTypeSchema) });

  const onSubmit = (values: LeaveTypeInput) => {
    createLeaveType.mutate(values, {
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
          <DialogTitle>{t(locale, 'leaves.typeDialog.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t(locale, 'leaves.field.typeName')}</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t(locale, 'departments.field.description')}</Label>
            <Input id="description" {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createLeaveType.isPending}>
              {createLeaveType.isPending ? t(locale, 'common.loading') : t(locale, 'common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
