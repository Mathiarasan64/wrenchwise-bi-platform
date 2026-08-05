'use client';

import React from 'react';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Award, DollarSign, Wallet, Clock, Users, Percent, ShieldCheck } from 'lucide-react';

interface ExecutiveProfileCardProps {
  stats: ExecutiveSummaryStats;
  onClearSelection?: () => void;
}

export const ExecutiveProfileCard: React.FC<ExecutiveProfileCardProps> = ({ stats, onClearSelection }) => {
  const getBadgeClass = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'badge-success';
      case 'Good':
        return 'badge-info';
      case 'Average':
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  };

  return (
    <div className="ww-card p-6 shadow-card space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-emerald-200 flex items-center justify-center text-[#08C565] font-extrabold text-lg shadow-xs">
            {stats.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[24px] font-bold text-[#111827]">{stats.name}</h2>
              <span className={getBadgeClass(stats.healthCategory)}>
                {stats.healthCategory}
              </span>
            </div>
            <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-0.5">Sales Executive Operational Performance Profile</p>
          </div>
        </div>

        {/* Health Score Counter */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Health Score</div>
            <div className="text-2xl font-extrabold font-mono text-[#08C565]">{stats.healthScore} <span className="text-xs text-[#6B7280] font-sans">/ 100</span></div>
          </div>

          {onClearSelection && (
            <button
              onClick={onClearSelection}
              className="btn-ghost text-xs font-semibold"
            >
              View All Reps
            </button>
          )}
        </div>
      </div>

      {/* Grid of All 13 Key Performance Values */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {/* 1. Total Learners */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280]">Total Learners</div>
          <div className="text-base sm:text-lg font-bold text-[#111827] mt-1 font-mono">{stats.totalLearners}</div>
          <div className="text-[11px] text-[#4B5563] mt-0.5">Assigned candidates</div>
        </div>

        {/* 2. Active Learners */}
        <div className="bg-[#DCFCE7] border border-emerald-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#166534]">Active Learners</div>
          <div className="text-base sm:text-lg font-bold text-[#08C565] mt-1 font-mono">{stats.activeLearners}</div>
          <div className="text-[11px] text-[#166534] mt-0.5">Active in training</div>
        </div>

        {/* 3. Onboarded - Not Active */}
        <div className="bg-[#FEF3C7] border border-amber-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#92400E]">Onboarded - Not Active</div>
          <div className="text-base sm:text-lg font-bold text-[#F59E0B] mt-1 font-mono">{stats.onboardedNotActive}</div>
          <div className="text-[11px] text-[#92400E] mt-0.5">Pending session start</div>
        </div>

        {/* 4. Hold */}
        <div className="bg-[#FEF3C7] border border-amber-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#92400E]">Hold</div>
          <div className="text-base sm:text-lg font-bold text-[#F59E0B] mt-1 font-mono">{stats.hold}</div>
          <div className="text-[11px] text-[#92400E] mt-0.5">Temporarily paused</div>
        </div>

        {/* 5. Not On-boarded */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280]">Not On-boarded</div>
          <div className="text-base sm:text-lg font-bold text-[#374151] mt-1 font-mono">{stats.notOnboarded}</div>
          <div className="text-[11px] text-[#6B7280] mt-0.5">Enrolment pending</div>
        </div>

        {/* 6. Dropped */}
        <div className="bg-[#FEE2E2] border border-red-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#991B1B]">Dropped</div>
          <div className="text-base sm:text-lg font-bold text-[#DC2626] mt-1 font-mono">{stats.dropped}</div>
          <div className="text-[11px] text-[#991B1B] mt-0.5">Cancelled candidate</div>
        </div>

        {/* 7. Original Sales Value */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280]">Original Sales Value</div>
          <div className="text-base sm:text-lg font-bold text-[#111827] mt-1 font-mono truncate">{formatCurrency(stats.originalSalesValue)}</div>
          <div className="text-[11px] text-[#6B7280] mt-0.5">Quotation baseline</div>
        </div>

        {/* 8. Total Sales Value */}
        <div className="bg-[#DBEAFE] border border-sky-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#1E40AF]">Total Sales Value</div>
          <div className="text-base sm:text-lg font-bold text-[#0B9BC5] mt-1 font-mono truncate">{formatCurrency(stats.totalSalesValue)}</div>
          <div className="text-[11px] text-[#1E40AF] mt-0.5">Contracted revenue</div>
        </div>

        {/* 9. Active Sales Value */}
        <div className="bg-[#DCFCE7] border border-emerald-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#166534]">Active Sales Value</div>
          <div className="text-base sm:text-lg font-bold text-[#08C565] mt-1 font-mono truncate">{formatCurrency(stats.activeSalesValue)}</div>
          <div className="text-[11px] text-[#166534] mt-0.5">Active deal value</div>
        </div>

        {/* 10. Dropped Value */}
        <div className="bg-[#FEE2E2] border border-red-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#991B1B]">Dropped Value</div>
          <div className="text-base sm:text-lg font-bold text-[#DC2626] mt-1 font-mono truncate">{formatCurrency(stats.droppedValue)}</div>
          <div className="text-[11px] text-[#991B1B] mt-0.5">Lost contract value</div>
        </div>

        {/* 11. Amount Collected */}
        <div className="bg-[#DCFCE7] border border-emerald-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#166534]">Amount Collected</div>
          <div className="text-base sm:text-lg font-bold text-[#08C565] mt-1 font-mono truncate">{formatCurrency(stats.amountCollected)}</div>
          <div className="text-[11px] text-[#166534] mt-0.5">Realized cash in hand</div>
        </div>

        {/* 12. Pending Amount */}
        <div className="bg-[#FEF3C7] border border-amber-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#92400E]">Pending Amount</div>
          <div className="text-base sm:text-lg font-bold text-[#F59E0B] mt-1 font-mono truncate">{formatCurrency(stats.pendingAmount)}</div>
          <div className="text-[11px] text-[#92400E] mt-0.5">Outstanding balance</div>
        </div>

        {/* 13. Collection % */}
        <div className="bg-[#DBEAFE] border border-sky-200 p-3.5 rounded-xl">
          <div className="text-xs font-semibold text-[#1E40AF]">Collection %</div>
          <div className="text-base sm:text-lg font-bold text-[#0B9BC5] mt-1 font-mono">{formatPercent(stats.collectionPercentage)}</div>
          <div className="text-[11px] text-[#1E40AF] mt-0.5">Realized cash ratio</div>
        </div>
      </div>

      {/* Observations Box */}
      {stats.observations.length > 0 && (
        <div className="pt-4 border-t border-[#E5E7EB]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#08C565]" />
            Live Operations Observations & Trends
          </div>
          <div className="space-y-1.5">
            {stats.observations.map((obs, idx) => (
              <div key={idx} className="text-xs text-[#374151] bg-[#F8FAFC] p-3 rounded-xl border border-[#E5E7EB] leading-[1.6] font-normal">
                {obs}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
