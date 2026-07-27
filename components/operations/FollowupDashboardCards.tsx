'use client';

import React from 'react';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { Clock, UserMinus, UserX, UserPlus, FileText, Filter } from 'lucide-react';

interface FollowupDashboardCardsProps {
  records: ZohoRecord[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const FollowupDashboardCards: React.FC<FollowupDashboardCardsProps> = ({
  records,
  activeCategory,
  onSelectCategory,
}) => {
  let pendingCount = 0;
  let pendingSum = 0;
  let holdCount = 0;
  let notOnboardedCount = 0;
  let droppedCount = 0;
  let observationCount = 0;

  records.forEach((r) => {
    if (r.pendingAmount > 0) {
      pendingCount++;
      pendingSum += r.pendingAmount;
    }
    if (r.hold > 0) holdCount += r.hold;
    if (r.notOnboarded > 0) notOnboardedCount += r.notOnboarded;
    if (r.dropped > 0) droppedCount += r.dropped;
    if (r.operationsObservation && r.operationsObservation !== '-') observationCount++;
  });

  const cards = [
    {
      id: 'Pending Collection',
      title: 'Pending Collection',
      count: pendingCount,
      subText: `${formatCurrency(pendingSum)} balance`,
      icon: <Clock className="w-5 h-5 text-[#F59E0B]" />,
      color: 'bg-[#FEF3C7] text-[#F59E0B]',
    },
    {
      id: 'Hold Learners',
      title: 'Hold Learners',
      count: holdCount,
      subText: 'Candidates paused',
      icon: <UserMinus className="w-5 h-5 text-[#F59E0B]" />,
      color: 'bg-[#FEF3C7] text-[#F59E0B]',
    },
    {
      id: 'Not On-boarded',
      title: 'Not On-boarded',
      count: notOnboardedCount,
      subText: 'Pre-onboarding prospects',
      icon: <UserPlus className="w-5 h-5 text-[#0B9BC5]" />,
      color: 'bg-[#DBEAFE] text-[#0B9BC5]',
    },
    {
      id: 'Dropped',
      title: 'Dropped Candidates',
      count: droppedCount,
      subText: 'Discontinued learners',
      icon: <UserX className="w-5 h-5 text-[#DC2626]" />,
      color: 'bg-[#FEE2E2] text-[#DC2626]',
    },
    {
      id: 'Operations Observation',
      title: 'Operations Notes',
      count: observationCount,
      subText: 'Observations logged',
      icon: <FileText className="w-5 h-5 text-[#08C565]" />,
      color: 'bg-[#DCFCE7] text-[#08C565]',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader
          icon={<Filter className="w-5 h-5 text-[#08C565]" />}
          title="Interactive Operations Follow-up Queue"
          subtitle="Click any category card below to cross-filter the work queue table, charts, and priority signals"
          badgeText="Click to Filter"
        />

        {activeCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="btn-ghost text-xs shrink-0"
          >
            Reset Category Filter ({activeCategory})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => {
          const isSelected = activeCategory === c.id;

          return (
            <div
              key={c.id}
              onClick={() => onSelectCategory(isSelected ? null : c.id)}
              className={`ww-card p-5 cursor-pointer transition-all duration-250 hover-lift ${
                isSelected
                  ? 'border-[#08C565] ring-2 ring-[#08C565]/30 bg-[#DCFCE7]/20'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{c.title}</span>
                <div className={`p-2 rounded-xl ${c.color}`}>{c.icon}</div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-bold font-mono text-[#111827]">{c.count}</div>
                {isSelected && (
                  <span className="badge-success text-[10px]">
                    Active Filter
                  </span>
                )}
              </div>

              <div className="text-xs text-[#4B5563] mt-1 font-normal">{c.subText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
