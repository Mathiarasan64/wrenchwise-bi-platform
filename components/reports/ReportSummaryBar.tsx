'use client';

import React from 'react';
import { ExportSummaryKPIs } from '@/lib/exportUtils';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { DollarSign, Wallet, Clock, Percent, Users, UserCheck, UserX } from 'lucide-react';

interface ReportSummaryBarProps {
  summary: ExportSummaryKPIs;
}

export const ReportSummaryBar: React.FC<ReportSummaryBarProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {/* Total Revenue */}
      <div className="ww-card p-3 shadow-xs">
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-[#0B9BC5]" /> Revenue
        </div>
        <div className="text-base font-bold font-mono text-[#0B9BC5] mt-1">
          {formatCurrency(summary.totalRevenue)}
        </div>
      </div>

      {/* Amount Collected */}
      <div className="ww-card p-3 shadow-xs">
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
          <Wallet className="w-3.5 h-3.5 text-[#08C565]" /> Collected
        </div>
        <div className="text-base font-bold font-mono text-[#08C565] mt-1">
          {formatCurrency(summary.amountCollected)}
        </div>
      </div>

      {/* Pending Amount */}
      <div className="ww-card p-3 shadow-xs">
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#F59E0B]" /> Pending
        </div>
        <div className="text-base font-bold font-mono text-[#F59E0B] mt-1">
          {formatCurrency(summary.pendingAmount)}
        </div>
      </div>

      {/* Collection % */}
      <div className="ww-card p-3 shadow-xs">
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
          <Percent className="w-3.5 h-3.5 text-[#0B9BC5]" /> Collection %
        </div>
        <div className="text-base font-bold font-mono text-[#0B9BC5] mt-1">
          {formatPercent(summary.collectionPercentage)}
        </div>
      </div>

      {/* Total Learners */}
      <div className="ww-card p-3 shadow-xs">
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-[#08C565]" /> Learners
        </div>
        <div className="text-base font-bold font-mono text-[#111827] mt-1">
          {summary.totalLearners}
        </div>
      </div>

      {/* Active Learners */}
      <div className="ww-card p-3 shadow-xs">
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-[#08C565]" /> Active
        </div>
        <div className="text-base font-bold font-mono text-[#08C565] mt-1">
          {summary.activeLearners}
        </div>
      </div>

      {/* Dropped Learners */}
      <div className="ww-card p-3 shadow-xs col-span-2 sm:col-span-1">
        <div className="text-xs font-semibold text-[#6B7280] flex items-center gap-1">
          <UserX className="w-3.5 h-3.5 text-[#DC2626]" /> Dropped
        </div>
        <div className="text-base font-bold font-mono text-[#DC2626] mt-1">
          {summary.droppedLearners}
        </div>
      </div>
    </div>
  );
};
