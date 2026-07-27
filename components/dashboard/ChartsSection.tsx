'use client';

import React, { memo } from 'react';
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
import { prepareChartData } from '@/lib/metrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon, UserCheck, Wallet } from 'lucide-react';

interface ChartsSectionProps {
  records: ZohoRecord[];
}

/* ─── Exact Chart Palette ─── */
const CHART_COLORS = {
  revenue: '#0B9BC5',
  collection: '#08C565',
  pending: '#F59E0B',
  dropped: '#DC2626',
  neutral: '#94A3B8',
};

/* ─── Chart Tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#111827] text-white border border-slate-800 p-3.5 rounded-xl shadow-xl min-w-[170px]">
      {label && (
        <p className="font-semibold text-white text-xs mb-2 pb-1.5 border-b border-slate-800">
          {label}
        </p>
      )}
      {payload.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color || item.fill || CHART_COLORS.collection }}
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

/* ─── Pie Chart Label ─── */
const renderPieLabel = ({ name, percent }: any) => {
  if (percent < 0.05) return '';
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

/* ─── Chart Card Wrapper (White #FFFFFF, Border #E5E7EB, Radius 16px) ─── */
const ChartCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ icon, title, subtitle, children }) => (
  <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-xs hover-lift flex flex-col">
    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100">{icon}</div>
        <div>
          <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
          <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">{subtitle}</p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

export const ChartsSection: React.FC<ChartsSectionProps> = memo(function ChartsSection({ records }) {
  const { revenueOverviewData, collectionData, learnerStatusData, executivePerformanceData } =
    prepareChartData(records);

  // Map to exact requested colors
  const customRevenueData = revenueOverviewData.map((d) => ({
    ...d,
    fill: d.category.includes('Original') ? CHART_COLORS.revenue : d.category.includes('Active') ? CHART_COLORS.collection : CHART_COLORS.dropped,
  }));

  const customCollectionData = collectionData.map((d) => ({
    ...d,
    color: d.name.includes('Collected') ? CHART_COLORS.collection : CHART_COLORS.pending,
  }));

  const customLearnerData = learnerStatusData.map((d) => ({
    ...d,
    color: d.name === 'Active' ? CHART_COLORS.collection : d.name === 'Hold' ? CHART_COLORS.pending : d.name === 'Dropped' ? CHART_COLORS.dropped : CHART_COLORS.revenue,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<BarChart3 className="w-5 h-5" />}
        title="Performance Analytics & Distribution"
        subtitle="Visual revenue breakdowns, collection efficiency ratios, and executive leaderboards"
        badgeText="Visual Analytics"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Overview */}
        <ChartCard
          icon={<BarChart3 className="w-4 h-4" />}
          title="Revenue Overview"
          subtitle="Original vs Active vs Dropped Sales Value"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#374151"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  stroke="#374151"
                  fontSize={12}
                  fontWeight={500}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <RechartsTooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Amount (₹)" radius={[6, 6, 0, 0]}>
                  {customRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Collection Overview */}
        <ChartCard
          icon={<Wallet className="w-4 h-4" />}
          title="Collection Overview"
          subtitle="Collected vs Outstanding Pending Amount"
        >
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customCollectionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {customCollectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 3: Learner Status */}
        <ChartCard
          icon={<PieChartIcon className="w-4 h-4" />}
          title="Learner Status Distribution"
          subtitle="Status breakdown across active, hold & dropped"
        >
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customLearnerData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {customLearnerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 4: Sales Executive Performance */}
        <ChartCard
          icon={<UserCheck className="w-4 h-4" />}
          title="Sales Executive Performance"
          subtitle="Total contracted sales value per executive"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={executivePerformanceData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#374151"
                  fontSize={12}
                  fontWeight={500}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#374151"
                  fontSize={12}
                  fontWeight={500}
                  width={85}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <RechartsTooltip content={<ChartTooltip />} />
                <Bar dataKey="totalSales" name="Total Sales (₹)" fill={CHART_COLORS.revenue} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
});
