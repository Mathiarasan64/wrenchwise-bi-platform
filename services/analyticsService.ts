import { ZohoRecord } from '@/types';
import { calculateExecutiveKPIs, prepareChartData, generateBusinessInsights } from '@/lib/metrics';
import { aggregateExecutiveStats, generateActionRecommendations } from '@/lib/salesExecutiveMetrics';
import { calculateOperationsOverview, getOperationsPriorityQueue, getOperationsWorkQueue } from '@/lib/operationsMetrics';

/**
 * Analytics Service dispatching computations for executive, sales, operations, and decision modules.
 */
export const analyticsService = {
  getExecutiveKPIs: calculateExecutiveKPIs,
  getChartData: prepareChartData,
  getBusinessInsights: generateBusinessInsights,
  getExecutiveStats: aggregateExecutiveStats,
  getActionRecommendations: generateActionRecommendations,
  getOperationsOverview: calculateOperationsOverview,
  getOperationsPriorityQueue,
  getOperationsWorkQueue,
};
