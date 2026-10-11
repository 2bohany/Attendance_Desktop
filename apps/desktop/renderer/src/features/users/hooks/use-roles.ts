import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateRoleInput } from '@attendance/shared';
import { createRole, listPermissions, listRoles, updateRolePermissions } from '../services/roles-api';

const ROLES_QUERY_KEY = ['roles'];
const PERMISSIONS_QUERY_KEY = ['permissions'];

export function useRoles() {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: listRoles,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: listPermissions,
    staleTime: Infinity,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRoleInput) => createRole(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissionKeys }: { id: string; permissionKeys: string[] }) =>
      updateRolePermissions(id, permissionKeys),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}
