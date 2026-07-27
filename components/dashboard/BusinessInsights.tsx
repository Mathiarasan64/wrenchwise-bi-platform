'use client';

import React from 'react';
import { generateBusinessInsights, calculateExecutiveKPIs } from '@/lib/metrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  Lightbulb,
  Trophy,
  Percent,
  Clock,
  CheckCircle2,
  Users,
  AlertTriangle,
  UserCheck,
  Zap,
} from 'lucide-react';

interface BusinessInsightsProps {
  records: ZohoRecord[];
}

export const BusinessInsights: React.FC<BusinessInsightsProps> = ({ records }) => {
  const insights = generateBusinessInsights(records);
  const kpis = calculateExecutiveKPIs(records);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Lightbulb className="w-5 h-5 text-[#08C565]" />}
        title="Executive Summary & Business Insights"
        subtitle="Automated intelligence signals, sales performance leaders, and operational follow-ups"
        badgeText="Executive Intelligence"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Highest Revenue Executive (Success Card State) */}
        <div className="card-success p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#16A34A] border border-emerald-200 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Highest Revenue Exec
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.highestRevenueExecutive.name}
            </div>
            <div className="text-sm text-[#0B9BC5] font-mono font-bold mt-1">
              {formatCurrency(insights.highestRevenueExecutive.value)} Sales
            </div>
          </div>
        </div>

        {/* 2. Highest Collection % (Success Card State) */}
        <div className="card-success p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#16A34A] border border-emerald-200 shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Highest Collection %
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.highestCollectionPercentage.name}
            </div>
            <div className="text-sm text-[#08C565] font-mono font-bold mt-1">
              {formatPercent(insights.highestCollectionPercentage.percentage)} Realized
            </div>
          </div>
        </div>

        {/* 3. Highest Conversion Rate (Info Card State) */}
        <div className="card-info p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#2563EB] border border-blue-200 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
              Highest Conversion Rate
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.bestConversionRate.name}
            </div>
            <div className="text-sm text-[#0B9BC5] font-mono font-bold mt-1">
              {formatPercent(insights.bestConversionRate.rate)} Conversion
            </div>
          </div>
        </div>

        {/* 4. Highest Pending Amount (Warning Card State) */}
        <div className="card-warning p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#F59E0B] border border-amber-200 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#92400E] uppercase tracking-wider">
              Highest Pending Amount
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.highestPendingAmount.name}
            </div>
            <div className="text-sm text-[#F59E0B] font-mono font-bold mt-1">
              {formatCurrency(insights.highestPendingAmount.amount)} Pending
            </div>
          </div>
        </div>

        {/* 5. Most Active Learners (Success Card State) */}
        <div className="card-success p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#16A34A] border border-emerald-200 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Most Active Learners
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.highestActiveLearners.name}
            </div>
            <div className="text-sm text-[#08C565] font-mono font-bold mt-1">
              {insights.highestActiveLearners.count} Active Candidates
            </div>
          </div>
        </div>

        {/* 6. Revenue Leakage (Critical Alert Card State) */}
        <div className="card-critical p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#DC2626] border border-red-200 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#991B1B] uppercase tracking-wider">
              Revenue Leakage
            </div>
            <div className="text-[18px] font-extrabold text-[#DC2626] mt-0.5 font-mono">
              {formatCurrency(insights.revenueLeakage.totalDropped)}
            </div>
            <div className="text-xs text-[#374151] mt-1 font-normal">
              {insights.revenueLeakage.affectedDeals} dropped candidates
            </div>
          </div>
        </div>

        {/* 7. Collection Efficiency Card (Info Card State) */}
        <div className="card-info p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#2563EB] border border-blue-200 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
              Collection Efficiency
            </div>
            <div className="text-[18px] font-bold text-[#0B9BC5] mt-0.5 font-mono">
              {formatPercent(kpis.collectionPercentage)}
            </div>
            <div className="text-xs text-[#374151] mt-1 font-normal">
              {formatCurrency(kpis.amountCollected)} of {formatCurrency(kpis.totalSalesValue)}
            </div>
          </div>
        </div>

        {/* 8. Executive Needing Follow-up (Recommendation Card State) */}
        <div className="card-recommendation p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#08C565] uppercase tracking-wider">
                Recommended Action
              </span>
              <span className="badge-priority-high">High Priority</span>
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.executiveNeedingFollowup.name}
            </div>
            <p className="text-xs text-[#374151] mt-1 leading-[1.6] font-normal">
              {insights.executiveNeedingFollowup.reason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
