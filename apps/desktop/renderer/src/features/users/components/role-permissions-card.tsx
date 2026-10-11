import { useState } from 'react';
import { toast } from 'sonner';
import type { Permission, Role } from '@attendance/shared';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUpdateRolePermissions } from '../hooks/use-roles';

type RolePermissionsCardProps = {
  role: Role;
  allPermissions: Permission[];
  canEdit: boolean;
};

export function RolePermissionsCard({ role, allPermissions, canEdit }: RolePermissionsCardProps) {
  const locale = useAppStore((state) => state.locale);
  const updatePermissions = useUpdateRolePermissions();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(role.permissions.map((permission) => permission.key)),
  );

  const isDirty =
    selected.size !== role.permissions.length ||
    role.permissions.some((permission) => !selected.has(permission.key));

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSave = () => {
    updatePermissions.mutate(
      { id: role.id, permissionKeys: Array.from(selected) },
      { onError: (error) => toast.error((error as Error).message) },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{role.name}</CardTitle>
          {role.isSystem && <Badge variant="secondary">{t(locale, 'roles.systemBadge')}</Badge>}
        </div>
        {role.description && <CardDescription>{role.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {allPermissions.map((permission) => (
            <label key={permission.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input"
                checked={selected.has(permission.key)}
                disabled={role.isSystem || !canEdit}
                onChange={() => toggle(permission.key)}
              />
              {permission.key}
            </label>
          ))}
        </div>
        {!role.isSystem && canEdit && (
          <Button
            size="sm"
            disabled={!isDirty || updatePermissions.isPending}
            onClick={handleSave}
          >
            {t(locale, 'common.save')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
