'use client';

import React from 'react';
import { useFilters } from '@/context/FilterContext';
import { Building2, SearchX } from 'lucide-react';

interface EmptyVerticalStateProps {
  /** Optional override message */
  message?: string;
}

/**
 * EmptyVerticalState
 * Shown when filteredRecords is empty due to a Business Vertical filter.
 * Provides a "Clear Filter" button to reset.
 */
export const EmptyVerticalState: React.FC<EmptyVerticalStateProps> = ({ message }) => {
  const { filters, setBusinessVertical } = useFilters();

  const verticalLabel = filters.businessVertical !== 'All'
    ? filters.businessVertical
    : 'the selected filter';

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fadeIn">
      <div className="p-5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] mb-5 inline-flex">
        <SearchX className="w-10 h-10 text-[#9CA3AF]" />
      </div>

      <h3 className="text-lg font-bold text-[#111827] mb-2">
        No records found
      </h3>

      <p className="text-sm text-[#6B7280] font-normal leading-[1.6] max-w-sm mb-6">
        {message || `No records exist for the selected Business Vertical: `}
        {!message && (
          <span className="font-semibold text-[#111827]">{verticalLabel}</span>
        )}
        {!message && '.'}
      </p>

      <button
        onClick={() => setBusinessVertical('All')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#08C565] hover:bg-[#06a855] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
      >
        <Building2 className="w-4 h-4" />
        Clear Filter — Show All Verticals
      </button>
    </div>
  );
};
