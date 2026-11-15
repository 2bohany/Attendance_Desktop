import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateLeaveInput, LeaveStatus, LeaveTypeInput } from '@attendance/shared';
import { createLeave, createLeaveType, listLeaveTypes, listLeaves, updateLeaveStatus } from '../services/leaves-api';

const LEAVES_QUERY_KEY = ['leaves'];
const LEAVE_TYPES_QUERY_KEY = ['leave-types'];

export function useLeaves(enabled = true) {
  return useQuery({ queryKey: LEAVES_QUERY_KEY, queryFn: listLeaves, enabled });
}

export function useLeaveTypes() {
  return useQuery({ queryKey: LEAVE_TYPES_QUERY_KEY, queryFn: listLeaveTypes });
}

export function useCreateLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLeaveInput) => createLeave(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LEAVES_QUERY_KEY });
    },
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeaveStatus }) => updateLeaveStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LEAVES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useCreateLeaveType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LeaveTypeInput) => createLeaveType(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LEAVE_TYPES_QUERY_KEY });
    },
  });
}
