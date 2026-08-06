'use client';

import React, { useState } from 'react';
import {
  OverallCollectionProvider,
  useOverallCollectionData,
} from '@/context/OverallCollectionContext';
import { useZohoData } from '@/context/DataContext';
import { OverallCollectionKPIGrid } from '@/components/overall-collection/OverallCollectionKPIGrid';
import { OverallCollectionChartsSection } from '@/components/overall-collection/OverallCollectionChartsSection';
import { OverallCollectionFilterBar } from '@/components/overall-collection/OverallCollectionFilterBar';
import { OverallCollectionMonthTabs } from '@/components/overall-collection/OverallCollectionMonthTabs';
import { OverallCollectionTable } from '@/components/overall-collection/OverallCollectionTable';
import { ValidationReportModal } from '@/components/overall-collection/ValidationReportModal';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { LineChart, RefreshCw, Clock, FileCheck } from 'lucide-react';

function formatTimestamp(date: Date | null): string {
  const d = date || new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  const secs = String(d.getSeconds()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${mins}:${secs}`;
}

function OverallCollectionContent() {
  const { filteredRecords, isLoading, error, refetchData, lastSync } =
    useOverallCollectionData();
  const { refetchData: refetchMaster } = useZohoData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showValidationReport, setShowValidationReport] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchMaster(), refetchData(true)]);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading && filteredRecords.length === 0) {
    return <PageSkeleton />;
  }

  const formattedTimestamp = formatTimestamp(lastSync);

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-normal leading-[1.3] flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] border border-emerald-200 text-[#08C565] shadow-xs">
              <LineChart className="w-6 h-6" />
            </div>
            Overall Collection Report
            <BusinessVerticalBadge />
          </h1>
          <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">
            Live student-level EMI tracking, dynamic payment links, collection performance, and fee realization
          </p>
        </div>

        {/* Action Buttons & Timestamp */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] font-mono bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
            <Clock className="w-3.5 h-3.5 text-[#08C565]" />
            <span>Last Synced: {formattedTimestamp}</span>
          </div>

          <button
            onClick={() => setShowValidationReport(true)}
            className="ww-button ww-button-secondary text-xs flex items-center justify-center gap-1.5 py-2 px-3 shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#0B9BC5]" />
            Validation Report
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="ww-button ww-button-primary text-xs flex items-center justify-center gap-2 py-2 px-4 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={() => handleRefresh()} />}

      {/* Filter Toolbar & Global Search */}
      <OverallCollectionFilterBar />

      {/* Month View Dynamic Tabs */}
      <OverallCollectionMonthTabs />

      {filteredRecords.length === 0 && !isLoading ? (
        <EmptyVerticalState />
      ) : (
        <>
          {/* 1. Six KPI Cards */}
          <OverallCollectionKPIGrid />

          {/* 2. Three Charts */}
          <OverallCollectionChartsSection />

          {/* 3. Master Data Table */}
          <OverallCollectionTable />
        </>
      )}

      {/* Validation Report Modal */}
      <ValidationReportModal
        isOpen={showValidationReport}
        onClose={() => setShowValidationReport(false)}
      />
    </div>
  );
}

export default OverallCollectionContent;
