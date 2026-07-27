'use client';

import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { ExecutiveSummaryStats } from '@/lib/salesExecutiveMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Table, Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';

interface ExecutiveDataTableProps {
  execStats: ExecutiveSummaryStats[];
  onSelectExecutive?: (name: string) => void;
}

export const ExecutiveDataTable: React.FC<ExecutiveDataTableProps> = ({ execStats, onSelectExecutive }) => {
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<keyof ExecutiveSummaryStats>('healthScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const getBadgeClass = (category: string) => {
    switch (category) {
      case 'Excellent':
        return 'badge-success';
      case 'Good':
        return 'badge-info';
      case 'Average':
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  };

  const filtered = useMemo(() => {
    return execStats.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [execStats, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
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

  const handleSort = (field: keyof ExecutiveSummaryStats) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const exportData = sorted.map((e) => ({
      'Sales Executive': e.name,
      'Total Learners': e.totalLearners,
      'Active Learners': e.activeLearners,
      'Total Sales Value': e.totalSalesValue,
      'Amount Collected': e.amountCollected,
      'Pending Amount': e.pendingAmount,
      'Collection %': `${e.collectionPercentage.toFixed(1)}%`,
      'Conversion Rate %': `${e.conversionRate.toFixed(1)}%`,
      'Health Score': e.healthScore,
      'Health Category': e.healthCategory,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `WrenchWise_Sales_Executive_Performance_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="ww-card p-6 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SectionHeader
          icon={<Table className="w-5 h-5 text-[#08C565]" />}
          title="Sales Executive Master Data Table"
          subtitle="Searchable master performance directory with sorting, pagination, and direct CSV export"
          badgeText="Executive Directory"
        />

        <button
          onClick={handleExportCSV}
          className="btn-primary text-xs flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        <input
          type="text"
          placeholder="Search sales representative name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08C565]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="ww-table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Sales Executive <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-center cursor-pointer" onClick={() => handleSort('totalLearners')}>
                <div className="flex items-center justify-center gap-1">
                  Total Learners <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-right cursor-pointer" onClick={() => handleSort('totalSalesValue')}>
                <div className="flex items-center justify-end gap-1">
                  Revenue (₹) <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-right cursor-pointer" onClick={() => handleSort('amountCollected')}>
                <div className="flex items-center justify-end gap-1">
                  Collected (₹) <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-right cursor-pointer" onClick={() => handleSort('pendingAmount')}>
                <div className="flex items-center justify-end gap-1">
                  Pending (₹) <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-right cursor-pointer" onClick={() => handleSort('conversionRate')}>
                <div className="flex items-center justify-end gap-1">
                  Conversion % <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-right cursor-pointer" onClick={() => handleSort('collectionPercentage')}>
                <div className="flex items-center justify-end gap-1">
                  Collection % <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="text-center cursor-pointer" onClick={() => handleSort('healthScore')}>
                <div className="flex items-center justify-center gap-1">
                  Health Score <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((exec) => (
              <tr
                key={exec.name}
                onClick={() => onSelectExecutive && onSelectExecutive(exec.name)}
                className="cursor-pointer"
              >
                <td className="font-bold text-[#111827] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#08C565]" />
                    <span>{exec.name}</span>
                  </div>
                </td>

                <td className="text-center font-mono font-bold text-[#111827]">
                  {exec.totalLearners}
                </td>

                <td className="text-right font-mono font-bold text-[#0B9BC5]">
                  {formatCurrency(exec.totalSalesValue)}
                </td>

                <td className="text-right font-mono font-bold text-[#08C565]">
                  {formatCurrency(exec.amountCollected)}
                </td>

                <td className="text-right font-mono font-bold text-[#F59E0B]">
                  {formatCurrency(exec.pendingAmount)}
                </td>

                <td className="text-right font-mono font-bold text-[#0B9BC5]">
                  {formatPercent(exec.conversionRate)}
                </td>

                <td className="text-right font-mono font-bold text-[#08C565]">
                  {formatPercent(exec.collectionPercentage)}
                </td>

                <td className="text-center">
                  <span className={getBadgeClass(exec.healthCategory)}>
                    {exec.healthScore} / 100
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
          Showing {paginated.length} of {sorted.length} representatives
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
