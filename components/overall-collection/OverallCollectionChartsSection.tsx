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
import { useOverallCollectionData } from '@/context/OverallCollectionContext';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon, UserCheck, Wallet } from 'lucide-react';

const COLORS = {
  collected: '#08C565',
  pending: '#F59E0B',
  execCollected: '#0B9BC5',
  execPending: '#F59E0B',
  execPendingHighlight: '#DC2626', // Highlight for executive with highest pending
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const rawVal = typeof item.value === 'number' ? item.value : 0;
    const formattedVal = formatCurrency(rawVal);
    const pct = item.payload && item.payload.pct !== undefined ? item.payload.pct : null;

    return (
      <div className="bg-[#111827] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 min-w-[200px] max-w-[280px] z-50">
        <p className="font-semibold text-white mb-1 border-b border-slate-800 pb-1">
          {label || item.name}
        </p>
        <div className="flex items-center justify-between gap-3 py-0.5">
          <span className="text-slate-300 font-normal">{item.name || item.dataKey}:</span>
          <span style={{ color: item.color || item.fill }} className="font-mono font-bold">
            {formattedVal}
          </span>
        </div>
        {pct !== null && (
          <div className="flex items-center justify-between gap-3 py-0.5 text-[11px]">
            <span className="text-slate-400">Percentage:</span>
            <span className="text-emerald-400 font-mono font-semibold">
              {formatPercent(pct)}
            </span>
          </div>
        )}
        <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 leading-tight">
          Collections shown are based on learners assigned to each Sales Executive portfolio. Payment collection is managed by the Operations Team.
        </p>
      </div>
    );
  }
  return null;
};

export const OverallCollectionChartsSection: React.FC = memo(
  function OverallCollectionChartsSection() {
    const { filteredRecords, metrics, selectedMonth } = useOverallCollectionData();
    const [isMounted, setIsMounted] = React.useState(false);
    const isMonthView = selectedMonth && selectedMonth !== 'Overall';

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    // 1. Collection Status (Collected vs Pending Donut Chart)
    const collectionStatusData = useMemo(() => {
      const total = metrics.amountCollected + metrics.pendingCollection;
      const collectedPct = total > 0 ? (metrics.amountCollected / total) * 100 : 0;
      const pendingPct = total > 0 ? (metrics.pendingCollection / total) * 100 : 0;

      return [
        { name: 'Amount Collected', value: metrics.amountCollected, fill: COLORS.collected, pct: collectedPct },
        { name: 'Pending Collection', value: metrics.pendingCollection, fill: COLORS.pending, pct: pendingPct },
      ];
    }, [metrics]);

    // 2. Collection by Sales Executive (Horizontal Bar Chart sorted Highest to Lowest)
    const collectionByExecData = useMemo(() => {
      const execMap: Record<string, number> = {};
      filteredRecords.forEach((r) => {
        const exec = r.salesExecutive || 'Unassigned';
        const amt = isMonthView
          ? (r.monthPayments[selectedMonth]?.amount || 0)
          : r.amountCollected;
        execMap[exec] = (execMap[exec] || 0) + amt;
      });

      return Object.entries(execMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    }, [filteredRecords, isMonthView, selectedMonth]);

    // 3. Pending Collection by Sales Executive (Horizontal Bar Chart sorted Highest to Lowest)
    const pendingByExecData = useMemo(() => {
      const execMap: Record<string, number> = {};
      filteredRecords.forEach((r) => {
        const exec = r.salesExecutive || 'Unassigned';
        let pend = 0;
        if (isMonthView) {
          const m = r.monthPayments[selectedMonth];
          if (m) {
            pend = Math.max(0, (m.expectedEmi || 0) - (m.amount || 0));
          }
        } else {
          pend = r.pendingCollection;
        }
        execMap[exec] = (execMap[exec] || 0) + pend;
      });

      const list = Object.entries(execMap)
        .map(([name, pendingAmount]) => ({ name, pendingAmount }))
        .sort((a, b) => b.pendingAmount - a.pendingAmount);

      // Identify highest pending amount for highlight
      const maxPending = list.length > 0 ? list[0].pendingAmount : 0;

      return list.map((item) => ({
        ...item,
        isHighest: maxPending > 0 && item.pendingAmount === maxPending,
      }));
    }, [filteredRecords, isMonthView, selectedMonth]);

    if (!isMounted) {
      return (
        <div className="space-y-6">
          <SectionHeader
            icon={<BarChart3 className="w-5 h-5 text-[#08C565]" />}
            title="Collection Visual Analytics"
            subtitle="Overall collection status ratio, collected revenue per executive, and outstanding pending collection breakdown"
            badgeText="Visual Analytics"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(3)].map((_, i) => (
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
          icon={<BarChart3 className="w-5 h-5 text-[#08C565]" />}
          title="Collection Visual Analytics"
          subtitle="Overall collection status ratio, collected revenue per executive, and outstanding pending collection breakdown"
          badgeText="Visual Analytics"
        />

        {/* Responsive Grid: Desktop = 2 charts on row 1, 1 full-width chart on row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Collection Status (Donut Chart) */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-100 shrink-0">
                <PieChartIcon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  1. Collection Status
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Collected vs Pending Collection balance
                </p>
              </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collectionStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {collectionStatusData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={48}
                    wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#374151', paddingTop: '8px' }}
                    formatter={(val) => <span className="text-[#374151] font-semibold">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Collection Performance by Sales Executive Portfolio */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#DBEAFE] text-[#0B9BC5] border border-sky-100 shrink-0">
                <Wallet className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  2. Collection Performance by Sales Executive Portfolio
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Realized cash collected from learners enrolled by each Sales Executive. Payment collection is managed by Operations.
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={collectionByExecData}
                  layout="vertical"
                  margin={{ top: 10, right: 50, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={500}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}K`}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={600}
                    width={95}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    name="Collected Amount"
                    fill={COLORS.execCollected}
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(val: any) =>
                        typeof val === 'number' && val > 0
                          ? `₹${val >= 100000 ? (val / 100000).toFixed(1) + 'L' : (val / 1000).toFixed(0) + 'K'}`
                          : '₹0'
                      }
                      className="fill-[#374151] font-mono text-[10px] font-bold"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Pending Collection by Sales Executive Portfolio */}
          <div className="ww-card p-4 sm:p-5 shadow-xs flex flex-col w-full min-w-0 overflow-hidden lg:col-span-2">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB] mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#FEF3C7] text-[#F59E0B] border border-amber-100 shrink-0">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  3. Pending Collection by Sales Executive Portfolio
                </h3>
                <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">
                  Outstanding pending balance from learners enrolled by each Sales Executive. Follow-ups are managed by Operations.
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pendingByExecData}
                  layout="vertical"
                  margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
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
                    width={100}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="pendingAmount"
                    name="Pending Collection"
                    radius={[0, 4, 4, 0]}
                  >
                    {pendingByExecData.map((entry, idx) => (
                      <Cell
                        key={`cell-pending-${idx}`}
                        fill={entry.isHighest ? COLORS.execPendingHighlight : COLORS.execPending}
                      />
                    ))}
                    <LabelList
                      dataKey="pendingAmount"
                      position="right"
                      formatter={(val: any) =>
                        typeof val === 'number' && val > 0
                          ? `₹${(val / 100000).toFixed(2)}L`
                          : '₹0'
                      }
                      className="fill-[#374151] font-mono text-[10px] font-bold"
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

