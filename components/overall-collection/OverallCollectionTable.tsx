'use client';

import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { useOverallCollectionData } from '@/context/OverallCollectionContext';
import { OverallCollectionRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { LearnerDetailModal } from './LearnerDetailModal';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  Table,
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Eye,
} from 'lucide-react';

export const OverallCollectionTable: React.FC = () => {
  const { filteredRecords, detectedMonths, selectedMonth } = useOverallCollectionData();
  const [selectedLearner, setSelectedLearner] = useState<OverallCollectionRecord | null>(null);

  const [sortField, setSortField] = useState<keyof OverallCollectionRecord>('studentName');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const pageSize = 10;
  const isMonthView = selectedMonth && selectedMonth !== 'Overall';

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (isMonthView) {
        if (sortField === 'amountCollected') {
          valA = a.monthPayments[selectedMonth]?.amount || 0;
          valB = b.monthPayments[selectedMonth]?.amount || 0;
        } else if (sortField === 'totalPayableFee') {
          valA = a.monthPayments[selectedMonth]?.expectedEmi || 0;
          valB = b.monthPayments[selectedMonth]?.expectedEmi || 0;
        } else if (sortField === 'pendingCollection') {
          const mA = a.monthPayments[selectedMonth];
          const mB = b.monthPayments[selectedMonth];
          valA = Math.max(0, (mA?.expectedEmi || 0) - (mA?.amount || 0));
          valB = Math.max(0, (mB?.expectedEmi || 0) - (mB?.amount || 0));
        }
      } else {
        if (sortField === 'pendingCollection') {
          valA = a.totalPayableFee > 0 ? Math.max(0, (a.totalPayableFee || 0) - (a.amountCollected || 0)) : 0;
          valB = b.totalPayableFee > 0 ? Math.max(0, (b.totalPayableFee || 0) - (b.amountCollected || 0)) : 0;
        }
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA || '').localeCompare(String(valB || ''))
        : String(valB || '').localeCompare(String(valA || ''));
    });
  }, [filteredRecords, sortField, sortAsc, isMonthView, selectedMonth]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, page]);

  const handleSort = (field: keyof OverallCollectionRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const exportData = sortedRecords.map((r) => ({
      'S.No': r.sNo,
      'Student Name': r.studentName,
      'Sales Executive': r.salesExecutive,
      'Business Vertical': r.businessVertical,
      Email: r.email,
      Phone: r.phone,
      Course: r.courseName,
      Shift: r.shift,
      'Enrolled Month': r.enrolledMonth,
      'Payment Type': r.paymentType,
      'Total Price': r.totalPrice,
      Advance: r.advance,
      'EMI Tenure': r.emiTenure,
      'Total Payable Fee': r.totalPayableFee,
      'Amount Collected': r.amountCollected,
      'Pending Amount': r.totalPayableFee > 0 ? Math.max(0, r.totalPayableFee - r.amountCollected) : 0,
      'Collection %': `${(r.totalPayableFee > 0 ? (r.amountCollected / r.totalPayableFee) * 100 : 0).toFixed(2)}%`,
      Status: r.learnerStatus,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Overall_Collection_Report_${selectedMonth || 'Overall'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = (e: React.MouseEvent, text: string, key: string) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-4 relative">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionHeader
          title={isMonthView ? `Learner Breakdown — ${selectedMonth}` : 'Overall Learner Collection Table'}
          subtitle={`Showing ${filteredRecords.length} records matching active filters.`}
          icon={<Table className="w-5 h-5 text-[#08C565]" />}
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="ww-button ww-button-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-semibold shadow-2xs"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#08C565]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="ww-card overflow-hidden border border-[#E5E7EB] bg-white rounded-2xl shadow-xs">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                {/* 1. Student Name */}
                <th
                  onClick={() => handleSort('studentName')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Student Name
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                {/* 2. Sales Executive */}
                <th
                  onClick={() => handleSort('salesExecutive')}
                  className="py-3 px-4 cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Sales Rep
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                {/* 3. Contact Info */}
                <th className="py-3 px-4">Contact</th>

                {/* 4. Course & Shift */}
                <th className="py-3 px-4">Course & Shift</th>

                {/* 5. Total Payable / EMI */}
                <th
                  onClick={() => handleSort('totalPayableFee')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    {isMonthView ? `Expected EMI (${selectedMonth})` : 'Total Payable'}
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                {/* 6. Amount Collected / Paid */}
                <th
                  onClick={() => handleSort('amountCollected')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    {isMonthView ? `Paid (${selectedMonth})` : 'Collected'}
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                {/* 7. Pending */}
                <th
                  onClick={() => handleSort('pendingCollection')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    {isMonthView ? `Pending EMI (${selectedMonth})` : 'Pending'}
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>

                {/* 8. Status */}
                <th className="py-3 px-4 text-center">
                  {isMonthView ? `Status (${selectedMonth})` : 'Status'}
                </th>

                {/* 9. Direct Action Button */}
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6B7280]">
                    No learner records match your active filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  let paymentUrl = '';
                  let statusStr = r.learnerStatus;
                  let expectedEmiDisplay = r.totalPayableFee > 0 ? formatCurrency(r.totalPayableFee) : '—';
                  let paidDisplay = formatCurrency(r.amountCollected);
                  const calcPending = r.totalPayableFee > 0 ? Math.max(0, (r.totalPayableFee || 0) - (r.amountCollected || 0)) : 0;
                  let pendingDisplay = r.totalPayableFee > 0 ? formatCurrency(calcPending) : '—';

                  if (isMonthView) {
                    const monthData = r.monthPayments[selectedMonth];
                    paymentUrl = monthData?.paymentLink || '';
                    statusStr = monthData?.status || 'Not Updated';
                    expectedEmiDisplay = monthData && monthData.hasExpectedEmi && monthData.expectedEmi > 0 ? formatCurrency(monthData.expectedEmi) : '—';
                    paidDisplay = monthData && monthData.hasAmount ? formatCurrency(monthData.amount) : '—';
                    const expVal = monthData?.expectedEmi || 0;
                    const pVal = monthData?.amount || 0;
                    pendingDisplay = monthData && monthData.hasExpectedEmi ? formatCurrency(Math.max(0, expVal - pVal)) : '—';
                  } else {
                    const latestMonthObj = detectedMonths.slice(-1)[0];
                    const latestData = latestMonthObj ? r.monthPayments[latestMonthObj.name] : null;
                    paymentUrl = latestData?.paymentLink || '';
                  }

                  const rowKey = `${r.id}-${selectedMonth}-tbl`;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedLearner(r)}
                      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      {/* Student Name */}
                      <td className="py-3 px-4 font-semibold text-[#111827]">
                        <div>{r.studentName}</div>
                        <div className="text-[10px] text-[#6B7280] font-normal">
                          {r.enrolledMonth} • {r.paymentType}
                        </div>
                      </td>

                      {/* Sales Executive */}
                      <td className="py-3 px-4 font-medium text-[#374151]">
                        {r.salesExecutive}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4 text-[#4B5563]">
                        <div className="text-[11px] font-mono select-all">{r.email || '—'}</div>
                        <div className="text-[10px] font-mono text-[#6B7280] select-all">{r.phone || '—'}</div>
                      </td>

                      {/* Course & Shift */}
                      <td className="py-3 px-4 text-[#374151]">
                        <div className="font-semibold text-[11px]">{r.courseName}</div>
                        <div className="text-[10px] text-[#6B7280]">{r.shift}</div>
                      </td>

                      {/* Payable Fee / Expected EMI */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#111827]">
                        {expectedEmiDisplay}
                      </td>

                      {/* Amount Collected / Paid Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#08C565]">
                        {paidDisplay}
                      </td>

                      {/* Pending Collection / Pending EMI */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#F59E0B]">
                        {pendingDisplay}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border inline-block ${
                            statusStr.toLowerCase() === 'active' || statusStr.toLowerCase() === 'paid' || statusStr.toLowerCase() === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : statusStr.toLowerCase() === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : statusStr.toLowerCase() === 'overdue'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {statusStr}
                        </span>
                      </td>

                      {/* Direct Single-Click Action Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLearner(r);
                          }}
                          className="p-1.5 rounded-lg text-[#08C565] hover:bg-[#DCFCE7] transition-all"
                          title="View Learner Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4B5563]">
          <div>
            Showing <span className="font-semibold text-[#111827]">{(page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-[#111827]">
              {Math.min(page * pageSize, sortedRecords.length)}
            </span>{' '}
            of <span className="font-semibold text-[#111827]">{sortedRecords.length}</span> learners
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-[#D1D5DB] bg-white disabled:opacity-40 hover:bg-[#F1F5F9] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-[#111827]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-[#D1D5DB] bg-white disabled:opacity-40 hover:bg-[#F1F5F9] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Learner Detail Modal Drawer */}
      <LearnerDetailModal
        learner={selectedLearner}
        onClose={() => setSelectedLearner(null)}
      />
    </div>
  );
};
