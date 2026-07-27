'use client';

import React from 'react';
import { useFilters } from '@/context/FilterContext';
import { X, Filter, RotateCcw } from 'lucide-react';

export const FilterPills: React.FC = () => {
  const { filters, setSalesExecutive, setBusinessVertical, setSearchQuery, setStatus, setRegion, clearFilters, hasActiveFilters } =
    useFilters();

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#E5E7EB] mt-3 animate-fadeIn">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5 mr-1">
        <Filter className="w-3.5 h-3.5 text-[#08C565]" />
        Active Filters:
      </span>

      {filters.businessVertical !== 'All' && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] border border-indigo-200 text-[#3730A3]">
          Vertical: {filters.businessVertical}
          <button
            onClick={() => setBusinessVertical('All')}
            className="hover:bg-indigo-200/40 rounded-full p-0.5 transition-colors"
            title="Remove business vertical filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.salesExecutive !== 'All' && (
        <span className="badge-success inline-flex items-center gap-1.5">
          Executive: {filters.salesExecutive}
          <button
            onClick={() => setSalesExecutive('All')}
            className="hover:bg-[#166534]/20 rounded-full p-0.5 transition-colors"
            title="Remove executive filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.searchQuery.trim() !== '' && (
        <span className="badge-info inline-flex items-center gap-1.5">
          Search: &quot;{filters.searchQuery}&quot;
          <button
            onClick={() => setSearchQuery('')}
            className="hover:bg-[#1D4ED8]/20 rounded-full p-0.5 transition-colors"
            title="Clear search filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.status !== 'All' && (
        <span className="badge-success inline-flex items-center gap-1.5">
          Status: {filters.status}
          <button
            onClick={() => setStatus('All')}
            className="hover:bg-[#166534]/20 rounded-full p-0.5 transition-colors"
            title="Clear status filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.region !== 'All' && (
        <span className="badge-warning inline-flex items-center gap-1.5">
          Region: {filters.region}
          <button
            onClick={() => setRegion('All')}
            className="hover:bg-[#92400E]/20 rounded-full p-0.5 transition-colors"
            title="Clear region filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        onClick={clearFilters}
        className="inline-flex items-center gap-1 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors ml-auto pl-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All
      </button>
    </div>
  );
};
