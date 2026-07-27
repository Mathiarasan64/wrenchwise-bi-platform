import { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { getLearnerCrmProfile, calculateLearnerRisk } from '@/lib/learnerCrmEngine';

export function useLearnerAnalytics(selectedLearnerId?: string | null) {
  const { records, filteredRecords, isLoading, error, refetchData } = useZohoData();

  const selectedProfile = useMemo(() => {
    if (!selectedLearnerId) return null;
    const record = records.find((r) => r.id === selectedLearnerId);
    if (!record) return null;
    return getLearnerCrmProfile(record, records);
  }, [selectedLearnerId, records]);

  return {
    records,
    filteredRecords,
    selectedProfile,
    calculateLearnerRisk,
    isLoading,
    error,
    refetchData,
  };
}
