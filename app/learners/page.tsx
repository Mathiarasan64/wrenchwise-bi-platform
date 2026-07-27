'use client';

import React, { useState, useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { getLearnerCrmProfile } from '@/lib/learnerCrmEngine';
import { aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { LearnerSearchToolbar, LearnerFilters } from '@/components/learners/LearnerSearchToolbar';
import { LearnerMasterTable } from '@/components/learners/LearnerMasterTable';
import { Learner360ProfileCard } from '@/components/learners/Learner360ProfileCard';
import { LearnerFinancialOverview } from '@/components/learners/LearnerFinancialOverview';
import { LearningJourneyTimeline } from '@/components/learners/LearningJourneyTimeline';
import { LearnerRiskAssessmentCard } from '@/components/learners/LearnerRiskAssessmentCard';
import { LearnerExecutiveCard } from '@/components/learners/LearnerExecutiveCard';
import { LearnerPaymentAnalytics } from '@/components/learners/LearnerPaymentAnalytics';
import { GraduationCap, Users, ArrowLeft } from 'lucide-react';

export default function Learner360Page() {
  const { records, error, refetchData, isLoading, syncStatus } = useZohoData();
  const [filters, setFilters] = useState<LearnerFilters>({
    searchQuery: '',
    statusFilter: 'All',
    executiveFilter: 'All',
  });
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);

  // Unique status and executive options
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => { if (r.learnerStatus) set.add(r.learnerStatus); });
    return Array.from(set).sort();
  }, [records]);

  const executiveOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => { if (r.salesExecutive) set.add(r.salesExecutive); });
    return Array.from(set).sort();
  }, [records]);

  // Executive stats for ranking
  const execStats = useMemo(() => aggregateExecutiveStats(records), [records]);

  // Selected learner CRM profile
  const selectedProfile = useMemo(() => {
    if (!selectedLearnerId) return null;
    const record = records.find((r) => r.id === selectedLearnerId);
    if (!record) return null;
    return getLearnerCrmProfile(record, records);
  }, [selectedLearnerId, records]);

  // Exec rank for selected learner
  const execRankInfo = useMemo(() => {
    if (!selectedProfile?.assignedExecStats) return { rank: undefined, total: undefined };
    const idx = execStats.findIndex((e) => e.name === selectedProfile.assignedExecStats?.name);
    return { rank: idx >= 0 ? idx + 1 : undefined, total: execStats.length };
  }, [selectedProfile, execStats]);

  if (isLoading && records.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fadeIn p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] border border-emerald-200 text-[#08C565] shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-normal leading-[1.3]">
              Learner 360°
            </h1>
            <span className="badge-success text-xs font-semibold">
              CRM Module
            </span>
            <BusinessVerticalBadge />
          </div>
          <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">
            Search any candidate and instantly view business, payment, operational, and engagement details.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold">
            <div className={`w-2 h-2 rounded-full ${syncStatus === 'success' ? 'bg-[#08C565] animate-pulse' : 'bg-[#F59E0B]'}`} />
            <span className="text-[#374151]">
              {syncStatus === 'success' ? 'Live Data' : 'Syncing'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#0B9BC5]" />
            <span className="font-mono font-extrabold text-[#111827]">{records.length}</span>
            <span className="text-[#6B7280] font-medium">Records</span>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={refetchData} />}

      {/* Search & Filters */}
      <LearnerSearchToolbar
        filters={filters}
        onFiltersChange={setFilters}
        statusOptions={statusOptions}
        executiveOptions={executiveOptions}
        totalCount={records.length}
        filteredCount={records.filter((r) => {
          if (filters.statusFilter !== 'All' && r.learnerStatus !== filters.statusFilter) return false;
          if (filters.executiveFilter !== 'All' && r.salesExecutive !== filters.executiveFilter) return false;
          if (filters.searchQuery.trim()) {
            const q = filters.searchQuery.toLowerCase();
            const h = [r.customerName, r.id, r.course, r.section, r.salesExecutive, r.learnerStatus, r.operationsObservation].join(' ').toLowerCase();
            if (!h.includes(q)) return false;
          }
          return true;
        }).length}
      />

      {/* 360° CRM View */}
      {records.length === 0 && !isLoading ? (
        <EmptyVerticalState />
      ) : selectedProfile ? (
        <div className="space-y-5">
          {/* Back button */}
          <button
            onClick={() => setSelectedLearnerId(null)}
            className="btn-ghost flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Learner Registry
          </button>

          {/* Profile Card */}
          <Learner360ProfileCard profile={selectedProfile} />

          {/* Financial Overview */}
          <LearnerFinancialOverview profile={selectedProfile} />

          {/* Two-column layout for Timeline + Risk */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LearningJourneyTimeline milestones={selectedProfile.milestones} />
            <LearnerRiskAssessmentCard risk={selectedProfile.riskAssessment} />
          </div>

          {/* Two-column layout for Executive + Payment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LearnerExecutiveCard
              execStats={selectedProfile.assignedExecStats}
              execRank={execRankInfo.rank}
              totalExecs={execRankInfo.total}
            />
            <LearnerPaymentAnalytics profile={selectedProfile} />
          </div>
        </div>
      ) : (
        /* Learner Master Table */
        <LearnerMasterTable
          records={records}
          searchQuery={filters.searchQuery}
          statusFilter={filters.statusFilter}
          executiveFilter={filters.executiveFilter}
          selectedLearnerId={selectedLearnerId}
          onSelectLearner={setSelectedLearnerId}
        />
      )}
    </div>
  );
}
