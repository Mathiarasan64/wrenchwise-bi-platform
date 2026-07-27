'use client';

import React from 'react';
import { PriorityAlert } from '@/lib/companyHealthMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AlertOctagon, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PriorityAlertsSectionProps {
  alerts: PriorityAlert[];
}

export const PriorityAlertsSection: React.FC<PriorityAlertsSectionProps> = ({ alerts }) => {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<ShieldAlert className="w-5 h-5 text-rose-400" />}
        title="Operational Priority Alerts"
        subtitle="Automated severity signals highlighting critical pending risks, collection delays, and healthy milestones"
        accentColor="amber"
        badgeText="Priority Alerts"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';
          const isHealthy = alert.severity === 'healthy';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border backdrop-blur-md shadow-xl flex items-start gap-3.5 ${
                isCritical
                  ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                  : isWarning
                  ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                  : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  isCritical
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : isWarning
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {isCritical && <AlertOctagon className="w-5 h-5" />}
                {isWarning && <AlertTriangle className="w-5 h-5" />}
                {isHealthy && <CheckCircle2 className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-slate-100">{alert.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                <div className="text-[11px] font-mono font-bold mt-1.5 opacity-90">
                  Signal Metric: {alert.metric}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
