'use client';

import React, { memo } from 'react';
import { useOverallCollectionData } from '@/context/OverallCollectionContext';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Users, DollarSign, Wallet, Clock, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const OverallCollectionKPIGrid: React.FC = memo(function OverallCollectionKPIGrid() {
  const { metrics, selectedMonth } = useOverallCollectionData();
  const isMonthView = selectedMonth && selectedMonth !== 'Overall';

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<ShieldCheck className="w-5 h-5 text-[#08C565]" />}
        title={isMonthView ? `${selectedMonth} Collection Overview` : 'Collection Summary Overview'}
        subtitle={
          isMonthView
            ? `Live collection KPIs, expected EMI balances, realization ratios, and learner statuses for ${selectedMonth}`
            : 'Live high-level collection KPIs, payable fee balances, collection ratios, and pending learner counts'
        }
        badgeText={isMonthView ? `${selectedMonth} KPIs` : 'Collection KPIs'}
      />

      {/* Grid Layout: Desktop = 3 cards per row, Tablet = 2 cards per row, Mobile = 1 card per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Total Learners */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Learners</span>
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5] border border-sky-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#111827] mt-2">
            {metrics.totalLearners}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">
            {isMonthView ? `Learners tracked for ${selectedMonth}` : 'Total enrolled candidates'}
          </div>
        </div>

        {/* 2. Total Payable Fee / Expected EMI Collection */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              {isMonthView ? `Expected EMI (${selectedMonth})` : 'Total Payable Fee'}
            </span>
            <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#9333EA] border border-purple-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#111827] mt-2 truncate">
            {isMonthView
              ? formatCurrency(metrics.expectedEmiCollection || 0)
              : formatCurrency(metrics.totalPayableFee)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">
            {isMonthView ? `Expected EMI sum for ${selectedMonth}` : 'Gross contracted value'}
          </div>
        </div>

        {/* 3. Amount Collected */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              {isMonthView ? `Amount Collected (${selectedMonth})` : 'Amount Collected'}
            </span>
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#08C565] mt-2 truncate">
            {formatCurrency(metrics.amountCollected)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">
            {isMonthView ? `Cash collected in ${selectedMonth}` : 'Realized cash collected'}
          </div>
        </div>

        {/* 4. Pending Collection */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              {isMonthView ? `Pending Collection (${selectedMonth})` : 'Pending Collection'}
            </span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#F59E0B] mt-2 truncate">
            {formatCurrency(metrics.pendingCollection)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">
            {isMonthView ? `Outstanding EMI for ${selectedMonth}` : 'Outstanding receivables'}
          </div>
        </div>

        {/* 5. Collection Percentage */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Collection Percentage</span>
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#08C565] mt-2">
              {formatPercent(metrics.collectionPercentage)}
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#E5E7EB] rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-[#08C565] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, metrics.collectionPercentage))}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">
            {isMonthView ? `${selectedMonth} realization ratio` : 'Realization efficiency'}
          </div>
        </div>

        {/* 6. Pending / Paid Learners */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              {isMonthView ? `Paid / Pending (${selectedMonth})` : 'Pending Learners'}
            </span>
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] border border-red-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#DC2626] mt-2">
            {isMonthView ? (
              <span className="text-lg">
                <span className="text-[#08C565]">{metrics.paidLearners || 0} Paid</span>
                <span className="text-[#6B7280] mx-1">/</span>
                <span className="text-[#DC2626]">{metrics.pendingLearners} Pending</span>
              </span>
            ) : (
              metrics.pendingLearners
            )}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal font-sans">
            {isMonthView ? `Learner payment statuses for ${selectedMonth}` : 'Learners with balance'}
          </div>
        </div>
      </div>
    </div>
  );
});

