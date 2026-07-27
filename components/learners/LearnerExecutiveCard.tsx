'use client';

import React from 'react';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { UserCheck, TrendingUp, Wallet, Percent, Trophy } from 'lucide-react';

interface LearnerExecutiveCardProps {
  execStats?: ExecutiveSummaryStats;
  execRank?: number;
  totalExecs?: number;
}

export const LearnerExecutiveCard: React.FC<LearnerExecutiveCardProps> = ({
  execStats,
  execRank,
  totalExecs,
}) => {
  if (!execStats) {
    return (
      <div className="ww-card p-5 shadow-card border-l-6 border-l-[#7C3AED]">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#7C3AED] border border-purple-200">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-[18px] font-semibold text-[#111827]">Executive Information</span>
        </div>
        <p className="text-xs text-[#6B7280]">Executive data not available.</p>
      </div>
    );
  }

  const healthColor =
    execStats.healthScore >= 90 ? 'text-[#08C565]' :
    execStats.healthScore >= 75 ? 'text-[#0B9BC5]' :
    execStats.healthScore >= 60 ? 'text-[#F59E0B]' : 'text-[#DC2626]';

  return (
    <div className="ww-card p-5 shadow-card border-l-6 border-l-[#7C3AED]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#7C3AED] border border-purple-200">
          <UserCheck className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[18px] font-semibold text-[#111827]">Executive Information</span>
          <span className="text-xs text-[#6B7280] block font-normal">Assigned sales representative CRM profile</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
        <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-purple-200 flex items-center justify-center text-sm font-bold text-[#7C3AED] shrink-0">
          {execStats.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-[#111827] truncate">{execStats.name}</div>
          <div className="text-xs text-[#6B7280]">{execStats.healthCategory}</div>
        </div>
        {execRank && totalExecs && (
          <div className="badge-warning">
            <Trophy className="w-3 h-3 text-[#92400E]" />
            <span>#{execRank}/{totalExecs}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-[#0B9BC5]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Health Score</span>
          </div>
          <span className={`text-lg font-bold font-mono ${healthColor}`}>
            {execStats.healthScore}/100
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className="w-3 h-3 text-[#08C565]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Revenue</span>
          </div>
          <span className="text-lg font-bold font-mono text-[#08C565]">
            {formatCurrency(execStats.totalSalesValue)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <Percent className="w-3 h-3 text-[#0B9BC5]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Collection %</span>
          </div>
          <span className="text-lg font-bold font-mono text-[#0B9BC5]">
            {formatPercent(execStats.collectionPercentage)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy className="w-3 h-3 text-[#F59E0B]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Learners</span>
          </div>
          <span className="text-lg font-bold font-mono text-[#F59E0B]">
            {execStats.activeLearners}/{execStats.totalLearners}
          </span>
        </div>
      </div>
    </div>
  );
};
