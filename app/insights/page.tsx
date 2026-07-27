'use client';

import React, { useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import {
  generateCEOBriefing,
  calculateDetailedHealthComposition,
  generateRootCauseAnalysis,
  generateExecutiveAlerts,
} from '@/lib/decisionIntelligenceEngine';
import { CEOBriefingSummary } from '@/components/decision-intelligence/CEOBriefingSummary';
import { WhyHealthScoreBreakdown } from '@/components/decision-intelligence/WhyHealthScoreBreakdown';
import { RootCauseAnalysisCard } from '@/components/decision-intelligence/RootCauseAnalysisCard';
import { ExecutiveAlertCenter } from '@/components/decision-intelligence/ExecutiveAlertCenter';
import { SmartActionCards } from '@/components/decision-intelligence/SmartActionCards';
import { WhatIfSimulationTool } from '@/components/decision-intelligence/WhatIfSimulationTool';
import { TopBusinessInsightsGrid } from '@/components/insights/TopBusinessInsightsGrid';
import { AIBusinessInsightsGrid } from '@/components/insights/AIBusinessInsightsGrid';
import { TopBottomExecutiveTables } from '@/components/insights/TopBottomExecutiveTables';
import { FilterBar } from '@/components/filters/FilterBar';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { BrainCircuit, Sparkles } from 'lucide-react';

export default function InsightsPage() {
  const { filteredRecords, isLoading, error, refetchData } = useZohoData();

  // Decision Intelligence Engine Aggregation
  const ceoBriefing = useMemo(() => generateCEOBriefing(filteredRecords), [filteredRecords]);
  const healthComposition = useMemo(() => calculateDetailedHealthComposition(filteredRecords), [filteredRecords]);
  const rootCauses = useMemo(() => generateRootCauseAnalysis(filteredRecords), [filteredRecords]);
  const executiveAlerts = useMemo(() => generateExecutiveAlerts(filteredRecords), [filteredRecords]);

  if (isLoading && filteredRecords.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111827] tracking-normal leading-[1.3] flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] border border-emerald-200 text-[#08C565] shadow-xs">
              <BrainCircuit className="w-6 h-6" />
            </div>
            Executive Decision Intelligence Platform
          </h1>
          <BusinessVerticalBadge />
          <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">
            Enterprise decision engine generating CEO briefing, health score compositions, root cause diagnostics, scenario simulations, and module drill-downs
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="badge-success flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#166534]" />
            Decision Intelligence Mode
          </span>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={refetchData} />}

      {/* Global Filter Toolbar */}
      <FilterBar />

      {filteredRecords.length === 0 && !isLoading ? (
        <EmptyVerticalState />
      ) : (
        <>
          {/* 1. Today's Business Summary (CEO Executive Briefing) */}
          <CEOBriefingSummary briefing={ceoBriefing} />

          {/* 2. Top Business Macro Insights */}
          <TopBusinessInsightsGrid records={filteredRecords} />

          {/* 3. Why Health Score Breakdown with Progress Bars */}
          <WhyHealthScoreBreakdown composition={healthComposition} />

          {/* 4. Interactive What-If Scenario Decision Simulator */}
          <WhatIfSimulationTool records={filteredRecords} />

          {/* 5. Data-Driven Root Cause Analysis Engine */}
          <RootCauseAnalysisCard items={rootCauses} />

          {/* 6. Executive Alert Center & Risk Priority Matrix */}
          <ExecutiveAlertCenter alerts={executiveAlerts} />

          {/* 7. Smart Decision Recommendations & Action Cards */}
          <SmartActionCards records={filteredRecords} />

          {/* 8. AI Business Insights Grid */}
          <AIBusinessInsightsGrid records={filteredRecords} />

          {/* 9. Top 5 vs Bottom 5 Executive Performance Tables */}
          <TopBottomExecutiveTables records={filteredRecords} />
        </>
      )}
    </div>
  );
}
