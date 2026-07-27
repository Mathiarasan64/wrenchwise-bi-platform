import { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import {
  calculateOperationsOverview,
  getOperationsPriorityQueue,
  getOperationsWorkQueue,
} from '@/lib/operationsMetrics';

export function useOperations() {
  const { records, filteredRecords, isLoading, error, refetchData } = useZohoData();

  const metrics = useMemo(() => calculateOperationsOverview(filteredRecords), [filteredRecords]);
  const execStats = useMemo(() => aggregateExecutiveStats(filteredRecords), [filteredRecords]);
  const priorityQueue = useMemo(() => getOperationsPriorityQueue(execStats), [execStats]);
  const workQueue = useMemo(() => getOperationsWorkQueue(filteredRecords), [filteredRecords]);

  return {
    records,
    filteredRecords,
    metrics,
    priorityQueue,
    workQueue,
    isLoading,
    error,
    refetchData,
  };
}
