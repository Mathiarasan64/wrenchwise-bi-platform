'use client';

import React from 'react';
import Link from 'next/link';
import { RootCauseItem } from '@/lib/decisionIntelligenceEngine';
import { SectionHeader } from '@/components/common/SectionHeader';
import { HelpCircle, ArrowRight } from 'lucide-react';

interface RootCauseAnalysisCardProps {
  items: RootCauseItem[];
}

export const RootCauseAnalysisCard: React.FC<RootCauseAnalysisCardProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<HelpCircle className="w-5 h-5 text-[#08C565]" />}
        title="Data-Driven Root Cause Analysis Engine"
        subtitle="Automated root cause diagnostics identifying key operational friction points from live dataset values"
        badgeText="Root Cause Analysis"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="ww-card ww-card-hover p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-[#08C565] shrink-0" />
                <h4 className="text-[18px] font-semibold text-[#111827]">{item.question}</h4>
              </div>

              <p className="text-[14px] text-[#374151] leading-[1.6] font-normal mb-3">
                <strong className="text-[#0B9BC5] font-semibold">Root Cause: </strong>
                {item.rootCause}
              </p>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#374151] font-mono mb-3">
                <span className="text-[#08C565] font-bold">Data Evidence: </span>
                {item.supportingData}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#374151] truncate">
                {item.recommendation}
              </span>

              <Link
                href={item.targetModule}
                className="btn-ghost text-xs flex items-center gap-1 shrink-0"
              >
                <span>Drill Down</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
