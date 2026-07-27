'use client';

import React, { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { calculateExecutiveKPIs } from '@/lib/metrics';
import { calculateCompanyHealth, generatePriorityAlerts } from '@/lib/companyHealthMetrics';
import { aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import { FilterBar } from '@/components/filters/FilterBar';
import { KPIGrid } from '@/components/dashboard/KPIGrid';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { BusinessInsights } from '@/components/dashboard/BusinessInsights';
import { EnhancedDataTable } from '@/components/dashboard/EnhancedDataTable';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { formatCurrency, formatPercent, formatCount, formatRelativeTime } from '@/lib/utils';
import {
  LayoutDashboard,
  Heart,
  TrendingUp,
  Wallet,
  Users,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  FileSpreadsheet,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function ExecutiveDashboard() {
  const { error, refetchData, records, filteredRecords, isLoading, lastSync } = useZohoData();

  // Compute KPIs from filtered records
  const kpis = useMemo(() => calculateExecutiveKPIs(filteredRecords), [filteredRecords]);

  // Executive stats for alerts
  const execStats = useMemo(() => aggregateExecutiveStats(filteredRecords), [filteredRecords]);

  // Business Health Score
  const health = useMemo(() => {
    return calculateCompanyHealth(
      kpis.totalSalesValue,
      kpis.amountCollected,
      kpis.pendingAmount,
      kpis.droppedValue,
      kpis.totalLearners,
      kpis.activeLearners
    );
  }, [kpis]);

  // Priority Alerts
  const alerts = useMemo(() => {
    return generatePriorityAlerts(
      kpis.pendingAmount,
      kpis.collectionPercentage,
      kpis.droppedLearners,
      kpis.droppedValue,
      execStats
    );
  }, [kpis, execStats]);

  // Loading state
  if (isLoading && filteredRecords.length === 0) {
    return <PageSkeleton />;
  }

  const healthColorMap = {
    Excellent: { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', badge: 'badge-success' },
    Good: { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', badge: 'badge-info' },
    Average: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', badge: 'badge-warning' },
    Critical: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', badge: 'badge-danger' },
  };

  const hc = healthColorMap[health.category] || healthColorMap.Average;

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      {/* Executive Command Center */}
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200 shrink-0">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-normal text-[#111827] leading-[1.3]">
                Executive Command Center
              </h1>
              <p className="text-sm text-[#6B7280] font-normal leading-[1.6] mt-0.5">
                Real-time business performance powered by live Zoho Sheet data
                <span className="text-[#9CA3AF] mx-1.5">•</span>
                <span className="text-[#6B7280] font-mono text-xs" suppressHydrationWarning>Synced {formatRelativeTime(lastSync)}</span>
              </p>
            </div>
            <BusinessVerticalBadge />
          </div>
        </div>

        {/* Connection Error */}
        {error && <ErrorAlert message={error} onRetry={refetchData} />}

        {/* ─── Business Health + Top Metrics Row ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Business Health Score Card */}
          <div className="ww-card p-5 hover-lift flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${hc.text}`} />
                <span className="text-sm font-semibold text-[#374151]">
                  Business Health
                </span>
              </div>
              <span className={hc.badge}>
                {health.category}
              </span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-extrabold font-mono ${hc.text}`}>
                  {health.score}
                </span>
                <span className="text-sm font-medium text-[#6B7280]">/100</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  health.score >= 75 ? 'bg-[#08C565]' : health.score >= 60 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'
                }`}
                style={{ width: `${health.score}%` }}
              />
            </div>
          </div>

          {/* Top 3 Priority KPIs */}
          <div className="ww-card p-5 hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#08C565]" />
              <span className="text-sm font-semibold text-[#374151]">Total Revenue</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#111827]">
              {formatCurrency(kpis.totalSalesValue)}
            </div>
            <div className="text-xs text-[#6B7280] mt-1.5 font-normal leading-[1.6]">Net contracted sales value</div>
          </div>

          <div className="ww-card p-5 hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-[#08C565]" />
              <span className="text-sm font-semibold text-[#374151]">Collection %</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#08C565]">
              {formatPercent(kpis.collectionPercentage)}
            </div>
            <div className="text-xs text-[#6B7280] mt-1.5 font-normal leading-[1.6]">{formatCurrency(kpis.amountCollected)} collected</div>
          </div>

          <div className="ww-card p-5 hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#0B9BC5]" />
              <span className="text-sm font-semibold text-[#374151]">Active Learners</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-[#0B9BC5]">
              {formatCount(kpis.activeLearners)}
            </div>
            <div className="text-xs text-[#6B7280] mt-1.5 font-normal leading-[1.6]">of {formatCount(kpis.totalLearners)} total</div>
          </div>
        </div>

        {/* ─── Priority Alerts ─── */}
        {alerts.length > 0 && (
          <div className="ww-card p-5">
            <h3 className="text-base font-semibold text-[#111827] mb-3 flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              Priority Alerts
            </h3>
            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${
                    alert.severity === 'critical'
                      ? 'bg-[#FEE2E2] border-red-200 text-[#991B1B]'
                      : alert.severity === 'warning'
                      ? 'bg-[#FEF3C7] border-amber-200 text-[#92400E]'
                      : 'bg-[#DCFCE7] border-emerald-200 text-[#166534]'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                    ) : alert.severity === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs leading-[1.3]">{alert.title}</div>
                    <div className="text-xs mt-1 leading-[1.6] font-normal">{alert.message}</div>
                  </div>
                  <span className="text-xs font-semibold font-mono shrink-0 px-2.5 py-1 rounded-lg bg-white border border-[#E5E7EB]">
                    {alert.metric}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Executive Summary + Quick Links ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Summary */}
          <div className="lg:col-span-2 ww-card p-5">
            <h3 className="text-base font-semibold text-[#111827] mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Info className="w-4 h-4 text-[#08C565]" />
              Executive Summary
            </h3>
            <p className="text-sm text-[#374151] leading-[1.6] font-normal">
              The platform is tracking{' '}
              <strong className="text-[#0B9BC5] font-semibold">{formatCount(kpis.totalLearners)} learners</strong> across{' '}
              <strong className="text-[#0B9BC5] font-semibold">{execStats.length} sales executives</strong> with a total contracted
              revenue of <strong className="text-[#08C565] font-semibold">{formatCurrency(kpis.totalSalesValue)}</strong>.
              Collection efficiency stands at{' '}
              <strong className={kpis.collectionPercentage >= 50 ? 'text-[#08C565] font-semibold' : 'text-[#F59E0B] font-semibold'}>
                {formatPercent(kpis.collectionPercentage)}
              </strong>{' '}
              with <strong className="text-[#F59E0B] font-semibold">{formatCurrency(kpis.pendingAmount)}</strong> in outstanding
              receivables.
              {kpis.droppedLearners > 0 && (
                <> Revenue leakage from <strong className="text-[#DC2626] font-semibold">{formatCount(kpis.droppedLearners)} dropped learners</strong> accounts
                for <strong className="text-[#DC2626] font-semibold">{formatCurrency(kpis.droppedValue)}</strong> in lost contract value.</>
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="ww-card p-5">
            <h3 className="text-base font-semibold text-[#111827] mb-3 uppercase tracking-wider">Quick Access</h3>
            <div className="space-y-2">
              {[
                { href: '/reports', icon: <FileSpreadsheet className="w-4 h-4 text-[#F59E0B]" />, label: 'Reports & Export' },
                { href: '/insights', icon: <Lightbulb className="w-4 h-4 text-[#08C565]" />, label: 'Business Insights' },
                { href: '/operations', icon: <AlertTriangle className="w-4 h-4 text-[#0B9BC5]" />, label: 'Operations MIS' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-[#F3F4F6] text-[#374151] hover:text-[#111827] transition-all group text-sm font-medium border border-transparent hover:border-[#E5E7EB]"
                >
                  {link.icon}
                  <span className="flex-1">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#08C565] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTIONS */}
      <FilterBar />
      {filteredRecords.length === 0 && !isLoading ? (
        <EmptyVerticalState />
      ) : (
        <>
          <KPIGrid kpis={kpis} />
          <BusinessInsights records={filteredRecords} />
          <ChartsSection records={filteredRecords} />
          <EnhancedDataTable records={filteredRecords} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}
