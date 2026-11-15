import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil, Users, Building2 } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { formatDay, matchesSearch } from '@/lib/format';
import { PageHeader } from '@/components/page-header';
import { SearchInput, Segmented } from '@/components/search-input';
import { EmployeeAvatar } from '@/components/employee-avatar';
import { TableSkeleton } from '@/components/table-skeleton';
import { useConfirm } from '@/components/confirm-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployees, useSetEmployeeActive } from '../hooks/use-employees';
import { useDeleteDepartment, useDepartments } from '../hooks/use-departments';
import { EmployeeFormDialog } from '../components/employee-form-dialog';
import { CreateDepartmentDialog } from '../components/create-department-dialog';

type StatusFilter = 'all' | 'active' | 'inactive';
const ALL_DEPARTMENTS = '__all__';

export function EmployeesPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreate = useAuthStore((state) => state.hasPermission('employees.create'));
  const canEdit = useAuthStore((state) => state.hasPermission('employees.edit'));
  const canDelete = useAuthStore((state) => state.hasPermission('employees.delete'));

  const [tab, setTab] = useState('employees');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('active');
  const [departmentId, setDepartmentId] = useState(ALL_DEPARTMENTS);

  const employeesQuery = useEmployees();
  const departmentsQuery = useDepartments();
  const setEmployeeActive = useSetEmployeeActive();
  const deleteDepartment = useDeleteDepartment();
  const { confirm, dialog } = useConfirm();

  const departments = departmentsQuery.data ?? [];
  const employees = useMemo(() => employeesQuery.data ?? [], [employeesQuery.data]);

  const counts = useMemo(
    () => ({
      all: employees.length,
      active: employees.filter((employee) => employee.isActive).length,
      inactive: employees.filter((employee) => !employee.isActive).length,
    }),
    [employees],
  );

  const visible = employees.filter(
    (employee) =>
      (status === 'all' || employee.isActive === (status === 'active')) &&
      (departmentId === ALL_DEPARTMENTS || employee.department?.id === departmentId) &&
      matchesSearch(search, employee.fullName, employee.employeeCode, employee.jobTitle, employee.email),
  );

  const toggleActive = (employee: (typeof employees)[number]) => {
    const run = () =>
      setEmployeeActive.mutate(
        { id: employee.id, isActive: !employee.isActive },
        { onError: (error) => toast.error((error as Error).message) },
      );
    if (!employee.isActive) return run();
    confirm({
      title: t(locale, 'employees.confirmDeactivate.title', { name: employee.fullName }),
      description: t(locale, 'employees.confirmDeactivate.description'),
      confirmLabel: t(locale, 'employees.action.deactivate'),
      variant: 'destructive',
      onConfirm: run,
    });
  };

  const headerAction =
    canCreate &&
    (tab === 'employees' ? (
      <EmployeeFormDialog
        departments={departments}
        trigger={
          <Button>
            <Plus />
            {t(locale, 'employees.action.createEmployee')}
          </Button>
        }
      />
    ) : (
      <CreateDepartmentDialog
        trigger={
          <Button>
            <Plus />
            {t(locale, 'departments.action.createDepartment')}
          </Button>
        }
      />
    ));

  return (
    <div>
      <PageHeader
        title={t(locale, 'employees.title')}
        description={t(locale, 'employees.description')}
        actions={headerAction || undefined}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="employees">
            {t(locale, 'employees.tab.employees')}
            <span className="tabular rounded-full bg-muted px-1.5 text-xs">{counts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="departments">
            {t(locale, 'employees.tab.departments')}
            <span className="tabular rounded-full bg-muted px-1.5 text-xs">{departments.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Segmented
              label={t(locale, 'employees.table.status')}
              value={status}
              onChange={setStatus}
              options={[
                { value: 'active', label: t(locale, 'employees.status.active'), count: counts.active },
                { value: 'inactive', label: t(locale, 'employees.status.inactive'), count: counts.inactive },
                { value: 'all', label: t(locale, 'common.all'), count: counts.all },
              ]}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger className="h-9 bg-card sm:w-48" aria-label={t(locale, 'employees.table.department')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_DEPARTMENTS}>{t(locale, 'employees.filter.allDepartments')}</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t(locale, 'employees.searchPlaceholder')}
              />
            </div>
          </div>

          {employeesQuery.isLoading ? (
            <TableSkeleton />
          ) : employeesQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={(employeesQuery.error as Error).message}
              onRetry={() => employeesQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : employees.length === 0 ? (
            <EmptyState
              icon={<Users />}
              title={t(locale, 'employees.empty.title')}
              description={t(locale, 'employees.empty.description')}
              action={headerAction || undefined}
            />
          ) : visible.length === 0 ? (
            <EmptyState
              title={t(locale, 'common.noResults')}
              description={t(locale, 'common.noResultsDescription')}
            />
          ) : (
            <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t(locale, 'employees.table.fullName')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t(locale, 'employees.table.department')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t(locale, 'employees.table.hireDate')}</TableHead>
                    <TableHead>{t(locale, 'employees.table.status')}</TableHead>
                    {canEdit && (
                      <TableHead className="text-end">
                        <span className="sr-only">{t(locale, 'employees.table.actions')}</span>
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((employee) => (
                    <TableRow key={employee.id} className={employee.isActive ? undefined : 'text-muted-foreground'}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <EmployeeAvatar name={employee.fullName} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{employee.fullName}</p>
                            <p className="tabular truncate text-xs text-muted-foreground">
                              {employee.employeeCode}
                              {employee.jobTitle ? ` · ${employee.jobTitle}` : ''}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {employee.department?.name ?? <span className="text-muted-foreground/60">—</span>}
                      </TableCell>
                      <TableCell className="tabular hidden lg:table-cell">
                        {formatDay(locale, employee.hireDate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.isActive ? 'success' : 'secondary'} dot>
                          {employee.isActive
                            ? t(locale, 'employees.status.active')
                            : t(locale, 'employees.status.inactive')}
                        </Badge>
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-end">
                          <div className="inline-flex gap-1">
                            <EmployeeFormDialog
                              departments={departments}
                              employee={employee}
                              trigger={
                                <Button variant="ghost" size="sm" aria-label={t(locale, 'employees.action.edit')}>
                                  <Pencil />
                                  <span className="hidden sm:inline">{t(locale, 'employees.action.edit')}</span>
                                </Button>
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={setEmployeeActive.isPending && setEmployeeActive.variables?.id === employee.id}
                              onClick={() => toggleActive(employee)}
                            >
                              {employee.isActive
                                ? t(locale, 'employees.action.deactivate')
                                : t(locale, 'employees.action.activate')}
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="departments">
          {departmentsQuery.isLoading ? (
            <TableSkeleton rows={4} />
          ) : departmentsQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={(departmentsQuery.error as Error).message}
              onRetry={() => departmentsQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : departments.length > 0 ? (
            <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t(locale, 'departments.table.name')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t(locale, 'departments.table.description')}</TableHead>
                    <TableHead className="text-end">{t(locale, 'departments.table.employeeCount')}</TableHead>
                    {canDelete && (
                      <TableHead className="w-12">
                        <span className="sr-only">{t(locale, 'departments.table.actions')}</span>
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {department.description ?? '—'}
                      </TableCell>
                      <TableCell className="tabular text-end">{department.employeeCount}</TableCell>
                      {canDelete && (
                        <TableCell className="text-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            aria-label={`${t(locale, 'departments.action.delete')} ${department.name}`}
                            disabled={deleteDepartment.isPending}
                            onClick={() =>
                              confirm({
                                title: t(locale, 'departments.confirmDelete.title', { name: department.name }),
                                description: t(locale, 'departments.confirmDelete.description'),
                                confirmLabel: t(locale, 'common.delete'),
                                variant: 'destructive',
                                onConfirm: () =>
                                  deleteDepartment.mutate(department.id, {
                                    onError: (error) => toast.error((error as Error).message),
                                  }),
                              })
                            }
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={<Building2 />}
              title={t(locale, 'departments.empty.title')}
              description={t(locale, 'departments.empty.description')}
              action={headerAction || undefined}
            />
          )}
        </TabsContent>
      </Tabs>
      {dialog}
    </div>
  );
}
