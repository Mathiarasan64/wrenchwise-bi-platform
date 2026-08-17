'use client';

import React from 'react';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Trophy, Award, UserCheck, ChevronRight } from 'lucide-react';

interface ExecutiveLeaderboardProps {
  execStats: ExecutiveSummaryStats[];
  selectedExecutive: string;
  onSelectExecutive: (name: string) => void;
}

export const ExecutiveLeaderboard: React.FC<ExecutiveLeaderboardProps> = ({
  execStats,
  selectedExecutive,
  onSelectExecutive,
}) => {
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="badge-warning inline-flex items-center gap-1 font-bold text-xs"><Trophy className="w-3.5 h-3.5 text-[#92400E]" />#1 Leader</span>;
    if (rank === 2) return <span className="badge-info inline-flex items-center gap-1 font-bold text-xs"><Award className="w-3.5 h-3.5 text-[#1D4ED8]" />#2 Runner</span>;
    if (rank === 3) return <span className="badge-success inline-flex items-center gap-1 font-bold text-xs"><Award className="w-3.5 h-3.5 text-[#166534]" />#3 Top 3</span>;
    return <span className="text-[#6B7280] font-mono font-bold text-xs">#{rank}</span>;
  };

  return (
    <div className="ww-card p-6 shadow-card space-y-4">
      <SectionHeader
        icon={<Trophy className="w-5 h-5 text-[#08C565]" />}
        title="Executive Performance Leaderboard"
        subtitle="Ranked dynamically by Performance Health Score (0-100), contracted revenue, and collection efficiency"
        badgeText="Leaderboard"
      />

      <div className="overflow-x-auto custom-scrollbar relative">
        <table className="w-full text-left border-separate border-spacing-0 text-xs min-w-[700px]">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center">Rank</th>
              <th className="py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">Sales Executive</th>
              <th className="py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center">Health Score</th>
              <th className="py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right">Revenue (₹)</th>
              <th className="py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right">Collected (₹)</th>
              <th className="py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right">Collection %</th>
              <th className="py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center">Conversion %</th>
              <th className="sticky right-0 z-20 py-3 px-4 border-b border-l border-[#E5E7EB] bg-[#F8FAFC] text-center w-24 min-w-[90px] shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
            {execStats.map((exec, idx) => {
              const isSelected = selectedExecutive === exec.name;
              const rank = idx + 1;

              return (
                <tr
                  key={exec.name}
                  onClick={() => onSelectExecutive(exec.name)}
                  className={`group hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#DCFCE7]/30 border-l-4 border-l-[#08C565] font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4 border-b border-[#E5E7EB] text-center">{getRankBadge(rank)}</td>

                  <td className="py-3 px-4 border-b border-[#E5E7EB] font-bold text-[#111827] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#08C565]" />
                      <span>{exec.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 border-b border-[#E5E7EB] text-center">
                    <span className={getBadgeClass(exec.healthCategory)}>
                      {exec.healthScore} / 100 ({exec.healthCategory})
                    </span>
                  </td>

                  <td className="py-3 px-4 border-b border-[#E5E7EB] text-right font-mono font-bold text-[#0B9BC5]">
                    {formatCurrency(exec.totalSalesValue)}
                  </td>

                  <td className="py-3 px-4 border-b border-[#E5E7EB] text-right font-mono font-bold text-[#08C565]">
                    {formatCurrency(exec.amountCollected)}
                  </td>

                  <td className="py-3 px-4 border-b border-[#E5E7EB] text-right font-mono font-bold text-[#0B9BC5]">
                    {formatPercent(exec.collectionPercentage)}
                  </td>

                  <td className="py-3 px-4 border-b border-[#E5E7EB] text-center font-mono font-bold text-[#08C565]">
                    {formatPercent(exec.conversionRate)}
                  </td>

                  <td className="py-3 px-4 border-b border-l border-[#E5E7EB] text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] z-10 w-24 min-w-[90px] shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExecutive(exec.name);
                      }}
                      className="btn-ghost text-xs inline-flex items-center gap-1 py-1 px-2"
                    >
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
