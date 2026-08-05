'use client';

import React from 'react';
import { useZohoData } from '@/context/DataContext';
import { FilterBar } from '@/components/filters/FilterBar';
import { OperationsKPIGrid } from '@/components/operations/OperationsKPIGrid';
import { OperationsChartsSection } from '@/components/operations/OperationsChartsSection';
import { OperationsWorkQueueTable } from '@/components/operations/OperationsWorkQueueTable';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { Wrench } from 'lucide-react';

export default function OperationsPage() {
  const { filteredRecords, isLoading, error, refetchData } = useZohoData();

  if (isLoading && filteredRecords.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-normal leading-[1.3] flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DBEAFE] border border-sky-200 text-[#0B9BC5] shadow-xs">
              <Wrench className="w-6 h-6" />
            </div>
            Operations Command Center
          </h1>
          <BusinessVerticalBadge />
          <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">
            Real-time operations management, learner health distribution, pending collection follow-up, and master work queue
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="badge-info text-xs font-semibold">
            Operations View
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
          {/* 1. Operations Overview KPIs (6 Cards Only) */}
          <OperationsKPIGrid records={filteredRecords} />

          {/* 2. Three Important Charts */}
          <OperationsChartsSection records={filteredRecords} />

          {/* 3. Operations Work Queue Master Table */}
          <OperationsWorkQueueTable records={filteredRecords} />
        </>
      )}
    </div>
  );
}
