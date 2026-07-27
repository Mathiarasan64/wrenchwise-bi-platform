'use client';

import React from 'react';
import { LearningJourneyMilestone } from '@/lib/learnerCrmEngine';
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';

interface LearningJourneyTimelineProps {
  milestones: LearningJourneyMilestone[];
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; line: string }> = {
  completed: { icon: CheckCircle2, color: 'text-[#08C565]', line: 'bg-[#DCFCE7]' },
  current: { icon: Clock, color: 'text-[#F59E0B]', line: 'bg-[#FEF3C7]' },
  pending: { icon: Circle, color: 'text-[#9CA3AF]', line: 'bg-[#E5E7EB]' },
  failed: { icon: XCircle, color: 'text-[#DC2626]', line: 'bg-[#FEE2E2]' },
};

export const LearningJourneyTimeline: React.FC<LearningJourneyTimelineProps> = ({ milestones }) => {
  return (
    <div className="ww-card p-5 shadow-card border-l-6 border-l-[#0B9BC5]">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#0B9BC5] border border-blue-200">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[18px] font-semibold text-[#111827]">Learning Journey</span>
          <span className="text-xs text-[#6B7280] block font-normal">Candidate lifecycle milestones</span>
        </div>
      </div>

      <div className="relative">
        {milestones.map((m, idx) => {
          const cfg = statusConfig[m.status] || statusConfig.pending;
          const Icon = cfg.icon;
          const isLast = idx === milestones.length - 1;

          return (
            <div key={m.id} className="flex gap-4 group">
              {/* Timeline line + icon */}
              <div className="flex flex-col items-center">
                <div className={`p-1.5 rounded-full border ${
                  m.status === 'completed' ? 'border-emerald-300 bg-[#DCFCE7]' :
                  m.status === 'current' ? 'border-amber-300 bg-[#FEF3C7]' :
                  m.status === 'failed' ? 'border-red-300 bg-[#FEE2E2]' :
                  'border-[#E5E7EB] bg-[#F8FAFC]'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[32px] ${cfg.line}`} />
                )}
              </div>

              {/* Content */}
              <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#111827]">{m.stageName}</span>
                  <span className={`text-xs font-mono font-bold ${cfg.color}`}>
                    {m.dateText}
                  </span>
                </div>
                <p className="text-xs text-[#4B5563] mt-0.5 leading-[1.6] font-normal">{m.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
