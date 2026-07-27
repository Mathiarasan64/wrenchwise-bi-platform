'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { FilterState, FilterContextType } from '@/types';

const initialFilterState: FilterState = {
  salesExecutive: 'All',
  businessVertical: 'All',
  dateRange: { startDate: null, endDate: null },
  searchQuery: '',
  status: 'All',
  region: 'All',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const setSalesExecutive = (salesExec: string) => {
    setFilters((prev) => ({ ...prev, salesExecutive: salesExec }));
  };

  const setBusinessVertical = (bv: string) => {
    setFilters((prev) => ({ ...prev, businessVertical: bv }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setStatus = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setRegion = (region: string) => {
    setFilters((prev) => ({ ...prev, region }));
  };

  const setDateRange = (startDate: string | null, endDate: string | null) => {
    setFilters((prev) => ({ ...prev, dateRange: { startDate, endDate } }));
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.salesExecutive !== 'All' ||
      filters.businessVertical !== 'All' ||
      filters.searchQuery.trim() !== '' ||
      filters.status !== 'All' ||
      filters.region !== 'All' ||
      filters.dateRange.startDate !== null ||
      filters.dateRange.endDate !== null
    );
  }, [filters]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSalesExecutive,
        setBusinessVertical,
        setSearchQuery,
        setStatus,
        setRegion,
        setDateRange,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
