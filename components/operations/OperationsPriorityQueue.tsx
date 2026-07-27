'use client';

import React from 'react';
import { PriorityQueueItem } from '@/lib/operationsMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AlertOctagon, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface OperationsPriorityQueueProps {
  items: PriorityQueueItem[];
}

export const OperationsPriorityQueue: React.FC<OperationsPriorityQueueProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<AlertOctagon className="w-5 h-5 text-[#DC2626]" />}
        title="Operations Priority Queue"
        subtitle="Automated priority action cards categorizing critical pending balances, dropped learners, and representative action items"
        badgeText="Priority Queue"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isCritical = item.type === 'critical';
          const isWarning = item.type === 'warning';

          const cardClass = isCritical
            ? 'card-critical'
            : isWarning
            ? 'card-warning'
            : 'card-success';

          const titleClass = isCritical
            ? 'text-[#991B1B]'
            : isWarning
            ? 'text-[#92400E]'
            : 'text-[#166534]';

          const badgeClass = isCritical
            ? 'badge-priority-critical'
            : isWarning
            ? 'badge-priority-high'
            : 'badge-priority-low';

          return (
            <div
              key={item.id}
              className={`${cardClass} hover-lift p-5 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isCritical && <AlertOctagon className="w-5 h-5 text-[#DC2626] shrink-0" />}
                    {isWarning && <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />}
                    {!isCritical && !isWarning && <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />}
                    <h4 className={`text-[18px] font-semibold ${titleClass}`}>{item.title}</h4>
                  </div>
                  <span className={badgeClass}>
                    {item.type}
                  </span>
                </div>

                <div className="text-2xl font-extrabold font-mono text-[#111827] mt-1">
                  {item.count}
                </div>
                <p className="text-[14px] text-[#374151] leading-[1.6] font-normal mt-1.5">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] mt-3 flex items-center justify-between text-xs font-semibold text-[#08C565]">
                <span className="text-[#4B5563] text-xs font-normal">Action:</span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#111827]">
                  {item.actionText}
                  <ArrowRight className="w-3.5 h-3.5 text-[#08C565] shrink-0" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
