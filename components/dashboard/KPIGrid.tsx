'use client';

import React from 'react';
import { ExecutiveKPIs } from '@/types';
import { KPICard } from './KPICard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent, formatCount, getStaggerClass } from '@/lib/utils';
import {
  Users,
  UserCheck,
  Clock,
  UserMinus,
  UserX,
  UserPlus,
  DollarSign,
  TrendingUp,
  Award,
  AlertTriangle,
  Wallet,
  Percent,
  CheckCircle2,
} from 'lucide-react';

interface KPIGridProps {
  kpis: ExecutiveKPIs;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ kpis }) => {
  return (
    <div className="space-y-8">
      {/* 1. Financial Performance Section */}
      <div>
        <SectionHeader
          icon={<DollarSign className="w-5 h-5" />}
          title="Financial Performance"
          subtitle="Contracted revenue, realized cash collections, and outstanding receivables"
          badgeText="Financial Metrics"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={getStaggerClass(0)}>
            <KPICard
              title="Original Sales Value"
              value={formatCurrency(kpis.originalSalesValue)}
              icon={<DollarSign className="w-5 h-5" />}
              accentColor="blue"
              tooltipText="Total quoted/list price value before discounts or negotiations."
              calculation="Sum of all original quotation amounts across all deals"
              importance="Establishes the gross revenue potential and discount impact visibility"
              subText="Gross quotation baseline"
              trend={{ type: 'neutral', value: 'Quoted' }}
            />
          </div>

          <div className={getStaggerClass(1)}>
            <KPICard
              title="Total Sales Value"
              value={formatCurrency(kpis.totalSalesValue)}
              icon={<TrendingUp className="w-5 h-5" />}
              accentColor="green"
              tooltipText="Net agreed sales contract value across all deals."
              calculation="Sum of final contracted amounts after negotiations and discounts"
              importance="Primary revenue benchmark for business growth tracking"
              subText="Net contracted revenue"
              trend={{ type: 'positive', value: 'Contracted' }}
            />
          </div>

          <div className={getStaggerClass(2)}>
            <KPICard
              title="Active Sales Value"
              value={formatCurrency(kpis.activeSalesValue)}
              icon={<Award className="w-5 h-5" />}
              accentColor="green"
              tooltipText="Contract value from active enrolled learners."
              calculation="Sum of sales value where learner status = Active"
              importance="Shows realized revenue from currently enrolled students"
              subText="Revenue from active students"
              trend={{ type: 'positive', value: 'Active' }}
            />
          </div>

          <div className={getStaggerClass(3)}>
            <KPICard
              title="Dropped Value"
              value={formatCurrency(kpis.droppedValue)}
              icon={<AlertTriangle className="w-5 h-5" />}
              accentColor="rose"
              tooltipText="Revenue lost from dropped learners or lost opportunities."
              calculation="Sum of contract values where learner status = Dropped"
              importance="Quantifies revenue leakage and identifies retention opportunities"
              subText="Lost / cancelled deal value"
              trend={{ type: kpis.droppedValue > 0 ? 'negative' : 'neutral', value: kpis.droppedValue > 0 ? 'Risk' : 'Zero' }}
            />
          </div>

          <div className={getStaggerClass(4)}>
            <KPICard
              title="Amount Collected"
              value={formatCurrency(kpis.amountCollected)}
              icon={<Wallet className="w-5 h-5" />}
              accentColor="green"
              tooltipText="Total realized cash collected from clients and learners."
              calculation="Sum of all payment amounts received across deals"
              importance="Measures actual cash realization and business liquidity"
              subText="Realized cash in hand"
              trend={{ type: 'positive', value: 'Collected' }}
            />
          </div>

          <div className={getStaggerClass(5)}>
            <KPICard
              title="Pending Amount"
              value={formatCurrency(kpis.pendingAmount)}
              icon={<Clock className="w-5 h-5" />}
              accentColor="amber"
              tooltipText="Outstanding unpaid balance across active & booked deals."
              calculation="Total Sales Value − Amount Collected"
              importance="Drives collection follow-up urgency and cash flow planning"
              subText="Outstanding receivables"
              trend={{ type: kpis.pendingAmount > 0 ? 'negative' : 'positive', value: kpis.pendingAmount > 0 ? 'Due' : 'Clear' }}
            />
          </div>

          <div className={getStaggerClass(6)}>
            <KPICard
              title="Collection %"
              value={formatPercent(kpis.collectionPercentage)}
              icon={<Percent className="w-5 h-5" />}
              accentColor="blue"
              tooltipText="Ratio of cash collected versus total contracted sales value."
              calculation="(Amount Collected ÷ Total Sales Value) × 100"
              importance="Key efficiency indicator — target is ≥50% for operational health"
              subText={`${formatCurrency(kpis.amountCollected)} of ${formatCurrency(kpis.totalSalesValue)}`}
              progressValue={kpis.collectionPercentage}
              trend={{
                type: kpis.collectionPercentage >= 50 ? 'positive' : 'negative',
                value: formatPercent(kpis.collectionPercentage, 0),
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Learner Performance Section */}
      <div>
        <SectionHeader
          icon={<Users className="w-5 h-5" />}
          title="Learner Performance"
          subtitle="Technician student volume, active enrollment, and conversion health"
          badgeText="Student Metrics"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={getStaggerClass(0)}>
            <KPICard
              title="Total Learners"
              value={formatCount(kpis.totalLearners)}
              icon={<Users className="w-5 h-5" />}
              accentColor="blue"
              tooltipText="Total number of registered technician candidates."
              calculation="Count of all enrolled learners across all statuses"
              importance="Base metric for market penetration and enrollment volume"
              subText="Total student volume"
              trend={{ type: 'neutral', value: 'Total' }}
            />
          </div>

          <div className={getStaggerClass(1)}>
            <KPICard
              title="Active Learners"
              value={formatCount(kpis.activeLearners)}
              icon={<UserCheck className="w-5 h-5" />}
              accentColor="green"
              tooltipText="Learners currently attending training modules."
              calculation="Count of learners with status = Active"
              importance="Directly correlates with revenue realization and delivery capacity"
              subText="In-session active students"
              trend={{ type: 'positive', value: 'Active' }}
            />
          </div>

          <div className={getStaggerClass(2)}>
            <KPICard
              title="Onboarded - Not Active"
              value={formatCount(kpis.onboardedNotActive)}
              icon={<Clock className="w-5 h-5" />}
              accentColor="blue"
              tooltipText="Technicians registered awaiting batch launch date."
              calculation="Count of learners registered but not yet in active batch"
              importance="Pipeline of future active learners — tracks onboarding efficiency"
              subText="Registered for upcoming batch"
              trend={{ type: 'neutral', value: 'Pending' }}
            />
          </div>

          <div className={getStaggerClass(3)}>
            <KPICard
              title="Hold"
              value={formatCount(kpis.holdLearners)}
              icon={<UserMinus className="w-5 h-5" />}
              accentColor="amber"
              tooltipText="Learners who paused their training program."
              calculation="Count of learners with status = Hold"
              importance="At-risk cohort requiring proactive follow-up to prevent dropout"
              subText="Temporarily paused candidates"
              trend={{ type: kpis.holdLearners > 0 ? 'negative' : 'neutral', value: 'Paused' }}
            />
          </div>

          <div className={getStaggerClass(4)}>
            <KPICard
              title="Not On-boarded"
              value={formatCount(kpis.notOnboarded)}
              icon={<UserPlus className="w-5 h-5" />}
              accentColor="blue"
              tooltipText="Leads or inquiries in pipeline prior to onboarding."
              calculation="Count of prospects not yet onboarded to any program"
              importance="Conversion funnel metric — shows onboarding gap to close"
              subText="Pre-onboarding prospects"
              trend={{ type: 'neutral', value: 'Prospects' }}
            />
          </div>

          <div className={getStaggerClass(5)}>
            <KPICard
              title="Dropped"
              value={formatCount(kpis.droppedLearners)}
              icon={<UserX className="w-5 h-5" />}
              accentColor="rose"
              tooltipText="Learners who cancelled or discontinued training."
              calculation="Count of learners with status = Dropped"
              importance="Retention failure indicator — each drop represents lost revenue"
              subText="Discontinued learners"
              trend={{ type: kpis.droppedLearners > 0 ? 'negative' : 'positive', value: 'Loss' }}
            />
          </div>

          <div className={getStaggerClass(6)}>
            <KPICard
              title="Conversion Rate"
              value={formatPercent(kpis.avgConversionRate)}
              icon={<CheckCircle2 className="w-5 h-5" />}
              accentColor="green"
              tooltipText="Percentage of total learners active in training programs."
              calculation="(Active Learners ÷ Total Learners) × 100"
              importance="Funnel health metric — target ≥40% for sustainable growth"
              subText="Active learner ratio"
              progressValue={kpis.avgConversionRate}
              trend={{
                type: kpis.avgConversionRate >= 40 ? 'positive' : 'negative',
                value: formatPercent(kpis.avgConversionRate, 0),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
