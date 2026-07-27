'use client';

import React, { useState } from 'react';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { GitCompare, UserCheck } from 'lucide-react';

interface ExecutiveComparisonProps {
  execStats: ExecutiveSummaryStats[];
}

export const ExecutiveComparison: React.FC<ExecutiveComparisonProps> = ({ execStats }) => {
  const [execA, setExecA] = useState<string>(execStats[0]?.name || '');
  const [execB, setExecB] = useState<string>(execStats[1]?.name || execStats[0]?.name || '');

  const statA = execStats.find((e) => e.name === execA);
  const statB = execStats.find((e) => e.name === execB);

  if (!statA || !statB) return null;

  const compareMetrics = [
    { label: 'Performance Health Score', valA: `${statA.healthScore} / 100`, valB: `${statB.healthScore} / 100`, numA: statA.healthScore, numB: statB.healthScore },
    { label: 'Total Sales Value', valA: formatCurrency(statA.totalSalesValue), valB: formatCurrency(statB.totalSalesValue), numA: statA.totalSalesValue, numB: statB.totalSalesValue },
    { label: 'Amount Collected', valA: formatCurrency(statA.amountCollected), valB: formatCurrency(statB.amountCollected), numA: statA.amountCollected, numB: statB.amountCollected },
    { label: 'Pending Balance', valA: formatCurrency(statA.pendingAmount), valB: formatCurrency(statB.pendingAmount), numA: statA.pendingAmount, numB: statB.pendingAmount, lowerIsBetter: true },
    { label: 'Collection %', valA: formatPercent(statA.collectionPercentage), valB: formatPercent(statB.collectionPercentage), numA: statA.collectionPercentage, numB: statB.collectionPercentage },
    { label: 'Conversion Rate', valA: formatPercent(statA.conversionRate), valB: formatPercent(statB.conversionRate), numA: statA.conversionRate, numB: statB.conversionRate },
    { label: 'Active Learners', valA: statA.activeLearners, valB: statB.activeLearners, numA: statA.activeLearners, numB: statB.activeLearners },
    { label: 'Dropped Value', valA: formatCurrency(statA.droppedValue), valB: formatCurrency(statB.droppedValue), numA: statA.droppedValue, numB: statB.droppedValue, lowerIsBetter: true },
  ];

  return (
    <div className="ww-card p-6 shadow-card space-y-6">
      <SectionHeader
        icon={<GitCompare className="w-5 h-5 text-[#08C565]" />}
        title="Side-by-Side Executive Comparison"
        subtitle="Select any two Sales Representatives to compare contracted sales, collection ratio, active learners, and health scores"
        badgeText="Executive Benchmark"
      />

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Exec A Selector */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <label className="text-xs font-bold uppercase tracking-wider text-[#08C565] block mb-2">
            Select Representative A
          </label>
          <div className="relative">
            <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#08C565] pointer-events-none" />
            <select
              value={execA}
              onChange={(e) => setExecA(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#08C565] cursor-pointer"
            >
              {execStats.map((e) => (
                <option key={e.name} value={e.name}>
                  {e.name} (Score: {e.healthScore})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exec B Selector */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0B9BC5] block mb-2">
            Select Representative B
          </label>
          <div className="relative">
            <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0B9BC5] pointer-events-none" />
            <select
              value={execB}
              onChange={(e) => setExecB(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0B9BC5] cursor-pointer"
            >
              {execStats.map((e) => (
                <option key={e.name} value={e.name}>
                  {e.name} (Score: {e.healthScore})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="divide-y divide-[#E5E7EB] bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-3 p-3 bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider text-[#111827]">
          <div className="text-[#08C565] truncate">{statA.name}</div>
          <div className="text-center text-[#6B7280]">Metric</div>
          <div className="text-right text-[#0B9BC5] truncate">{statB.name}</div>
        </div>

        {/* Rows */}
        {compareMetrics.map((m, idx) => {
          let isAWinner = false;
          let isBWinner = false;

          if (m.lowerIsBetter) {
            isAWinner = m.numA < m.numB;
            isBWinner = m.numB < m.numA;
          } else {
            isAWinner = m.numA > m.numB;
            isBWinner = m.numB > m.numA;
          }

          return (
            <div key={idx} className="grid grid-cols-3 p-3 text-xs items-center hover:bg-[#F9FAFB] transition-colors">
              <div className={`font-mono font-bold ${isAWinner ? 'text-[#08C565]' : 'text-[#374151]'}`}>
                {m.valA} {isAWinner && <span className="badge-success text-[10px] ml-1">Lead</span>}
              </div>

              <div className="text-center font-semibold text-[#374151] text-xs truncate">
                {m.label}
              </div>

              <div className={`text-right font-mono font-bold ${isBWinner ? 'text-[#08C565]' : 'text-[#374151]'}`}>
                {isBWinner && <span className="badge-success text-[10px] mr-1">Lead</span>} {m.valB}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
