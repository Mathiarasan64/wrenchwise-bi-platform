'use client';

import React from 'react';
import { LearnerCrmProfile } from '@/lib/learnerCrmEngine';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface LearnerPaymentAnalyticsProps {
  profile: LearnerCrmProfile;
}

export const LearnerPaymentAnalytics: React.FC<LearnerPaymentAnalyticsProps> = ({ profile }) => {
  const total = profile.totalSalesValue || 1;
  const collectedPct = (profile.amountCollected / total) * 100;
  const pendingPct = (profile.pendingAmount / total) * 100;

  return (
    <div className="ww-card p-5 shadow-card border-l-6 border-l-[#08C565]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[18px] font-semibold text-[#111827]">Payment Analytics</span>
          <span className="text-xs text-[#6B7280] block font-normal">Collected vs Pending breakdown</span>
        </div>
      </div>

      {/* Horizontal stacked bar */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#111827]">Collected vs Pending</span>
            <span className="text-xs font-mono font-medium text-[#6B7280]">{formatCurrency(total)}</span>
          </div>
          <div className="w-full h-6 bg-[#F1F5F9] rounded-lg overflow-hidden flex">
            <div
              className="h-full bg-[#08C565] transition-all duration-700 flex items-center justify-center text-white"
              style={{ width: `${Math.max(collectedPct, 2)}%` }}
            >
              {collectedPct > 15 && (
                <span className="text-[10px] font-bold">{collectedPct.toFixed(0)}%</span>
              )}
            </div>
            <div
              className="h-full bg-[#F59E0B] transition-all duration-700 flex items-center justify-center text-white"
              style={{ width: `${Math.max(pendingPct, 2)}%` }}
            >
              {pendingPct > 15 && (
                <span className="text-[10px] font-bold">{pendingPct.toFixed(0)}%</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#08C565]" />
              <span className="text-xs text-[#4B5563]">Collected ({formatCurrency(profile.amountCollected)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" />
              <span className="text-xs text-[#4B5563]">Pending ({formatCurrency(profile.pendingAmount)})</span>
            </div>
          </div>
        </div>

        {/* Collection % gauge */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#111827]">Collection Efficiency</span>
            <span className={`text-sm font-bold font-mono ${
              profile.collectionPercentage >= 70 ? 'text-[#08C565]' :
              profile.collectionPercentage >= 40 ? 'text-[#F59E0B]' : 'text-[#DC2626]'
            }`}>
              {formatPercent(profile.collectionPercentage)}
            </span>
          </div>
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, profile.collectionPercentage)}%`,
                background: profile.collectionPercentage >= 70
                  ? '#08C565'
                  : profile.collectionPercentage >= 40
                  ? '#F59E0B'
                  : '#DC2626',
              }}
            />
          </div>
        </div>

        {/* Recommended Action */}
        <div className="card-recommendation p-3 border-l-4 border-l-[#08C565]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#08C565] block mb-1">
            Recommended Action
          </span>
          <p className="text-xs text-[#374151] leading-[1.6] font-normal">{profile.recommendedAction}</p>
        </div>
      </div>
    </div>
  );
};
