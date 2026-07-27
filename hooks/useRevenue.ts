import { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { calculateExecutiveKPIs } from '@/lib/metrics';

export function useRevenue() {
  const { records, filteredRecords, isLoading, error, refetchData } = useZohoData();

  const kpis = useMemo(() => calculateExecutiveKPIs(filteredRecords), [filteredRecords]);

  return {
    records,
    filteredRecords,
    kpis,
    isLoading,
    error,
    refetchData,
  };
}
