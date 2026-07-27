import { ZohoRecord } from '@/types';
import { calculateCompanyHealth, CompanyHealthResult } from './companyHealthMetrics';
import { aggregateExecutiveStats } from './salesExecutiveMetrics';
import { formatCurrency } from './utils';

export interface CEOBriefingData {
  summaryParagraph: string;
  keyTakeaways: string[];
  healthStatusText: string;
}

export interface DetailedHealthComposition {
  overallScore: number;
  collectionContribution: number;
  revenueContribution: number;
  conversionContribution: number;
  activeLearnerContribution: number;
  pendingPenalty: number;
  droppedPenalty: number;
  revenueLeakagePenalty: number;
}

export interface RootCauseItem {
  id: string;
  question: string;
  rootCause: string;
  supportingData: string;
  recommendation: string;
  targetModule: '/revenue' | '/operations' | '/sales-executive' | '/learners';
}

export interface ExecutiveAlertItem {
  id: string;
  riskType: 'Revenue Risk' | 'Collection Risk' | 'Drop Risk' | 'Hold Risk' | 'Conversion Risk';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  impactText: string;
  suggestedAction: string;
  targetModule: '/revenue' | '/operations' | '/sales-executive' | '/learners';
}

export interface SimulationResult {
  projectedRevenue: number;
  projectedCollection: number;
  projectedPending: number;
  projectedHealthScore: number;
  scoreDelta: number;
  revenueDelta: number;
}

export function generateCEOBriefing(records: ZohoRecord[]): CEOBriefingData {
  let totalRevenue = 0;
  let amountCollected = 0;
  let pendingAmount = 0;
  let totalLearners = 0;
  let activeLearners = 0;
  let droppedLearners = 0;
  let totalOriginal = 0;
  let droppedValue = 0;

  records.forEach((r) => {
    totalRevenue += r.totalSalesValue || 0;
    amountCollected += r.amountCollected || 0;
    pendingAmount += r.pendingAmount || 0;
    totalLearners += r.totalLearners || 0;
    activeLearners += r.activeLearners || 0;
    droppedLearners += r.dropped || 0;
    totalOriginal += r.originalSalesValue || 0;
    droppedValue += r.droppedValue || 0;
  });

  const collectionPct = totalRevenue > 0 ? (amountCollected / totalRevenue) * 100 : 0;
  const conversionRate = totalOriginal > 0 ? (totalRevenue / totalOriginal) * 100 : 0;

  const companyHealth = calculateCompanyHealth(
    totalRevenue,
    amountCollected,
    pendingAmount,
    droppedValue,
    totalLearners,
    activeLearners
  );

  const summaryParagraph = `Wrench Wise Business Intelligence currently tracks ${formatCurrency(
    totalRevenue
  )} in contracted gross sales with realized cash collections standing at ${formatCurrency(
    amountCollected
  )} (${collectionPct.toFixed(
    1
  )}% collection efficiency). Outstanding receivables total ${formatCurrency(
    pendingAmount
  )}. Across learner operations, ${activeLearners} active candidates are undergoing training out of ${totalLearners} total candidates, while ${droppedLearners} candidates have discontinued. Overall conversion rate is ${conversionRate.toFixed(
    1
  )}%, giving Wrench Wise an Executive Health Score of ${companyHealth.score}/100 (${
    companyHealth.category
  }).`;

  const keyTakeaways = [
    `Collection Efficiency sits at ${collectionPct.toFixed(1)}% vs target of 70%.`,
    `Outstanding receivables balance stands at ${formatCurrency(pendingAmount)}.`,
    `Learner retention tracks at ${((activeLearners / (totalLearners || 1)) * 100).toFixed(
      1
    )}% active training engagement.`,
  ];

  return {
    summaryParagraph,
    keyTakeaways,
    healthStatusText: `${companyHealth.category} (${companyHealth.score}/100)`,
  };
}

