'use client';

import React from 'react';
import { useFilters } from '@/context/FilterContext';
import { useZohoData } from '@/context/DataContext';
import { SalesExecutiveFilter } from './SalesExecutiveFilter';
import { FilterPills } from './FilterPills';
import { Search, SlidersHorizontal, Layers, RotateCcw, UserCheck } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filters, setSearchQuery, clearFilters, hasActiveFilters } = useFilters();
  const { records, filteredRecords, isLoading } = useZohoData();

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 mb-6 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2 text-[#111827] font-semibold text-xs uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-[#08C565]" />
            <span>Filters</span>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search executive, section, observation notes..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565] transition-all font-normal"
            />
          </div>
        </div>

        {/* Current Executive Badge, Sales Executive Filter & Record Stats */}
        <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap sm:flex-nowrap">
          {/* Current Executive Badge */}
          {filters.salesExecutive !== 'All' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#DCFCE7] border border-emerald-200 text-xs font-semibold text-[#166534]">
              <UserCheck className="w-4 h-4 text-[#08C565]" />
              <span>{filters.salesExecutive}</span>
            </div>
          )}

          {/* Sales Executive Selector */}
          <SalesExecutiveFilter />

          {/* Record Count Badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] text-xs font-medium text-[#374151] whitespace-nowrap">
            <Layers className="w-4 h-4 text-[#0B9BC5]" />
            <span>
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <strong className="text-[#0B9BC5] font-mono font-bold">{filteredRecords.length}</strong> /{' '}
                  <span className="text-[#6B7280] font-mono">{records.length}</span> Records
                </>
              )}
            </span>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] text-xs font-medium rounded-[12px] border border-[#E5E7EB] transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Pills */}
      <FilterPills />
    </div>
  );
};
