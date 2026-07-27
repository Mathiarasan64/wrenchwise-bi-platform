'use client';

import React from 'react';
import { useZohoData } from '@/context/DataContext';
import { Search, RotateCcw, Filter } from 'lucide-react';

export interface ReportFilterState {
  salesExecutive: string;
  learnerStatus: string;
  minCollectionPct: number;
  searchQuery: string;
}

interface ReportFilterToolbarProps {
  filters: ReportFilterState;
  onFilterChange: (newFilters: Partial<ReportFilterState>) => void;
  onReset: () => void;
}

export const ReportFilterToolbar: React.FC<ReportFilterToolbarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const { salesExecutivesList } = useZohoData();

  const isFiltered =
    filters.salesExecutive !== 'All' ||
    filters.learnerStatus !== 'All' ||
    filters.minCollectionPct > 0 ||
    filters.searchQuery !== '';

  return (
    <div className="ww-card p-4 shadow-card space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-2 text-[#111827] font-semibold text-xs uppercase tracking-wider shrink-0">
          <Filter className="w-4 h-4 text-[#08C565]" />
          <span>Report Filters</span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          {/* 1. Sales Executive Dropdown */}
          <div>
            <select
              value={filters.salesExecutive}
              onChange={(e) => onFilterChange({ salesExecutive: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#08C565] cursor-pointer"
            >
              <option value="All">All Sales Executives</option>
              {salesExecutivesList.map((exec) => (
                <option key={exec} value={exec}>
                  {exec}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Learner Status Dropdown */}
          <div>
            <select
              value={filters.learnerStatus}
              onChange={(e) => onFilterChange({ learnerStatus: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#08C565] cursor-pointer"
            >
              <option value="All">All Learner Statuses</option>
              <option value="Active">Active Learners</option>
              <option value="Onboarded Not Active">Onboarded - Not Active</option>
              <option value="Hold">Hold Learners</option>
              <option value="Not On-boarded">Not On-boarded</option>
              <option value="Dropped">Dropped Learners</option>
            </select>
          </div>

          {/* 3. Collection % Threshold */}
          <div>
            <select
              value={filters.minCollectionPct}
              onChange={(e) => onFilterChange({ minCollectionPct: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] font-medium focus:outline-none focus:ring-2 focus:ring-[#08C565] cursor-pointer"
            >
              <option value={0}>Min Collection %: Any</option>
              <option value={20}>Collection &gt;= 20%</option>
              <option value={50}>Collection &gt;= 50% (Target)</option>
              <option value={75}>Collection &gt;= 75%</option>
              <option value={100}>Collection = 100% (Cleared)</option>
            </select>
          </div>

          {/* 4. Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search rep, section, notes..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565]"
            />
          </div>
        </div>

        {/* Reset Filters Button */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="btn-secondary text-xs inline-flex items-center gap-1.5 shrink-0 self-end lg:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
