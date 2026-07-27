'use client';

import React, { useState, useMemo } from 'react';
import { useZohoData } from '@/context/DataContext';
import { useFilters } from '@/context/FilterContext';
import { REPORT_CONFIGS, ReportCategory, getReportRows } from '@/lib/reportEngine';
import { exportToCSV, exportToExcel, printReport, ExportSummaryKPIs } from '@/lib/exportUtils';
import { ReportHeader } from '@/components/reports/ReportHeader';
import { ReportFilterToolbar, ReportFilterState } from '@/components/reports/ReportFilterToolbar';
import { ReportCategoryCards } from '@/components/reports/ReportCategoryCards';
import { ReportSummaryBar } from '@/components/reports/ReportSummaryBar';
import { ReportPreviewTable } from '@/components/reports/ReportPreviewTable';
import { ExportOptionsBar } from '@/components/reports/ExportOptionsBar';
import { ExportHistoryLog, ExportHistoryRecord } from '@/components/reports/ExportHistoryLog';
import { BusinessVerticalBadge } from '@/components/common/BusinessVerticalBadge';
import { EmptyVerticalState } from '@/components/common/EmptyVerticalState';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { PageSkeleton } from '@/components/common/LoadingSkeleton';

export default function ReportsPage() {
  const { filteredRecords, isLoading, error, refetchData } = useZohoData();
  const { filters: globalFilters } = useFilters();

  // Active Report Category
  const [activeCategory, setActiveCategory] = useState<ReportCategory>('executive-summary');

  // Filter State
  const [filters, setFilters] = useState<ReportFilterState>({
    salesExecutive: 'All',
    learnerStatus: 'All',
    minCollectionPct: 0,
    searchQuery: '',
  });

  // Export History Audit Log
  const [history, setHistory] = useState<ExportHistoryRecord[]>([]);

  // Current Report Configuration
  const currentConfig = useMemo(
    () => REPORT_CONFIGS.find((c) => c.id === activeCategory) || REPORT_CONFIGS[0],
    [activeCategory]
  );

  // Column Visibility State per report
  const [visibleColumns, setVisibleColumns] = useState<string[]>(currentConfig.defaultColumns);

  // Sync visible columns when category changes
  const handleSelectCategory = (cat: ReportCategory) => {
    setActiveCategory(cat);
    const cfg = REPORT_CONFIGS.find((c) => c.id === cat) || REPORT_CONFIGS[0];
    setVisibleColumns(cfg.defaultColumns);
  };

  const handleToggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  // Filter dataset based on ReportFilterState
  const rawRows = useMemo(() => {
    return getReportRows(activeCategory, filteredRecords);
  }, [activeCategory, filteredRecords]);

  const reportRows = useMemo(() => {
    return rawRows.filter((r) => {
      if (filters.salesExecutive !== 'All' && r.salesExecutive !== filters.salesExecutive) {
        return false;
      }
      if (filters.learnerStatus !== 'All' && r.learnerStatus && r.learnerStatus !== filters.learnerStatus) {
        return false;
      }
      if (filters.minCollectionPct > 0 && (r.collectionPercentage || 0) < filters.minCollectionPct) {
        return false;
      }
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matches = Object.values(r).some((val) =>
          val !== undefined && String(val).toLowerCase().includes(query)
        );
        if (!matches) return false;
      }
      return true;
    });
  }, [rawRows, filters]);

  // Compute Summary KPIs for Current Report Data
  const summaryKPIs: ExportSummaryKPIs = useMemo(() => {
    let totalRevenue = 0;
    let amountCollected = 0;
    let pendingAmount = 0;
    let totalLearners = 0;
    let activeLearners = 0;
    let droppedLearners = 0;

    reportRows.forEach((r) => {
      totalRevenue += r.totalSalesValue || 0;
      amountCollected += r.amountCollected || 0;
      pendingAmount += r.pendingAmount || 0;
      totalLearners += r.totalLearners || 0;
      activeLearners += r.activeLearners || 0;
      droppedLearners += r.dropped || 0;
    });

    const collectionPercentage = totalRevenue > 0 ? (amountCollected / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      amountCollected,
      pendingAmount,
      collectionPercentage,
      totalLearners,
      activeLearners,
      droppedLearners,
    };
  }, [reportRows]);

  const logExport = (format: 'CSV' | 'Excel' | 'PDF' | 'Print') => {
    const newRecord: ExportHistoryRecord = {
      id: `exp-${Date.now()}`,
      reportName: currentConfig.title,
      generatedBy: 'Operations Manager',
      generatedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      exportFormat: format,
      rowCount: reportRows.length,
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  const handleExportCSV = () => {
    const bvLabel = globalFilters.businessVertical !== 'All' ? `Business Vertical: ${globalFilters.businessVertical}` : undefined;
    exportToCSV(currentConfig.title, reportRows, visibleColumns, summaryKPIs, bvLabel);
    logExport('CSV');
  };

  const handleExportExcel = () => {
    const bvLabel = globalFilters.businessVertical !== 'All' ? `Business Vertical: ${globalFilters.businessVertical}` : undefined;
    exportToExcel(currentConfig.title, reportRows, visibleColumns, summaryKPIs, bvLabel);
    logExport('Excel');
  };

  const handleExportPDF = () => {
    const parts: string[] = [];
    if (globalFilters.businessVertical !== 'All') parts.push(`Business Vertical: ${globalFilters.businessVertical}`);
    if (filters.salesExecutive !== 'All') parts.push(`Executive: ${filters.salesExecutive}`);
    const filterSummary = parts.length > 0 ? parts.join(' | ') : undefined;
    printReport(currentConfig.title, reportRows, visibleColumns, summaryKPIs, filterSummary);
    logExport('PDF');
  };

  const handlePrint = () => {
    const parts: string[] = [];
    if (globalFilters.businessVertical !== 'All') parts.push(`Business Vertical: ${globalFilters.businessVertical}`);
    if (filters.salesExecutive !== 'All') parts.push(`Executive: ${filters.salesExecutive}`);
    const filterSummary = parts.length > 0 ? parts.join(' | ') : undefined;
    printReport(currentConfig.title, reportRows, visibleColumns, summaryKPIs, filterSummary);
    logExport('Print');
  };

  if (isLoading && filteredRecords.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* 1. Header */}
      <ReportHeader />
      <BusinessVerticalBadge />

      {error && <ErrorAlert message={error} onRetry={refetchData} />}

      {/* 2. Report Filter Toolbar */}
      <ReportFilterToolbar
        filters={filters}
        onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
        onReset={() =>
          setFilters({
            salesExecutive: 'All',
            learnerStatus: 'All',
            minCollectionPct: 0,
            searchQuery: '',
          })
        }
      />

      {/* 3. Report Categories (6 Cards) */}
      {filteredRecords.length === 0 && !isLoading ? (
        <EmptyVerticalState />
      ) : (
        <>
          <ReportCategoryCards
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            onExportCategory={(cat) => {
              handleSelectCategory(cat);
              handleExportCSV();
            }}
          />

          {/* 4. Report Summary KPI Cards */}
          <ReportSummaryBar summary={summaryKPIs} />

          {/* 5. Report Preview Table with Column Toggles */}
          <ReportPreviewTable
            reportTitle={currentConfig.title}
            rows={reportRows}
            allColumns={currentConfig.defaultColumns}
            visibleColumns={visibleColumns}
            onToggleColumn={handleToggleColumn}
          />

          {/* 6. Export Options Bar */}
          <ExportOptionsBar
            reportTitle={currentConfig.title}
            rowCount={reportRows.length}
            onExportExcel={handleExportExcel}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
          />

          {/* 7. Export Audit & Activity History */}
          <ExportHistoryLog history={history} />
        </>
      )}
    </div>
  );
}
