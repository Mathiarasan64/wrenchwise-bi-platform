'use client';

import React from 'react';
import Link from 'next/link';
import { ExecutiveAlertItem } from '@/lib/decisionIntelligenceEngine';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AlertOctagon, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

interface ExecutiveAlertCenterProps {
  alerts: ExecutiveAlertItem[];
}

export const ExecutiveAlertCenter: React.FC<ExecutiveAlertCenterProps> = ({ alerts }) => {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<ShieldAlert className="w-5 h-5 text-[#DC2626]" />}
        title="Executive Alert Center & Risk Priority Matrix"
        subtitle="Real-time automated risk classification across Revenue, Collection, Learner Retention, and Conversion Risk"
        badgeText="Priority Matrix"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';
          const isHigh = alert.severity === 'High';
          const isMedium = alert.severity === 'Medium';

          const cardClass = isCritical
            ? 'card-critical'
            : isHigh
            ? 'card-warning'
            : 'card-info';

          const titleClass = isCritical
            ? 'text-[#991B1B]'
            : isHigh
            ? 'text-[#92400E]'
            : 'text-[#1D4ED8]';

          const badgeClass = isCritical
            ? 'badge-priority-critical'
            : isHigh
            ? 'badge-priority-high'
            : 'badge-priority-medium';

          return (
            <div
              key={alert.id}
              className={`${cardClass} p-5 flex flex-col justify-between hover-lift`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[18px] font-semibold flex items-center gap-1.5 ${titleClass}`}>
                    {isCritical ? (
                      <AlertOctagon className="w-5 h-5 text-[#DC2626] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
                    )}
                    {alert.riskType}
                  </span>
                  <span className={badgeClass}>
                    {alert.severity} Risk
                  </span>
                </div>

                <p className="text-[14px] text-[#374151] leading-[1.6] font-normal mb-3">
                  <strong className="text-[#111827] font-semibold">Impact: </strong>
                  {alert.impactText}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                <span className="text-[14px] text-[#4B5563] font-normal truncate max-w-[170px]" title={alert.suggestedAction}>
                  {alert.suggestedAction}
                </span>

                <Link
                  href={alert.targetModule}
                  className="btn-primary text-xs flex items-center gap-1 shrink-0"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
