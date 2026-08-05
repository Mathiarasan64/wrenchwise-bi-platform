'use client';

import React from 'react';
import { generateActionRecommendations } from '@/lib/salesExecutiveMetrics';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Lightbulb, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExecutiveActionRecommendationsProps {
  execStats: ExecutiveSummaryStats[];
}

export const ExecutiveActionRecommendations: React.FC<ExecutiveActionRecommendationsProps> = ({ execStats }) => {
  const recommendations = generateActionRecommendations(execStats);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Zap className="w-5 h-5 text-emerald-400" />}
        title="Executive Action Recommendations"
        subtitle="Automated operational recommendations generated dynamically from operational figures"
        accentColor="emerald"
        badgeText="Executive Action Plan"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-4.5 rounded-2xl border backdrop-blur-md shadow-xl flex flex-col justify-between ${
              rec.type === 'urgent'
                ? 'bg-rose-950/25 border-rose-800/60'
                : rec.type === 'warning'
                ? 'bg-amber-950/25 border-amber-800/60'
                : rec.type === 'opportunity'
                ? 'bg-sky-950/25 border-sky-800/60'
                : 'bg-emerald-950/25 border-emerald-800/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold text-slate-100 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                  {rec.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                  Target: {rec.targetExecutive}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{rec.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Recommended Strategy:</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                {rec.recommendedAction}
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
