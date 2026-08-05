'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ZohoRecord, DataContextType, SyncStatus } from '@/types';
import { fetchZohoData } from '@/services/zohoService';
import { calculateCentralizedMetrics, validateCalculations } from '@/lib/calculationEngine';
import { useFilters } from './FilterContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<ZohoRecord[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const { filters } = useFilters();

  const loadData = useCallback(async (forceRefresh = false) => {
    const hasExistingData = records.length > 0;
    if (!hasExistingData) setIsLoading(true);

    setSyncStatus('syncing');
    setError(null);

    try {
      const result = await fetchZohoData(forceRefresh);
      setRecords(result.records);
      setHeaders(result.headers);
      setSyncStatus(result.syncStatus);
      setError(result.error);
      setLastSync(result.lastSync);

      // Run automatic calculation audit
      if (result.records && result.records.length > 0) {
        validateCalculations(result.records);
      }
    } catch (err: any) {
      console.error('Failed to load Zoho Sheet data:', err);
      setError(err.message || 'Connection Error: Unable to fetch live Zoho Sheet data.');
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

  // SINGLE SOURCE OF TRUTH: Calculate centralized metrics respecting active filters
  const centralizedMetrics = useMemo(() => {
    return calculateCentralizedMetrics(records, filters);
  }, [records, filters]);

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
      if (filters.businessVertical !== 'All' && record.businessVertical !== filters.businessVertical) {
        return false;
      }
      if (filters.salesExecutive !== 'All' && record.salesExecutive !== filters.salesExecutive) {
        return false;
      }
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
        centralizedMetrics,
        isLoading,
        error,
        syncStatus,
        lastSync,
        dataSource: 'live',
        refetchData: () => loadData(true),
        salesExecutivesList,
        rawCsvHeaders: headers,
        validateCalculations: () => validateCalculations(records),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useGoogleSheetsData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useGoogleSheetsData must be used within a DataProvider');
  }
  return context;
};

// Backward compatibility alias for legacy hook imports
export const useZohoData = useGoogleSheetsData;
