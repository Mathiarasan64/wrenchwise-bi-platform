'use client';

import React, { useState, useMemo } from 'react';
import { ZohoRecord } from '@/types';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency, formatPercent, formatCount } from '@/lib/utils';
import {
  FileSpreadsheet,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building,
} from 'lucide-react';
import Papa from 'papaparse';

interface EnhancedDataTableProps {
  records: ZohoRecord[];
  isLoading?: boolean;
}

type SortField =
  | 'salesExecutive'
  | 'section'
  | 'totalLearners'
  | 'activeLearners'
  | 'hold'
  | 'dropped'
  | 'originalSalesValue'
  | 'totalSalesValue'
  | 'activeSalesValue'
  | 'amountCollected'
  | 'pendingAmount'
  | 'collectionPercentage';

export const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({ records, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('totalSalesValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Search filter
  const searchedRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const term = searchTerm.toLowerCase();
    return records.filter(
      (r) =>
        r.salesExecutive.toLowerCase().includes(term) ||
        r.section.toLowerCase().includes(term) ||
        r.operationsObservation.toLowerCase().includes(term)
    );
  }, [records, searchTerm]);

  // Sorting
  const sortedRecords = useMemo(() => {
    const copy = [...searchedRecords];
    copy.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [searchedRecords, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 ml-1 inline" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#08C565] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#08C565] ml-1 inline" />
    );
  };

  const handleExportCSV = () => {
    if (sortedRecords.length === 0) return;
    const exportData = sortedRecords.map((r) => ({
      'Sales Executive': r.salesExecutive,
      'MIS Section': r.section,
      'Total Learners': r.totalLearners,
      'Active Learners': r.activeLearners,
      'Onboarded - Not Active': r.onboardedNotActive,
      Hold: r.hold,
      'Not On-boarded': r.notOnboarded,
      Dropped: r.dropped,
      'Original Sales Value': r.originalSalesValue,
      'Total Sales Value': r.totalSalesValue,
      'Active Sales Value': r.activeSalesValue,
      'Amount Collected': r.amountCollected,
      'Pending Amount': r.pendingAmount,
      'Collection %': `${r.collectionPercentage.toFixed(2)}%`,
      'Operations Observation': r.operationsObservation,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `WrenchWise_Live_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden shadow-xs">
      {/* Header Toolbar */}
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#111827]">Operations Table</h3>
            <p className="text-xs text-[#6B7280] font-normal leading-[1.6]">Master Operational Dataset</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search executive or notes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565] w-full sm:w-64 font-normal"
            />
          </div>

          {/* Primary Green Button (#08C565) */}
          <button
            onClick={handleExportCSV}
            disabled={sortedRecords.length === 0}
            className="btn-primary flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export Live CSV
          </button>
        </div>
      </div>

      {sortedRecords.length === 0 ? (
        <EmptyState title="No Records Found" description="Unable to find matching records." />
      ) : (
        <div className="overflow-x-auto custom-scrollbar relative w-full min-w-0">
          <table className="w-full text-left border-separate border-spacing-0 text-xs">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th
                  onClick={() => handleSort('salesExecutive')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Sales Executive {renderSortIcon('salesExecutive')}
                </th>
                <th
                  onClick={() => handleSort('section')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  MIS Section {renderSortIcon('section')}
                </th>
                <th
                  onClick={() => handleSort('totalLearners')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Total {renderSortIcon('totalLearners')}
                </th>
                <th
                  onClick={() => handleSort('activeLearners')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Active {renderSortIcon('activeLearners')}
                </th>
                <th
                  onClick={() => handleSort('hold')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Hold {renderSortIcon('hold')}
                </th>
                <th
                  onClick={() => handleSort('dropped')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-center cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Dropped {renderSortIcon('dropped')}
                </th>
                <th
                  onClick={() => handleSort('totalSalesValue')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Total Sales (₹) {renderSortIcon('totalSalesValue')}
                </th>
                <th
                  onClick={() => handleSort('amountCollected')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Collected (₹) {renderSortIcon('amountCollected')}
                </th>
                <th
                  onClick={() => handleSort('pendingAmount')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Pending (₹) {renderSortIcon('pendingAmount')}
                </th>
                <th
                  onClick={() => handleSort('collectionPercentage')}
                  className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] text-right cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                >
                  Collection % {renderSortIcon('collectionPercentage')}
                </th>
                <th className="sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] max-w-xs">Operations Observation</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-[#111827] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#08C565]" />
                      {r.salesExecutive}
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-[#374151] text-xs font-medium border border-[#E5E7EB]">
                      <Building className="w-3.5 h-3.5 text-[#6B7280]" />
                      {r.section}
                    </span>
                  </td>
                  <td className="text-center font-bold text-[#111827]">{formatCount(r.totalLearners)}</td>
                  <td className="text-center font-bold text-[#08C565]">{formatCount(r.activeLearners)}</td>
                  <td className="text-center font-bold text-[#92400E]">{r.hold}</td>
                  <td className="text-center font-bold text-[#991B1B]">{r.dropped}</td>
                  <td className="text-right font-mono font-bold text-[#0B9BC5]">
                    {formatCurrency(r.totalSalesValue)}
                  </td>
                  <td className="text-right font-mono font-bold text-[#08C565]">
                    {formatCurrency(r.amountCollected)}
                  </td>
                  <td className="text-right font-mono font-bold text-[#F59E0B]">
                    {formatCurrency(r.pendingAmount)}
                  </td>
                  <td className="text-right font-mono font-bold text-[#0B9BC5]">
                    {formatPercent(r.collectionPercentage)}
                  </td>
                  <td className="text-[#374151] text-xs leading-[1.6] max-w-sm truncate font-normal" title={r.operationsObservation}>
                    {r.operationsObservation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="btn-secondary flex items-center gap-1 text-xs disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-sm text-[#374151] font-normal">
            Page <strong className="text-[#111827] font-semibold">{currentPage}</strong> of{' '}
            <strong className="text-[#111827] font-semibold">{totalPages}</strong>
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="btn-secondary flex items-center gap-1 text-xs disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
