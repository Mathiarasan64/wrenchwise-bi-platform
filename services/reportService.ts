import { ZohoRecord } from '@/types';
import { REPORT_CONFIGS, ReportCategory, getReportRows } from '@/lib/reportEngine';

/**
 * Report Service dispatching report templates and row generation
 */
export const reportService = {
  getConfigs: () => REPORT_CONFIGS,
  getReportRows: (category: ReportCategory, records: ZohoRecord[]) => getReportRows(category, records),
};
