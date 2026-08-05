import { ZohoRecord, ExecutiveKPIs, BusinessInsightSummary } from '@/types';
import { calculateCentralizedMetrics } from './calculationEngine';

/**
 * Computes all 14 Executive Dashboard KPI card metrics using the centralized engine
 */
export function calculateExecutiveKPIs(records: ZohoRecord[]): ExecutiveKPIs {
  const m = calculateCentralizedMetrics(records);
  return {
    totalLearners: m.learners.totalLearners,
    activeLearners: m.learners.activeLearners,
    onboardedNotActive: m.learners.onboardedNotActive,
    holdLearners: m.learners.holdLearners,
    notOnboarded: m.learners.notOnboarded,
    droppedLearners: m.learners.droppedLearners,
    originalSalesValue: m.financial.originalSalesValue,
    totalSalesValue: m.financial.totalSalesValue,
    activeSalesValue: m.financial.activeSalesValue,
    droppedValue: m.financial.droppedValue,
    amountCollected: m.financial.amountCollected,
    pendingAmount: m.financial.pendingAmount,
    collectionPercentage: m.financial.collectionPercentage,
    avgConversionRate: m.learners.conversionRate,
  };
}

/**
 * Computes chart data structures for Recharts using the centralized engine
 */
export function prepareChartData(records: ZohoRecord[]) {
  const m = calculateCentralizedMetrics(records);
  return m.charts;
}

/**
 * Generates automated Business Insights summary cards using the centralized engine
 */
export function generateBusinessInsights(records: ZohoRecord[]): BusinessInsightSummary {
  const m = calculateCentralizedMetrics(records);

  if (m.executives.length === 0) {
    return {
      highestRevenueExecutive: { name: 'N/A', value: 0 },
      highestCollectionPercentage: { name: 'N/A', percentage: 0 },
      highestPendingAmount: { name: 'N/A', amount: 0 },
      bestConversionRate: { name: 'N/A', rate: 0 },
      highestActiveLearners: { name: 'N/A', count: 0 },
      revenueLeakage: { totalDropped: 0, affectedDeals: 0 },
      executiveNeedingFollowup: { name: 'N/A', pendingAmount: 0, reason: 'No live records available.' },
    };
  }

  let topRevenueExec = { name: 'N/A', value: 0 };
  let topCollectionExec = { name: 'N/A', percentage: 0 };
  let topPendingExec = { name: 'N/A', amount: 0 };
  let topConversionExec = { name: 'N/A', rate: 0 };
  let topActiveLearnerExec = { name: 'N/A', count: 0 };

  m.executives.forEach((e) => {
    if (e.contractedSales > topRevenueExec.value) topRevenueExec = { name: e.name, value: e.contractedSales };
    if (e.collectionPercentage > topCollectionExec.percentage) topCollectionExec = { name: e.name, percentage: e.collectionPercentage };
    if (e.pendingAmount > topPendingExec.amount) topPendingExec = { name: e.name, amount: e.pendingAmount };
    if (e.conversionRate > topConversionExec.rate) topConversionExec = { name: e.name, rate: e.conversionRate };
    if (e.activeLearners > topActiveLearnerExec.count) topActiveLearnerExec = { name: e.name, count: e.activeLearners };
  });

  const execNeedingFollowup = {
    name: topPendingExec.name,
    pendingAmount: topPendingExec.amount,
    reason: `Highest outstanding pending balance (${topPendingExec.name} has ₹${topPendingExec.amount.toLocaleString(
      'en-IN'
    )} pending collection across assigned candidates).`,
  };

  return {
    highestRevenueExecutive: topRevenueExec,
    highestCollectionPercentage: topCollectionExec,
    highestPendingAmount: topPendingExec,
    bestConversionRate: topConversionExec,
    highestActiveLearners: topActiveLearnerExec,
    revenueLeakage: { totalDropped: m.financial.droppedValue, affectedDeals: m.learners.droppedLearners },
    executiveNeedingFollowup: execNeedingFollowup,
  };
}
