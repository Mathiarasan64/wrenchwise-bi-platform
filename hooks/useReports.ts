import { useState, useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { REPORT_CONFIGS, ReportCategory, getReportRows } from '@/lib/reportEngine';

export function useReports() {
  const { records, isLoading, error, refetchData } = useZohoData();
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('executive-summary');

  const activeConfig = useMemo(() => {
    return REPORT_CONFIGS.find((c) => c.id === activeCategory) || REPORT_CONFIGS[0];
  }, [activeCategory]);

  const reportRows = useMemo(() => {
    return getReportRows(activeCategory, records);
  }, [activeCategory, records]);

  return {
    records,
    configs: REPORT_CONFIGS,
    activeCategory,
    setActiveCategory,
    activeConfig,
    reportRows,
    isLoading,
    error,
    refetchData,
  };
}
