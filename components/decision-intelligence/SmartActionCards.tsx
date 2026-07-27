'use client';

import React from 'react';
import Link from 'next/link';
import { generateActionRecommendations } from '@/lib/salesExecutiveMetrics';
import { aggregateExecutiveStats } from '@/lib/salesExecutiveMetrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Lightbulb, Zap, ExternalLink } from 'lucide-react';

interface SmartActionCardsProps {
  records: ZohoRecord[];
}

export const SmartActionCards: React.FC<SmartActionCardsProps> = ({ records }) => {
  const execStats = aggregateExecutiveStats(records);
  const recommendations = generateActionRecommendations(execStats);

  const getModuleRoute = (targetExec: string): string => {
    if (targetExec.includes('Collection') || targetExec.includes('Pending')) return '/operations';
    if (targetExec.includes('Learner') || targetExec.includes('Drop')) return '/learners';
    if (targetExec.includes('Sales') || targetExec.includes('Executive')) return '/sales-executive';
    return '/revenue';
  };

  const getModuleName = (route: string): string => {
    switch (route) {
      case '/operations':
        return 'Operations';
      case '/learners':
        return 'Learner 360°';
      case '/sales-executive':
        return 'Sales Executive';
      default:
        return 'Revenue';
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Lightbulb className="w-5 h-5 text-[#08C565]" />}
        title="Smart Decision Recommendations & Executive Action Cards"
        subtitle="Data-backed action cards outlining specific reasons, expected financial/operational impact, priority ratings, and drill-down links"
        badgeText="Action Engine"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const route = getModuleRoute(rec.title);
          const moduleName = getModuleName(route);

          const priorityBadgeClass =
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
                  <h4 className="text-[18px] font-semibold text-[#08C565] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#08C565] shrink-0" />
                    {rec.title}
                  </h4>
                  <span className={priorityBadgeClass}>
                    {rec.type === 'urgent' ? 'Critical' : rec.type === 'warning' ? 'High' : 'Medium'} Priority
                  </span>
                </div>

                {/* Reason in Dark Gray #374151 */}
                <p className="text-[14px] text-[#374151] leading-[1.6] font-normal mb-3">
                  <strong className="text-[#111827] font-semibold">Reason ({rec.targetExecutive}): </strong>
                  {rec.description}
                </p>

                {/* Impact */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#374151] font-mono mb-3">
                  <span className="text-[#0B9BC5] font-bold">Expected Impact: </span>
                  {rec.metric}
                </div>
              </div>

              {/* Suggested Action in Black #111827 & Drill Down Button */}
              <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-[#111827] font-semibold truncate">
                  Suggested Action: <span className="text-[#08C565] font-bold">{rec.recommendedAction}</span>
                </div>

                <Link
                  href={route}
                  className="btn-secondary flex items-center gap-1 text-xs shrink-0 self-start sm:self-auto"
                >
                  <span>Drill Down ({moduleName})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
