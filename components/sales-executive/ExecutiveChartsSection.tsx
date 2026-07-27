'use client';

import React from 'react';
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
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon, UserCheck, DollarSign, Wallet, Users, Percent } from 'lucide-react';

interface ExecutiveChartsSectionProps {
  execStats: ExecutiveSummaryStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-semibold text-white mb-1">{label || payload[0].name}</p>
        {payload.map((item: any, idx: number) => (
          <p key={idx} style={{ color: item.color || item.fill }} className="font-mono font-bold">
            {item.name || item.dataKey}:{' '}
            {typeof item.value === 'number' && item.value > 100
              ? formatCurrency(item.value)
              : item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Brand Chart Colors: Blue #0B9BC5, Green #08C565, Orange #F59E0B, Red #DC2626, Gray #94A3B8
const BRAND_CHART_COLORS = ['#0B9BC5', '#08C565', '#F59E0B', '#DC2626', '#94A3B8', '#0284C7', '#059669', '#D97706'];

export const ExecutiveChartsSection: React.FC<ExecutiveChartsSectionProps> = ({ execStats }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sort data for charts
  const revenueData = [...execStats].sort((a, b) => b.totalSalesValue - a.totalSalesValue);
  const collectionPctData = [...execStats].sort((a, b) => b.collectionPercentage - a.collectionPercentage);
  const pendingData = [...execStats].sort((a, b) => b.pendingAmount - a.pendingAmount);
  const activeLearnersData = [...execStats].sort((a, b) => b.activeLearners - a.activeLearners);
  const conversionData = [...execStats].sort((a, b) => b.conversionRate - a.conversionRate);

  // Donut chart for revenue contribution
  const totalRev = execStats.reduce((sum, e) => sum + e.totalSalesValue, 0);
  const revenueContributionData = execStats
    .filter((e) => e.totalSalesValue > 0)
    .map((e) => ({
      name: e.name,
      value: e.totalSalesValue,
      percentage: totalRev > 0 ? (e.totalSalesValue / totalRev) * 100 : 0,
    }));

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={<BarChart3 className="w-5 h-5 text-[#08C565]" />}
          title="Executive Performance Charts"
          subtitle="Six visual analytics breakdowns comparing sales value, collections, active learners, and conversion rates across representatives"
          badgeText="Executive Charts"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ww-card p-5 h-80 flex items-center justify-center text-xs font-medium text-[#6B7280]">
              Loading executive chart...
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
        subtitle="Six visual analytics breakdowns comparing sales value, collections, active learners, and conversion rates across representatives"
        badgeText="Executive Charts"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Revenue by Executive */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5] border border-sky-200">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">1. Revenue by Executive</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Total contracted sales value per representative</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#374151" fontSize={13} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis stroke="#374151" fontSize={13} fontWeight={500} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="totalSalesValue" name="Total Sales (₹)" fill="#0B9BC5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Collection % by Executive */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">2. Collection % by Executive</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Realized cash collection ratio per representative</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionPctData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#374151" fontSize={13} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis stroke="#374151" fontSize={13} fontWeight={500} tickFormatter={(val) => `${val}%`} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="collectionPercentage" name="Collection %" fill="#08C565" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Pending Amount by Executive */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-200">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">3. Pending Amount by Executive</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Outstanding unpaid receivables balance</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pendingData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#374151" fontSize={13} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis stroke="#374151" fontSize={13} fontWeight={500} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="pendingAmount" name="Pending Balance (₹)" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Active Learners by Executive */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">4. Active Learners by Executive</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">In-session candidates actively undergoing training</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeLearnersData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#374151" fontSize={13} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis stroke="#374151" fontSize={13} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="activeLearners" name="Active Learners" fill="#08C565" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Conversion Rate by Executive */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5] border border-sky-200">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">5. Conversion Rate by Executive</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Ratio of assigned candidates active in training</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#374151" fontSize={13} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis stroke="#374151" fontSize={13} fontWeight={500} tickFormatter={(val) => `${val}%`} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="conversionRate" name="Conversion Rate %" fill="#0B9BC5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Revenue Contribution % */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">6. Revenue Contribution %</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Share of total contracted revenue by executive</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueContributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {revenueContributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '13px', color: '#111827' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
