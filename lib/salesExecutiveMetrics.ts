import { ZohoRecord } from '@/types';

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
 * Calculates Performance Health Score (0-100) based on weighted metrics:
 * Collection % = 30%, Conversion Rate = 25%, Active Learner Ratio = 20%,
 * Pending Penalty = -15%, Dropped Value Penalty = -10%
 */
export function calculateHealthScore(stats: {
  totalLearners: number;
  activeLearners: number;
  totalSalesValue: number;
  amountCollected: number;
  pendingAmount: number;
  droppedValue: number;
  collectionPercentage: number;
  conversionRate: number;
}): { score: number; category: 'Excellent' | 'Good' | 'Average' | 'Needs Attention' } {
  const colScore = Math.min(30, (stats.collectionPercentage / 100) * 30);
  const convScore = Math.min(25, (stats.conversionRate / 100) * 25);

  const activeRatio = stats.totalLearners > 0 ? stats.activeLearners / stats.totalLearners : 0;
  const activeScore = Math.min(20, activeRatio * 20);

  const pendingRatio = stats.totalSalesValue > 0 ? stats.pendingAmount / stats.totalSalesValue : 0;
  const pendingPenalty = Math.min(15, pendingRatio * 15);

  const droppedRatio = stats.totalSalesValue > 0 ? stats.droppedValue / stats.totalSalesValue : 0;
  const droppedPenalty = Math.min(10, droppedRatio * 10);

  const rawScore = colScore + convScore + activeScore - pendingPenalty - droppedPenalty;
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  let category: 'Excellent' | 'Good' | 'Average' | 'Needs Attention' = 'Needs Attention';
  if (score >= 90) category = 'Excellent';
  else if (score >= 75) category = 'Good';
  else if (score >= 60) category = 'Average';

  return { score, category };
}

/**
 * Aggregates live Zoho records per Sales Executive
 */
export function aggregateExecutiveStats(records: ZohoRecord[]): ExecutiveSummaryStats[] {
  const map: Record<string, ExecutiveSummaryStats> = {};

  records.forEach((r) => {
    const exec = r.salesExecutive || 'Unassigned';
    if (!map[exec]) {
      map[exec] = {
        name: exec,
        totalLearners: 0,
        activeLearners: 0,
        onboardedNotActive: 0,
        hold: 0,
        notOnboarded: 0,
        dropped: 0,
        originalSalesValue: 0,
        totalSalesValue: 0,
        activeSalesValue: 0,
        droppedValue: 0,
        amountCollected: 0,
        pendingAmount: 0,
        collectionPercentage: 0,
        conversionRate: 0,
        healthScore: 0,
        healthCategory: 'Needs Attention',
        observations: [],
      };
    }

    const item = map[exec];
    item.totalLearners += r.totalLearners || 0;
    item.activeLearners += r.activeLearners || 0;
    item.onboardedNotActive += r.onboardedNotActive || 0;
    item.hold += r.hold || 0;
    item.notOnboarded += r.notOnboarded || 0;
    item.dropped += r.dropped || 0;

    item.originalSalesValue += r.originalSalesValue || 0;
    item.totalSalesValue += r.totalSalesValue || 0;
    item.activeSalesValue += r.activeSalesValue || 0;
    item.droppedValue += r.droppedValue || 0;
    item.amountCollected += r.amountCollected || 0;
    item.pendingAmount += r.pendingAmount || 0;

    if (r.operationsObservation && r.operationsObservation !== '-') {
      item.observations.push(`[${r.section}]: ${r.operationsObservation}`);
    }
  });

  const result = Object.values(map).map((item) => {
    item.collectionPercentage =
      item.totalSalesValue > 0 ? (item.amountCollected / item.totalSalesValue) * 100 : 0;
    item.conversionRate =
      item.totalLearners > 0 ? (item.activeLearners / item.totalLearners) * 100 : 0;

    const health = calculateHealthScore(item);
    item.healthScore = health.score;
    item.healthCategory = health.category;

    return item;
  });

  // Sort descending by healthScore
  result.sort((a, b) => b.healthScore - a.healthScore);
  return result;
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
