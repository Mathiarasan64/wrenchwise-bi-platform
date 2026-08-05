import { ZohoRecord, ExecutiveKPIs, FilterState } from '@/types';

export interface FinancialMetrics {
  originalSalesValue: number;
  totalSalesValue: number;
  activeSalesValue: number;
  droppedValue: number;
  amountCollected: number;
  pendingAmount: number;
  collectionPercentage: number;
}

export interface LearnerMetrics {
  totalLearners: number;
  activeLearners: number;
  droppedLearners: number;
  completedLearners: number;
  holdLearners: number;
  onboardedNotActive: number;
  notOnboarded: number;
  conversionRate: number;
}

export interface ExecutiveMetrics {
  name: string;
  originalSales: number;
  contractedSales: number; // totalSalesValue
  collectedAmount: number;
  pendingAmount: number;
  collectionPercentage: number;
  conversionRate: number;
  droppedValue: number;
  activeRevenue: number; // activeSalesValue
  avgTicketSize: number;
  totalLearners: number;
  activeLearners: number;
  onboardedNotActive: number;
  holdLearners: number;
  notOnboarded: number;
  droppedLearners: number;
  healthScore: number;
  healthCategory: 'Excellent' | 'Good' | 'Average' | 'Needs Attention';
  observations: string[];
}

export interface OperationsMetrics {
  pendingFollowups: number;
  pendingCollections: number;
  overdueEMIs: number;
  highRiskLearners: number;
  todaysFollowups: number;
  collectionsDue: number;
  totalPendingAmount: number;
  totalHoldLearners: number;
  totalDroppedLearners: number;
  totalNotOnboarded: number;
  collectionEfficiency: number;
  revenueAtRisk: number;
}

export interface ChartData {
  revenueOverviewData: Array<{ category: string; value: number; fill: string }>;
  collectionData: Array<{ name: string; value: number; color: string }>;
  learnerStatusData: Array<{ name: string; count: number; color: string }>;
  executivePerformanceData: Array<{ name: string; totalSales: number; collected: number; learners: number }>;
}

export interface CentralizedMetrics {
  financial: FinancialMetrics;
  learners: LearnerMetrics;
  executives: ExecutiveMetrics[];
  operations: OperationsMetrics;
  charts: ChartData;
  recordCount: number;
}

/**
 * Universal safe numeric parser for raw values, currency strings, percentage strings, blank cells, null & undefined.
 */
