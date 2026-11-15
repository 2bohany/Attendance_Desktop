import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkIn, checkOut, listAttendance } from '../services/attendance-api';

const ATTENDANCE_QUERY_KEY = ['attendance'];

/** `date` is YYYY-MM-DD; omit it for the server's current business day. */
export function useAttendance(date?: string, enabled = true) {
  return useQuery({
    enabled,
    queryKey: [...ATTENDANCE_QUERY_KEY, date ?? 'today'],
    queryFn: () => listAttendance(date),
    refetchInterval: date ? false : 60_000,
  });
}

export function useTodayAttendance(enabled = true) {
  return useAttendance(undefined, enabled);
}

function useAttendanceMutation(fn: (employeeId: string) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useCheckIn() {
  return useAttendanceMutation(checkIn);
}

export function useCheckOut() {
  return useAttendanceMutation(checkOut);
}
