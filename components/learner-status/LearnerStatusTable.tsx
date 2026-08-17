'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { useLearnerStatusData } from '@/context/LearnerStatusContext';

// ─── Status badge colours ────────────────────────────────────────────────────

function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase().trim();
  if (s === 'onboarded') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  if (s === 'not onboarded' || s === 'not on-boarded' || s === 'not onboarded') {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }
  if (s === 'dropped off' || s === 'dropped') {
    return 'bg-red-50 text-red-700 border border-red-200';
  }
  if (s === 'hold') {
    return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
  // Any other dynamic status — neutral blue
  return 'bg-blue-50 text-blue-700 border border-blue-200';
}

// ─── Empty state ─────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="p-4 rounded-2xl bg-[#F3F4F6] mb-4">
      <Users className="w-8 h-8 text-[#9CA3AF]" />
    </div>
    <p className="text-[15px] font-semibold text-[#374151] mb-1">
      No learners found
    </p>
    <p className="text-sm text-[#6B7280]">
      Try adjusting your filters or search query.
    </p>
  </div>
);

// ─── Table ────────────────────────────────────────────────────────────────────

export const LearnerStatusTable: React.FC = () => {
  const { filteredRecords, isLoading } = useLearnerStatusData();

  if (!isLoading && filteredRecords.length === 0) {
    return <EmptyState />;
  }

  return (
    /*
     * Responsive strategy:
     *  - Page never scrolls horizontally.
     *  - overflow-x-auto only on this table wrapper (mobile scrolls the table).
     */
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar relative">
        <table className="w-full text-left border-separate border-spacing-0 text-xs min-w-[520px]">
          {/* ── Header ─────────────────────────────────────────────── */}
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th
                scope="col"
                className="sticky top-0 z-20 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280] border-b border-[#E5E7EB] bg-[#F8FAFC] w-12"
              >
                #
              </th>
              <th
                scope="col"
                className="sticky top-0 z-20 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280] border-b border-[#E5E7EB] bg-[#F8FAFC]"
              >
                Sales Executive
              </th>
              <th
                scope="col"
                className="sticky top-0 z-20 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280] border-b border-[#E5E7EB] bg-[#F8FAFC]"
              >
                Learner Name
              </th>
              <th
                scope="col"
                className="sticky top-0 z-20 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280] border-b border-[#E5E7EB] bg-[#F8FAFC]"
              >
                Learner Status
              </th>
            </tr>
          </thead>

          {/* ── Body ───────────────────────────────────────────────── */}
          <tbody className="divide-y divide-[#F3F4F6]">
            {isLoading
              ? // Loading skeleton rows
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3.5">
                      <div className="h-3 w-6 bg-[#E5E7EB] rounded" />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="h-3 w-32 bg-[#E5E7EB] rounded" />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="h-3 w-40 bg-[#E5E7EB] rounded" />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="h-5 w-24 bg-[#E5E7EB] rounded-full" />
                    </td>
                  </tr>
                ))
              : filteredRecords.map((record, idx) => (
                  <tr
                    key={record.id}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Row number */}
                    <td className="px-5 py-3.5 text-[#9CA3AF] text-xs font-mono">
                      {idx + 1}
                    </td>

                    {/* Sales Executive */}
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-[#374151]">
                        {record.salesExecutive}
                      </span>
                    </td>

                    {/* Learner Name */}
                    <td className="px-5 py-3.5 text-[#111827] font-medium">
                      {record.learnerName}
                    </td>

                    {/* Learner Status badge */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          record.learnerStatus
                        )}`}
                      >
                        {record.learnerStatus}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer row count ─────────────────────────────────────────── */}
      {!isLoading && filteredRecords.length > 0 && (
        <div className="px-5 py-3 border-t border-[#F3F4F6] bg-[#F8FAFC]">
          <span className="text-xs text-[#9CA3AF]">
            Showing {filteredRecords.length}{' '}
            {filteredRecords.length === 1 ? 'learner' : 'learners'}
          </span>
        </div>
      )}
    </div>
  );
};
