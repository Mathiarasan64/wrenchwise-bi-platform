'use client';

import React from 'react';
import { LearnerCrmProfile } from '@/lib/learnerCrmEngine';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { DollarSign, Wallet, Clock, Percent, CreditCard, Receipt } from 'lucide-react';

interface LearnerFinancialOverviewProps {
  profile: LearnerCrmProfile;
}

export const LearnerFinancialOverview: React.FC<LearnerFinancialOverviewProps> = ({ profile }) => {
  const outstanding = Math.max(0, profile.totalSalesValue - profile.amountCollected);
  const progressPct = profile.totalSalesValue > 0
    ? Math.min(100, (profile.amountCollected / profile.totalSalesValue) * 100)
    : 0;

  const cards = [
    {
      label: 'Course Fee',
      value: formatCurrency(profile.totalSalesValue),
      icon: DollarSign,
      color: 'bg-[#DBEAFE] text-[#0B9BC5]',
      textColor: 'text-[#0B9BC5]',
    },
    {
      label: 'Collected',
      value: formatCurrency(profile.amountCollected),
      icon: Wallet,
      color: 'bg-[#DCFCE7] text-[#08C565]',
      textColor: 'text-[#08C565]',
    },
    {
      label: 'Pending',
      value: formatCurrency(profile.pendingAmount),
      icon: Clock,
      color: 'bg-[#FEF3C7] text-[#F59E0B]',
      textColor: 'text-[#F59E0B]',
    },
    {
      label: 'Collection %',
      value: formatPercent(profile.collectionPercentage),
      icon: Percent,
      color: 'bg-[#DBEAFE] text-[#0B9BC5]',
      textColor: 'text-[#0B9BC5]',
    },
    {
      label: 'Registration',
      value: profile.amountCollected > 0 ? formatCurrency(Math.min(profile.amountCollected, profile.totalSalesValue * 0.2)) : 'N/A',
      icon: CreditCard,
      color: 'bg-[#F3E8FF] text-[#7C3AED]',
      textColor: 'text-[#7C3AED]',
    },
    {
      label: 'Outstanding',
      value: formatCurrency(outstanding),
      icon: Receipt,
      color: 'bg-[#FEE2E2] text-[#DC2626]',
      textColor: 'text-[#DC2626]',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="ww-card p-3.5 shadow-card hover-lift"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{c.label}</span>
                <div className={`p-1.5 rounded-lg ${c.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className={`text-base font-bold font-mono ${c.textColor}`}>{c.value}</div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="ww-card p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#111827]">Payment Realization Progress</span>
          <span className="text-xs font-mono font-bold text-[#0B9BC5]">{progressPct.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              background: progressPct >= 70
                ? '#08C565'
                : progressPct >= 40
                ? '#F59E0B'
                : '#DC2626',
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-[#6B7280]">{formatCurrency(0)}</span>
          <span className="text-[10px] text-[#6B7280]">{formatCurrency(profile.totalSalesValue)}</span>
        </div>
      </div>
    </div>
  );
};
