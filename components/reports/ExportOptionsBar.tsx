'use client';

import React from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface ExportOptionsBarProps {
  reportTitle: string;
  rowCount: number;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
}

export const ExportOptionsBar: React.FC<ExportOptionsBarProps> = ({
  reportTitle,
  rowCount,
  onExportExcel,
  onExportCSV,
  onExportPDF,
  onPrint,
}) => {
  return (
    <div className="ww-card p-6 shadow-card space-y-4">
      <SectionHeader
        icon={<Download className="w-5 h-5 text-[#08C565]" />}
        title={`Export Options: ${reportTitle}`}
        subtitle="Export filtered data directly into Excel spreadsheets, CSV files, printable PDF, or hardcopy print format"
        badgeText="Export Engine"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Export to Excel (Green #16A34A Button) */}
        <div className="ww-card p-5 shadow-card flex flex-col justify-between hover-lift">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#DCFCE7] text-[#16A34A] border border-emerald-200 shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-[#111827]">Export to Excel (.xlsx)</div>
              <div className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">Full formatted spreadsheet ({rowCount} rows)</div>
            </div>
          </div>
          <button
            onClick={onExportExcel}
            className="w-full h-[44px] bg-[#16A34A] hover:bg-[#15803D] text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>

        {/* Export to CSV (Blue #2563EB Button) */}
        <div className="ww-card p-5 shadow-card flex flex-col justify-between hover-lift">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#DBEAFE] text-[#2563EB] border border-blue-200 shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-[#111827]">Export to CSV</div>
              <div className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">Raw data comma-separated file</div>
            </div>
          </div>
          <button
            onClick={onExportCSV}
            className="w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Export to PDF (Red #DC2626 Button) */}
        <div className="ww-card p-5 shadow-card flex flex-col justify-between hover-lift">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] border border-red-200 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-[#111827]">Export to PDF</div>
              <div className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">Branded executive report layout</div>
            </div>
          </div>
          <button
            onClick={onExportPDF}
            className="w-full h-[44px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>

        {/* Print Report (Gray #6B7280 Button) */}
        <div className="ww-card p-5 shadow-card flex flex-col justify-between hover-lift">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] shrink-0">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-[#111827]">Print Executive Report</div>
              <div className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-1">Direct browser print layout</div>
            </div>
          </div>
          <button
            onClick={onPrint}
            className="w-full h-[44px] bg-[#6B7280] hover:bg-[#4B5563] text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
