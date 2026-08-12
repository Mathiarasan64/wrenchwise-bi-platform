'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  LearnerStatusRecord,
  fetchLearnerStatusData,
} from '@/services/learnerStatusService';

// ─── Filter state ─────────────────────────────────────────────────────────────

export interface LearnerStatusFilterState {
  salesExecutive: string;
  learnerStatus: string;
  searchQuery: string; // searches learner name + sales executive
}

const initialFilters: LearnerStatusFilterState = {
  salesExecutive: 'All',
  learnerStatus: 'All',
  searchQuery: '',
};

// ─── Context shape ────────────────────────────────────────────────────────────

interface LearnerStatusContextType {
  records: LearnerStatusRecord[];
  filteredRecords: LearnerStatusRecord[];
  // Dynamic filter option lists (derived from the sheet — never hardcoded)
  salesExecutives: string[];
  learnerStatuses: string[];
  filters: LearnerStatusFilterState;
  setFilters: React.Dispatch<React.SetStateAction<LearnerStatusFilterState>>;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  refetchData: (forceRefresh?: boolean) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LearnerStatusContext = createContext<LearnerStatusContextType | undefined>(
  undefined
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const LearnerStatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [records, setRecords] = useState<LearnerStatusRecord[]>([]);
  const [salesExecutives, setSalesExecutives] = useState<string[]>([]);
  const [learnerStatuses, setLearnerStatuses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [filters, setFilters] =
    useState<LearnerStatusFilterState>(initialFilters);

  const loadData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchLearnerStatusData(forceRefresh);
      if (res.syncStatus === 'error') {
        setError(res.error || 'Failed to load Learner Status data.');
      } else {
        setRecords(res.records);
        setSalesExecutives(res.salesExecutives);
        setLearnerStatuses(res.learnerStatuses);
        setLastSync(res.lastSync);
      }
    } catch (err: any) {
      console.error('LearnerStatus load error:', err);
      setError(
        err.message || 'Connection Error: Failed to fetch Learner Status data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  const setSearchQuery = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // ── Client-side filtering ────────────────────────────────────────────────
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (
        filters.salesExecutive !== 'All' &&
        r.salesExecutive !== filters.salesExecutive
      ) {
        return false;
      }
      if (
        filters.learnerStatus !== 'All' &&
        r.learnerStatus !== filters.learnerStatus
      ) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const match =
          r.learnerName.toLowerCase().includes(q) ||
          r.salesExecutive.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [records, filters]);

  return (
    <LearnerStatusContext.Provider
      value={{
        records,
        filteredRecords,
        salesExecutives,
        learnerStatuses,
        filters,
        setFilters,
        setSearchQuery,
        resetFilters,
        isLoading,
        error,
        lastSync,
        refetchData: loadData,
      }}
    >
      {children}
    </LearnerStatusContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLearnerStatusData() {
  const ctx = useContext(LearnerStatusContext);
  if (!ctx) {
    throw new Error(
      'useLearnerStatusData must be used within a LearnerStatusProvider'
    );
  }
  return ctx;
}
