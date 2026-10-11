import { useQuery } from '@tanstack/react-query';
import { getReportsSummary } from '../services/reports-api';

export function useReportsSummary() {
  return useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: getReportsSummary,
  });
}
