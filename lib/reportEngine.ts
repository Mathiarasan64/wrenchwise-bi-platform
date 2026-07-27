import { ZohoRecord } from '@/types';
import { aggregateExecutiveStats, ExecutiveSummaryStats } from './salesExecutiveMetrics';

export type ReportCategory =
  | 'executive-summary'
  | 'revenue'
  | 'sales-executive'
  | 'learner-status'
  | 'operations-mis'
  | 'pending-collection';

export interface ReportConfig {
  id: ReportCategory;
  title: string;
  description: string;
  iconName: string;
  defaultColumns: string[];
}

export const REPORT_CONFIGS: ReportConfig[] = [
  {
    id: 'executive-summary',
    title: 'Executive Summary Report',
    description: '30-second macro summary of company health, overall revenue, cash collected, and learner volume.',
    iconName: 'FileSpreadsheet',
    defaultColumns: ['section', 'salesExecutive', 'totalLearners', 'activeLearners', 'totalSalesValue', 'amountCollected', 'pendingAmount', 'collectionPercentage'],
  },
  {
    id: 'revenue',
    title: 'Revenue Analytics Report',
    description: 'Detailed gross quotation, net contracted sales, realized cash collections, and dropped deal losses.',
    iconName: 'DollarSign',
    defaultColumns: ['section', 'salesExecutive', 'originalSalesValue', 'totalSalesValue', 'activeSalesValue', 'droppedValue', 'amountCollected', 'pendingAmount', 'collectionPercentage'],
  },
  {
    id: 'sales-executive',
    title: 'Sales Executive Performance Report',
    description: 'Representative-level leaderboard with Performance Health Scores (0-100), conversion rates, and revenue.',
    iconName: 'UserCheck',
    defaultColumns: ['salesExecutive', 'totalLearners', 'activeLearners', 'totalSalesValue', 'amountCollected', 'pendingAmount', 'collectionPercentage', 'conversionRate', 'healthScore', 'healthCategory'],
  },
  {
    id: 'learner-status',
    title: 'Learner Status Lifecycle Report',
    description: 'Candidate training status breakdown across active, onboarded not active, hold, not onboarded, and dropped.',
    iconName: 'GraduationCap',
    defaultColumns: ['section', 'salesExecutive', 'totalLearners', 'activeLearners', 'onboardedNotActive', 'hold', 'notOnboarded', 'dropped', 'learnerStatus'],
  },
  {
    id: 'operations-mis',
    title: 'Operations MIS Master Report',
    description: 'Multi-table operations management records including observations, batch launch dates, and regions.',
    iconName: 'Wrench',
    defaultColumns: ['section', 'salesExecutive', 'totalLearners', 'activeLearners', 'totalSalesValue', 'amountCollected', 'pendingAmount', 'operationsObservation', 'region'],
  },
  {
    id: 'pending-collection',
    title: 'Pending Receivables Audit Report',
    description: 'Receivables audit report targeting deals with unpaid balances and high collection risk.',
    iconName: 'Clock',
    defaultColumns: ['salesExecutive', 'section', 'totalSalesValue', 'amountCollected', 'pendingAmount', 'collectionPercentage', 'operationsObservation', 'status'],
  },
];

export function getReportRows(
  category: ReportCategory,
  records: ZohoRecord[]
): any[] {
  if (category === 'sales-executive') {
    const execs = aggregateExecutiveStats(records);
    return execs.map((e) => ({
      salesExecutive: e.name,
      totalLearners: e.totalLearners,
      activeLearners: e.activeLearners,
      totalSalesValue: e.totalSalesValue,
      amountCollected: e.amountCollected,
      pendingAmount: e.pendingAmount,
      collectionPercentage: e.collectionPercentage,
      conversionRate: e.conversionRate,
      healthScore: e.healthScore,
      healthCategory: e.healthCategory,
    }));
  }

  if (category === 'pending-collection') {
    return records
      .filter((r) => (r.pendingAmount || 0) > 0)
      .map((r) => ({
        salesExecutive: r.salesExecutive,
        section: r.section,
        totalSalesValue: r.totalSalesValue,
        amountCollected: r.amountCollected,
        pendingAmount: r.pendingAmount,
        collectionPercentage: r.collectionPercentage,
        operationsObservation: r.operationsObservation || 'No observations.',
        status: r.status,
      }));
  }

  // General records for other reports
  return records.map((r) => ({
    id: r.id,
    section: r.section,
    salesExecutive: r.salesExecutive,
    totalLearners: r.totalLearners,
    activeLearners: r.activeLearners,
    onboardedNotActive: r.onboardedNotActive,
    hold: r.hold,
    notOnboarded: r.notOnboarded,
    dropped: r.dropped,
    originalSalesValue: r.originalSalesValue,
    totalSalesValue: r.totalSalesValue,
    activeSalesValue: r.activeSalesValue,
    droppedValue: r.droppedValue,
    amountCollected: r.amountCollected,
    pendingAmount: r.pendingAmount,
    collectionPercentage: r.collectionPercentage,
    conversionRate: r.conversionRate,
    operationsObservation: r.operationsObservation,
    learnerStatus: r.learnerStatus,
    region: r.region,
    date: r.date,
    status: r.status,
  }));
}
