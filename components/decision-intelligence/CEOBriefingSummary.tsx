'use client';

import React from 'react';
import { CEOBriefingData } from '@/lib/decisionIntelligenceEngine';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface CEOBriefingSummaryProps {
  briefing: CEOBriefingData;
}

export const CEOBriefingSummary: React.FC<CEOBriefingSummaryProps> = ({ briefing }) => {
  return (
    <div className="ww-card p-6 shadow-card space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <SectionHeader
          icon={<Sparkles className="w-5 h-5 text-[#08C565]" />}
          title="Today's Business Summary (CEO Executive Briefing)"
          subtitle="AI decision synthesis calculated dynamically from live Zoho Sheet CSV data"
          badgeText="Executive Intelligence"
        />

        <div className="badge-success flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#166534]" />
          <span>Status: {briefing.healthStatusText}</span>
        </div>
      </div>

      {/* Dynamic Synthesis Paragraph */}
      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-5">
        <p className="text-[15px] text-[#374151] leading-[1.6] font-medium">
          {briefing.summaryParagraph}
        </p>
      </div>

      {/* Key Takeaway Bullet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {briefing.keyTakeaways.map((takeaway, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#374151] font-medium shadow-xs"
          >
            <TrendingUp className="w-4 h-4 text-[#08C565] shrink-0 mt-0.5" />
            <span>{takeaway}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
