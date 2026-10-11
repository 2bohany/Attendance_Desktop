import { useQuery } from '@tanstack/react-query';
import type { HealthCheckResponse } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthCheckResponse> => {
      const response = await apiRequest<HealthCheckResponse>({
        method: 'GET',
        path: '/health',
      });

      if (!response.success || !response.data) {
        throw new Error(response.error ?? 'Health check failed');
      }

      return response.data;
    },
    refetchInterval: 30000,
    retry: 2,
  });
}

export function useDatabaseInfo() {
  return useQuery({
    queryKey: ['database-info'],
    queryFn: () => window.electronAPI.getDatabaseInfo(),
  });
}

export function useAppInfo() {
  return useQuery({
    queryKey: ['app-info'],
    queryFn: () => window.electronAPI.getAppInfo(),
  });
}
