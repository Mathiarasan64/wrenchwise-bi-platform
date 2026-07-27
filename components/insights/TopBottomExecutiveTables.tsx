'use client';

import React from 'react';
import { ZohoRecord } from '@/types';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { getTopAndBottomExecutives } from '@/lib/companyHealthMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Trophy, AlertTriangle, UserCheck } from 'lucide-react';

interface TopBottomExecutiveTablesProps {
  records?: ZohoRecord[];
  top5?: ExecutiveSummaryStats[];
  bottom5?: ExecutiveSummaryStats[];
  onSelectExecutive?: (name: string) => void;
}

export const TopBottomExecutiveTables: React.FC<TopBottomExecutiveTablesProps> = ({
  records,
  top5: rawTop5,
  bottom5: rawBottom5,
  onSelectExecutive,
}) => {
  const { top5, bottom5 } = React.useMemo(() => {
    if (rawTop5 && rawBottom5) {
      return { top5: rawTop5, bottom5: rawBottom5 };
    }
    if (records) {
      return getTopAndBottomExecutives(records);
    }
    return { top5: [], bottom5: [] };
  }, [records, rawTop5, rawBottom5]);

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
    <div className="space-y-4">
      <SectionHeader
        icon={<Trophy className="w-5 h-5 text-[#08C565]" />}
        title="Executive Performance Leaderboards"
        subtitle="Side-by-side ranking of Top 5 Sales Champions vs Bottom 5 Representatives requiring intervention"
        badgeText="Executive Leaderboards"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Executives */}
        <div className="ww-card p-5 shadow-card space-y-3 hover-lift">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Top 5 Sales Leaders</h3>
                <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Highest performing representatives across revenue & collection</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="ww-table">
              <thead>
                <tr>
                  <th className="text-center">Rank</th>
                  <th>Sales Executive</th>
                  <th className="text-right">Revenue</th>
                  <th className="text-right">Collection %</th>
                  <th className="text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((exec, idx) => (
                  <tr
                    key={exec.name}
                    onClick={() => onSelectExecutive && onSelectExecutive(exec.name)}
                    className="cursor-pointer"
                  >
                    <td className="text-center font-mono font-bold text-[#08C565]">
                      #{idx + 1}
                    </td>
                    <td className="font-semibold text-[#111827] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-[#08C565]" />
                        <span>{exec.name}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono font-bold text-[#0B9BC5]">
                      {formatCurrency(exec.totalSalesValue)}
                    </td>
                    <td className="text-right font-mono font-bold text-[#08C565]">
                      {formatPercent(exec.collectionPercentage)}
                    </td>
                    <td className="text-center">
                      <span className={getBadgeClass(exec.healthCategory)}>
                        {exec.healthScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom 5 Executives */}
        <div className="ww-card p-5 shadow-card space-y-3 hover-lift">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] border border-red-200">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-[#111827]">Bottom 5 Representatives</h3>
                <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Executives requiring management intervention & collection push</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="ww-table">
              <thead>
                <tr>
                  <th className="text-center">Rank</th>
                  <th>Sales Executive</th>
                  <th className="text-right">Pending</th>
                  <th className="text-right">Collection %</th>
                  <th className="text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {bottom5.map((exec, idx) => (
                  <tr
                    key={exec.name}
                    onClick={() => onSelectExecutive && onSelectExecutive(exec.name)}
                    className="cursor-pointer"
                  >
                    <td className="text-center font-mono font-bold text-[#DC2626]">
                      #{idx + 1}
                    </td>
                    <td className="font-semibold text-[#111827] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-[#DC2626]" />
                        <span>{exec.name}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono font-bold text-[#F59E0B]">
                      {formatCurrency(exec.pendingAmount)}
                    </td>
                    <td className="text-right font-mono font-bold text-[#374151]">
                      {formatPercent(exec.collectionPercentage)}
                    </td>
                    <td className="text-center">
                      <span className={getBadgeClass(exec.healthCategory)}>
                        {exec.healthScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
