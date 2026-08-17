'use client';

import React, { useState, useMemo } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Table, Search, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface ReportPreviewTableProps {
  reportTitle: string;
  rows: any[];
  allColumns: string[];
  visibleColumns: string[];
  onToggleColumn: (col: string) => void;
}

export const ReportPreviewTable: React.FC<ReportPreviewTableProps> = ({
  reportTitle,
  rows,
  allColumns,
  visibleColumns,
  onToggleColumn,
}) => {
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>(allColumns[0] || 'salesExecutive');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [showColumnPicker, setShowColumnPicker] = useState<boolean>(false);
  const pageSize = 10;

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const query = search.toLowerCase();
    return rows.filter((r) =>
      allColumns.some((col) => {
        const val = r[col];
        return val !== undefined && String(val).toLowerCase().includes(query);
      })
    );
  }, [rows, search, allColumns]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA || '').localeCompare(String(valB || ''))
        : String(valB || '').localeCompare(String(valA || ''));
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const formatHeaderName = (col: string): string => {
    const map: Record<string, string> = {
      section: 'Section / MIS',
      salesExecutive: 'Sales Executive',
      totalLearners: 'Total Learners',
      activeLearners: 'Active Learners',
      onboardedNotActive: 'Onboarded Not Active',
      hold: 'Hold Learners',
      notOnboarded: 'Not On-boarded',
      dropped: 'Dropped Learners',
      originalSalesValue: 'Original Sales',
      totalSalesValue: 'Total Sales',
      activeSalesValue: 'Active Sales',
      droppedValue: 'Dropped Value',
      amountCollected: 'Amount Collected',
      pendingAmount: 'Pending Amount',
      collectionPercentage: 'Collection %',
      conversionRate: 'Conversion %',
      healthScore: 'Health Score',
      healthCategory: 'Category',
      operationsObservation: 'Operations Observation',
      learnerStatus: 'Learner Status',
      region: 'Region',
      status: 'Deal Status',
    };
    return map[col] || col;
  };

  return (
    <div className="ww-card p-6 shadow-card space-y-4">
      {/* Header Bar with Title, Search, and Column Picker Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SectionHeader
          icon={<Table className="w-5 h-5 text-[#08C565]" />}
          title={`Live Report Preview: ${reportTitle}`}
          subtitle="Real-time interactive data preview table with search, multi-column sorting, and column toggles"
          badgeText={`${rows.length} Rows`}
        />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Column Picker Trigger */}
          <button
            onClick={() => setShowColumnPicker((p) => !p)}
            className="btn-ghost text-xs flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#08C565]" />
            <span>Columns ({visibleColumns.length})</span>
          </button>
        </div>
      </div>

      {/* Column Visibility Picker Panel */}
      {showColumnPicker && (
        <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-2 animate-fadeIn">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
            Toggle Visible Report Columns
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {allColumns.map((col) => {
              const isChecked = visibleColumns.includes(col);

              return (
                <label
                  key={col}
                  className={`flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-lg border transition-colors ${
                    isChecked
                      ? 'bg-[#DCFCE7] border-emerald-300 text-[#166534]'
                      : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleColumn(col)}
                    className="rounded text-[#08C565] focus:ring-[#08C565]"
                  />
                  <span>{formatHeaderName(col)}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search preview data rows..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565]"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar relative w-full min-w-0">
        <table className="w-full text-left border-separate border-spacing-0 text-xs">
          <thead>
            <tr className="bg-[#F8FAFC]">
              {visibleColumns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className={`sticky top-0 z-20 py-3 px-4 border-b border-[#E5E7EB] bg-[#F8FAFC] cursor-pointer hover:bg-[#F1F5F9] transition-colors ${
                    col.toLowerCase().includes('value') ||
                    col.toLowerCase().includes('amount') ||
                    col.toLowerCase().includes('collected') ||
                    col.toLowerCase().includes('percentage') ||
                    col.toLowerCase().includes('rate')
                      ? 'text-right'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{formatHeaderName(col)}</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9CA3AF]" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, idx) => (
              <tr key={idx}>
                {visibleColumns.map((col) => {
                  let val = row[col];
                  const isCurrency =
                    typeof val === 'number' &&
                    (col.toLowerCase().includes('value') ||
                      col.toLowerCase().includes('amount') ||
                      col.toLowerCase().includes('revenue') ||
                      col.toLowerCase().includes('collected'));
                  const isPct = typeof val === 'number' && (col.toLowerCase().includes('percentage') || col.toLowerCase().includes('rate'));

                  return (
                    <td
                      key={col}
                      className={
                        isCurrency
                          ? 'numeric font-bold text-[#0B9BC5]'
                          : isPct
                          ? 'numeric font-bold text-[#08C565]'
                          : ''
                      }
                    >
                      {isCurrency
                        ? formatCurrency(val)
                        : isPct
                        ? formatPercent(val)
                        : val !== undefined
                        ? String(val)
                        : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] text-xs text-[#6B7280]">
        <div>
          Showing {paginated.length} of {sorted.length} records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-ghost p-1.5 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-[#111827]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-ghost p-1.5 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
