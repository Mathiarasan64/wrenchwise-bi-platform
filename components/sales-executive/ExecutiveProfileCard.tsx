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

      {/* Grid of Key Performance Values */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#0B9BC5]" />
            Total Candidates
          </div>
          <div className="text-lg font-bold text-[#111827] mt-1 font-mono">{stats.totalLearners}</div>
          <div className="text-xs text-[#4B5563] mt-0.5 font-normal">{stats.activeLearners} Active Learners</div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#0B9BC5]" />
            Total Sales Value
          </div>
          <div className="text-lg font-bold text-[#0B9BC5] mt-1 font-mono">{formatCurrency(stats.totalSalesValue)}</div>
          <div className="text-xs text-[#4B5563] mt-0.5 font-normal">Contracted sales value</div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-[#08C565]" />
            Amount Collected
          </div>
          <div className="text-lg font-bold text-[#08C565] mt-1 font-mono">{formatCurrency(stats.amountCollected)}</div>
          <div className="text-xs text-[#4B5563] mt-0.5 font-normal">Realized cash in hand</div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            Pending Balance
          </div>
          <div className="text-lg font-bold text-[#F59E0B] mt-1 font-mono">{formatCurrency(stats.pendingAmount)}</div>
          <div className="text-xs text-[#4B5563] mt-0.5 font-normal">Outstanding receivables</div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-[#0B9BC5]" />
            Collection %
          </div>
          <div className="text-lg font-bold text-[#0B9BC5] mt-1 font-mono">{formatPercent(stats.collectionPercentage)}</div>
          <div className="text-xs text-[#4B5563] mt-0.5 font-normal">Realized cash ratio</div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#08C565]" />
            Conversion Rate
          </div>
          <div className="text-lg font-bold text-[#08C565] mt-1 font-mono">{formatPercent(stats.conversionRate)}</div>
          <div className="text-xs text-[#4B5563] mt-0.5 font-normal">Active candidate ratio</div>
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
