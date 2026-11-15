import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EmployeeFormInput } from '@attendance/shared';
import { createEmployee, listEmployees, setEmployeeActive, updateEmployee } from '../services/employees-api';

const EMPLOYEES_QUERY_KEY = ['employees'];

export function useEmployees(enabled = true) {
  return useQuery({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: listEmployees,
    enabled,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeFormInput) => createEmployee(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EmployeeFormInput }) => updateEmployee(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useSetEmployeeActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setEmployeeActive(id, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
