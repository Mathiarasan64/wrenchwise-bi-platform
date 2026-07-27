'use client';

import React from 'react';
import { generateActionRecommendations } from '@/lib/salesExecutiveMetrics';
import { aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Lightbulb, Zap, ArrowRight } from 'lucide-react';

interface OperationsSmartAlertsProps {
  records: ZohoRecord[];
}

export const OperationsSmartAlerts: React.FC<OperationsSmartAlertsProps> = ({ records }) => {
  const execStats = aggregateExecutiveStats(records);
  const recommendations = generateActionRecommendations(execStats);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Zap className="w-5 h-5 text-[#08C565]" />}
        title="Operations Smart Alerts & Dynamic Action Plan"
        subtitle="Automated operational recommendations generated dynamically from live Zoho Sheet figures"
        badgeText="Operations Recommendations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const badgeClass =
            rec.type === 'urgent'
              ? 'badge-priority-critical'
              : rec.type === 'warning'
              ? 'badge-priority-high'
              : 'badge-priority-medium';

          return (
            <div
              key={rec.id}
              className="card-recommendation p-5 flex flex-col justify-between hover-lift"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#08C565] shrink-0" />
                    {rec.title}
                  </span>
                  <span className={badgeClass}>
                    Target: {rec.targetExecutive}
                  </span>
                </div>
                <p className="text-[14px] text-[#374151] leading-[1.6] font-normal mb-3">{rec.description}</p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-[#4B5563] font-normal">
                  Action: <strong className="text-[#111827] font-semibold">{rec.recommendedAction}</strong>
                </span>
                <button className="btn-secondary text-xs flex items-center gap-1 shrink-0 self-start sm:self-auto">
                  <span>Execute Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
