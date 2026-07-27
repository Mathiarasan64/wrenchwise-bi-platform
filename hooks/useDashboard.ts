import { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { calculateExecutiveKPIs, prepareChartData, generateBusinessInsights } from '@/lib/metrics';

export function useDashboard() {
  const { records, filteredRecords, isLoading, error, refetchData } = useZohoData();

  const kpis = useMemo(() => calculateExecutiveKPIs(filteredRecords), [filteredRecords]);
  const chartData = useMemo(() => prepareChartData(filteredRecords), [filteredRecords]);
  const insights = useMemo(() => generateBusinessInsights(filteredRecords), [filteredRecords]);

  return {
    records,
    filteredRecords,
    kpis,
    chartData,
    insights,
    isLoading,
    error,
    refetchData,
  };
}
