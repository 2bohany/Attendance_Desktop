import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { holidaySchema, type HolidayInput } from '@attendance/shared';
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
import { useCreateHoliday } from '../hooks/use-holidays';

type CreateHolidayDialogProps = {
  trigger: React.ReactNode;
};

export function CreateHolidayDialog({ trigger }: CreateHolidayDialogProps) {
  const locale = useAppStore((state) => state.locale);
  const createHoliday = useCreateHoliday();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HolidayInput>({ resolver: zodResolver(holidaySchema) });

  const onSubmit = (values: HolidayInput) => {
    createHoliday.mutate(values, {
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
          <DialogTitle>{t(locale, 'holidays.dialog.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t(locale, 'holidays.field.name')}</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{t(locale, 'holidays.field.date')}</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t(locale, 'departments.field.description')}</Label>
            <Input id="description" {...register('description')} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createHoliday.isPending}>
              {createHoliday.isPending ? t(locale, 'common.loading') : t(locale, 'common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
