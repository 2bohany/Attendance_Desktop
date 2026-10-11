import { useMutation, useQuery } from '@tanstack/react-query';
import type { BootstrapAdminInput, LoginInput } from '@attendance/shared';
import { useAuthStore } from '@/stores/auth-store';
import { bootstrapAdmin, getSetupStatus, login } from '../services/auth-api';

export function useSetupStatus() {
  return useQuery({
    queryKey: ['auth', 'setup-status'],
    queryFn: getSetupStatus,
    retry: 2,
    // The backend takes a moment to come up after the window appears; keep polling
    // until it answers instead of settling into a permanent error after the initial
    // retries, which would otherwise strand the user on the wrong screen.
    refetchInterval: (query) => (query.state.data ? false : 2000),
  });
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async (data) => {
      await setSession(data.user, data.accessToken);
    },
  });
}

export function useBootstrapAdmin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: BootstrapAdminInput) => bootstrapAdmin(input),
    onSuccess: async (data) => {
      await setSession(data.user, data.accessToken);
    },
  });
}
