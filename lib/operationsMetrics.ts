import { ZohoRecord } from '@/types';
import { aggregateExecutiveStats, ExecutiveSummaryStats } from './salesExecutiveMetrics';

export interface OperationsOverviewMetrics {
  totalPendingAmount: number;
  totalHoldLearners: number;
  totalDroppedLearners: number;
  totalNotOnboarded: number;
  collectionEfficiency: number;
  revenueAtRisk: number;
}

export function calculateOperationsOverview(records: ZohoRecord[]): OperationsOverviewMetrics {
  let totalPendingAmount = 0;
  let totalHoldLearners = 0;
  let totalDroppedLearners = 0;
  let totalNotOnboarded = 0;
  let totalSalesValue = 0;
  let amountCollected = 0;
  let droppedValue = 0;

  records.forEach((r) => {
    totalPendingAmount += r.pendingAmount || 0;
    totalHoldLearners += r.hold || 0;
    totalDroppedLearners += r.dropped || 0;
    totalNotOnboarded += r.notOnboarded || 0;
    totalSalesValue += r.totalSalesValue || 0;
    amountCollected += r.amountCollected || 0;
    droppedValue += r.droppedValue || 0;
  });

  const collectionEfficiency = totalSalesValue > 0 ? (amountCollected / totalSalesValue) * 100 : 0;
  const criticalPending = records.filter((r) => (r.pendingAmount || 0) > 100000).reduce((sum, r) => sum + r.pendingAmount, 0);
  const revenueAtRisk = droppedValue + criticalPending;

  return {
    totalPendingAmount,
    totalHoldLearners,
    totalDroppedLearners,
    totalNotOnboarded,
    collectionEfficiency,
    revenueAtRisk,
  };
}

export interface PriorityQueueItem {
  id: string;
  type: 'critical' | 'warning' | 'healthy';
  title: string;
  count: number | string;
  description: string;
  actionText: string;
}

export function getOperationsPriorityQueue(execStats: ExecutiveSummaryStats[]): PriorityQueueItem[] {
  const criticalPendingExecs = execStats.filter((e) => e.pendingAmount > 100000);
  const highDroppedExecs = execStats.filter((e) => e.dropped > 0);
  const lowCollectionExecs = execStats.filter((e) => e.totalSalesValue > 0 && e.collectionPercentage < 40);
  const topPendingExec = [...execStats].sort((a, b) => b.pendingAmount - a.pendingAmount)[0];

  const items: PriorityQueueItem[] = [];

  // Critical Pending Accounts
  items.push({
    id: 'pq-critical-pending',
    type: criticalPendingExecs.length > 0 ? 'critical' : 'healthy',
    title: 'Critical Pending Accounts (> ₹1L)',
    count: `${criticalPendingExecs.length} Execs`,
    description: criticalPendingExecs.length > 0
      ? `${criticalPendingExecs.map((e) => e.name).join(', ')} exceed ₹1,00,000 in unpaid balance.`
      : 'No representative currently exceeds the ₹1,00,000 pending threshold.',
    actionText: 'Initiate formal payment milestone follow-up',
  });

  // High Value Pending Leader
  items.push({
    id: 'pq-high-value-pending',
    type: 'warning',
    title: 'Highest Pending Balance Executive',
    count: topPendingExec ? `₹${topPendingExec.pendingAmount.toLocaleString('en-IN')}` : '₹0',
    description: topPendingExec
      ? `${topPendingExec.name} has the largest outstanding balance of ₹${topPendingExec.pendingAmount.toLocaleString('en-IN')}.`
      : 'No pending balance recorded.',
    actionText: 'Prioritize collection outreach for top deal balance',
  });

  // High Dropped Learners
  items.push({
    id: 'pq-high-dropped',
    type: highDroppedExecs.length > 0 ? 'warning' : 'healthy',
    title: 'Dropped Learner Occurrences',
    count: `${highDroppedExecs.reduce((sum, e) => sum + e.dropped, 0)} Learners`,
    description: highDroppedExecs.length > 0
      ? `${highDroppedExecs.map((e) => `${e.name} (${e.dropped})`).join(', ')} recorded candidate drop-offs.`
      : 'Zero dropped learner cancellations recorded across current dataset.',
    actionText: 'Review exit interview feedback and batch transfers',
  });

  // Immediate Follow-up Representative
  items.push({
    id: 'pq-immediate-followup',
    type: lowCollectionExecs.length > 0 ? 'critical' : 'healthy',
    title: 'Immediate Executive Action Required',
    count: lowCollectionExecs.length > 0 ? lowCollectionExecs[0].name : 'All On Track',
    description: lowCollectionExecs.length > 0
      ? `${lowCollectionExecs[0].name} has ${lowCollectionExecs[0].collectionPercentage.toFixed(1)}% collection ratio and ₹${lowCollectionExecs[0].pendingAmount.toLocaleString('en-IN')} pending.`
      : 'All representatives maintain collection ratio above target thresholds.',
    actionText: 'Schedule 1-on-1 operations review meeting',
  });

  return items;
}

export interface WorkQueueRow {
  id: string;
  salesExecutive: string;
  pendingAmount: number;
  hold: number;
  dropped: number;
  collectionPercentage: number;
  operationsObservation: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Action Required' | 'On Track';
}

export function getOperationsWorkQueue(records: ZohoRecord[]): WorkQueueRow[] {
  const aggregated = aggregateExecutiveStats(records);

  return aggregated.map((exec, idx) => {
    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    if (exec.pendingAmount > 100000 || exec.dropped > 0 || exec.collectionPercentage < 30) {
      priority = 'High';
    } else if (exec.pendingAmount > 50000 || exec.hold > 0 || exec.collectionPercentage < 50) {
      priority = 'Medium';
    }

    const status: 'Action Required' | 'On Track' = priority === 'High' ? 'Action Required' : 'On Track';

    return {
      id: `wq-${idx}-${exec.name.replace(/\s+/g, '')}`,
      salesExecutive: exec.name,
      pendingAmount: exec.pendingAmount,
      hold: exec.hold,
      dropped: exec.dropped,
      collectionPercentage: exec.collectionPercentage,
      operationsObservation: exec.observations.join('; ') || 'No critical observations.',
      priority,
      status,
    };
  });
}
