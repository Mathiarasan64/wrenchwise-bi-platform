'use client';

import React from 'react';
import { useOverallCollectionData } from '@/context/OverallCollectionContext';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { X, FileCheck, CheckCircle, AlertTriangle, Link2, Users, Calendar } from 'lucide-react';

interface ValidationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValidationReportModal: React.FC<ValidationReportModalProps> = ({ isOpen, onClose }) => {
  const { validationReport } = useOverallCollectionData();

  if (!isOpen || !validationReport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111827]">
                Zoho Collection Sheet Validation Report
              </h2>
              <p className="text-xs text-[#6B7280]">
                Live data integrity metrics and mathematical formula verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] transition-all"
            aria-label="Close Validation Report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
              <div className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1.5 mb-1">
                <FileCheck className="w-3.5 h-3.5 text-[#0B9BC5]" />
                Rows Loaded
              </div>
              <div className="text-lg font-bold font-mono text-[#111827]">
                {validationReport.rowsLoaded}
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
              <div className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-[#08C565]" />
                Total Learners
              </div>
              <div className="text-lg font-bold font-mono text-[#111827]">
                {validationReport.totalLearners}
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
              <div className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1.5 mb-1">
                <Link2 className="w-3.5 h-3.5 text-[#08C565]" />
                Links Found
              </div>
              <div className="text-lg font-bold font-mono text-[#08C565]">
                {validationReport.paymentLinksFound}
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB]">
              <div className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                Links Missing
              </div>
              <div className="text-lg font-bold font-mono text-[#F59E0B]">
                {validationReport.paymentLinksMissing}
              </div>
            </div>
          </div>

          {/* Detected Months */}
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] space-y-2">
            <div className="text-xs font-semibold text-[#374151] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#08C565]" />
              Detected Payment Months ({validationReport.monthsDetected.length})
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {validationReport.monthsDetected.length === 0 ? (
                <span className="text-xs text-[#9CA3AF] italic">No months detected</span>
              ) : (
                validationReport.monthsDetected.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-semibold text-[#111827] shadow-2xs"
                  >
                    {m}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Financial Validation Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Financial Totals & Formulas
            </h3>
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#4B5563] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Metric</th>
                    <th className="py-2.5 px-4 text-right">Validated Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] font-mono">
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-[#111827]">
                      Total Payable Fee
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#111827]">
                      {formatCurrency(validationReport.totalPayableFee)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-[#08C565]">
                      Amount Collected
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#08C565]">
                      {formatCurrency(validationReport.amountCollected)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-[#F59E0B]">
                      Pending Collection
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#F59E0B]">
                      {formatCurrency(validationReport.pendingCollection)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-[#08C565]">
                      Collection %
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#08C565]">
                      {formatPercent(validationReport.collectionPercentage)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-[#DC2626]">
                      Pending Learners Count
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#DC2626]">
                      {validationReport.pendingLearners}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex justify-between items-center text-xs text-[#6B7280]">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle className="w-4 h-4 text-[#08C565]" />
            100% Calculated Directly from Live CSV
          </span>
          <button
            onClick={onClose}
            className="ww-button ww-button-secondary text-xs py-2 px-4"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
