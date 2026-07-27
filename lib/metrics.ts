import { ZohoRecord, ExecutiveKPIs, BusinessInsightSummary } from '@/types';

/**
 * Computes all 14 Executive Dashboard KPI card metrics from live Zoho records
 */
export function calculateExecutiveKPIs(records: ZohoRecord[]): ExecutiveKPIs {
  let totalLearners = 0;
  let activeLearners = 0;
  let onboardedNotActive = 0;
  let holdLearners = 0;
  let notOnboarded = 0;
  let droppedLearners = 0;

  let originalSalesValue = 0;
  let totalSalesValue = 0;
  let activeSalesValue = 0;
  let droppedValue = 0;
  let amountCollected = 0;
  let pendingAmount = 0;

  records.forEach((record) => {
    totalLearners += record.totalLearners || 0;
    activeLearners += record.activeLearners || 0;
    onboardedNotActive += record.onboardedNotActive || 0;
    holdLearners += record.hold || 0;
    notOnboarded += record.notOnboarded || 0;
    droppedLearners += record.dropped || 0;

    originalSalesValue += record.originalSalesValue || 0;
    totalSalesValue += record.totalSalesValue || 0;
    activeSalesValue += record.activeSalesValue || 0;
    droppedValue += record.droppedValue || 0;
    amountCollected += record.amountCollected || 0;
    pendingAmount += record.pendingAmount || 0;
  });

  const collectionPercentage = totalSalesValue > 0 ? (amountCollected / totalSalesValue) * 100 : 0;
  const avgConversionRate = totalLearners > 0 ? (activeLearners / totalLearners) * 100 : 0;

  return {
    totalLearners,
    activeLearners,
    onboardedNotActive,
    holdLearners,
    notOnboarded,
    droppedLearners,
    originalSalesValue,
    totalSalesValue,
    activeSalesValue,
    droppedValue,
    amountCollected,
    pendingAmount,
    collectionPercentage,
    avgConversionRate,
  };
}

/**
 * Computes chart data structures for Recharts from live records
 */
export function prepareChartData(records: ZohoRecord[]) {
  const kpis = calculateExecutiveKPIs(records);

  // 1. Revenue Overview Data
  const revenueOverviewData = [
    { category: 'Original Sales Value', value: kpis.originalSalesValue, fill: '#6366f1' },
    { category: 'Active Sales Value', value: kpis.activeSalesValue, fill: '#10b981' },
    { category: 'Dropped Value', value: kpis.droppedValue, fill: '#f43f5e' },
  ];

  // 2. Collection Overview Data
  const collectionData = [
    { name: 'Amount Collected', value: kpis.amountCollected, color: '#10b981' },
    { name: 'Pending Amount', value: kpis.pendingAmount, color: '#f59e0b' },
  ];

  // 3. Learner Status Distribution
  const learnerStatusData = [
    { name: 'Active', count: kpis.activeLearners, color: '#10b981' },
    { name: 'Hold', count: kpis.holdLearners, color: '#f59e0b' },
    { name: 'Not On-boarded', count: kpis.notOnboarded, color: '#6366f1' },
    { name: 'Onboarded - Not Active', count: kpis.onboardedNotActive, color: '#8b5cf6' },
    { name: 'Dropped', count: kpis.droppedLearners, color: '#f43f5e' },
  ];

  // 4. Sales Executive Performance (Total Sales Value per Sales Executive)
  const execMap: Record<string, { totalSales: number; collected: number; learners: number }> = {};

  records.forEach((r) => {
    const exec = r.salesExecutive || 'Unassigned';
    if (!execMap[exec]) {
      execMap[exec] = { totalSales: 0, collected: 0, learners: 0 };
    }
    execMap[exec].totalSales += r.totalSalesValue;
    execMap[exec].collected += r.amountCollected;
    execMap[exec].learners += r.totalLearners;
  });

  const executivePerformanceData = Object.keys(execMap)
    .map((name) => ({
      name,
      totalSales: execMap[name].totalSales,
      collected: execMap[name].collected,
      learners: execMap[name].learners,
    }))
    .filter((e) => e.totalSales > 0 || e.learners > 0)
    .sort((a, b) => b.totalSales - a.totalSales);

  return {
    revenueOverviewData,
    collectionData,
    learnerStatusData,
    executivePerformanceData,
  };
}

/**
 * Generates automated Business Insights summary cards from live Zoho data
 */
export function generateBusinessInsights(records: ZohoRecord[]): BusinessInsightSummary {
  if (records.length === 0) {
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

  const execStats: Record<
    string,
    {
      sales: number;
      collected: number;
      pending: number;
      activeLearners: number;
      totalLearners: number;
      droppedLearners: number;
      droppedValue: number;
    }
  > = {};

  let totalDroppedVal = 0;
  let affectedDealsCount = 0;

  records.forEach((r) => {
    const exec = r.salesExecutive || 'Unassigned';
    if (!execStats[exec]) {
      execStats[exec] = {
        sales: 0,
        collected: 0,
        pending: 0,
        activeLearners: 0,
        totalLearners: 0,
        droppedLearners: 0,
        droppedValue: 0,
      };
    }
    execStats[exec].sales += r.totalSalesValue;
    execStats[exec].collected += r.amountCollected;
    execStats[exec].pending += r.pendingAmount;
    execStats[exec].activeLearners += r.activeLearners;
    execStats[exec].totalLearners += r.totalLearners;
    execStats[exec].droppedLearners += r.dropped;
    execStats[exec].droppedValue += r.droppedValue;

    if (r.dropped > 0 || r.droppedValue > 0) {
      totalDroppedVal += r.droppedValue;
      affectedDealsCount += r.dropped;
    }
  });

  const execList = Object.keys(execStats);

  let topRevenueExec = { name: 'N/A', value: 0 };
  let topCollectionExec = { name: 'N/A', percentage: 0 };
  let topPendingExec = { name: 'N/A', amount: 0 };
  let topConversionExec = { name: 'N/A', rate: 0 };
  let topActiveLearnerExec = { name: 'N/A', count: 0 };

  execList.forEach((name) => {
    const stat = execStats[name];
    if (stat.sales > topRevenueExec.value) topRevenueExec = { name, value: stat.sales };

    const colPct = stat.sales > 0 ? (stat.collected / stat.sales) * 100 : 0;
    if (colPct > topCollectionExec.percentage) topCollectionExec = { name, percentage: colPct };

    if (stat.pending > topPendingExec.amount) topPendingExec = { name, amount: stat.pending };

    const convRate = stat.totalLearners > 0 ? (stat.activeLearners / stat.totalLearners) * 100 : 0;
    if (convRate > topConversionExec.rate) topConversionExec = { name, rate: convRate };

    if (stat.activeLearners > topActiveLearnerExec.count)
      topActiveLearnerExec = { name, count: stat.activeLearners };
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
    revenueLeakage: { totalDropped: totalDroppedVal, affectedDeals: affectedDealsCount },
    executiveNeedingFollowup: execNeedingFollowup,
  };
}