export function safeParseNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).trim();
  if (str === '' || str === '-' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') return 0;
  const cleaned = str.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return 0;
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculates Executive Health Score (0-100) based on weighted parameters
 */
export function calculateExecutiveHealthScore(stats: {
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
 * Filter records based on Business Vertical and active filters
 */
export function filterDataset(records: ZohoRecord[], filters?: FilterState): ZohoRecord[] {
  if (!filters) return records;

  return records.filter((record) => {
    if (filters.businessVertical && filters.businessVertical !== 'All' && record.businessVertical !== filters.businessVertical) {
      return false;
    }
    if (filters.salesExecutive && filters.salesExecutive !== 'All' && record.salesExecutive !== filters.salesExecutive) {
      return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const matches =
        record.salesExecutive.toLowerCase().includes(query) ||
        record.section.toLowerCase().includes(query) ||
        record.id.toLowerCase().includes(query) ||
        record.operationsObservation.toLowerCase().includes(query);
      if (!matches) return false;
    }
    return true;
  });
}

/**
 * SINGLE SOURCE OF TRUTH: Calculates all business metrics directly from filtered dataset
 */
export function calculateCentralizedMetrics(
  records: ZohoRecord[],
  filters?: FilterState
): CentralizedMetrics {
  // 1. Filter dataset FIRST (Business Vertical, Sales Executive, Search Query)
  const activeRecords = filterDataset(records, filters);

  // 2. FINANCIAL METRICS — calculated using reduce() directly over activeRecords
  const originalSalesValue = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.originalSalesValue),
    0
  );
  const totalSalesValue = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.totalSalesValue),
    0
  );
  const activeSalesValue = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.activeSalesValue),
    0
  );
  const droppedValue = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.droppedValue),
    0
  );
  const amountCollected = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.amountCollected),
    0
  );
  // Derived KPI rule: Pending Amount = Active Sales Value - Amount Collected
  const pendingAmount = Math.max(0, activeSalesValue - amountCollected);

  const collectionPercentage =
    totalSalesValue > 0 ? (amountCollected / totalSalesValue) * 100 : 0;

  const financial: FinancialMetrics = {
    originalSalesValue,
    totalSalesValue,
    activeSalesValue,
    droppedValue,
    amountCollected,
    pendingAmount,
    collectionPercentage,
  };

  // 3. LEARNER METRICS — calculated using reduce() directly over activeRecords
  const activeLearners = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.activeLearners),
    0
  );
  const onboardedNotActive = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.onboardedNotActive),
    0
  );
  const holdLearners = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.hold),
    0
  );
  const notOnboarded = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.notOnboarded),
    0
  );
  const droppedLearners = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.dropped),
    0
  );
  const totalLearners = activeRecords.reduce(
    (sum, r) => sum + safeParseNumber(r.totalLearners),
    0
  );
  const conversionRate =
    totalLearners > 0 ? (activeLearners / totalLearners) * 100 : 0;
  const completedLearners = activeLearners;

  const learners: LearnerMetrics = {
    totalLearners,
    activeLearners,
    droppedLearners,
    completedLearners,
    holdLearners,
    onboardedNotActive,
    notOnboarded,
    conversionRate,
  };

  // 4. SALES EXECUTIVE METRICS (Per Executive breakdown)
  const execMap: Record<string, ExecutiveMetrics> = {};

  activeRecords.forEach((r) => {
    const name = r.salesExecutive || 'Unassigned';
    if (!execMap[name]) {
      execMap[name] = {
        name,
        originalSales: 0,
        contractedSales: 0,
        collectedAmount: 0,
        pendingAmount: 0,
        collectionPercentage: 0,
        conversionRate: 0,
        droppedValue: 0,
        activeRevenue: 0,
        avgTicketSize: 0,
        totalLearners: 0,
        activeLearners: 0,
        onboardedNotActive: 0,
        holdLearners: 0,
        notOnboarded: 0,
        droppedLearners: 0,
        healthScore: 0,
        healthCategory: 'Needs Attention',
        observations: [],
      };
    }

    const item = execMap[name];
    item.originalSales += safeParseNumber(r.originalSalesValue);
    item.contractedSales += safeParseNumber(r.totalSalesValue);
    item.collectedAmount += safeParseNumber(r.amountCollected);
    item.droppedValue += safeParseNumber(r.droppedValue);
    item.activeRevenue += safeParseNumber(r.activeSalesValue);

    item.totalLearners += safeParseNumber(r.totalLearners);
    item.activeLearners += safeParseNumber(r.activeLearners);
    item.onboardedNotActive += safeParseNumber(r.onboardedNotActive);
    item.holdLearners += safeParseNumber(r.hold);
    item.notOnboarded += safeParseNumber(r.notOnboarded);
    item.droppedLearners += safeParseNumber(r.dropped);

    if (
      r.operationsObservation &&
      r.operationsObservation !== '-' &&
      r.operationsObservation !== 'No observations recorded.'
    ) {
      item.observations.push(`[${r.section}]: ${r.operationsObservation}`);
    }
  });

  const executives = Object.values(execMap).map((item) => {
    // Derived executive pending amount = Active Revenue - Collected Amount
    item.pendingAmount = Math.max(0, item.activeRevenue - item.collectedAmount);
    item.collectionPercentage =
      item.contractedSales > 0 ? (item.collectedAmount / item.contractedSales) * 100 : 0;
    item.conversionRate =
      item.totalLearners > 0 ? (item.activeLearners / item.totalLearners) * 100 : 0;
    item.avgTicketSize =
      item.totalLearners > 0 ? item.contractedSales / item.totalLearners : 0;

    const health = calculateExecutiveHealthScore({
      totalLearners: item.totalLearners,
      activeLearners: item.activeLearners,
      totalSalesValue: item.contractedSales,
      amountCollected: item.collectedAmount,
      pendingAmount: item.pendingAmount,
      droppedValue: item.droppedValue,
      collectionPercentage: item.collectionPercentage,
      conversionRate: item.conversionRate,
    });

    item.healthScore = health.score;
    item.healthCategory = health.category;

    return item;
  });

  executives.sort((a, b) => b.healthScore - a.healthScore);

  // 5. OPERATIONS METRICS
  const pendingCollections = activeRecords.filter(
    (r) => safeParseNumber(r.pendingAmount) > 0
  ).length;
  const overdueEMIs = activeRecords.filter(
    (r) => safeParseNumber(r.pendingAmount) > 50000
  ).length;
  const highRiskLearners = activeRecords.filter(
    (r) => safeParseNumber(r.dropped) > 0 || safeParseNumber(r.hold) > 0
  ).length;

  const criticalPending = activeRecords
    .filter((r) => safeParseNumber(r.pendingAmount) > 100000)
    .reduce((sum, r) => sum + safeParseNumber(r.pendingAmount), 0);
  const revenueAtRisk = droppedValue + criticalPending;

  const operations: OperationsMetrics = {
    pendingFollowups: pendingCollections + highRiskLearners,
    pendingCollections,
    overdueEMIs,
    highRiskLearners,
    todaysFollowups: Math.ceil((pendingCollections + highRiskLearners) * 0.4),
    collectionsDue: pendingAmount,
    totalPendingAmount: pendingAmount,
    totalHoldLearners: holdLearners,
    totalDroppedLearners: droppedLearners,
    totalNotOnboarded: notOnboarded,
    collectionEfficiency: collectionPercentage,
    revenueAtRisk,
  };

  // 6. CHART DATA
  const revenueOverviewData = [
    { category: 'Original Sales Value', value: originalSalesValue, fill: '#6366f1' },
    { category: 'Active Sales Value', value: activeSalesValue, fill: '#10b981' },
    { category: 'Dropped Value', value: droppedValue, fill: '#f43f5e' },
  ];

  const collectionData = [
    { name: 'Amount Collected', value: amountCollected, color: '#10b981' },
    { name: 'Pending Amount', value: pendingAmount, color: '#f59e0b' },
  ];

  const learnerStatusData = [
    { name: 'Active', count: activeLearners, color: '#10b981' },
    { name: 'Hold', count: holdLearners, color: '#f59e0b' },
    { name: 'Not On-boarded', count: notOnboarded, color: '#6366f1' },
    { name: 'Onboarded - Not Active', count: onboardedNotActive, color: '#8b5cf6' },
    { name: 'Dropped', count: droppedLearners, color: '#f43f5e' },
  ];

  const executivePerformanceData = executives
    .map((e) => ({
      name: e.name,
      totalSales: e.contractedSales,
      collected: e.collectedAmount,
      learners: e.totalLearners,
    }))
    .filter((e) => e.totalSales > 0 || e.learners > 0);

  const charts: ChartData = {
    revenueOverviewData,
    collectionData,
    learnerStatusData,
    executivePerformanceData,
  };

  return {
    financial,
    learners,
    executives,
    operations,
    charts,
    recordCount: activeRecords.length,
  };
}

