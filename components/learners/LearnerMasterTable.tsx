'use client';

import React, { useMemo, useState } from 'react';
import { ZohoRecord } from '@/types';
import { calculateLearnerRisk } from '@/lib/learnerCrmEngine';
import { formatCurrency } from '@/lib/utils';
import { Table, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download, AlertTriangle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface LearnerMasterTableProps {
  records: ZohoRecord[];
  searchQuery: string;
  statusFilter: string;
  executiveFilter: string;
  selectedLearnerId: string | null;
  onSelectLearner: (id: string) => void;
}

type SortField = 'customerName' | 'course' | 'salesExecutive' | 'amountCollected' | 'pendingAmount' | 'learnerStatus' | 'risk';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 15;

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Active':
      return 'badge-success';
    case 'Hold':
      return 'badge-warning';
    case 'Dropped':
      return 'badge-danger';
    case 'Not On-boarded':
      return 'badge-info';
    case 'Onboarded - Not Active':
      return 'badge-info';
    default:
      return 'badge-secondary';
  }
};

const riskBadgeMap: Record<string, { cls: string; Icon: typeof Shield }> = {
  'Low Risk': { cls: 'text-[#08C565]', Icon: ShieldCheck },
  'Medium Risk': { cls: 'text-[#F59E0B]', Icon: Shield },
  'High Risk': { cls: 'text-[#F59E0B]', Icon: ShieldAlert },
  'Critical Risk': { cls: 'text-[#DC2626]', Icon: AlertTriangle },
};

export const LearnerMasterTable: React.FC<LearnerMasterTableProps> = ({
  records,
  searchQuery,
  statusFilter,
  executiveFilter,
  selectedLearnerId,
  onSelectLearner,
}) => {
  const [sortField, setSortField] = useState<SortField>('risk');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);

  const enriched = useMemo(() => {
    return records.map((r) => ({
      ...r,
      risk: calculateLearnerRisk(r),
    }));
  }, [records]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return enriched.filter((r) => {
      if (statusFilter !== 'All' && r.learnerStatus !== statusFilter) return false;
      if (executiveFilter !== 'All' && r.salesExecutive !== executiveFilter) return false;
      if (q) {
        const haystack = [
          r.customerName,
          r.id,
          r.course,
          r.section,
          r.salesExecutive,
          r.learnerStatus,
          r.operationsObservation,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, searchQuery, statusFilter, executiveFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'customerName':
          cmp = (a.customerName || '').localeCompare(b.customerName || '');
          break;
        case 'course':
          cmp = (a.course || '').localeCompare(b.course || '');
          break;
        case 'salesExecutive':
          cmp = (a.salesExecutive || '').localeCompare(b.salesExecutive || '');
          break;
        case 'amountCollected':
          cmp = (a.amountCollected || 0) - (b.amountCollected || 0);
          break;
        case 'pendingAmount':
          cmp = (a.pendingAmount || 0) - (b.pendingAmount || 0);
          break;
        case 'learnerStatus':
          cmp = (a.learnerStatus || '').localeCompare(b.learnerStatus || '');
          break;
        case 'risk':
          cmp = a.risk.score - b.risk.score;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(0);
  };

  const exportCsv = () => {
    const headers = ['Learner', 'Course', 'Executive', 'Collected', 'Pending', 'Status', 'Risk Score', 'Risk Level'];
    const rows = sorted.map((r) => [
      r.customerName || r.salesExecutive,
      r.course || r.section,
      r.salesExecutive,
      r.amountCollected,
      r.pendingAmount,
      r.learnerStatus,
      r.risk.score,
      r.risk.category,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learner_360_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-[#08C565]" />
    ) : (
      <ChevronDown className="w-3 h-3 text-[#08C565]" />
    );
  };

  return (
    <div className="ww-card overflow-hidden shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#111827]">Learner Master Registry</span>
            <span className="text-xs text-[#6B7280] block font-normal">{sorted.length} candidates</span>
          </div>
        </div>
        <button
          onClick={exportCsv}
          className="btn-primary text-xs flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="ww-table">
          <thead>
            <tr>
              {[
                { key: 'customerName' as SortField, label: 'Learner' },
                { key: 'course' as SortField, label: 'Course' },
                { key: 'salesExecutive' as SortField, label: 'Executive' },
                { key: 'amountCollected' as SortField, label: 'Collected' },
                { key: 'pendingAmount' as SortField, label: 'Pending' },
                { key: 'learnerStatus' as SortField, label: 'Status' },
                { key: 'risk' as SortField, label: 'Risk' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="sortable select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[#6B7280] italic">
                  No learners match the current filters.
                </td>
              </tr>
            ) : (
              pageData.map((r) => {
                const riskInfo = riskBadgeMap[r.risk.category] || riskBadgeMap['Low Risk'];
                const RiskIcon = riskInfo.Icon;
                const isSelected = selectedLearnerId === r.id;

                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectLearner(r.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'bg-[#DCFCE7]/30 border-l-4 border-l-[#08C565]' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#DBEAFE] border border-blue-200 flex items-center justify-center text-xs font-bold text-[#0B9BC5] shrink-0">
                          {(r.customerName || r.salesExecutive || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[#111827] truncate max-w-[160px]">
                            {r.customerName || r.salesExecutive || 'Candidate'}
                          </div>
                          <div className="text-xs text-[#6B7280] font-mono font-normal">{r.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-[#374151] truncate max-w-[120px]">{r.course || r.section}</td>
                    <td className="text-[#374151] truncate max-w-[120px]">{r.salesExecutive}</td>
                    <td className="font-mono font-bold text-[#08C565]">{formatCurrency(r.amountCollected || 0)}</td>
                    <td className="font-mono font-bold text-[#F59E0B]">{formatCurrency(r.pendingAmount || 0)}</td>
                    <td>
                      <span className={getStatusBadgeClass(r.learnerStatus)}>
                        {r.learnerStatus || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <div className={`flex items-center gap-1.5 ${riskInfo.cls}`}>
                        <RiskIcon className="w-3.5 h-3.5" />
                        <span className="font-bold text-xs">{r.risk.score}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
        <span className="text-xs text-[#6B7280] font-medium">
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-ghost p-1.5 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-ghost p-1.5 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