export function calculateDetailedHealthComposition(
  records: ZohoRecord[]
): DetailedHealthComposition {
  let totalRevenue = 0;
  let amountCollected = 0;
  let pendingAmount = 0;
  let totalLearners = 0;
  let activeLearners = 0;
  let droppedLearners = 0;
  let totalOriginal = 0;
  let droppedValue = 0;

  records.forEach((r) => {
    totalRevenue += r.totalSalesValue || 0;
    amountCollected += r.amountCollected || 0;
    pendingAmount += r.pendingAmount || 0;
    totalLearners += r.totalLearners || 0;
    activeLearners += r.activeLearners || 0;
    droppedLearners += r.dropped || 0;
    totalOriginal += r.originalSalesValue || 0;
    droppedValue += r.droppedValue || 0;
  });

  const collectionPct = totalRevenue > 0 ? (amountCollected / totalRevenue) * 100 : 0;
  const conversionRate = totalOriginal > 0 ? (totalRevenue / totalOriginal) * 100 : 0;
  const activeRatio = totalLearners > 0 ? (activeLearners / totalLearners) * 100 : 0;

  // Contributions (+ points)
  const collectionContribution = Math.min(30, Math.round((collectionPct / 100) * 30));
  const revenueContribution = Math.min(25, Math.round(25 * 0.85)); // 21 pts base
  const conversionContribution = Math.min(25, Math.round((conversionRate / 100) * 25));
  const activeLearnerContribution = Math.min(20, Math.round((activeRatio / 100) * 20));

  // Penalties (- points)
  const pendingRatio = totalRevenue > 0 ? pendingAmount / totalRevenue : 0;
  const pendingPenalty = Math.min(15, Math.round(pendingRatio * 15));

  const droppedRatio = totalLearners > 0 ? droppedLearners / totalLearners : 0;
  const droppedPenalty = Math.min(15, Math.round(droppedRatio * 25));

  const leakageRatio = totalRevenue > 0 ? droppedValue / totalRevenue : 0;
  const revenueLeakagePenalty = Math.min(10, Math.round(leakageRatio * 20));

  const grossScore =
    collectionContribution + revenueContribution + conversionContribution + activeLearnerContribution;
  const totalPenalties = pendingPenalty + droppedPenalty + revenueLeakagePenalty;

  const overallScore = Math.max(0, Math.min(100, grossScore - totalPenalties));

  return {
    overallScore,
    collectionContribution,
    revenueContribution,
    conversionContribution,
    activeLearnerContribution,
    pendingPenalty,
    droppedPenalty,
    revenueLeakagePenalty,
  };
}

export function generateRootCauseAnalysis(records: ZohoRecord[]): RootCauseItem[] {
  const execs = aggregateExecutiveStats(records);
  const lowestColExec = [...execs].sort((a, b) => a.collectionPercentage - b.collectionPercentage)[0];
  const highestPendingExec = [...execs].sort((a, b) => b.pendingAmount - a.pendingAmount)[0];

  let totalDropped = 0;
  let totalOriginal = 0;
  let totalSales = 0;
  records.forEach((r) => {
    totalDropped += r.dropped || 0;
    totalOriginal += r.originalSalesValue || 0;
    totalSales += r.totalSalesValue || 0;
  });

  const conversionPct = totalOriginal > 0 ? (totalSales / totalOriginal) * 100 : 0;

  return [
    {
      id: 'rc-1',
      question: 'Why is the Business Health Score below 80?',
      rootCause: `Driven by outstanding pending receivables of ${formatCurrency(
        highestPendingExec ? highestPendingExec.pendingAmount : 0
      )} held primarily by ${highestPendingExec ? highestPendingExec.name : 'top executives'}.`,
      supportingData: `Pending balance accounts for ${((highestPendingExec ? highestPendingExec.pendingAmount : 0) / (totalSales || 1) * 100).toFixed(
        1
      )}% of overall sales volume.`,
      recommendation: 'Target high-pending accounts with automated milestone reminders.',
      targetModule: '/operations',
    },
    {
      id: 'rc-2',
      question: 'Why is collection efficiency lagging in certain segments?',
      rootCause: `${lowestColExec ? lowestColExec.name : 'Representative'} has a collection efficiency of ${
        lowestColExec ? lowestColExec.collectionPercentage.toFixed(1) : '0'
      }% on a total sales volume of ${formatCurrency(lowestColExec ? lowestColExec.totalSalesValue : 0)}.`,
      supportingData: `Outstanding unpaid balance for this representative is ${formatCurrency(
        lowestColExec ? lowestColExec.pendingAmount : 0
      )}.`,
      recommendation: 'Initiate representative collection audit and mandate upfront enrollment fees.',
      targetModule: '/sales-executive',
    },
    {
      id: 'rc-3',
      question: 'Why are candidate drop-offs occurring?',
      rootCause: `Candidate drop-offs total ${totalDropped} learners, resulting in revenue leakage of ${formatCurrency(
        records.reduce((acc, r) => acc + (r.droppedValue || 0), 0)
      )}.`,
      supportingData: `Dropped candidates represent ${((totalDropped / (records.reduce((acc, r) => acc + (r.totalLearners || 0), 0) || 1)) * 100).toFixed(
        1
      )}% of total enrolled learners.`,
      recommendation: 'Implement pre-onboarding orientation sessions and mid-course retention reviews.',
      targetModule: '/learners',
    },
    {
      id: 'rc-4',
      question: 'Why is conversion rate holding at current levels?',
      rootCause: `Gross quotation volume of ${formatCurrency(totalOriginal)} converted into ${formatCurrency(
        totalSales
      )} contracted sales (${conversionPct.toFixed(1)}% conversion).`,
      supportingData: `Quotation-to-close gap is ${formatCurrency(totalOriginal - totalSales)}.`,
      recommendation: 'Introduce value-proposition follow-ups for high quotation deals.',
      targetModule: '/revenue',
    },
  ];
}

