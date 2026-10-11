import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkIn, checkOut, listTodayAttendance } from '../services/attendance-api';

const ATTENDANCE_QUERY_KEY = ['attendance', 'today'];

export function useTodayAttendance() {
  return useQuery({
    queryKey: ATTENDANCE_QUERY_KEY,
    queryFn: listTodayAttendance,
    refetchInterval: 30000,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => checkIn(employeeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => checkOut(employeeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
    },
  });
}
