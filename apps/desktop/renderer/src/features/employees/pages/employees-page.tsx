import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useEmployees, useSetEmployeeActive } from '../hooks/use-employees';
import { useDeleteDepartment, useDepartments } from '../hooks/use-departments';
import { EmployeeFormDialog } from '../components/employee-form-dialog';
import { CreateDepartmentDialog } from '../components/create-department-dialog';

export function EmployeesPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('employees.create'));
  const canEdit = useAuthStore((state) => state.hasPermission('employees.edit'));
  const canDelete = useAuthStore((state) => state.hasPermission('employees.delete'));

  const employeesQuery = useEmployees();
  const departmentsQuery = useDepartments();
  const setEmployeeActive = useSetEmployeeActive();
  const deleteDepartment = useDeleteDepartment();

  const departments = departmentsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'employees.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'employees.description')}</p>
      </div>

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">{t(locale, 'employees.tab.employees')}</TabsTrigger>
          <TabsTrigger value="departments">{t(locale, 'employees.tab.departments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex justify-end">
            {canCreate && (
              <EmployeeFormDialog
                departments={departments}
                trigger={
                  <Button size="sm">
                    <Plus className="me-2 h-4 w-4" />
                    {t(locale, 'employees.action.createEmployee')}
                  </Button>
                }
              />
            )}
          </div>

          {employeesQuery.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : employeesQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={t(locale, 'error.description')}
              onRetry={() => employeesQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : employeesQuery.data && employeesQuery.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(locale, 'employees.table.code')}</TableHead>
                  <TableHead>{t(locale, 'employees.table.fullName')}</TableHead>
                  <TableHead>{t(locale, 'employees.table.jobTitle')}</TableHead>
                  <TableHead>{t(locale, 'employees.table.department')}</TableHead>
                  <TableHead>{t(locale, 'employees.table.hireDate')}</TableHead>
                  <TableHead>{t(locale, 'employees.table.status')}</TableHead>
                  {canEdit && (
                    <TableHead className="text-end">{t(locale, 'employees.table.actions')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeesQuery.data.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-mono text-xs">{employee.employeeCode}</TableCell>
                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                    <TableCell>{employee.jobTitle ?? '—'}</TableCell>
                    <TableCell>{employee.department?.name ?? '—'}</TableCell>
                    <TableCell>{new Date(employee.hireDate).toLocaleDateString(locale)}</TableCell>
                    <TableCell>
                      <Badge variant={employee.isActive ? 'success' : 'destructive'}>
                        {employee.isActive
                          ? t(locale, 'employees.status.active')
                          : t(locale, 'employees.status.inactive')}
                      </Badge>
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-end space-x-2 rtl:space-x-reverse">
                        <EmployeeFormDialog
                          departments={departments}
                          employee={employee}
                          trigger={
                            <Button variant="ghost" size="sm">
                              {t(locale, 'employees.action.edit')}
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={setEmployeeActive.isPending}
                          onClick={() =>
                            setEmployeeActive.mutate(
                              { id: employee.id, isActive: !employee.isActive },
                              { onError: (error) => toast.error((error as Error).message) },
                            )
                          }
                        >
                          {employee.isActive
                            ? t(locale, 'employees.action.deactivate')
                            : t(locale, 'employees.action.activate')}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title={t(locale, 'employees.empty.title')}
              description={t(locale, 'employees.empty.description')}
            />
          )}
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-end">
            {canCreate && (
              <CreateDepartmentDialog
                trigger={
                  <Button size="sm">
                    <Plus className="me-2 h-4 w-4" />
                    {t(locale, 'departments.action.createDepartment')}
                  </Button>
                }
              />
            )}
          </div>

          {departmentsQuery.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : departmentsQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={t(locale, 'error.description')}
              onRetry={() => departmentsQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : departments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(locale, 'departments.table.name')}</TableHead>
                  <TableHead>{t(locale, 'departments.table.description')}</TableHead>
                  <TableHead>{t(locale, 'departments.table.employeeCount')}</TableHead>
                  {canDelete && (
                    <TableHead className="text-end">{t(locale, 'departments.table.actions')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.description ?? '—'}</TableCell>
                    <TableCell>{department.employeeCount}</TableCell>
                    {canDelete && (
                      <TableCell className="text-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deleteDepartment.isPending}
                          onClick={() =>
                            deleteDepartment.mutate(department.id, {
                              onError: (error) => toast.error((error as Error).message),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title={t(locale, 'departments.empty.title')}
              description={t(locale, 'departments.empty.description')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
