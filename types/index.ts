export interface ZohoRecord {
  id: string;
  section: string; // e.g. 'B2C Operations MIS' or 'B2C - PAP Operations MIS'
  businessVertical: string; // 'B2C' | 'PAP' — read from Google Sheet column
  salesExecutive: string;
  totalLearners: number;
  activeLearners: number;
  onboardedNotActive: number;
  conversionRate: number; // percentage
  hold: number;
  notOnboarded: number;
  dropped: number;
  originalSalesValue: number;
  totalSalesValue: number;
  amount: number; // alias to totalSalesValue
  droppedValue: number;
  activeSalesValue: number;
  amountCollected: number;
  pendingAmount: number;
  collectionPercentage: number;
  operationsObservation: string;
  customerName: string;
  course: string;
  date: string;
  status: string;
  learnerStatus: string;
  region: string;
  leadSource: string;
}

export type SheetRecord = ZohoRecord;
export type GoogleSheetRecord = ZohoRecord;

export interface SalesExecutive {
  name: string;
  totalLearners: number;
  activeLearners: number;
  totalSalesValue: number;
  amountCollected: number;
  pendingAmount: number;
  collectionPercentage: number;
  conversionRate: number;
  healthScore: number;
  healthCategory: 'Excellent' | 'Good' | 'Average' | 'Needs Attention';
}

export interface Learner {
  id: string;
  customerName: string;
  course: string;
  section: string;
  salesExecutive: string;
  learnerStatus: string;
  amountCollected: number;
  pendingAmount: number;
}

export interface Revenue {
  originalSalesValue: number;
  totalSalesValue: number;
  activeSalesValue: number;
  droppedValue: number;
  amountCollected: number;
  pendingAmount: number;
}

export interface OperationsMIS {
  section: string;
  salesExecutive: string;
  totalLearners: number;
  activeLearners: number;
  hold: number;
  dropped: number;
  pendingAmount: number;
  operationsObservation: string;
}

export interface DashboardMetrics {
  executiveKPIs: ExecutiveKPIs;
  insights: BusinessInsightSummary;
}

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface FilterState {
  salesExecutive: string; // 'All' or specific name
  businessVertical: string; // 'All' | 'B2C' | 'PAP'
  dateRange: DateRange;
  searchQuery: string;
  status: string;
  region: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

import type { CentralizedMetrics } from '@/lib/calculationEngine';

export interface DataContextType {
  records: ZohoRecord[];
  filteredRecords: ZohoRecord[];
  centralizedMetrics: CentralizedMetrics;
  isLoading: boolean;
  error: string | null;
  syncStatus: SyncStatus;
  lastSync: Date | null;
  dataSource: 'live';
  refetchData: () => Promise<void>;
  salesExecutivesList: string[];
  rawCsvHeaders: string[];
  validateCalculations: () => any;
}

export interface FilterContextType {
  filters: FilterState;
  setSalesExecutive: (salesExec: string) => void;
  setBusinessVertical: (bv: string) => void;
  setSearchQuery: (query: string) => void;
  setStatus: (status: string) => void;
  setRegion: (region: string) => void;
  setDateRange: (startDate: string | null, endDate: string | null) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface NavigationItem {
  name: string;
  href: string;
  iconName: string;
  badge?: string;
  description: string;
}

export interface ExecutiveKPIs {
  totalLearners: number;
  activeLearners: number;
  onboardedNotActive: number;
  holdLearners: number;
  notOnboarded: number;
  droppedLearners: number;
  originalSalesValue: number;
  totalSalesValue: number;
  activeSalesValue: number;
  droppedValue: number;
  amountCollected: number;
  pendingAmount: number;
  collectionPercentage: number;
  avgConversionRate: number;
}

export interface BusinessInsightSummary {
  highestRevenueExecutive: { name: string; value: number };
  highestCollectionPercentage: { name: string; percentage: number };
  highestPendingAmount: { name: string; amount: number };
  bestConversionRate: { name: string; rate: number };
  highestActiveLearners: { name: string; count: number };
  revenueLeakage: { totalDropped: number; affectedDeals: number };
  executiveNeedingFollowup: { name: string; pendingAmount: number; reason: string };
}

/* ─── Overall Collection Report Types ─── */
export interface MonthPaymentData {
  monthName: string;
  amount: number;
  paymentLink: string;
  expectedEmi: number;
  status: string;
}

export interface OverallCollectionRecord {
  id: string;
  sNo: number;
  studentName: string;
  salesExecutive: string;
  email: string;
  phone: string;
  courseName: string;
  enrolledMonth: string;
  shift: string;
  paymentType: string;
  totalPrice: number;
  advance: number;
  emiTenure: string;
  pendingColumn: number;
  totalPayableFee: number;
  businessVertical: string;
  learnerStatus: string;
  monthPayments: Record<string, MonthPaymentData>;
  amountCollected: number;
  pendingCollection: number;
  collectionPercentage: number;
}

export interface DetectedMonth {
  name: string;
  amountCol: string;
  linkCol: string;
  expectedCol: string;
  statusCol: string;
}

export interface OverallCollectionMetrics {
  totalLearners: number;
  totalPayableFee: number;
  amountCollected: number;
  pendingCollection: number;
  collectionPercentage: number;
  pendingLearners: number;
  expectedEmiCollection?: number;
  paidLearners?: number;
  selectedMonth?: string;
}

export interface OverallCollectionFilterState {
  businessVertical: string;
  salesExecutive: string;
  courseName: string;
  enrolledMonth: string;
  shift: string;
  paymentType: string;
  learnerStatus: string;
  paymentStatus: string;
  searchQuery: string;
}

export interface ValidationReportData {
  rowsLoaded: number;
  monthsDetected: string[];
  totalLearners: number;
  totalPayableFee: number;
  amountCollected: number;
  pendingCollection: number;
  collectionPercentage: number;
  pendingLearners: number;
  paymentLinksFound: number;
  paymentLinksMissing: number;
}

