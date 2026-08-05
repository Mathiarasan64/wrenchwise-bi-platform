'use client';

import React, { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { useFilters } from '@/context/FilterContext';
import { aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import { FilterBar } from '@/components/filters/FilterBar';
import { ExecutiveProfileCard } from '@/components/sales-executive/ExecutiveProfileCard';
import { ExecutiveLeaderboard } from '@/components/sales-executive/ExecutiveLeaderboard';
import { ExecutiveChartsSection } from '@/components/sales-executive/ExecutiveChartsSection';
import { SalesExecutiveCompareView } from '@/components/sales-executive/SalesExecutiveCompareView';
import { ExecutiveDataTable } from '@/components/sales-executive/ExecutiveDataTable';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { UserCheck } from 'lucide-react';

export default function SalesExecutivePage() {
  const { filteredRecords, isLoading, error, refetchData } = useZohoData();
  const { filters, setSalesExecutive } = useFilters();

  // Aggregate executive metrics from filtered records
  const execStats = useMemo(() => {
    return aggregateExecutiveStats(filteredRecords);
  }, [filteredRecords]);

  // Selected profile stats
  const selectedProfileStat = useMemo(() => {
    if (filters.salesExecutive === 'All') return null;
    return execStats.find((e) => e.name === filters.salesExecutive) || null;
  }, [execStats, filters.salesExecutive]);

  if (isLoading && filteredRecords.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-normal leading-[1.3] flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] border border-emerald-200 text-[#08C565] shadow-xs">
              <UserCheck className="w-6 h-6" />
            </div>
            Sales Executive Intelligence
          <BusinessVerticalBadge />
        </h1>
          <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">
            Performance analytics, dynamic Health Scores (0-100), leaderboards, and data-driven operational insights
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="badge-success text-xs font-semibold">
            {execStats.length} Representatives Active
          </span>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={refetchData} />}

      {/* Filter Toolbar */}
      <FilterBar />

      {filteredRecords.length === 0 && !isLoading ? (
        <EmptyVerticalState />
      ) : (
        <>
          {/* Selected Representative Profile Card */}
          {selectedProfileStat ? (
            <ExecutiveProfileCard
              stats={selectedProfileStat}
              onClearSelection={() => setSalesExecutive('All')}
            />
          ) : (
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-4 text-center text-xs text-[#4B5563] font-medium">
              Tip: Select a Sales Executive from the dropdown or click any representative in the leaderboard below to view their detailed performance profile.
            </div>
          )}

          {/* Executive Leaderboard */}
          <ExecutiveLeaderboard
            execStats={execStats}
            selectedExecutive={filters.salesExecutive}
            onSelectExecutive={(name) => setSalesExecutive(name)}
          />

          {/* Sales Executive Side-by-Side Comparison Feature */}
          <SalesExecutiveCompareView execStats={execStats} records={filteredRecords} />

          {/* 3 Performance Charts */}
          <ExecutiveChartsSection execStats={execStats} />

          {/* Searchable Master Executive Data Table */}
          <ExecutiveDataTable
            execStats={execStats}
            onSelectExecutive={(name) => setSalesExecutive(name)}
          />
        </>
      )}
    </div>
  );
}
