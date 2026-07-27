import { ZohoRecord } from '@/types';
import { aggregateExecutiveStats, ExecutiveSummaryStats } from './salesExecutiveMetrics';

export interface LearnerRiskAssessment {
  score: number; // 0-100
  category: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';
  riskExplanation: string;
}

export interface LearningJourneyMilestone {
  id: string;
  stageName: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  dateText: string;
  description: string;
}

export interface LearnerCrmProfile {
  id: string;
  customerName: string;
  course: string;
  section: string;
  salesExecutive: string;
  totalSalesValue: number;
  amountCollected: number;
  pendingAmount: number;
  collectionPercentage: number;
  learnerStatus: string;
  operationsObservation: string;
  riskAssessment: LearnerRiskAssessment;
  milestones: LearningJourneyMilestone[];
  assignedExecStats?: ExecutiveSummaryStats;
  recommendedAction: string;
}

export function calculateLearnerRisk(record: ZohoRecord): LearnerRiskAssessment {
  let score = 0;

  // Unpaid Balance Risk (+ pts)
  const pending = record.pendingAmount || 0;
  if (pending > 100000) score += 45;
  else if (pending > 50000) score += 30;
  else if (pending > 10000) score += 15;

  // Collection % Risk (+ pts)
  const colPct = record.collectionPercentage || 0;
  if (colPct < 30) score += 25;
  else if (colPct < 50) score += 15;

  // Status Risk (+ pts)
  const status = record.learnerStatus || '';
  if (status === 'Dropped') score += 35;
  else if (status === 'Hold') score += 25;
  else if (status === 'Not On-boarded') score += 15;

  // Observation check
  if (record.operationsObservation && record.operationsObservation.toLowerCase().includes('pending')) {
    score += 10;
  }

  score = Math.min(100, Math.max(0, score));

  let category: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk' = 'Low Risk';
  if (score >= 75) category = 'Critical Risk';
  else if (score >= 50) category = 'High Risk';
  else if (score >= 30) category = 'Medium Risk';

  let riskExplanation = 'Standard candidate profile with low payment and retention risk.';
  if (category === 'Critical Risk') {
    riskExplanation = `High risk driven by ${pending > 0 ? `outstanding unpaid balance of ₹${pending.toLocaleString('en-IN')}` : ''} and candidate status (${status}).`;
  } else if (category === 'High Risk') {
    riskExplanation = `Elevated risk due to candidate status (${status}) and collection ratio (${colPct.toFixed(1)}%).`;
  } else if (category === 'Medium Risk') {
    riskExplanation = `Moderate risk requiring routine collection follow-up and onboarding check.`;
  }

  return { score, category, riskExplanation };
}

export function generateLearningJourney(record: ZohoRecord): LearningJourneyMilestone[] {
  const status = record.learnerStatus || 'Active';

  const isDropped = status === 'Dropped';
  const isHold = status === 'Hold';
  const isActive = status === 'Active';
  const isNotOnboarded = status === 'Not On-boarded';

  return [
    {
      id: 'm1',
      stageName: 'Registration & Inquiry',
      status: 'completed',
      dateText: record.date || 'Enrolled',
      description: `Course selected: ${record.course || 'B2C Training'}.`,
    },
    {
      id: 'm2',
      stageName: 'Fee Deposit & Realization',
      status: record.amountCollected > 0 ? 'completed' : 'current',
      dateText: record.amountCollected > 0 ? 'Payment Invoiced' : 'Pending Payment',
      description: `Collected: ₹${(record.amountCollected || 0).toLocaleString('en-IN')} (${(record.collectionPercentage || 0).toFixed(1)}%).`,
    },
    {
      id: 'm3',
      stageName: 'Candidate Onboarding',
      status: isNotOnboarded ? 'current' : 'completed',
      dateText: isNotOnboarded ? 'Pending Batch Launch' : 'Onboarded',
      description: `Section allocation: ${record.section || 'General'}.`,
    },
    {
      id: 'm4',
      stageName: 'Active Training Engagement',
      status: isActive ? 'completed' : isHold || isDropped ? 'failed' : 'pending',
      dateText: isActive ? 'In Session' : status,
      description: isActive ? 'Student actively attending training modules.' : `Status: ${status}`,
    },
    {
      id: 'm5',
      stageName: 'Certification & Completion',
      status: isDropped ? 'failed' : isHold ? 'pending' : 'completed',
      dateText: isDropped ? 'Terminated' : 'Target Milestone',
      description: isDropped ? 'Candidate discontinued training.' : 'Final certification upon full fee clearance.',
    },
  ];
}

export function getLearnerCrmProfile(
  record: ZohoRecord,
  allRecords: ZohoRecord[]
): LearnerCrmProfile {
  const execs = aggregateExecutiveStats(allRecords);
  const assignedExecStats = execs.find((e) => e.name === record.salesExecutive);
  const riskAssessment = calculateLearnerRisk(record);
  const milestones = generateLearningJourney(record);

  let recommendedAction = 'Maintain routine academic tracking.';
  if (record.pendingAmount > 0) {
    recommendedAction = `Issue payment milestone reminder for ₹${record.pendingAmount.toLocaleString('en-IN')}.`;
  } else if (record.learnerStatus === 'Hold') {
    recommendedAction = 'Reach out to candidate for batch resume scheduling.';
  } else if (record.learnerStatus === 'Dropped') {
    recommendedAction = 'Conduct exit feedback audit and evaluate refund policy rules.';
  }

  return {
    id: record.id,
    customerName: record.customerName || record.salesExecutive || 'Candidate Profile',
    course: record.course || 'Technical Course',
    section: record.section,
    salesExecutive: record.salesExecutive,
    totalSalesValue: record.totalSalesValue || 0,
    amountCollected: record.amountCollected || 0,
    pendingAmount: record.pendingAmount || 0,
    collectionPercentage: record.collectionPercentage || 0,
    learnerStatus: record.learnerStatus || 'Active',
    operationsObservation: record.operationsObservation || 'No operational notes logged.',
    riskAssessment,
    milestones,
    assignedExecStats,
    recommendedAction,
  };
}
