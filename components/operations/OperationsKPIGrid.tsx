'use client';

import React from 'react';
import { OperationsOverviewMetrics } from '@/lib/operationsMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Clock, UserMinus, UserX, UserPlus, Percent, AlertTriangle, ShieldAlert } from 'lucide-react';

interface OperationsKPIGridProps {
  metrics: OperationsOverviewMetrics;
}

export const OperationsKPIGrid: React.FC<OperationsKPIGridProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<ShieldAlert className="w-5 h-5 text-[#08C565]" />}
        title="Operations Command Center Overview"
        subtitle="Real-time operational health summary identifying blocked revenue, pending collections, and candidate holds"
        badgeText="Operations KPIs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Pending Amount */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Total Pending Amount</span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#F59E0B] mt-2">
            {formatCurrency(metrics.totalPendingAmount)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Outstanding receivables balance</div>
        </div>

        {/* Total Hold Learners */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Hold Learners</span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B]">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#111827] mt-2">
            {metrics.totalHoldLearners} Candidates
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Temporarily paused students</div>
        </div>

        {/* Total Dropped Learners */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Dropped Learners</span>
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626]">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#DC2626] mt-2">
            {metrics.totalDroppedLearners} Candidates
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Discontinued candidates</div>
        </div>

        {/* Total Not On-boarded */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Not On-boarded</span>
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5]">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#0B9BC5] mt-2">
            {metrics.totalNotOnboarded} Prospects
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Pre-onboarding candidates</div>
        </div>

        {/* Collection Efficiency */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Collection Efficiency</span>
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#08C565] mt-2">
            {formatPercent(metrics.collectionEfficiency)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Realized cash collection ratio</div>
        </div>

        {/* Revenue at Risk */}
        <div className="ww-card ww-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Revenue at Risk</span>
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#DC2626] mt-2">
            {formatCurrency(metrics.revenueAtRisk)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Dropped + Critical Pending balance</div>
        </div>
      </div>
    </div>
  );
};
