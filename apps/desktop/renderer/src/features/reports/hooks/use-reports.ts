import { useQuery } from '@tanstack/react-query';
import { getReportsSummary } from '../services/reports-api';

export function useReportsSummary(enabled = true) {
  return useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: getReportsSummary,
    enabled,
  });
}
