'use client';

import React, { useState, useMemo } from 'react';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  Users,
  DollarSign,
  Wallet,
  TrendingUp,
  Award,
  CheckCircle2,
  Sliders,
  ChevronDown,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
  LabelList,
} from 'recharts';

interface SalesExecutiveCompareViewProps {
  execStats: ExecutiveSummaryStats[];
  records: ZohoRecord[];
}

type MetricOption = 'totalSalesValue' | 'amountCollected' | 'pendingAmount' | 'collectionPercentage';

export const SalesExecutiveCompareView: React.FC<SalesExecutiveCompareViewProps> = ({
  execStats,
  records,
}) => {
  // Determine dominant business vertical for each executive
  const execVerticalMap = useMemo(() => {
    const map: Record<string, string> = {};
    records.forEach((r) => {
      const exec = r.salesExecutive || 'Unassigned';
      if (!map[exec] && r.businessVertical) {
        map[exec] = r.businessVertical;
      }
    });
    return map;
  }, [records]);

  // Selected Sales Executives state (default select first 3 if available)
  const [selectedExecs, setSelectedExecs] = useState<string[]>(() => {
    return execStats.slice(0, 3).map((e) => e.name);
  });

  // Selected Chart Metric
  const [chartMetric, setChartMetric] = useState<MetricOption>('amountCollected');

  // Toggle selection
  const handleToggleExec = (name: string) => {
    setSelectedExecs((prev) => {
      if (prev.includes(name)) {
        if (prev.length <= 1) return prev; // Keep at least 1 selected
        return prev.filter((n) => n !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedExecs(execStats.map((e) => e.name));
  };

  const handleClearSelection = () => {
    if (execStats.length > 0) {
      setSelectedExecs([execStats[0].name]);
    }
  };

  // Filter stats to selected executives
  const selectedStats = useMemo(() => {
    return execStats
      .filter((e) => selectedExecs.includes(e.name))
      .map((e) => ({
        ...e,
        businessVertical: execVerticalMap[e.name] || (e.name.toUpperCase().includes('PAP') ? 'PAP' : 'B2C'),
        inactiveLearners: e.onboardedNotActive + e.hold,
        closedLearners: e.dropped + e.notOnboarded,
      }));
  }, [execStats, selectedExecs, execVerticalMap]);

  // Compute benchmarks across ONLY selected executives for highlighting
  const benchmarks = useMemo(() => {
    if (selectedStats.length === 0) return {};

    const maxTotalSales = Math.max(...selectedStats.map((s) => s.totalSalesValue));
    const minTotalSales = Math.min(...selectedStats.map((s) => s.totalSalesValue));

    const maxCollected = Math.max(...selectedStats.map((s) => s.amountCollected));
    const minCollected = Math.min(...selectedStats.map((s) => s.amountCollected));

    const maxPending = Math.max(...selectedStats.map((s) => s.pendingAmount));
    const minPending = Math.min(...selectedStats.map((s) => s.pendingAmount));

    const maxCollectionPct = Math.max(...selectedStats.map((s) => s.collectionPercentage));
    const minCollectionPct = Math.min(...selectedStats.map((s) => s.collectionPercentage));

    const maxActiveSales = Math.max(...selectedStats.map((s) => s.activeSalesValue));
    const minActiveSales = Math.min(...selectedStats.map((s) => s.activeSalesValue));

    const maxTotalLearners = Math.max(...selectedStats.map((s) => s.totalLearners));
    const minTotalLearners = Math.min(...selectedStats.map((s) => s.totalLearners));

    const maxConversion = Math.max(...selectedStats.map((s) => s.conversionRate));
    const minConversion = Math.min(...selectedStats.map((s) => s.conversionRate));

    return {
      maxTotalSales,
      minTotalSales,
      maxCollected,
      minCollected,
      maxPending,
      minPending,
      maxCollectionPct,
      minCollectionPct,
      maxActiveSales,
      minActiveSales,
      maxTotalLearners,
      minTotalLearners,
      maxConversion,
      minConversion,
    };
  }, [selectedStats]);

  // Grouped Comparison Chart Data
  const chartData = useMemo(() => {
    return selectedStats.map((s) => {
      let value = 0;
      if (chartMetric === 'totalSalesValue') value = s.totalSalesValue;
      else if (chartMetric === 'amountCollected') value = s.amountCollected;
      else if (chartMetric === 'pendingAmount') value = s.pendingAmount;
      else if (chartMetric === 'collectionPercentage') value = s.collectionPercentage;

      return {
        name: s.name,
        value,
      };
    });
  }, [selectedStats, chartMetric]);

  const metricLabels: Record<MetricOption, string> = {
    totalSalesValue: 'Total Sales Value (₹)',
    amountCollected: 'Amount Collected (₹)',
    pendingAmount: 'Pending Amount (₹)',
    collectionPercentage: 'Collection Percentage (%)',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-[#111827] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-semibold text-white mb-1 border-b border-slate-800 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-300">{metricLabels[chartMetric]}:</span>
            <span className="font-mono font-bold text-[#08C565]">
              {chartMetric === 'collectionPercentage' ? formatPercent(val) : formatCurrency(val)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <SectionHeader
        icon={<Sliders className="w-5 h-5 text-[#08C565]" />}
        title="Sales Executive Side-by-Side Comparison"
        subtitle="Select multiple sales representatives to compare their learner distribution, revenue figures, and collection efficiency side-by-side."
        badgeText="Executive Comparison"
      />

      {/* Checkbox Selector Control Bar */}
      <div className="ww-card p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#08C565]" />
            <span className="text-xs font-bold text-[#111827]">
              Select Executives to Compare ({selectedExecs.length} Selected)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-[11px] font-semibold text-[#08C565] hover:underline px-2 py-1 rounded bg-[#DCFCE7]/50"
            >
              Select All ({execStats.length})
            </button>
            <button
              onClick={handleClearSelection}
              className="text-[11px] font-semibold text-[#6B7280] hover:underline px-2 py-1 rounded bg-slate-100"
            >
              Reset Selection
            </button>
          </div>
        </div>

        {/* Executive Checkboxes Grid */}
        <div className="flex flex-wrap items-center gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
          {execStats.map((exec) => {
            const isChecked = selectedExecs.includes(exec.name);
            return (
              <label
                key={exec.name}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all select-none ${
                  isChecked
                    ? 'bg-[#DCFCE7] text-[#08C565] border-emerald-300 shadow-2xs'
                    : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F8FAFC]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleExec(exec.name)}
                  className="rounded text-[#08C565] focus:ring-[#08C565] w-3.5 h-3.5"
                />
                <span>{exec.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Executive Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {selectedStats.map((exec) => {
          const isBestCollectionPct = exec.collectionPercentage === benchmarks.maxCollectionPct && exec.collectionPercentage > 0;
          const isMaxCollected = exec.amountCollected === benchmarks.maxCollected && exec.amountCollected > 0;
          const isLowestPending = exec.pendingAmount === benchmarks.minPending && exec.totalSalesValue > 0;

          return (
            <div
              key={exec.name}
              className="ww-card p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs space-y-3.5 flex flex-col justify-between"
            >
              {/* Executive Header & Badges */}
              <div className="pb-3 border-b border-[#E5E7EB] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#111827] truncate">{exec.name}</h3>
                  <span className="badge-secondary text-[10px] font-semibold shrink-0">
                    {exec.businessVertical}
                  </span>
                </div>

                {/* Special Performance Badges */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {isBestCollectionPct && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      🏆 Best Collection %
                    </span>
                  )}
                  {isMaxCollected && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      💰 Max Cash Collected
                    </span>
                  )}
                  {isLowestPending && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                      🛡️ Lowest Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Parallel Metric Rows */}
              <div className="space-y-2 text-xs text-[#374151] flex-1">
                {/* 1. Total Learners */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Total Learners</span>
                  <span
                    className={`font-mono font-bold ${
                      exec.totalLearners === benchmarks.maxTotalLearners
                        ? 'text-emerald-700 font-extrabold'
                        : exec.totalLearners === benchmarks.minTotalLearners
                        ? 'text-red-600'
                        : 'text-[#111827]'
                    }`}
                  >
                    {exec.totalLearners}
                  </span>
                </div>

                {/* 2. Active Learners */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Active Learners</span>
                  <span className="font-mono font-bold text-[#08C565]">
                    {exec.activeLearners}
                  </span>
                </div>

                {/* 3. Inactive Learners */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Inactive Learners</span>
                  <span className="font-mono font-semibold text-[#F59E0B]">
                    {exec.inactiveLearners}
                  </span>
                </div>

                {/* 4. Closed Learners */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Closed Learners</span>
                  <span className="font-mono text-[#6B7280]">{exec.closedLearners}</span>
                </div>

                {/* 5. Original Sales Value */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Original Sales</span>
                  <span className="font-mono text-[#4B5563]">
                    {formatCurrency(exec.originalSalesValue)}
                  </span>
                </div>

                {/* 6. Total Sales Value */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Total Sales Value</span>
                  <span
                    className={`font-mono font-bold ${
                      exec.totalSalesValue === benchmarks.maxTotalSales
                        ? 'text-emerald-700 font-extrabold'
                        : exec.totalSalesValue === benchmarks.minTotalSales
                        ? 'text-red-600'
                        : 'text-[#111827]'
                    }`}
                  >
                    {formatCurrency(exec.totalSalesValue)}
                  </span>
                </div>

                {/* 7. Active Sales Value */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Active Sales Value</span>
                  <span
                    className={`font-mono font-bold ${
                      exec.activeSalesValue === benchmarks.maxActiveSales
                        ? 'text-emerald-700 font-extrabold'
                        : exec.activeSalesValue === benchmarks.minActiveSales
                        ? 'text-red-600'
                        : 'text-[#0B9BC5]'
                    }`}
                  >
                    {formatCurrency(exec.activeSalesValue)}
                  </span>
                </div>

                {/* 8. Amount Collected */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Amount Collected</span>
                  <span
                    className={`font-mono font-bold ${
                      exec.amountCollected === benchmarks.maxCollected
                        ? 'text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded'
                        : exec.amountCollected === benchmarks.minCollected
                        ? 'text-red-600'
                        : 'text-[#08C565]'
                    }`}
                  >
                    {formatCurrency(exec.amountCollected)}
                  </span>
                </div>

                {/* 9. Pending Amount */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Pending Amount</span>
                  <span
                    className={`font-mono font-bold ${
                      exec.pendingAmount === benchmarks.minPending
                        ? 'text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded'
                        : exec.pendingAmount === benchmarks.maxPending
                        ? 'text-red-600'
                        : 'text-[#F59E0B]'
                    }`}
                  >
                    {formatCurrency(exec.pendingAmount)}
                  </span>
                </div>

                {/* 10. Collection % */}
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Collection %</span>
                  <span
                    className={`font-mono font-bold ${
                      exec.collectionPercentage === benchmarks.maxCollectionPct
                        ? 'text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded'
                        : exec.collectionPercentage === benchmarks.minCollectionPct
                        ? 'text-red-600'
                        : 'text-[#08C565]'
                    }`}
                  >
                    {formatPercent(exec.collectionPercentage)}
                  </span>
                </div>

                {/* 11. Conversion Rate */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-[#6B7280]">Conversion Rate</span>
                  <span
                    className={`font-mono font-semibold ${
                      exec.conversionRate === benchmarks.maxConversion
                        ? 'text-emerald-700 font-bold'
                        : exec.conversionRate === benchmarks.minConversion
                        ? 'text-red-600'
                        : 'text-[#374151]'
                    }`}
                  >
                    {formatPercent(exec.conversionRate)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Grouped Comparison Chart */}
      <div className="ww-card p-4 sm:p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-[#08C565]" />
            <div>
              <h4 className="text-sm font-bold text-[#111827]">
                Executive Comparison Chart
              </h4>
              <p className="text-xs text-[#6B7280]">
                Comparing selected executives visually across financial and collection metrics
              </p>
            </div>
          </div>

          {/* Metric Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#374151]">Compare Metric:</label>
            <select
              value={chartMetric}
              onChange={(e) => setChartMetric(e.target.value as MetricOption)}
              className="py-1.5 px-3 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#08C565]"
            >
              <option value="totalSalesValue">Total Sales Value (₹)</option>
              <option value="amountCollected">Amount Collected (₹)</option>
              <option value="pendingAmount">Pending Amount (₹)</option>
              <option value="collectionPercentage">Collection Percentage (%)</option>
            </select>
          </div>
        </div>

        {/* Grouped Bar Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 50, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis
                type="number"
                stroke="#374151"
                fontSize={11}
                tickFormatter={(val) =>
                  chartMetric === 'collectionPercentage'
                    ? `${val}%`
                    : `₹${(val / 1000).toFixed(0)}K`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#374151"
                fontSize={11}
                fontWeight={600}
                width={95}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name={metricLabels[chartMetric]} fill="#08C565" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={
                      idx === 0
                        ? '#08C565'
                        : idx === 1
                        ? '#0B9BC5'
                        : idx === 2
                        ? '#9333EA'
                        : '#F59E0B'
                    }
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(val: any) =>
                    typeof val === 'number'
                      ? chartMetric === 'collectionPercentage'
                        ? `${val.toFixed(1)}%`
                        : `₹${val >= 100000 ? (val / 100000).toFixed(1) + 'L' : (val / 1000).toFixed(0) + 'K'}`
                      : '0'
                  }
                  className="fill-[#374151] font-mono text-[10px] font-bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
