'use client';

import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { WorkQueueRow, getOperationsWorkQueue } from '@/lib/operationsMetrics';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Table, Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';

interface OperationsWorkQueueTableProps {
  records: ZohoRecord[];
  activeCategoryFilter?: string | null;
  onSelectExecutive?: (name: string) => void;
}

export const OperationsWorkQueueTable: React.FC<OperationsWorkQueueTableProps> = ({
  records,
  activeCategoryFilter = null,
  onSelectExecutive,
}) => {
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<keyof WorkQueueRow>('priority');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const allRows = useMemo(() => getOperationsWorkQueue(records), [records]);

  // Apply Category Filter & Search Filter
  const filtered = useMemo(() => {
    return allRows.filter((r) => {
      // Category filter check
      if (activeCategoryFilter === 'Pending Collection' && r.pendingAmount <= 0) return false;
      if (activeCategoryFilter === 'Hold Learners' && r.hold <= 0) return false;
      if (activeCategoryFilter === 'Dropped' && r.dropped <= 0) return false;
      if (
        activeCategoryFilter === 'Operations Observation' &&
        (!r.operationsObservation || r.operationsObservation.includes('No critical'))
      )
        return false;

      // Search check
      const query = search.toLowerCase();
      return (
        r.salesExecutive.toLowerCase().includes(query) ||
        r.operationsObservation.toLowerCase().includes(query) ||
        r.priority.toLowerCase().includes(query) ||
        r.status.toLowerCase().includes(query)
      );
    });
  }, [allRows, search, activeCategoryFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (sortField === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        const scoreA = priorityOrder[a.priority] || 0;
        const scoreB = priorityOrder[b.priority] || 0;
        return sortAsc ? scoreA - scoreB : scoreB - scoreA;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filtered, sortField, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const handleSort = (field: keyof WorkQueueRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const exportData = sorted.map((r) => ({
      'Sales Executive': r.salesExecutive,
      'Pending Amount': r.pendingAmount,
      'Hold Learners': r.hold,
      'Dropped Learners': r.dropped,
      'Collection %': `${r.collectionPercentage.toFixed(1)}%`,
      'Operations Observation': r.operationsObservation,
      Priority: r.priority,
      Status: r.status,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `WrenchWise_Operations_Work_Queue_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="ww-card p-6 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SectionHeader
          icon={<Table className="w-5 h-5 text-[#08C565]" />}
          title="Operations Work Queue Table"
          subtitle="Real-time action task queue prioritizing accounts with pending balances and candidate holds"
          badgeText="Work Queue"
        />

        <button
          onClick={handleExportCSV}
          className="btn-primary text-xs flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search executive, observation, status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565]"
        />
      </div>

      {/* Table with Sticky Header */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="ww-table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('salesExecutive')}>
                <div className="flex items-center gap-1">
                  Sales Executive <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-right cursor-pointer" onClick={() => handleSort('pendingAmount')}>
                <div className="flex items-center justify-end gap-1">
                  Pending (₹) <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-center cursor-pointer" onClick={() => handleSort('hold')}>
                <div className="flex items-center justify-center gap-1">
                  Hold <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-center cursor-pointer" onClick={() => handleSort('dropped')}>
                <div className="flex items-center justify-center gap-1">
                  Dropped <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-right cursor-pointer" onClick={() => handleSort('collectionPercentage')}>
                <div className="flex items-center justify-end gap-1">
                  Collection % <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th>Operations Observation</th>

              <th className="text-center cursor-pointer" onClick={() => handleSort('priority')}>
                <div className="flex items-center justify-center gap-1">
                  Priority <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectExecutive && onSelectExecutive(row.salesExecutive)}
                className="cursor-pointer"
              >
                <td className="font-bold text-[#111827] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#08C565]" />
                    <span>{row.salesExecutive}</span>
                  </div>
                </td>

                <td className="text-right font-mono font-bold text-[#F59E0B] whitespace-nowrap">
                  {formatCurrency(row.pendingAmount)}
                </td>

                <td className="text-center font-mono font-bold text-[#111827]">
                  {row.hold}
                </td>

                <td className="text-center font-mono font-bold text-[#DC2626]">
                  {row.dropped}
                </td>

                <td className="text-right font-mono font-bold text-[#0B9BC5]">
                  {formatPercent(row.collectionPercentage)}
                </td>

                <td className="text-[#374151] text-xs max-w-xs truncate" title={row.operationsObservation}>
                  {row.operationsObservation}
                </td>

                <td className="text-center">
                  <span
                    className={
                      row.priority === 'High'
                        ? 'badge-priority-critical'
                        : row.priority === 'Medium'
                        ? 'badge-priority-high'
                        : 'badge-priority-medium'
                    }
                  >
                    {row.priority}
                  </span>
                </td>

                <td className="text-center">
                  <span
                    className={
                      row.status === 'Action Required'
                        ? 'badge-danger'
                        : 'badge-success'
                    }
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] text-xs text-[#6B7280]">
        <div>
          Showing {paginated.length} of {sorted.length} work items
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
