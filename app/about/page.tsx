'use client';

import React from 'react';
import { useZohoData } from '@/context/DataContext';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import { WrenchWiseLogo } from '@/components/common/WrenchWiseLogo';
import {
  Info,
  Database,
  RefreshCw,
  Clock,
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  UserCheck,
  Wrench,
  FileSpreadsheet,
  Lightbulb,
  Calculator,
  Heart,
  Shield,
} from 'lucide-react';

const MODULES = [
  {
    name: 'Executive Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    color: 'text-[#08C565] bg-emerald-50 border-emerald-100',
    description: 'High-level business overview with 14 KPI cards, business insights, performance charts, and data tables.',
  },
  {
    name: 'Revenue Analytics',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'text-[#0B9BC5] bg-sky-50 border-sky-100',
    description: 'Financial revenue breakdown, training program course yields, and monthly revenue trend analysis.',
  },
  {
    name: 'Learner 360°',
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    description: 'Complete learner CRM profile with financial overview, learning journey timeline, risk assessment, and payment analytics.',
  },
  {
    name: 'Sales Executive Intelligence',
    icon: <UserCheck className="w-4 h-4" />,
    color: 'text-[#08C565] bg-emerald-50 border-emerald-100',
    description: 'Performance analytics with dynamic Health Scores (0–100), leaderboards, comparison tools, and operational insights.',
  },
  {
    name: 'Operations MIS',
    icon: <Wrench className="w-4 h-4" />,
    color: 'text-[#0B9BC5] bg-sky-50 border-sky-100',
    description: 'Real-time operations management, pending collection follow-up, candidate hold tracking, and task priorities.',
  },
  {
    name: 'Reports & Export',
    icon: <FileSpreadsheet className="w-4 h-4" />,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    description: '6 pre-built report categories with CSV, Excel, and PDF export. Includes column toggles, filters, and audit log.',
  },
  {
    name: 'Business Insights',
    icon: <Lightbulb className="w-4 h-4" />,
    color: 'text-[#08C565] bg-emerald-50 border-emerald-100',
    description: 'CEO briefing, health score breakdown, root cause analysis, what-if simulation, alert center, and AI-driven insights.',
  },
];

const KPI_DEFINITIONS = [
  { name: 'Total Learners', formula: 'Count of all enrolled learners across all statuses', context: 'Base metric for enrollment volume' },
  { name: 'Active Learners', formula: 'Count of learners with status = Active', context: 'Revenue-generating student base' },
  { name: 'Onboarded - Not Active', formula: 'Registered learners awaiting batch launch', context: 'Future active learner pipeline' },
  { name: 'Hold Learners', formula: 'Count of learners with status = Hold', context: 'At-risk cohort for follow-up' },
  { name: 'Not On-boarded', formula: 'Leads in pipeline before onboarding', context: 'Conversion gap metric' },
  { name: 'Dropped Learners', formula: 'Count of learners who discontinued', context: 'Retention failure indicator' },
  { name: 'Original Sales Value', formula: 'Sum of all original quotation amounts', context: 'Gross revenue potential' },
  { name: 'Total Sales Value', formula: 'Sum of final contracted amounts', context: 'Primary revenue benchmark' },
  { name: 'Active Sales Value', formula: 'Sum of contract values for active learners', context: 'Realized revenue from active students' },
  { name: 'Dropped Value', formula: 'Sum of contract values for dropped learners', context: 'Revenue leakage quantification' },
  { name: 'Amount Collected', formula: 'Sum of all payments received', context: 'Actual cash realization' },
  { name: 'Pending Amount', formula: 'Total Sales Value − Amount Collected', context: 'Outstanding receivable balance' },
  { name: 'Collection %', formula: '(Amount Collected ÷ Total Sales Value) × 100', context: 'Cash efficiency — target ≥50%' },
  { name: 'Conversion Rate', formula: '(Active Learners ÷ Total Learners) × 100', context: 'Funnel health — target ≥40%' },
];

const HEALTH_SCORE_COMPONENTS = [
  { component: 'Collection Efficiency', weight: '35%', formula: '(Collection% ÷ 100) × 35', color: 'text-[#08C565]' },
  { component: 'Conversion Rate', weight: '25%', formula: '(ConversionRate ÷ 100) × 25', color: 'text-[#0B9BC5]' },
  { component: 'Active Ratio', weight: '20%', formula: '(ActiveLearners ÷ Total) × 20', color: 'text-purple-600' },
  { component: 'Pending Penalty', weight: '-10%', formula: '(PendingAmount ÷ TotalSales) × 10', color: 'text-amber-600' },
  { component: 'Dropped Penalty', weight: '-10%', formula: '(DroppedValue ÷ TotalSales) × 10', color: 'text-rose-600' },
];

export default function AboutDashboardPage() {
  const { lastSync } = useZohoData();

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <WrenchWiseLogo showTagline={true} size="lg" />
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#08C565] font-bold text-xs">
            Official Wrench Wise BI Portal
          </span>
        </div>
      </div>

      {/* Platform Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover-lift shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#08C565]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Version</span>
          </div>
          <div className="text-xl font-black text-[#08C565] font-mono">v1.0.0-live</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Production Release</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover-lift shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-[#0B9BC5]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Data Source</span>
          </div>
          <div className="text-xl font-black text-[#0B9BC5]">Zoho Sheet CSV</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Live published spreadsheet</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover-lift shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Sync</span>
          </div>
          <div className="text-xl font-black text-amber-600" suppressHydrationWarning>{formatRelativeTime(lastSync)}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {lastSync ? formatDateTime(lastSync) : 'Not synced yet'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover-lift shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-[#08C565]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Refresh</span>
          </div>
          <div className="text-xl font-black text-slate-900">Manual</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Click Refresh in header to sync</div>
        </div>
      </div>

      {/* Company Branding Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          Company Branding & Core Identity
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Wrench Wise is committed to engineering excellence, operational efficiency, and candidate career transformation.
          This internal BI portal provides real-time transparency into B2C operations, candidate lifecycles, and financial metrics.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#08C565]" />
            <span className="text-xs font-bold text-slate-800">Primary Green (#08C565)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#0B9BC5]" />
            <span className="text-xs font-bold text-slate-800">Primary Blue (#0B9BC5)</span>
          </div>
        </div>
      </div>

      {/* Module Descriptions */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-[#08C565]" />
          Analytics Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map((mod) => (
            <div key={mod.name} className="bg-white border border-gray-200 rounded-2xl p-4 hover-lift shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-1.5 rounded-lg border ${mod.color}`}>
                  {mod.icon}
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">{mod.name}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{mod.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Definitions */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#0B9BC5]" />
          KPI Definitions
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="ww-table">
              <thead>
                <tr>
                  <th>KPI Name</th>
                  <th>Formula / Calculation</th>
                  <th>Business Context</th>
                </tr>
              </thead>
              <tbody>
                {KPI_DEFINITIONS.map((kpi) => (
                  <tr key={kpi.name}>
                    <td className="font-extrabold text-slate-900">{kpi.name}</td>
                    <td className="font-mono text-[#0B9BC5] text-[11px] font-bold">{kpi.formula}</td>
                    <td className="text-slate-600 font-medium">{kpi.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Business Health Score Formula */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#08C565]" />
          Business Health Score Formula
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
          <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
            The Business Health Score (0–100) is a composite metric that measures overall operational health.
            It combines collection efficiency, conversion rate, and active learner ratio, minus penalties for pending amounts and dropped value.
          </p>

          <div className="space-y-3">
            {HEALTH_SCORE_COMPONENTS.map((comp) => (
              <div key={comp.component} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                <div className="w-36 shrink-0">
                  <span className={`text-xs font-bold ${comp.color}`}>{comp.component}</span>
                </div>
                <div className="w-16 shrink-0">
                  <span className="text-xs font-bold text-slate-800 font-mono">{comp.weight}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-slate-600 font-mono font-medium">{comp.formula}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-xs text-[#08C565] font-mono font-bold">
              Health Score = Collection + Conversion + Active − Pending Penalty − Dropped Penalty
            </p>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Clamped to range [0, 100]. Categories: Excellent (≥90), Good (≥75), Average (≥60), Critical (&lt;60)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
