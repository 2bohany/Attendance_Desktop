import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateDepartmentInput } from '@attendance/shared';
import { createDepartment, deleteDepartment, listDepartments } from '../services/departments-api';

const DEPARTMENTS_QUERY_KEY = ['departments'];

export function useDepartments() {
  return useQuery({
    queryKey: DEPARTMENTS_QUERY_KEY,
    queryFn: listDepartments,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDepartmentInput) => createDepartment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}
