import { toast } from 'sonner';
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

  const roles = rolesQuery.data ?? [];
  const permissions = permissionsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t(locale, 'users.title')}</h2>
        <p className="text-muted-foreground">{t(locale, 'users.description')}</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">{t(locale, 'users.tab.users')}</TabsTrigger>
          <TabsTrigger value="roles">{t(locale, 'users.tab.roles')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-end">
            {canCreateUsers && (
              <UserFormDialog
                roles={roles}
                trigger={
                  <Button size="sm">
                    <Plus className="me-2 h-4 w-4" />
                    {t(locale, 'users.action.createUser')}
                  </Button>
                }
              />
            )}
          </div>

          {usersQuery.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : usersQuery.isError ? (
            <ErrorState
              title={t(locale, 'error.title')}
              description={t(locale, 'error.description')}
              onRetry={() => usersQuery.refetch()}
              retryLabel={t(locale, 'error.retry')}
            />
          ) : usersQuery.data && usersQuery.data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(locale, 'users.table.fullName')}</TableHead>
                  <TableHead>{t(locale, 'users.table.username')}</TableHead>
                  <TableHead>{t(locale, 'users.table.email')}</TableHead>
                  <TableHead>{t(locale, 'users.table.role')}</TableHead>
                  <TableHead>{t(locale, 'users.table.status')}</TableHead>
                  <TableHead>{t(locale, 'users.table.lastLogin')}</TableHead>
                  {canEditUsers && (
                    <TableHead className="text-end">{t(locale, 'users.table.actions')}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email ?? '—'}</TableCell>
                    <TableCell>{user.role.name}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'success' : 'destructive'}>
                        {user.isActive
                          ? t(locale, 'users.status.active')
                          : t(locale, 'users.status.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString(locale)
                        : t(locale, 'users.neverLoggedIn')}
                    </TableCell>
                    {canEditUsers && (
                      <TableCell className="text-end space-x-2 rtl:space-x-reverse">
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
                          onClick={() =>
                            setUserActive.mutate(
                              { id: user.id, isActive: !user.isActive },
                              { onError: (error) => toast.error((error as Error).message) },
                            )
                          }
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
          ) : (
            <EmptyState title={t(locale, 'empty.title')} description={t(locale, 'empty.description')} />
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-end">
            {canCreateRoles && (
              <CreateRoleDialog
                permissions={permissions}
                trigger={
                  <Button size="sm">
                    <Plus className="me-2 h-4 w-4" />
                    {t(locale, 'roles.action.createRole')}
                  </Button>
                }
              />
            )}
          </div>

          {rolesQuery.isLoading || permissionsQuery.isLoading ? (
            <Skeleton className="h-64 w-full" />
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
    </div>
  );
}
