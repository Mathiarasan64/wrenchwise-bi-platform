import { ZohoRecord } from '@/types';
import { calculateCentralizedMetrics, calculateExecutiveHealthScore } from './calculationEngine';

export { calculateExecutiveHealthScore as calculateHealthScore };

export interface ExecutiveSummaryStats {
  name: string;
  totalLearners: number;
  activeLearners: number;
  onboardedNotActive: number;
  hold: number;
  notOnboarded: number;
  dropped: number;
  originalSalesValue: number;
  totalSalesValue: number;
  activeSalesValue: number;
  droppedValue: number;
  amountCollected: number;
  pendingAmount: number;
  collectionPercentage: number;
  conversionRate: number;
  healthScore: number;
  healthCategory: 'Excellent' | 'Good' | 'Average' | 'Needs Attention';
  observations: string[];
}

/**
 * Aggregates live records per Sales Executive using the centralized calculation engine
 */
export function aggregateExecutiveStats(records: ZohoRecord[]): ExecutiveSummaryStats[] {
  const m = calculateCentralizedMetrics(records);
  return m.executives.map((e) => ({
    name: e.name,
    totalLearners: e.totalLearners,
    activeLearners: e.activeLearners,
    onboardedNotActive: e.onboardedNotActive,
    hold: e.holdLearners,
    notOnboarded: e.notOnboarded,
    dropped: e.droppedLearners,
    originalSalesValue: e.originalSales,
    totalSalesValue: e.contractedSales,
    activeSalesValue: e.activeRevenue,
    droppedValue: e.droppedValue,
    amountCollected: e.collectedAmount,
    pendingAmount: e.pendingAmount,
    collectionPercentage: e.collectionPercentage,
    conversionRate: e.conversionRate,
    healthScore: e.healthScore,
    healthCategory: e.healthCategory,
    observations: e.observations,
  }));
}

/**
 * Data-driven Action Recommendations generator
 */
export interface ActionRecommendation {
  id: string;
  type: 'urgent' | 'warning' | 'opportunity' | 'success';
  title: string;
  targetExecutive: string;
  metric: string;
  description: string;
  recommendedAction: string;
}

export function generateActionRecommendations(execStats: ExecutiveSummaryStats[]): ActionRecommendation[] {
  const recommendations: ActionRecommendation[] = [];

  execStats.forEach((exec, idx) => {
    // 1. High Pending Amount recommendation
    if (exec.pendingAmount > 100000) {
      recommendations.push({
        id: `rec-pending-${idx}`,
        type: 'urgent',
        title: 'Outstanding Collection Follow-up Required',
        targetExecutive: exec.name,
        metric: `₹${exec.pendingAmount.toLocaleString('en-IN')} Pending`,
        description: `${exec.name} has ₹${exec.pendingAmount.toLocaleString(
          'en-IN'
        )} in unpaid receivables (${(100 - exec.collectionPercentage).toFixed(1)}% uncollected).`,
        recommendedAction: 'Schedule an immediate payment reminder push and establish clear installment milestones.',
      });
    }

    // 2. High Dropped Count recommendation
    if (exec.dropped > 0) {
      recommendations.push({
        id: `rec-dropped-${idx}`,
        type: 'warning',
        title: 'Learner Retention & Exit Audit',
        targetExecutive: exec.name,
        metric: `${exec.dropped} Dropped Learner(s)`,
        description: `${exec.name} has ${exec.dropped} dropped learner(s) accounting for ₹${exec.droppedValue.toLocaleString(
          'en-IN'
        )} lost revenue.`,
        recommendedAction: 'Conduct exit interview review to identify drop-off root causes and offer batch transfer options.',
      });
    }

    // 3. Low Conversion Rate recommendation
    if (exec.totalLearners >= 2 && exec.conversionRate < 35) {
      recommendations.push({
        id: `rec-conv-${idx}`,
        type: 'opportunity',
        title: 'Onboarding & Demo Engagement Push',
        targetExecutive: exec.name,
        metric: `${exec.conversionRate.toFixed(1)}% Conversion Rate`,
        description: `${exec.name} currently converts only ${exec.activeLearners} of ${exec.totalLearners} assigned candidates into active learners.`,
        recommendedAction: 'Provide hands-on onboarding support, workshop orientation, and demo session invites.',
      });
    }

    // 4. Star Performer commendation
    if (exec.healthScore >= 85) {
      recommendations.push({
        id: `rec-star-${idx}`,
        type: 'success',
        title: 'High Performer Mentorship Role',
        targetExecutive: exec.name,
        metric: `${exec.healthScore}/100 Health Score`,
        description: `${exec.name} maintains an outstanding health score of ${exec.healthScore}/100 with ${exec.activeLearners} active learners.`,
        recommendedAction: 'Leverage best practices from this executive across the team and allocate high-priority inbound leads.',
      });
    }
  });

  return recommendations;
}
