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
import { ZohoRecord } from '@/types';
import { calculateCentralizedMetrics } from '@/lib/calculationEngine';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon, UserCheck, Wallet } from 'lucide-react';

interface OperationsChartsSectionProps {
  records: ZohoRecord[];
}

const COLORS = {
  active: '#08C565',       // Green
  onboardedNotActive: '#F59E0B', // Amber
  hold: '#EAB308',         // Yellow
  notOnboarded: '#94A3B8', // Gray
  dropped: '#DC2626',      // Red
  collected: '#08C565',    // Green
  pending: '#F59E0B',      // Amber
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

export const OperationsChartsSection: React.FC<OperationsChartsSectionProps> = memo(
  function OperationsChartsSection({ records }) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    const metrics = useMemo(() => calculateCentralizedMetrics(records), [records]);

    // A. Learner Status Distribution (Donut Chart)
    const learnerStatusData = useMemo(() => {
      return [
        { name: 'Active Learners', count: metrics.learners.activeLearners, fill: COLORS.active },
        { name: 'Onboarded - Not Active', count: metrics.learners.onboardedNotActive, fill: COLORS.onboardedNotActive },
        { name: 'Hold', count: metrics.learners.holdLearners, fill: COLORS.hold },
        { name: 'Not On-boarded', count: metrics.learners.notOnboarded, fill: COLORS.notOnboarded },
        { name: 'Dropped', count: metrics.learners.droppedLearners, fill: COLORS.dropped },
      ];
    }, [metrics]);

    // B. Pending Collection by Sales Executive (Horizontal Bar Chart sorted Highest to Lowest)
    const pendingByExecData = useMemo(() => {
      return [...metrics.executives]
        .sort((a, b) => b.pendingAmount - a.pendingAmount)
        .map((e) => ({
          name: e.name,
          pendingAmount: e.pendingAmount,
        }));
    }, [metrics]);

    // C. Collection Performance (Amount Collected vs Pending Amount Bar Chart)
    const collectionPerformanceData = useMemo(() => {
      return [
        { name: 'Amount Collected', value: metrics.financial.amountCollected, fill: COLORS.collected },
        { name: 'Pending Amount', value: metrics.financial.pendingAmount, fill: COLORS.pending },
      ];
    }, [metrics]);

    if (!isMounted) {
      return (
        <div className="space-y-6">
          <SectionHeader
            icon={<BarChart3 className="w-5 h-5 text-[#08C565]" />}
            title="Operations Visual Analytics"
            subtitle="Learner health distribution, executive pending collection follow-up, and collection efficiency ratios"
            badgeText="Visual Analytics"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="ww-card p-5 h-80 flex items-center justify-center text-xs font-medium text-[#6B7280]">
                Loading operations chart...
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
          title="Operations Visual Analytics"
          subtitle="Learner health distribution, executive pending collection follow-up, and collection efficiency ratios"
          badgeText="Visual Analytics"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart A: Learner Status Distribution (Donut Chart) */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100 shrink-0">
                <PieChartIcon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  A. Learner Status Distribution
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

          {/* Chart B: Pending Collection by Sales Executive (Horizontal Bar Chart) */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-100 shrink-0">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  B. Pending Collection by Executive
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Highest to lowest pending balance for follow-up
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pendingByExecData}
                  layout="vertical"
                  margin={{ top: 10, right: 35, left: 35, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={500}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={600}
                    width={90}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="pendingAmount"
                    name="Pending Amount (₹)"
                    fill={COLORS.pending}
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="pendingAmount"
                      position="right"
                      formatter={(val: any) =>
                        typeof val === 'number' ? `₹${(val / 100000).toFixed(1)}L` : String(val || '')
                      }
                      className="fill-[#374151] font-mono text-[10px] font-bold"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart C: Collection Performance (Bar Chart) */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100 shrink-0">
                <Wallet className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  C. Collection Performance
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Amount Collected vs Pending Amount ratio
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
        </div>
      </div>
    );
  }
);
