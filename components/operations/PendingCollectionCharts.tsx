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
import { aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { Wallet, BarChart3, PieChart as PieChartIcon, Clock, AlertTriangle } from 'lucide-react';

interface PendingCollectionChartsProps {
  records: ZohoRecord[];
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

export const PendingCollectionCharts: React.FC<PendingCollectionChartsProps> = ({ records }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const aggregated = aggregateExecutiveStats(records);

  const pendingByExecData = [...aggregated].sort((a, b) => b.pendingAmount - a.pendingAmount);
  const collectionPctData = [...aggregated].sort((a, b) => b.collectionPercentage - a.collectionPercentage);
  const top10PendingData = [...aggregated].sort((a, b) => b.pendingAmount - a.pendingAmount).slice(0, 10);

  // Revenue at Risk breakdown
  let totalPending = 0;
  let totalDroppedVal = 0;
  records.forEach((r) => {
    totalPending += r.pendingAmount || 0;
    totalDroppedVal += r.droppedValue || 0;
  });

  const revenueAtRiskData = [
    { name: 'Dropped Revenue Loss', value: totalDroppedVal, color: '#DC2626' },
    { name: 'Pending Balance', value: totalPending, color: '#F59E0B' },
  ];

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={<Wallet className="w-5 h-5 text-[#08C565]" />}
          title="Pending Collection Analysis"
          subtitle="Operational collection visual breakdown across sales representatives and deal risk profiles"
          badgeText="Collection Analytics"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ww-card p-5 h-80 flex items-center justify-center text-xs font-medium text-[#6B7280]">
              Loading collection chart...
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Wallet className="w-5 h-5 text-[#08C565]" />}
        title="Pending Collection Analysis"
        subtitle="Operational collection visual breakdown across sales representatives and deal risk profiles"
        badgeText="Collection Analytics"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Pending Amount by Sales Executive */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">Pending Amount by Sales Executive</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Total outstanding balance per representative</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pendingByExecData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" stroke="#374151" fontSize={13} fontWeight={500} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis stroke="#374151" fontSize={13} fontWeight={500} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="pendingAmount" name="Pending Balance (₹)" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Collection % by Sales Executive */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">Collection % by Sales Executive</h3>
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

        {/* Chart 3: Top 10 Highest Pending Executives */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] border border-red-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">Top 10 Highest Pending Representatives</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Representatives holding largest unpaid balances</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10PendingData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" stroke="#374151" fontSize={13} fontWeight={500} tickFormatter={(val) => `₹${val / 1000}k`} axisLine={{ stroke: '#E5E7EB' }} />
                <YAxis type="category" dataKey="name" stroke="#374151" fontSize={13} fontWeight={500} width={80} axisLine={{ stroke: '#E5E7EB' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="pendingAmount" name="Pending Balance (₹)" fill="#DC2626" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Revenue at Risk Breakdown */}
        <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] border border-red-200">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#111827]">Revenue at Risk Distribution</h3>
              <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Comparison of dropped lost revenue vs pending receivables</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueAtRiskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {revenueAtRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
