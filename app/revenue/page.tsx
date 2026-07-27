'use client';

import React from 'react';
import { useZohoData } from '@/context/DataContext';
import { FilterBar } from '@/components/filters/FilterBar';
import { DataPreviewTable } from '@/components/common/DataPreviewTable';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function RevenueAnalyticsPage() {
  const { filteredRecords, isLoading, error, refetchData } = useZohoData();

  if (isLoading && filteredRecords.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DBEAFE] border border-sky-200 text-[#0B9BC5] shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-normal leading-[1.3]">
              Revenue Analytics
            </h1>
            <span className="badge-info text-xs font-semibold">
              Executive Module
            </span>
            <BusinessVerticalBadge />
          </div>
          <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">
            Financial revenue breakdown, training program course yields, and monthly trend analysis.
          </p>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={refetchData} />}

      <FilterBar />

      {filteredRecords.length === 0 && !isLoading ? (
        <EmptyVerticalState />
      ) : (
        <>
          <div className="ww-card p-5 text-xs text-[#374151] flex items-center gap-3 shadow-card">
            <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-[#111827] block font-bold text-sm">Official Wrench Wise Revenue Module</strong>
              <span className="font-normal text-xs text-[#4B5563]">Financial breakdown and live course yields connected to official Zoho Sheet pipeline.</span>
            </div>
          </div>

          <DataPreviewTable />
        </>
      )}
    </div>
  );
}
