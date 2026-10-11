import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { HolidayInput } from '@attendance/shared';
import { createHoliday, deleteHoliday, listHolidays } from '../services/holidays-api';

const HOLIDAYS_QUERY_KEY = ['holidays'];

export function useHolidays() {
  return useQuery({ queryKey: HOLIDAYS_QUERY_KEY, queryFn: listHolidays });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: HolidayInput) => createHoliday(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HOLIDAYS_QUERY_KEY });
    },
  });
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHoliday(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HOLIDAYS_QUERY_KEY });
    },
  });
}
