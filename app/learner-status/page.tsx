'use client';

import React, { useState, useEffect } from 'react';
import {
  LearnerStatusProvider,
  useLearnerStatusData,
} from '@/context/LearnerStatusContext';
import { LearnerStatusFilterBar } from '@/components/learner-status/LearnerStatusFilterBar';
import { LearnerStatusTable } from '@/components/learner-status/LearnerStatusTable';
import { BookUser, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

// ─── Timestamp helper ─────────────────────────────────────────────────────────
// Accepts only a concrete Date — never calls new Date() during render.

function formatTimestamp(date: Date): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  const secs = String(date.getSeconds()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${mins}:${secs}`;
}

// ─── Page content (wrapped inside provider) ───────────────────────────────────

function LearnerStatusContent() {
  const { isLoading, error, refetchData, lastSync, records } =
    useLearnerStatusData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Hydration fix:
   * '—' is the stable placeholder rendered identically by both the server
   * and the initial client render. After mount, useEffect updates it to the
   * real timestamp (client-only). It also re-runs whenever lastSync changes
   * so the display updates after every Refresh.
   */
  const [displayedTimestamp, setDisplayedTimestamp] = useState<string>('—');

  useEffect(() => {
    // Use lastSync from the context if available; otherwise show current time.
    setDisplayedTimestamp(formatTimestamp(lastSync ?? new Date()));
  }, [lastSync]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchData(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    /*
     * max-w + mx-auto centres content on wide screens.
     * overflow-x-hidden prevents the PAGE from scrolling horizontally.
     * The table component handles its own overflow-x-auto internally.
     */
    <div className="space-y-6 p-4 sm:p-6 max-w-[1600px] mx-auto overflow-x-hidden animate-fadeIn">

      {/* ── Module Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-[#111827] tracking-normal leading-[1.3] flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] border border-emerald-200 text-[#08C565] shadow-xs shrink-0">
              <BookUser className="w-6 h-6" />
            </div>
            Learner Status Tracker
          </h1>
          <p className="text-[13px] text-[#4B5563] font-normal leading-[1.6] mt-1 ml-[52px]">
            Look up learners by Sales Executive, name, or onboarding status. Live data from Zoho Sheet.
          </p>
        </div>

        {/* Action area */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 self-end sm:self-auto">
          {/* Last synced timestamp */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] font-mono bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
            <Clock className="w-3.5 h-3.5 text-[#08C565]" />
            {/* displayedTimestamp is '—' on SSR and updates client-side via useEffect */}
            <span>Last Synced: {displayedTimestamp}</span>
          </div>

          {/* Refresh button — no F5 needed */}
          <button
            id="learner-status-refresh"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="ww-button ww-button-primary text-xs flex items-center justify-center gap-2 py-2 px-4 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            {isRefreshing ? 'Syncing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── Error Alert ─────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold mb-0.5">Data Load Error</p>
            <p className="font-normal">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-xs font-semibold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <LearnerStatusFilterBar />

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <LearnerStatusTable />
    </div>
  );
}

// ─── Default export — page wrapped in its dedicated Provider ──────────────────

export default function LearnerStatusPage() {
  return (
    <LearnerStatusProvider>
      <LearnerStatusContent />
    </LearnerStatusProvider>
  );
}
