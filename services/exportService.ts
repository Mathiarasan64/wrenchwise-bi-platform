import { exportToCSV, exportToExcel, printReport, ExportSummaryKPIs } from '@/lib/exportUtils';

/**
 * Export Service dispatching multi-format report exports (CSV, Excel, PDF, Print)
 */
export const exportService = {
  toCSV: exportToCSV,
  toExcel: exportToExcel,
  print: printReport,
};
