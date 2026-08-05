'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  OverallCollectionRecord,
  DetectedMonth,
  OverallCollectionMetrics,
  OverallCollectionFilterState,
  ValidationReportData,
} from '@/types';
import {
  fetchOverallCollectionData,
  calculateOverallCollectionMetrics,
  filterOverallCollectionDataset,
} from '@/services/overallCollectionService';

interface OverallCollectionContextType {
  records: OverallCollectionRecord[];
  filteredRecords: OverallCollectionRecord[];
  detectedMonths: DetectedMonth[];
  metrics: OverallCollectionMetrics;
  validationReport: ValidationReportData | null;
  filters: OverallCollectionFilterState;
  setFilters: React.Dispatch<React.SetStateAction<OverallCollectionFilterState>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  refetchData: (forceRefresh?: boolean) => Promise<void>;
  resetFilters: () => void;
}

const initialFilters: OverallCollectionFilterState = {
  businessVertical: 'All',
  salesExecutive: 'All',
  courseName: 'All',
  enrolledMonth: 'All',
  shift: 'All',
  paymentType: 'All',
  learnerStatus: 'All',
  paymentStatus: 'All',
  searchQuery: '',
};

const OverallCollectionContext = createContext<OverallCollectionContextType | undefined>(undefined);

export const OverallCollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<OverallCollectionRecord[]>([]);
  const [detectedMonths, setDetectedMonths] = useState<DetectedMonth[]>([]);
  const [validationReport, setValidationReport] = useState<ValidationReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [filters, setFilters] = useState<OverallCollectionFilterState>(initialFilters);
  const [selectedMonth, setSelectedMonth] = useState<string>('Overall');

  const loadData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchOverallCollectionData(forceRefresh);
      if (res.syncStatus === 'error') {
        setError(res.error || 'Failed to load Overall Collection data.');
      } else {
        setRecords(res.records);
        setDetectedMonths(res.detectedMonths);
        setValidationReport(res.validationReport);
        setLastSync(res.lastSync);
      }
    } catch (err: any) {
      console.error('Overall Collection load error:', err);
      setError(err.message || 'Connection Error: Failed to fetch Overall Collection data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSelectedMonth('Overall');
  }, []);

  const filteredRecords = useMemo(() => {
    return filterOverallCollectionDataset(records, filters);
  }, [records, filters]);

  const metrics = useMemo(() => {
    return calculateOverallCollectionMetrics(filteredRecords, selectedMonth);
  }, [filteredRecords, selectedMonth]);

  return (
    <OverallCollectionContext.Provider
      value={{
        records,
        filteredRecords,
        detectedMonths,
        metrics,
        validationReport,
        filters,
        setFilters,
        searchQuery: filters.searchQuery,
        setSearchQuery,
        selectedMonth,
        setSelectedMonth,
        isLoading,
        error,
        lastSync,
        refetchData: loadData,
        resetFilters,
      }}
    >
      {children}
    </OverallCollectionContext.Provider>
  );
};


export function useOverallCollectionData() {
  const context = useContext(OverallCollectionContext);
  if (!context) {
    throw new Error('useOverallCollectionData must be used within an OverallCollectionProvider');
  }
  return context;
}
