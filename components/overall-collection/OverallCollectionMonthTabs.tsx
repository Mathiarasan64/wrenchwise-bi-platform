'use client';

import React from 'react';
import { useOverallCollectionData } from '@/context/OverallCollectionContext';
import { Calendar, Layers } from 'lucide-react';

export const OverallCollectionMonthTabs: React.FC = () => {
  const { detectedMonths, selectedMonth, setSelectedMonth } = useOverallCollectionData();

  const monthNames = ['Overall', ...detectedMonths.map((m) => m.name)];

  return (
    <div className="ww-card p-3 sm:p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E5E7EB]">
        <Calendar className="w-4 h-4 text-[#08C565]" />
        <span className="text-xs font-semibold text-[#374151]">Month View Analysis</span>
        <span className="text-[11px] text-[#6B7280] font-normal">
          ({selectedMonth === 'Overall' ? 'Cumulative Dataset' : `Filtered for ${selectedMonth}`})
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {monthNames.map((month) => {
          const isActive = selectedMonth === month;
          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#08C565] text-white shadow-xs scale-[1.02]'
                  : 'bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F1F5F9] border border-[#E5E7EB]'
              }`}
            >
              {month === 'Overall' && <Layers className="w-3.5 h-3.5" />}
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};
