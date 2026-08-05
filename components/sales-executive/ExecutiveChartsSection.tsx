'use client';

import React, { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LabelList,
} from 'recharts';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, Wallet, Users, DollarSign } from 'lucide-react';

interface ExecutiveChartsSectionProps {
  execStats: ExecutiveSummaryStats[];
}

const COLORS = {
  activeSales: '#0B9BC5',
  collected: '#08C565',
  pending: '#F59E0B',
  dropped: '#DC2626',
  hold: '#EAB308',
  notActive: '#F59E0B',
  notOnboarded: '#94A3B8',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 min-w-[160px]">
        <p className="font-semibold text-white mb-1 border-b border-slate-800 pb-1">
          {label || payload[0]?.name}
        </p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-3 py-0.5">
            <span className="text-slate-300 font-normal">{item.name || item.dataKey}:</span>
            <span style={{ color: item.color || item.fill }} className="font-mono font-bold">
              {typeof item.value === 'number' && item.value > 100
                ? formatCurrency(item.value)
                : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ExecutiveChartsSection: React.FC<ExecutiveChartsSectionProps> = memo(
  function ExecutiveChartsSection({ execStats }) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    // A. Collection Performance (Amount Collected vs Pending Amount)
    const collectionPerformanceData = useMemo(() => {
      const collected = execStats.reduce((sum, e) => sum + (e.amountCollected || 0), 0);
      const pending = execStats.reduce((sum, e) => sum + (e.pendingAmount || 0), 0);
      return [
        { name: 'Amount Collected', value: collected, fill: COLORS.collected },
        { name: 'Pending Amount', value: pending, fill: COLORS.pending },
      ];
    }, [execStats]);

    // B. Learner Status Distribution (Active, Onboarded - Not Active, Hold, Not On-boarded, Dropped)
    const learnerStatusData = useMemo(() => {
      const active = execStats.reduce((sum, e) => sum + (e.activeLearners || 0), 0);
      const onboardedNotActive = execStats.reduce((sum, e) => sum + (e.onboardedNotActive || 0), 0);
      const hold = execStats.reduce((sum, e) => sum + (e.hold || 0), 0);
      const notOnboarded = execStats.reduce((sum, e) => sum + (e.notOnboarded || 0), 0);
      const dropped = execStats.reduce((sum, e) => sum + (e.dropped || 0), 0);

      return [
        { name: 'Active', count: active, fill: COLORS.collected },
        { name: 'Onboarded - Not Active', count: onboardedNotActive, fill: COLORS.notActive },
        { name: 'Hold', count: hold, fill: COLORS.hold },
        { name: 'Not On-boarded', count: notOnboarded, fill: COLORS.notOnboarded },
        { name: 'Dropped', count: dropped, fill: COLORS.dropped },
      ];
    }, [execStats]);

    // C. Revenue Breakdown (Active Sales Value vs Dropped Value)
    const revenueBreakdownData = useMemo(() => {
      const activeSales = execStats.reduce((sum, e) => sum + (e.activeSalesValue || 0), 0);
      const droppedValue = execStats.reduce((sum, e) => sum + (e.droppedValue || 0), 0);
      return [
        { name: 'Active Sales Value', value: activeSales, fill: COLORS.activeSales },
        { name: 'Dropped Value', value: droppedValue, fill: COLORS.dropped },
      ];
    }, [execStats]);

    if (!isMounted) {
      return (
        <div className="space-y-6">
          <SectionHeader
            icon={<BarChart3 className="w-5 h-5 text-[#08C565]" />}
            title="Executive Performance Charts"
            subtitle="Three visual analytics breakdowns: Collection Performance, Learner Status Distribution, and Revenue Breakdown"
            badgeText="Executive Charts"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="ww-card p-5 h-80 flex items-center justify-center text-xs font-medium text-[#6B7280]"
              >
                Loading performance chart...
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <SectionHeader
          icon={<BarChart3 className="w-5 h-5 text-[#08C565]" />}
          title="Executive Performance Charts"
          subtitle="Three visual analytics breakdowns: Collection Performance, Learner Status Distribution, and Revenue Breakdown"
          badgeText="Executive Charts"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart A: Collection Performance */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200 shrink-0">
                <Wallet className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  A. Collection Performance
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Amount Collected vs Pending Amount
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionPerformanceData} margin={{ top: 20, right: 15, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={500}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Amount (₹)" radius={[6, 6, 0, 0]}>
                    {collectionPerformanceData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(val: any) =>
                        typeof val === 'number' ? `₹${(val / 100000).toFixed(2)}L` : String(val || '')
                      }
                      className="fill-[#374151] font-mono text-[11px] font-bold"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart B: Learner Status Distribution */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200 shrink-0">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  B. Learner Status Distribution
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Active, Inactive, Hold, Un-onboarded, and Dropped
                </p>
              </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={learnerStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {learnerStatusData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={48}
                    wrapperStyle={{ fontSize: '10px', fontWeight: 600, color: '#374151', paddingTop: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart C: Revenue Breakdown */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#DBEAFE] text-[#0B9BC5] border border-sky-200 shrink-0">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  C. Revenue Breakdown
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Active Sales Value vs Dropped Value
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueBreakdownData} margin={{ top: 20, right: 15, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={500}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Amount (₹)" radius={[6, 6, 0, 0]}>
                    {revenueBreakdownData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(val: any) =>
                        typeof val === 'number' ? `₹${(val / 100000).toFixed(2)}L` : String(val || '')
                      }
                      className="fill-[#374151] font-mono text-[11px] font-bold"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
