import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateSettingsInput } from '@attendance/shared';
import { getSettings, updateSettings } from '../services/settings-api';

const SETTINGS_QUERY_KEY = ['settings'];

export function useSettings() {
  return useQuery({ queryKey: SETTINGS_QUERY_KEY, queryFn: getSettings });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSettingsInput) => updateSettings(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
}
