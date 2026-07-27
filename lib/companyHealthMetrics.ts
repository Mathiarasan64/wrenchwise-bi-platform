import { ZohoRecord } from '@/types';
import { aggregateExecutiveStats, ExecutiveSummaryStats } from './salesExecutiveMetrics';

export interface CompanyHealthResult {
  score: number;
  category: 'Excellent' | 'Good' | 'Average' | 'Critical';
  collectionContribution: number;
  conversionContribution: number;
  activeContribution: number;
  pendingPenalty: number;
  droppedPenalty: number;
}

export function calculateCompanyHealth(
  totalSalesValue: number,
  amountCollected: number,
  pendingAmount: number,
  droppedValue: number,
  totalLearners: number,
  activeLearners: number
): CompanyHealthResult {
  const collectionPct = totalSalesValue > 0 ? (amountCollected / totalSalesValue) * 100 : 0;
  const conversionRate = totalLearners > 0 ? (activeLearners / totalLearners) * 100 : 0;
  const activeRatio = totalLearners > 0 ? activeLearners / totalLearners : 0;

  const collectionContribution = Math.min(35, (collectionPct / 100) * 35);
  const conversionContribution = Math.min(25, (conversionRate / 100) * 25);
  const activeContribution = Math.min(20, activeRatio * 20);

  const pendingRatio = totalSalesValue > 0 ? pendingAmount / totalSalesValue : 0;
  const pendingPenalty = Math.min(10, pendingRatio * 10);

  const droppedRatio = totalSalesValue > 0 ? droppedValue / totalSalesValue : 0;
  const droppedPenalty = Math.min(10, droppedRatio * 10);

  const rawScore =
    collectionContribution +
    conversionContribution +
    activeContribution -
    pendingPenalty -
    droppedPenalty;

  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  let category: 'Excellent' | 'Good' | 'Average' | 'Critical' = 'Critical';
  if (score >= 90) category = 'Excellent';
  else if (score >= 75) category = 'Good';
  else if (score >= 60) category = 'Average';

  return {
    score,
    category,
    collectionContribution,
    conversionContribution,
    activeContribution,
    pendingPenalty,
    droppedPenalty,
  };
}

export interface PriorityAlert {
  id: string;
  severity: 'critical' | 'warning' | 'healthy';
  title: string;
  message: string;
  metric: string;
}

export function generatePriorityAlerts(
  pendingAmount: number,
  collectionPct: number,
  droppedLearners: number,
  droppedValue: number,
  execStats: ExecutiveSummaryStats[]
): PriorityAlert[] {
  const alerts: PriorityAlert[] = [];

  // Critical Alert
  if (pendingAmount > 100000) {
    alerts.push({
      id: 'alert-pending-critical',
      severity: 'critical',
      title: 'Critical Outstanding Receivables Threshold',
      message: `Total uncollected receivables stand at ₹${pendingAmount.toLocaleString(
        'en-IN'
      )}. Immediate management intervention and collection drive required.`,
      metric: `₹${pendingAmount.toLocaleString('en-IN')} Pending`,
    });
  }

  // Warning Alert - Low Collection
  if (collectionPct < 40) {
    alerts.push({
      id: 'alert-collection-warning',
      severity: 'warning',
      title: 'Collection Efficiency Below Target',
      message: `Current realization rate is ${collectionPct.toFixed(
        1
      )}%, below the 50% target milestone across active contracts.`,
      metric: `${collectionPct.toFixed(1)}% Realized`,
    });
  }

  // Warning Alert - Dropped Learners
  if (droppedLearners > 0) {
    alerts.push({
      id: 'alert-dropped-warning',
      severity: 'warning',
      title: 'Revenue Leakage from Dropped Candidates',
      message: `${droppedLearners} dropped candidate(s) resulted in ₹${droppedValue.toLocaleString(
        'en-IN'
      )} in lost contract value.`,
      metric: `${droppedLearners} Dropped (₹${droppedValue.toLocaleString('en-IN')})`,
    });
  }

  // Healthy Alert
  if (collectionPct >= 50) {
    alerts.push({
      id: 'alert-healthy-collection',
      severity: 'healthy',
      title: 'Healthy Realized Cash Ratio',
      message: `Cash collection efficiency of ${collectionPct.toFixed(
        1
      )}% meets operational benchmarks.`,
      metric: `${collectionPct.toFixed(1)}% Collection Ratio`,
    });
  }

  // Additional Exec Warning
  const lowExecs = execStats.filter((e) => e.healthScore < 60);
  if (lowExecs.length > 0) {
    alerts.push({
      id: 'alert-exec-critical',
      severity: 'critical',
      title: 'Executive Performance Intervention Required',
      message: `${lowExecs.length} representative(s) (${lowExecs
        .map((e) => e.name)
        .join(', ')}) require direct coaching and pending collection follow-up.`,
      metric: `${lowExecs.length} Execs Critical`,
    });
  }

  return alerts;
}

export function getTopAndBottomExecutives(records: ZohoRecord[]): {
  top5: ExecutiveSummaryStats[];
  bottom5: ExecutiveSummaryStats[];
} {
  const aggregated = aggregateExecutiveStats(records);
  const sorted = [...aggregated].sort((a, b) => b.healthScore - a.healthScore);

  const top5 = sorted.slice(0, 5);
  const bottom5 = [...sorted].reverse().slice(0, 5);

  return { top5, bottom5 };
}
