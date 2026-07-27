'use client';

import React from 'react';
import { useFilters } from '@/context/FilterContext';
import { useZohoData } from '@/context/DataContext';
import { UserCheck, ChevronDown } from 'lucide-react';

export const SalesExecutiveFilter: React.FC = () => {
  const { filters, setSalesExecutive } = useFilters();
  const { salesExecutivesList, records } = useZohoData();

  // Count records per executive
  const execCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      if (r.salesExecutive) {
        counts[r.salesExecutive] = (counts[r.salesExecutive] || 0) + 1;
      }
    });
    return counts;
  }, [records]);

  return (
    <div className="relative inline-flex items-center">
      <div className="relative flex items-center w-full">
        <span className="absolute left-3 text-[#08C565] pointer-events-none">
          <UserCheck className="w-4 h-4" />
        </span>
        <select
          id="sales-executive-select"
          aria-label="Filter by Sales Executive"
          value={filters.salesExecutive}
          onChange={(e) => setSalesExecutive(e.target.value)}
          className="appearance-none pl-9 pr-10 py-2 bg-white hover:bg-[#F3F4F6] text-[#111827] text-sm font-medium rounded-[12px] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#08C565] transition-all cursor-pointer shadow-xs w-full md:w-64"
        >
          <option value="All" className="bg-white text-[#111827] font-medium">
            All Sales Executives ({records.length} total)
          </option>
          {salesExecutivesList.map((exec) => (
            <option key={exec} value={exec} className="bg-white text-[#111827] font-medium">
              {exec} ({execCounts[exec] || 0} deals)
            </option>
          ))}
        </select>
        <span className="absolute right-3 text-[#6B7280] pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
