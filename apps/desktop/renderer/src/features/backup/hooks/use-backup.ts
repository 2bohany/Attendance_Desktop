import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBackup, listBackups } from '../services/backup-api';

const BACKUP_QUERY_KEY = ['backup'];

export function useBackups() {
  return useQuery({ queryKey: BACKUP_QUERY_KEY, queryFn: listBackups });
}

export function useCreateBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createBackup(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    },
  });
}
