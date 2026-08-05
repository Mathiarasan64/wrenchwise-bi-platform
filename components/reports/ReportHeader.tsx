'use client';

import React, { useState, useEffect } from 'react';
import { useZohoData } from '@/context/DataContext';
import { FileSpreadsheet, Calendar, Clock, RefreshCw, Layers } from 'lucide-react';

export const ReportHeader: React.FC = () => {
  const { syncStatus, lastSync, refetchData, isLoading, error, records } = useZohoData();
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    setCurrentDate(now.toLocaleDateString('en-IN', options));
  }, []);

  const formattedSyncTime = lastSync
    ? lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Never';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-normal leading-[1.3] flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#DCFCE7] border border-emerald-200 text-[#08C565] shadow-xs">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          Reports & Export Center
        </h1>
        <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">
          Generate, preview, filter, and export business reports in Excel (.xlsx), CSV, PDF, and printable formats
        </p>
      </div>

      {/* Badges: Current Date, Last Refresh, Total Records */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap self-end sm:self-auto text-xs font-semibold">
        {/* Current Date */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-[#374151] shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#08C565]" />
          <span>{currentDate || '25 Jul 2026'}</span>
        </div>

        {/* Last Refresh Time */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] font-mono text-xs shadow-xs">
          <Clock className="w-3.5 h-3.5 text-[#0B9BC5]" />
          <span>{formattedSyncTime}</span>
        </div>

        {/* Total Records */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DBEAFE] border border-sky-200 text-[#1D4ED8] text-xs">
          <Layers className="w-3.5 h-3.5 text-[#0B9BC5]" />
          <span>
            <strong className="font-mono text-[#111827]">{records.length}</strong> Records
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => refetchData()}
          disabled={isLoading}
          className="btn-ghost p-2 text-[#374151] hover:text-[#111827]"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#08C565]' : ''}`} />
        </button>
      </div>
    </div>
  );
};
