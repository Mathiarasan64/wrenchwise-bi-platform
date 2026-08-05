'use client';

import React, { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { calculateCentralizedMetrics } from '@/lib/calculationEngine';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon, UserCheck, Wallet } from 'lucide-react';

interface ChartsSectionProps {
  records: ZohoRecord[];
}

const CHART_COLORS = {
  activeSales: '#0B9BC5',   // Sky/Blue
  dropped: '#DC2626',       // Red
  collected: '#08C565',     // Green
  pending: '#F59E0B',       // Amber
};

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#111827] text-white border border-slate-800 p-3 rounded-xl shadow-xl min-w-[160px]">
      {label && (
        <p className="font-semibold text-white text-xs mb-1.5 pb-1 border-b border-slate-800">
          {label}
        </p>
      )}
      {payload.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between gap-3 py-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color || item.fill || CHART_COLORS.collected }}
            />
            <span className="text-xs text-slate-300 font-normal">{item.name || item.dataKey}</span>
          </div>
          <span className="text-xs font-bold text-white font-mono">
            {typeof item.value === 'number' && item.value > 100
              ? formatCurrency(item.value)
              : item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Chart Card Wrapper ─── */
const ChartCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  isMounted?: boolean;
  className?: string;
}> = ({ icon, title, subtitle, children, isMounted = true, className = '' }) => (
  <div className={`bg-white border border-[#E5E7EB] rounded-[16px] p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden ${className}`}>
    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 sm:p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#111827] truncate">{title}</h3>
          <p className="text-xs text-[#6B7280] font-normal leading-[1.6] truncate">{subtitle}</p>
        </div>
      </div>
    </div>
    {isMounted ? (
      children
    ) : (
      <div className="h-64 w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-center text-xs font-medium text-[#6B7280]">
        Loading visualization...
      </div>
    )}
  </div>
);

export const ChartsSection: React.FC<ChartsSectionProps> = memo(function ChartsSection({ records }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute metrics directly from Centralized Engine
  const metrics = useMemo(() => calculateCentralizedMetrics(records), [records]);

  // 1. Revenue Distribution (Donut Chart) Data
  const revenueDistributionData = useMemo(() => [
    { name: 'Active Sales Value', value: metrics.financial.activeSalesValue, fill: CHART_COLORS.activeSales },
    { name: 'Amount Collected', value: metrics.financial.amountCollected, fill: CHART_COLORS.collected },
    { name: 'Pending Amount', value: metrics.financial.pendingAmount, fill: CHART_COLORS.pending },
    { name: 'Dropped Value', value: metrics.financial.droppedValue, fill: CHART_COLORS.dropped },
  ], [metrics]);

  // 2. Top 10 Sales Executives Data (Ranked by Total Sales Value)
  const top10ExecutivesData = useMemo(() => {
    return [...metrics.executives]
      .sort((a, b) => b.contractedSales - a.contractedSales)
      .slice(0, 10)
      .map((e) => ({
        name: e.name,
        totalSales: e.contractedSales,
        collected: e.collectedAmount,
        pending: e.pendingAmount,
      }));
  }, [metrics]);

  // 3. Collection Performance Data
  const collectionPerformanceData = useMemo(() => [
    { name: 'Amount Collected', value: metrics.financial.amountCollected, fill: CHART_COLORS.collected },
    { name: 'Pending Amount', value: metrics.financial.pendingAmount, fill: CHART_COLORS.pending },
  ], [metrics]);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<BarChart3 className="w-5 h-5 text-[#08C565]" />}
        title="Executive Performance Visualizations"
        subtitle="Simplified revenue distribution, collection performance ratios, and top executive rankings"
        badgeText="Visual Analytics"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Revenue Distribution (Donut Chart) */}
        <ChartCard
          icon={<PieChartIcon className="w-4 h-4 text-[#08C565]" />}
          title="Revenue Distribution"
          subtitle="Breakdown of Active, Collected, Pending, and Dropped Values"
          isMounted={isMounted}
        >
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueDistributionData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {revenueDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={48}
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#374151', paddingTop: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 3. Collection Performance (Bar Ratios & Progress) */}
        <ChartCard
          icon={<Wallet className="w-4 h-4 text-[#08C565]" />}
          title="Collection Performance"
          subtitle="Realized cash collected vs outstanding receivables"
          isMounted={isMounted}
        >
          <div className="space-y-4">
            {/* Top KPI Ratios Header */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <div>
                <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Collection %</div>
                <div className="text-lg font-extrabold font-mono text-[#08C565] mt-0.5">
                  {formatPercent(metrics.financial.collectionPercentage)}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Collected</div>
                <div className="text-sm font-bold font-mono text-[#111827] mt-0.5 truncate">
                  {formatCurrency(metrics.financial.amountCollected)}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Pending</div>
                <div className="text-sm font-bold font-mono text-[#F59E0B] mt-0.5 truncate">
                  {formatCurrency(metrics.financial.pendingAmount)}
                </div>
              </div>
            </div>

            {/* Collection Performance Bar Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionPerformanceData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#374151"
                    fontSize={12}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={500}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Amount (₹)" radius={[6, 6, 0, 0]}>
                    {collectionPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>

        {/* 2. Top 10 Sales Executives (Horizontal Bar Chart) */}
        <ChartCard
          icon={<UserCheck className="w-4 h-4 text-[#08C565]" />}
          title="Top 10 Sales Executives"
          subtitle="Ranked by Total Sales Value"
          isMounted={isMounted}
          className="lg:col-span-2"
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top10ExecutivesData}
                layout="vertical"
                margin={{ top: 10, right: 25, left: 40, bottom: 10 }}
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
                  fontSize={12}
                  fontWeight={600}
                  width={110}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="totalSales"
                  name="Total Sales Value (₹)"
                  fill={CHART_COLORS.activeSales}
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
});