export function generateExecutiveAlerts(records: ZohoRecord[]): ExecutiveAlertItem[] {
  const execs = aggregateExecutiveStats(records);
  const highestPendingExec = [...execs].sort((a, b) => b.pendingAmount - a.pendingAmount)[0];

  return [
    {
      id: 'alt-1',
      riskType: 'Collection Risk',
      severity: 'Critical',
      impactText: `${highestPendingExec ? highestPendingExec.name : 'Executive'} holds ${formatCurrency(
        highestPendingExec ? highestPendingExec.pendingAmount : 0
      )} in unpaid pending balances.`,
      suggestedAction: 'Enforce payment deadline escalation and withhold final certifications.',
      targetModule: '/operations',
    },
    {
      id: 'alt-2',
      riskType: 'Drop Risk',
      severity: 'High',
      impactText: `Dropped learners account for ${records.reduce(
        (acc, r) => acc + (r.dropped || 0),
        0
      )} candidate cancellations.`,
      suggestedAction: 'Conduct exit interviews and offer flexible installment restructuring.',
      targetModule: '/learners',
    },
    {
      id: 'alt-3',
      riskType: 'Revenue Risk',
      severity: 'Medium',
      impactText: `Total revenue leakage from dropped deals stands at ${formatCurrency(
        records.reduce((acc, r) => acc + (r.droppedValue || 0), 0)
      )}.`,
      suggestedAction: 'Review discount approvals and non-refundable deposit terms.',
      targetModule: '/revenue',
    },
    {
      id: 'alt-4',
      riskType: 'Conversion Risk',
      severity: 'Low',
      impactText: `Conversion variance detected across executive cohorts.`,
      suggestedAction: 'Pair low-performing executives with top sales mentors.',
      targetModule: '/sales-executive',
    },
  ];
}

export function simulateScenario(
  records: ZohoRecord[],
  collectionIncreasePct: number, // e.g. 10
  pendingDecreasePct: number, // e.g. 15
  conversionIncreasePct: number // e.g. 5
): SimulationResult {
  let baseRevenue = 0;
  let baseCollection = 0;
  let basePending = 0;

  records.forEach((r) => {
    baseRevenue += r.totalSalesValue || 0;
    baseCollection += r.amountCollected || 0;
    basePending += r.pendingAmount || 0;
  });

  const projectedCollection = baseCollection * (1 + collectionIncreasePct / 100);
  const projectedPending = Math.max(0, basePending * (1 - pendingDecreasePct / 100));
  const projectedRevenue = baseRevenue * (1 + conversionIncreasePct / 100);

  const baseComposition = calculateDetailedHealthComposition(records);

  // Recalculate Health Score with simulated parameters
  const colBoost = Math.min(10, Math.round((collectionIncreasePct / 20) * 10));
  const pendBoost = Math.min(10, Math.round((pendingDecreasePct / 25) * 10));
  const convBoost = Math.min(10, Math.round((conversionIncreasePct / 10) * 10));

  const projectedHealthScore = Math.min(
    100,
    baseComposition.overallScore + colBoost + pendBoost + convBoost
  );

  return {
    projectedRevenue,
    projectedCollection,
    projectedPending,
    projectedHealthScore,
    scoreDelta: projectedHealthScore - baseComposition.overallScore,
    revenueDelta: projectedRevenue - baseRevenue,
  };
}
