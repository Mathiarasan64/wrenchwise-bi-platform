'use client';

import React, { useState } from 'react';
import { useZohoData } from '@/context/DataContext';
import { TableSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { UserCheck, Calendar, MapPin, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

export const DataPreviewTable: React.FC = () => {
  const { filteredRecords, isLoading } = useZohoData();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  if (isLoading) return <TableSkeleton />;
  if (filteredRecords.length === 0) return <EmptyState />;

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="ww-card overflow-hidden shadow-card">
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 bg-[#F8FAFC]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#111827]">
              Parsed Zoho Sheet Operations Table
            </h3>
            <p className="text-xs text-[#6B7280]">Live operational dataset processed by Zoho engine</p>
          </div>
        </div>
        <div className="text-xs text-[#4B5563] font-medium bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          Showing <span className="text-[#111827] font-semibold">{(currentPage - 1) * pageSize + 1}</span>-
          <span className="text-[#111827] font-semibold">
            {Math.min(currentPage * pageSize, filteredRecords.length)}
          </span>{' '}
          of <span className="text-[#0B9BC5] font-semibold">{filteredRecords.length}</span> records
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar relative w-full min-w-0">
        <table className="w-full text-left border-separate border-spacing-0 text-xs">
          <thead>
            <tr className="bg-[#F8FAFC]">
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">ID</th>
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">Date</th>
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">Sales Executive</th>
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">Customer Name</th>
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">Course Program</th>
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right">Amount (₹)</th>
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">Region</th>
              <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record) => (
              <tr key={record.id}>
                <td className="font-mono font-medium text-[#0B9BC5] p-4 border-b border-[#F3F4F6]">
                  {record.id}
                </td>
                <td className="text-[#6B7280] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>{formatDate(record.date)}</span>
                  </div>
                </td>
                <td className="font-semibold text-[#111827] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#08C565]" />
                    <span>{record.salesExecutive}</span>
                  </div>
                </td>
                <td className="font-semibold text-[#111827]">{record.customerName}</td>
                <td className="text-[#374151] max-w-xs truncate">{record.course}</td>
                <td className="text-right font-semibold text-[#08C565] font-mono">
                  {formatCurrency(record.amount)}
                </td>
                <td className="text-[#6B7280] whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                    <span>{record.region}</span>
                  </div>
                </td>
                <td className="text-center">
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-3.5 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="btn-ghost text-xs flex items-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs text-[#6B7280] font-medium">
            Page <strong className="text-[#111827]">{currentPage}</strong> of{' '}
            <strong className="text-[#111827]">{totalPages}</strong>
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="btn-ghost text-xs flex items-center gap-1 disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
