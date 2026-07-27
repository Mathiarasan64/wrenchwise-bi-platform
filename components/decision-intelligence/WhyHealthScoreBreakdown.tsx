'use client';

import React from 'react';
import { DetailedHealthComposition } from '@/lib/decisionIntelligenceEngine';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Activity, Plus, Minus, Award } from 'lucide-react';

interface WhyHealthScoreBreakdownProps {
  composition: DetailedHealthComposition;
}

export const WhyHealthScoreBreakdown: React.FC<WhyHealthScoreBreakdownProps> = ({ composition }) => {
  return (
    <div className="ww-card p-6 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <SectionHeader
          icon={<Activity className="w-5 h-5 text-[#08C565]" />}
          title="Why Health Score? (Composition Breakdown)"
          subtitle="Mathematical breakdown of positive growth drivers and operational penalty deductions"
          badgeText="Health Engine"
        />

        <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-[#E5E7EB] shrink-0">
          <Award className="w-5 h-5 text-[#08C565]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#6B7280]">Overall Score</div>
            <div className="text-xl font-extrabold font-mono text-[#08C565]">
              {composition.overallScore}/100
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Positive Drivers (+ Points) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#166534] uppercase tracking-wider">
            <Plus className="w-4 h-4 text-[#08C565]" />
            <span>Positive Growth Drivers (+ Points)</span>
          </div>

          {/* Collection Contribution */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#374151]">
              <span>Collection Realization</span>
              <span className="font-mono text-[#08C565] font-bold">+{composition.collectionContribution} / 30 pts</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div
                className="bg-[#08C565] h-full rounded-full transition-all duration-500"
                style={{ width: `${(composition.collectionContribution / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Revenue Contribution */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#374151]">
              <span>Revenue Realization</span>
              <span className="font-mono text-[#0B9BC5] font-bold">+{composition.revenueContribution} / 25 pts</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div
                className="bg-[#0B9BC5] h-full rounded-full transition-all duration-500"
                style={{ width: `${(composition.revenueContribution / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Conversion Contribution */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#374151]">
              <span>Conversion Efficiency</span>
              <span className="font-mono text-[#08C565] font-bold">+{composition.conversionContribution} / 25 pts</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div
                className="bg-[#08C565] h-full rounded-full transition-all duration-500"
                style={{ width: `${(composition.conversionContribution / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Learner Contribution */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#374151]">
              <span>Active Training Engagement</span>
              <span className="font-mono text-[#0B9BC5] font-bold">+{composition.activeLearnerContribution} / 20 pts</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div
                className="bg-[#0B9BC5] h-full rounded-full transition-all duration-500"
                style={{ width: `${(composition.activeLearnerContribution / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Operational Penalty Deductions (- Points) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#991B1B] uppercase tracking-wider">
            <Minus className="w-4 h-4 text-[#DC2626]" />
            <span>Operational Penalty Deductions (- Points)</span>
          </div>

          {/* Pending Penalty */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#374151]">
              <span>Pending Receivables Balance Penalty</span>
              <span className="font-mono text-[#F59E0B] font-bold">-{composition.pendingPenalty} pts</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div
                className="bg-[#F59E0B] h-full rounded-full transition-all duration-500"
                style={{ width: `${(composition.pendingPenalty / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Dropped Penalty */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#374151]">
              <span>Candidate Drop-off Rate Penalty</span>
              <span className="font-mono text-[#DC2626] font-bold">-{composition.droppedPenalty} pts</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div
                className="bg-[#DC2626] h-full rounded-full transition-all duration-500"
                style={{ width: `${(composition.droppedPenalty / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Revenue Leakage Penalty */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#374151]">
              <span>Revenue Leakage Value Penalty</span>
              <span className="font-mono text-[#DC2626] font-bold">-{composition.revenueLeakagePenalty} pts</span>
            </div>
            <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
              <div
                className="bg-[#DC2626] h-full rounded-full transition-all duration-500"
                style={{ width: `${(composition.revenueLeakagePenalty / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
