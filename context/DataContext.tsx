'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ZohoRecord, DataContextType, SyncStatus } from '@/types';
import { fetchZohoCSVData } from '@/lib/zoho/zohoService';
import { useFilters } from './FilterContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<ZohoRecord[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  // Start as false — if localStorage cache exists, zohoService returns instantly
  // and records will be populated before the first paint
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const { filters } = useFilters();

  const loadData = useCallback(async (forceRefresh = false) => {
    // Only show full-page skeleton on very first load (no records yet)
    // For background refreshes, keep showing existing data quietly
    const hasExistingData = records.length > 0;
    if (!hasExistingData) setIsLoading(true);

    setSyncStatus('syncing');
    setError(null);

    try {
      const result = await fetchZohoCSVData(undefined, forceRefresh);
      setRecords(result.records);
      setHeaders(result.headers);
      setSyncStatus(result.syncStatus);
      setError(result.error);
      setLastSync(result.lastSync);
    } catch (err: any) {
      console.error('Failed to load Zoho data:', err);
      setError(err.message || 'Connection Error: Unable to fetch live Zoho Sheet CSV.');
      setSyncStatus('error');
      if (!hasExistingData) setRecords([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);


  // Extract unique Sales Executives dynamically from dataset
  const salesExecutivesList = useMemo(() => {
    const executivesSet = new Set<string>();
    records.forEach((record) => {
      if (record.salesExecutive && record.salesExecutive.trim() !== '') {
        executivesSet.add(record.salesExecutive.trim());
      }
    });
    return Array.from(executivesSet).sort();
  }, [records]);

  // Compute filtered records based on active filters
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // 0. Business Vertical Filter (primary global filter)
      if (filters.businessVertical !== 'All' && record.businessVertical !== filters.businessVertical) {
        return false;
      }

      // 1. Sales Executive Filter
      if (filters.salesExecutive !== 'All' && record.salesExecutive !== filters.salesExecutive) {
        return false;
      }

      // 2. Search Query Filter
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          record.salesExecutive.toLowerCase().includes(query) ||
          record.section.toLowerCase().includes(query) ||
          record.id.toLowerCase().includes(query) ||
          record.operationsObservation.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [records, filters]);


  return (
    <DataContext.Provider
      value={{
        records,
        filteredRecords,
        isLoading,
        error,
        syncStatus,
        lastSync,
        dataSource: 'live',
        refetchData: () => loadData(true),
        salesExecutivesList,
        rawCsvHeaders: headers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useZohoData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useZohoData must be used within a DataProvider');
  }
  return context;
};
