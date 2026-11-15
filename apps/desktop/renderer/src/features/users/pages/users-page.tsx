import { useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/table-skeleton';
import { PageHeader } from '@/components/page-header';
import { EmployeeAvatar } from '@/components/employee-avatar';
import { useConfirm } from '@/components/confirm-dialog';
import { formatDateTime } from '@/lib/format';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Plus } from 'lucide-react';
import { useUsers, useSetUserActive } from '../hooks/use-users';
import { useRoles, usePermissions } from '../hooks/use-roles';
import { UserFormDialog } from '../components/user-form-dialog';
import { CreateRoleDialog } from '../components/create-role-dialog';
import { RolePermissionsCard } from '../components/role-permissions-card';

export function UsersPage() {
  const locale = useAppStore((state) => state.locale);
  const canCreateUsers = useAuthStore((state) => state.hasPermission('users.create'));
  const canEditUsers = useAuthStore((state) => state.hasPermission('users.edit'));
  const canCreateRoles = useAuthStore((state) => state.hasPermission('roles.create'));
  const canEditRoles = useAuthStore((state) => state.hasPermission('roles.edit'));

  const usersQuery = useUsers();
  const rolesQuery = useRoles();
  const permissionsQuery = usePermissions();
  const setUserActive = useSetUserActive();

  const [tab, setTab] = useState('users');
  const { confirm, dialog } = useConfirm();
  const roles = rolesQuery.data ?? [];
  const permissions = permissionsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        className="mb-0"
        title={t(locale, 'users.title')}
        description={t(locale, 'users.description')}
        actions={
          tab === 'users'
            ? canCreateUsers && (
                <UserFormDialog
                  roles={roles}
                  trigger={
                    <Button>
                      <Plus />
                      {t(locale, 'users.action.createUser')}
                    </Button>
                  }
                />
              )
            : canCreateRoles && (
                <CreateRoleDialog
                  permissions={permissions}
                  trigger={
                    <Button>
                      <Plus />
                      {t(locale, 'roles.action.createRole')}
                    </Button>
                  }
                />
              )
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="users">{t(locale, 'users.tab.users')}</TabsTrigger>
          <TabsTrigger value="roles">{t(locale, 'users.tab.roles')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users">

          {usersQuery.isLoading ? (
            <TableSkeleton />
          ) : usersQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={t(locale, 'error.description')}
              onRetry={() => usersQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : usersQuery.data && usersQuery.data.length > 0 ? (
            <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(locale, 'users.table.fullName')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t(locale, 'users.table.email')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t(locale, 'users.table.role')}</TableHead>
                  <TableHead>{t(locale, 'users.table.status')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t(locale, 'users.table.lastLogin')}</TableHead>
                  {canEditUsers && (
                    <TableHead className="text-end">{t(locale, 'users.table.actions')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar name={user.fullName} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.fullName}</p>
                          <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">{user.email ?? '—'}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{user.role.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'secondary'} dot>
                        {user.isActive
                          ? t(locale, 'users.status.active')
                          : t(locale, 'users.status.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular hidden text-muted-foreground md:table-cell">
                      {user.lastLoginAt
                        ? formatDateTime(locale, user.lastLoginAt)
                        : t(locale, 'users.neverLoggedIn')}
                    </TableCell>
                    {canEditUsers && (
                      <TableCell className="whitespace-nowrap text-end">
                        <UserFormDialog
                          roles={roles}
                          user={user}
                          trigger={
                            <Button variant="ghost" size="sm">
                              {t(locale, 'users.action.edit')}
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={setUserActive.isPending}
                          onClick={() => {
                            const run = () =>
                              setUserActive.mutate(
                                { id: user.id, isActive: !user.isActive },
                                { onError: (error) => toast.error((error as Error).message) },
                              );
                            if (!user.isActive) return run();
                            confirm({
                              title: t(locale, 'users.confirmDeactivate.title', { name: user.fullName }),
                              description: t(locale, 'users.confirmDeactivate.description'),
                              confirmLabel: t(locale, 'users.action.deactivate'),
                              variant: 'destructive',
                              onConfirm: run,
                            });
                          }}
                        >
                          {user.isActive
                            ? t(locale, 'users.action.deactivate')
                            : t(locale, 'users.action.activate')}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <EmptyState title={t(locale, 'empty.title')} description={t(locale, 'empty.description')} />
          )}
        </TabsContent>

        <TabsContent value="roles">

          {rolesQuery.isLoading || permissionsQuery.isLoading ? (
            <TableSkeleton />
          ) : rolesQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={t(locale, 'error.description')}
              onRetry={() => rolesQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {roles.map((role) => (
                <RolePermissionsCard
                  key={role.id}
                  role={role}
                  allPermissions={permissions}
                  canEdit={canEditRoles}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {dialog}
    </div>
  );
}
