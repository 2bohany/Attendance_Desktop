import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, type Employee, type EmployeeFormInput, type Department } from '@attendance/shared';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { localIsoDay } from '@/lib/format';
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
import { useCreateEmployee, useUpdateEmployee } from '../hooks/use-employees';

const NO_DEPARTMENT = '__none__';

type EmployeeFormDialogProps = {
  departments: Department[];
  trigger: React.ReactNode;
  employee?: Employee;
};

export function EmployeeFormDialog({ departments, trigger, employee }: EmployeeFormDialogProps) {
  const locale = useAppStore((state) => state.locale);
  const [open, setOpen] = useState(false);
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const isEdit = Boolean(employee);
  const isPending = createEmployee.isPending || updateEmployee.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormInput>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employee
      ? {
          fullName: employee.fullName,
          email: employee.email ?? '',
          phone: employee.phone ?? '',
          jobTitle: employee.jobTitle ?? '',
          hireDate: employee.hireDate.slice(0, 10),
          notes: employee.notes ?? '',
          departmentId: employee.department?.id ?? '',
        }
      : { hireDate: localIsoDay() },
  });

  const onSubmit = (values: EmployeeFormInput) => {
    const payload = {
      ...values,
      departmentId: values.departmentId === NO_DEPARTMENT ? '' : values.departmentId,
    };

    const mutation = isEdit
      ? updateEmployee.mutateAsync({ id: employee!.id, input: payload })
      : createEmployee.mutateAsync(payload);

    mutation
      .then(() => {
        setOpen(false);
        reset();
      })
      .catch((error: unknown) => toast.error((error as Error).message));
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
            {t(locale, isEdit ? 'employees.editDialog.title' : 'employees.createDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t(locale, isEdit ? 'employees.editDialog.description' : 'employees.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t(locale, 'employees.field.fullName')}</Label>
            <Input id="fullName" {...register('fullName')} />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t(locale, 'employees.field.email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t(locale, 'employees.field.phone')}</Label>
              <Input id="phone" {...register('phone')} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">{t(locale, 'employees.field.jobTitle')}</Label>
              <Input id="jobTitle" {...register('jobTitle')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">{t(locale, 'employees.field.hireDate')}</Label>
              <Input id="hireDate" type="date" {...register('hireDate')} />
              {errors.hireDate && <p className="text-xs text-destructive">{errors.hireDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departmentId">{t(locale, 'employees.field.department')}</Label>
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <Select value={field.value || NO_DEPARTMENT} onValueChange={field.onChange}>
                  <SelectTrigger id="departmentId">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_DEPARTMENT}>
                      {t(locale, 'employees.field.noDepartment')}
                    </SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t(locale, 'employees.field.notes')}</Label>
            <Input id="notes" {...register('notes')} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? t(locale, 'common.loading') : t(locale, 'common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
