import type { ReportsSummary } from '@attendance/shared';
import { apiRequest } from '@/services/api-client';

export async function getReportsSummary(): Promise<ReportsSummary> {
  const response = await apiRequest<ReportsSummary>({ method: 'GET', path: '/reports/summary' });
  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Failed to load reports summary');
  }
  return response.data;
}
