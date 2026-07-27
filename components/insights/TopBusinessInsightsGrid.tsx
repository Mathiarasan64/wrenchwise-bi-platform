'use client';

import React from 'react';
import { ZohoRecord, ExecutiveKPIs } from '@/types';
import { calculateExecutiveKPIs } from '@/lib/metrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { DollarSign, Wallet, Clock, Percent, Users, CheckCircle2, TrendingUp } from 'lucide-react';

interface TopBusinessInsightsGridProps {
  records?: ZohoRecord[];
  kpis?: ExecutiveKPIs;
}

export const TopBusinessInsightsGrid: React.FC<TopBusinessInsightsGridProps> = ({ records, kpis: rawKpis }) => {
  const kpis: ExecutiveKPIs = React.useMemo(() => {
    if (rawKpis) return rawKpis;
    if (records) return calculateExecutiveKPIs(records);
    return {
      totalLearners: 0,
      activeLearners: 0,
      onboardedNotActive: 0,
      holdLearners: 0,
      notOnboarded: 0,
      droppedLearners: 0,
      originalSalesValue: 0,
      totalSalesValue: 0,
      activeSalesValue: 0,
      droppedValue: 0,
      amountCollected: 0,
      pendingAmount: 0,
      collectionPercentage: 0,
      avgConversionRate: 0,
    };
  }, [records, rawKpis]);

  const activeLearnerPct = kpis.totalLearners > 0 ? (kpis.activeLearners / kpis.totalLearners) * 100 : 0;

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<TrendingUp className="w-5 h-5 text-[#08C565]" />}
        title="Top Executive Business Metrics"
        subtitle="30-second core macro financial and candidate active metrics"
        badgeText="Core Metrics"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Revenue</span>
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#111827] mt-2">
            {formatCurrency(kpis.totalSalesValue)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Total contracted deals</div>
        </div>

        {/* Total Collected */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Collected</span>
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#08C565] mt-2">
            {formatCurrency(kpis.amountCollected)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Realized cash in bank</div>
        </div>

        {/* Total Pending */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Pending</span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#F59E0B] mt-2">
            {formatCurrency(kpis.pendingAmount)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Outstanding receivables</div>
        </div>

        {/* Collection Efficiency */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Collection Efficiency</span>
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#0B9BC5] mt-2">
            {formatPercent(kpis.collectionPercentage)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Realized cash ratio</div>
        </div>

        {/* Active Learner % */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Active Learner %</span>
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#08C565] mt-2">
            {formatPercent(activeLearnerPct)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">{kpis.activeLearners} of {kpis.totalLearners} candidates</div>
        </div>

        {/* Overall Conversion Rate */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Overall Conversion</span>
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#0B9BC5] mt-2">
            {formatPercent(kpis.avgConversionRate)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Conversion benchmark</div>
        </div>
      </div>
    </div>
  );
};
