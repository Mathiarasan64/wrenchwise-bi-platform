'use client';

import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export interface LearnerFilters {
  searchQuery: string;
  statusFilter: string;
  executiveFilter: string;
}

interface LearnerSearchToolbarProps {
  filters: LearnerFilters;
  onFiltersChange: (filters: LearnerFilters) => void;
  statusOptions: string[];
  executiveOptions: string[];
  totalCount: number;
  filteredCount: number;
}

export const LearnerSearchToolbar: React.FC<LearnerSearchToolbarProps> = ({
  filters,
  onFiltersChange,
  statusOptions,
  executiveOptions,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.statusFilter !== 'All' ||
    filters.executiveFilter !== 'All';

  const resetFilters = () => {
    onFiltersChange({ searchQuery: '', statusFilter: 'All', executiveFilter: 'All' });
  };

  return (
    <div className="ww-card p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
          <Filter className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
          Search & Filters
        </span>
        <span className="ml-auto text-xs font-mono font-medium text-[#6B7280]">
          {filteredCount} of {totalCount} candidates
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search by name, ID, course, batch, phone, email..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565] transition-all font-normal"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.statusFilter}
          onChange={(e) => onFiltersChange({ ...filters, statusFilter: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#08C565] transition-all appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="All">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Executive Filter */}
        <select
          value={filters.executiveFilter}
          onChange={(e) => onFiltersChange({ ...filters, executiveFilter: e.target.value })}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#08C565] transition-all appearance-none cursor-pointer min-w-[180px]"
        >
          <option value="All">All Executives</option>
          {executiveOptions.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn-secondary text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
