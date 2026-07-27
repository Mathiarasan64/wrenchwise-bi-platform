import { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { aggregateExecutiveStats, generateActionRecommendations } from '@/lib/salesExecutiveMetrics';

export function useSalesExecutive() {
  const { records, filteredRecords, isLoading, error, refetchData } = useZohoData();

  const execStats = useMemo(() => aggregateExecutiveStats(filteredRecords), [filteredRecords]);
  const recommendations = useMemo(() => generateActionRecommendations(execStats), [execStats]);

  return {
    records,
    filteredRecords,
    execStats,
    recommendations,
    isLoading,
    error,
    refetchData,
  };
}