export interface KPIValidationItem {
  kpiName: string;
  googleSheetTotal: number;
  applicationTotal: number;
  match: 'Yes' | 'No';
}

/**
 * COMPREHENSIVE AUDIT FUNCTION: Validates 13 KPIs against raw Google Sheet dataset
 */
export function validateCalculations(records: ZohoRecord[]): {
  isValid: boolean;
  items: KPIValidationItem[];
} {
  const engine = calculateCentralizedMetrics(records);

  // Raw Google Sheet totals computed directly over raw records using reduce()
  const rawTotalLearners = records.reduce((s, r) => s + safeParseNumber(r.totalLearners), 0);
  const rawActiveLearners = records.reduce((s, r) => s + safeParseNumber(r.activeLearners), 0);
  const rawOnboardedNotActive = records.reduce((s, r) => s + safeParseNumber(r.onboardedNotActive), 0);
  const rawHold = records.reduce((s, r) => s + safeParseNumber(r.hold), 0);
  const rawNotOnboarded = records.reduce((s, r) => s + safeParseNumber(r.notOnboarded), 0);
  const rawDropped = records.reduce((s, r) => s + safeParseNumber(r.dropped), 0);

  const rawOriginalSalesValue = records.reduce((s, r) => s + safeParseNumber(r.originalSalesValue), 0);
  const rawTotalSalesValue = records.reduce((s, r) => s + safeParseNumber(r.totalSalesValue), 0);
  const rawActiveSalesValue = records.reduce((s, r) => s + safeParseNumber(r.activeSalesValue), 0);
  const rawDroppedValue = records.reduce((s, r) => s + safeParseNumber(r.droppedValue), 0);
  const rawAmountCollected = records.reduce((s, r) => s + safeParseNumber(r.amountCollected), 0);
  const rawPendingAmount = Math.max(0, rawActiveSalesValue - rawAmountCollected);
  const rawCollectionPct = rawTotalSalesValue > 0 ? (rawAmountCollected / rawTotalSalesValue) * 100 : 0;

  const compare = (kpiName: string, rawVal: number, appVal: number): KPIValidationItem => {
    const isMatch = Math.abs(rawVal - appVal) < 0.01;
    return {
      kpiName,
      googleSheetTotal: Number(rawVal.toFixed(2)),
      applicationTotal: Number(appVal.toFixed(2)),
      match: isMatch ? 'Yes' : 'No',
    };
  };

  const items: KPIValidationItem[] = [
    compare('Total Learners', rawTotalLearners, engine.learners.totalLearners),
    compare('Active Learners', rawActiveLearners, engine.learners.activeLearners),
    compare('Onboarded - Not Active', rawOnboardedNotActive, engine.learners.onboardedNotActive),
    compare('Hold', rawHold, engine.learners.holdLearners),
    compare('Not On-boarded', rawNotOnboarded, engine.learners.notOnboarded),
    compare('Dropped', rawDropped, engine.learners.droppedLearners),
    compare('Original Sales Value', rawOriginalSalesValue, engine.financial.originalSalesValue),
    compare('Total Sales Value', rawTotalSalesValue, engine.financial.totalSalesValue),
    compare('Active Sales Value', rawActiveSalesValue, engine.financial.activeSalesValue),
    compare('Dropped Value', rawDroppedValue, engine.financial.droppedValue),
    compare('Amount Collected', rawAmountCollected, engine.financial.amountCollected),
    compare('Pending Amount', rawPendingAmount, engine.financial.pendingAmount),
  ];

  const isValid = items.every((i) => i.match === 'Yes');
  return { isValid, items };
}
