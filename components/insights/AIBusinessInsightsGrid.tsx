'use client';

import React from 'react';
import { generateBusinessInsights } from '@/lib/metrics';
import { ExecutiveSummaryStats, aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Lightbulb, Trophy, Percent, Clock, Users, AlertTriangle, UserX, CheckCircle2, Zap } from 'lucide-react';

interface AIBusinessInsightsGridProps {
  records: ZohoRecord[];
  execStats?: ExecutiveSummaryStats[];
}

export const AIBusinessInsightsGrid: React.FC<AIBusinessInsightsGridProps> = ({ records, execStats: rawExecStats }) => {
  const execStats = React.useMemo(() => {
    return rawExecStats || aggregateExecutiveStats(records);
  }, [records, rawExecStats]);

  const insights = generateBusinessInsights(records);

  // Derive additional stats
  const sortedConvAsc = [...execStats].filter(e => e.totalLearners >= 1).sort((a, b) => a.conversionRate - b.conversionRate);
  const lowestConversionExec = sortedConvAsc[0];

  const sortedDroppedVal = [...execStats].sort((a, b) => b.droppedValue - a.droppedValue);
  const highestDroppedExec = sortedDroppedVal[0];

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Lightbulb className="w-5 h-5 text-[#08C565]" />}
        title="AI Executive Signals & Performance Drivers"
        subtitle="Automated intelligence cards pinpointing sales leaders, operational risks, and collection priorities"
        badgeText="AI Signals"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {/* 1. Highest Revenue Executive */}
        <div className="card-success p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#16A34A] border border-emerald-200 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Highest Revenue Executive
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.highestRevenueExecutive.name}
            </div>
            <div className="text-sm text-[#0B9BC5] font-mono font-bold mt-1">
              {formatCurrency(insights.highestRevenueExecutive.value)} Sales
            </div>
          </div>
        </div>

        {/* 2. Highest Collection % */}
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

        {/* 3. Highest Pending Amount */}
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

        {/* 4. Highest Active Learners */}
        <div className="card-success p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#16A34A] border border-emerald-200 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider">
              Highest Active Learners
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.highestActiveLearners.name}
            </div>
            <div className="text-sm text-[#08C565] font-mono font-bold mt-1">
              {insights.highestActiveLearners.count} Active Candidates
            </div>
          </div>
        </div>

        {/* 5. Lowest Conversion Exec */}
        <div className="card-critical p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#DC2626] border border-red-200 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#991B1B] uppercase tracking-wider">
              Lowest Conversion Rate
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {lowestConversionExec ? lowestConversionExec.name : 'N/A'}
            </div>
            <div className="text-sm text-[#DC2626] font-mono font-bold mt-1">
              {lowestConversionExec ? `${formatPercent(lowestConversionExec.conversionRate)} Conversion` : '0%'}
            </div>
          </div>
        </div>

        {/* 6. Highest Dropped Value */}
        <div className="card-critical p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#DC2626] border border-red-200 shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#991B1B] uppercase tracking-wider">
              Highest Dropped Value
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {highestDroppedExec ? highestDroppedExec.name : 'N/A'}
            </div>
            <div className="text-sm text-[#DC2626] font-mono font-bold mt-1">
              {highestDroppedExec ? formatCurrency(highestDroppedExec.droppedValue) : '₹0'} Dropped
            </div>
          </div>
        </div>

        {/* 7. Executives Requiring Follow-up */}
        <div className="card-warning p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#F59E0B] border border-amber-200 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#92400E] uppercase tracking-wider">
              Executive Needing Follow-up
            </div>
            <div className="text-[18px] font-semibold text-[#111827] mt-0.5">
              {insights.executiveNeedingFollowup.name}
            </div>
            <div className="text-xs text-[#374151] mt-1 leading-[1.6] font-normal">
              {insights.executiveNeedingFollowup.reason}
            </div>
          </div>
        </div>

        {/* 8. Highest Revenue Leakage */}
        <div className="card-critical p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#DC2626] border border-red-200 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#991B1B] uppercase tracking-wider">
              Revenue Leakage Risk
            </div>
            <div className="text-[18px] font-extrabold text-[#DC2626] mt-0.5 font-mono">
              {formatCurrency(insights.revenueLeakage.totalDropped)}
            </div>
            <div className="text-xs text-[#374151] mt-1 font-normal">
              {insights.revenueLeakage.affectedDeals} dropped candidates
            </div>
          </div>
        </div>

        {/* 9. Collection Efficiency */}
        <div className="card-info p-4 flex items-start gap-3 hover-lift">
          <div className="p-2.5 rounded-xl bg-white text-[#2563EB] border border-blue-200 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
              Collection Efficiency Status
            </div>
            <div className="text-[18px] font-bold text-[#0B9BC5] mt-0.5 font-mono">
              {insights.highestCollectionPercentage.percentage >= 50 ? 'Healthy Realization' : 'Requires Push'}
            </div>
            <div className="text-xs text-[#374151] mt-1 font-normal">
              Leader: {insights.highestCollectionPercentage.name} ({formatPercent(insights.highestCollectionPercentage.percentage)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
