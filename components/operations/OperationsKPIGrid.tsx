'use client';

import React, { memo, useMemo } from 'react';
import { ZohoRecord } from '@/types';
import { calculateExecutiveKPIs } from '@/lib/metrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Clock, UserMinus, UserX, Users, Percent, ShieldAlert, UserCheck } from 'lucide-react';

interface OperationsKPIGridProps {
  records: ZohoRecord[];
}

export const OperationsKPIGrid: React.FC<OperationsKPIGridProps> = memo(function OperationsKPIGrid({ records }) {
  const kpis = useMemo(() => calculateExecutiveKPIs(records), [records]);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<ShieldAlert className="w-5 h-5 text-[#08C565]" />}
        title="Operations Command Center Overview"
        subtitle="Real-time operational health summary tracking active learners, pending collections, candidate holds, and drop-offs"
        badgeText="Operations KPIs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Active Learners */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Active Learners</span>
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#08C565] mt-2">
            {kpis.activeLearners}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Active in training</div>
        </div>

        {/* 2. Onboarded - Not Active */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Onboarded - Not Active</span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-100">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#F59E0B] mt-2">
            {kpis.onboardedNotActive}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Pending session start</div>
        </div>

        {/* 3. Hold Learners */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Hold Learners</span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-100">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#111827] mt-2">
            {kpis.holdLearners}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Temporarily paused</div>
        </div>

        {/* 4. Pending Amount */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Pending Amount</span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#F59E0B] mt-2 truncate">
            {formatCurrency(kpis.pendingAmount)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Outstanding receivables</div>
        </div>

        {/* 5. Collection % */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Collection %</span>
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#08C565] mt-2">
            {formatPercent(kpis.collectionPercentage)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Realized collection ratio</div>
        </div>

        {/* 6. Dropped Learners */}
        <div className="ww-card ww-card-hover p-4 flex flex-col justify-between h-full min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Dropped Learners</span>
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] border border-red-100">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-[#DC2626] mt-2">
            {kpis.droppedLearners}
          </div>
          <div className="text-xs text-[#4B5563] mt-1 font-normal">Discontinued candidates</div>
        </div>
      </div>
    </div>
  );
});
