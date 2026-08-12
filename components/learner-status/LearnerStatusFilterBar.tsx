'use client';

import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { useLearnerStatusData } from '@/context/LearnerStatusContext';

export const LearnerStatusFilterBar: React.FC = () => {
  const {
    filters,
    setFilters,
    setSearchQuery,
    resetFilters,
    salesExecutives,
    learnerStatuses,
    records,
    filteredRecords,
  } = useLearnerStatusData();

  const hasActiveFilters =
    filters.salesExecutive !== 'All' ||
    filters.learnerStatus !== 'All' ||
    filters.searchQuery.trim() !== '';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-wrap">

        {/* ── Search input ────────────────────────────────────────────── */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          <input
            id="learner-search"
            type="text"
            placeholder="Search learner or executive…"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565]/30 focus:border-[#08C565] transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Sales Executive dropdown ─────────────────────────────────── */}
        <div className="relative min-w-[180px]">
          <select
            id="filter-sales-executive"
            value={filters.salesExecutive}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                salesExecutive: e.target.value,
              }))
            }
            className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#08C565]/30 focus:border-[#08C565] transition-all cursor-pointer"
          >
            <option value="All">All Executives</option>
            {salesExecutives.map((se) => (
              <option key={se} value={se}>
                {se}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        </div>

        {/* ── Learner Status dropdown ──────────────────────────────────── */}
        <div className="relative min-w-[180px]">
          <select
            id="filter-learner-status"
            value={filters.learnerStatus}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                learnerStatus: e.target.value,
              }))
            }
            className="w-full appearance-none pl-3 pr-8 py-2 text-sm bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#08C565]/30 focus:border-[#08C565] transition-all cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {learnerStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        </div>

        {/* ── Reset button + result count ──────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          {hasActiveFilters && (
            <button
              id="reset-learner-filters"
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6B7280] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
          <span className="text-xs text-[#6B7280] font-medium whitespace-nowrap">
            {filteredRecords.length}{' '}
            {filteredRecords.length === 1 ? 'learner' : 'learners'}
            {records.length !== filteredRecords.length
              ? ` of ${records.length}`
              : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
