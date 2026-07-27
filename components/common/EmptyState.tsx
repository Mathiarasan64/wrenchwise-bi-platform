'use client';

import React from 'react';
import { SearchX, RotateCcw, FilterX, Inbox } from 'lucide-react';
import { useFilters } from '@/context/FilterContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'filter' | 'data';
  showResetButton?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Matching Records Found',
  description = 'No operational records match your currently active filters. Try adjusting your search criteria or clearing active filters.',
  icon = 'filter',
  showResetButton = true,
}) => {
  const { clearFilters, hasActiveFilters } = useFilters();

  const IconComponent = icon === 'search' ? SearchX : icon === 'filter' ? FilterX : Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 bg-white border border-[#E5E7EB] rounded-[16px] text-center my-6 shadow-xs animate-fadeIn">
      {/* Icon circle */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-[16px] bg-[#DCFCE7] border border-emerald-200 flex items-center justify-center">
          <IconComponent className="w-7 h-7 text-[#08C565]" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#111827] mb-1.5">{title}</h3>

      {/* Description */}
      <p className="text-sm text-[#6B7280] max-w-md leading-[1.6] mb-6 font-normal">{description}</p>

      {/* Reset button: Primary Green #08C565 */}
      {showResetButton && hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="btn-primary flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Filters
        </button>
      )}
    </div>
  );
};
