'use client';

import React from 'react';
import { useFilters } from '@/context/FilterContext';
import { Building2 } from 'lucide-react';

/**
 * BusinessVerticalBadge
 * Shows the currently selected Business Vertical near page titles.
 * Renders nothing when 'All' is selected.
 */
export const BusinessVerticalBadge: React.FC = () => {
  const { filters, setBusinessVertical } = useFilters();

  if (filters.businessVertical === 'All') return null;

  const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    B2C: {
      bg: 'bg-[#EEF2FF]',
      border: 'border-indigo-200',
      text: 'text-[#3730A3]',
      dot: 'bg-indigo-500',
    },
    PAP: {
      bg: 'bg-[#FFF7ED]',
      border: 'border-orange-200',
      text: 'text-[#9A3412]',
      dot: 'bg-orange-500',
    },
  };

  const style = colorMap[filters.businessVertical] || colorMap.B2C;

  return (
    <button
      onClick={() => setBusinessVertical('All')}
      title="Click to clear Business Vertical filter"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all hover:opacity-80 ${style.bg} ${style.border} ${style.text}`}
    >
      <Building2 className="w-3 h-3" />
      <span>Business Vertical : {filters.businessVertical}</span>
    </button>
  );
};
