import Papa from 'papaparse';

export interface ExportSummaryKPIs {
  totalRevenue: number;
  amountCollected: number;
  pendingAmount: number;
  collectionPercentage: number;
  totalLearners: number;
  activeLearners: number;
  droppedLearners: number;
}

function formatHeaderName(col: string): string {
  const map: Record<string, string> = {
    section: 'Section / MIS',
    salesExecutive: 'Sales Executive',
    totalLearners: 'Total Learners',
    activeLearners: 'Active Learners',
    onboardedNotActive: 'Onboarded Not Active',
    hold: 'Hold Learners',
    notOnboarded: 'Not On-boarded',
    dropped: 'Dropped Learners',
    originalSalesValue: 'Original Sales (₹)',
    totalSalesValue: 'Total Sales (₹)',
    activeSalesValue: 'Active Sales (₹)',
    droppedValue: 'Dropped Value (₹)',
    amountCollected: 'Amount Collected (₹)',
    pendingAmount: 'Pending Amount (₹)',
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
}

function formatCellValue(val: any, col: string): string {
  if (val === undefined || val === null) return '-';
  if (typeof val === 'number') {
    if (col.toLowerCase().includes('value') || col.toLowerCase().includes('amount') || col.toLowerCase().includes('revenue') || col.toLowerCase().includes('collected')) {
      return `₹${val.toLocaleString('en-IN')}`;
    }
    if (col.toLowerCase().includes('percentage') || col.toLowerCase().includes('rate')) {
      return `${val.toFixed(1)}%`;
    }
    return val.toLocaleString('en-IN');
  }
  return String(val);
}

function getFilterSummary(filterSummary?: string): string {
  return filterSummary || 'All Records (No filters applied)';
}

function getGeneratedDate(): string {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

export function exportToCSV(
  reportTitle: string,
  rows: any[],
  visibleColumns: string[],
  summaryKPIs?: ExportSummaryKPIs,
  filterSummary?: string
) {
  // Build metadata header rows
  const metaRows: string[][] = [
    ['WRENCH WISE BUSINESS INTELLIGENCE PLATFORM'],
    [`Company Name: Wrench Wise Operations`],
    [`Report: ${reportTitle}`],
    [`Generated Date: ${getGeneratedDate()}`],
    [`Filters: ${getFilterSummary(filterSummary)}`],
    [],
  ];

  // Summary KPI row
  if (summaryKPIs) {
    metaRows.push(['--- Summary KPIs ---']);
    metaRows.push([
      `Total Revenue: ₹${summaryKPIs.totalRevenue.toLocaleString('en-IN')}`,
      `Collected: ₹${summaryKPIs.amountCollected.toLocaleString('en-IN')}`,
      `Pending: ₹${summaryKPIs.pendingAmount.toLocaleString('en-IN')}`,
      `Collection: ${summaryKPIs.collectionPercentage.toFixed(1)}%`,
      `Learners: ${summaryKPIs.totalLearners.toLocaleString('en-IN')}`,
      `Active: ${summaryKPIs.activeLearners.toLocaleString('en-IN')}`,
      `Dropped: ${summaryKPIs.droppedLearners.toLocaleString('en-IN')}`,
    ]);
    metaRows.push([]);
  }

  // Format data rows
  const formattedRows = rows.map((r) => {
    const obj: Record<string, any> = {};
    visibleColumns.forEach((col) => {
      obj[formatHeaderName(col)] = formatCellValue(r[col], col);
    });
    return obj;
  });

  const dataCsv = Papa.unparse(formattedRows);
  const metaCsv = metaRows.map((row) => row.join(',')).join('\n');
  const fullCsv = metaCsv + '\n' + dataCsv;

  const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `WrenchWise_${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToExcel(
  reportTitle: string,
  rows: any[],
  visibleColumns: string[],
  summaryKPIs?: ExportSummaryKPIs,
  filterSummary?: string
) {
  // Uses CSV with official metadata headers
  exportToCSV(reportTitle, rows, visibleColumns, summaryKPIs, filterSummary);
}

export function printReport(
  reportTitle: string,
  rows: any[],
  visibleColumns: string[],
  summaryKPIs?: ExportSummaryKPIs,
  filterSummary?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const now = getGeneratedDate();
  const filters = getFilterSummary(filterSummary);

  const headersHtml = visibleColumns
    .map((col) => `<th style="padding:8px 12px; border:1px solid #e5e7eb; background:#f8fafc; text-align:left; font-size:10px; text-transform:uppercase; font-weight:700; color:#334155; white-space:nowrap;">${formatHeaderName(col)}</th>`)
    .join('');

  const rowsHtml = rows
    .map(
      (r, ri) =>
        `<tr style="background:${ri % 2 === 0 ? '#ffffff' : '#fafafa'};">${visibleColumns
          .map((col) => {
            const val = formatCellValue(r[col], col);
            const isNum = typeof r[col] === 'number';
            return `<td style="padding:6px 12px; border:1px solid #f1f5f9; font-size:10px; color:#1e293b; ${isNum ? 'text-align:right; font-family:monospace; font-weight:600;' : ''}">${val}</td>`;
          })
          .join('')}</tr>`
    )
    .join('');

  const summaryHtml = summaryKPIs
    ? `
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:20px;">
        <div style="padding:10px; border:1px solid #e5e7eb; border-radius:8px; background:#ffffff;">
          <div style="font-size:9px; font-weight:700; color:#64748b; text-transform:uppercase;">Total Revenue</div>
          <div style="font-size:15px; font-weight:800; color:#0B9BC5; margin-top:3px;">₹${summaryKPIs.totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div style="padding:10px; border:1px solid #e5e7eb; border-radius:8px; background:#ffffff;">
          <div style="font-size:9px; font-weight:700; color:#64748b; text-transform:uppercase;">Amount Collected</div>
          <div style="font-size:15px; font-weight:800; color:#08C565; margin-top:3px;">₹${summaryKPIs.amountCollected.toLocaleString('en-IN')}</div>
        </div>
        <div style="padding:10px; border:1px solid #e5e7eb; border-radius:8px; background:#ffffff;">
          <div style="font-size:9px; font-weight:700; color:#64748b; text-transform:uppercase;">Pending Amount</div>
          <div style="font-size:15px; font-weight:800; color:#d97706; margin-top:3px;">₹${summaryKPIs.pendingAmount.toLocaleString('en-IN')}</div>
        </div>
        <div style="padding:10px; border:1px solid #e5e7eb; border-radius:8px; background:#ffffff;">
          <div style="font-size:9px; font-weight:700; color:#64748b; text-transform:uppercase;">Collection %</div>
          <div style="font-size:15px; font-weight:800; color:#08C565; margin-top:3px;">${summaryKPIs.collectionPercentage.toFixed(1)}%</div>
        </div>
      </div>
    `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} - Wrench Wise Operations</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #111827; background-color: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #08C565; padding-bottom: 12px; margin-bottom: 20px; }
          .logo-container { display: flex; items-center: center; gap: 12px; }
          .logo-img { height: 40px; width: auto; object-contain: contain; }
          .logo-text { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
          .tagline { font-size: 9px; color: #08C565; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
          .meta { text-align: right; }
          .footer { margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 10px; font-size: 9px; color: #64748b; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          @media print {
            body { margin: 12px; }
            .no-break { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <img src="/wrenchwise-logo.jpg" alt="Wrench Wise Logo" class="logo-img" />
            <div>
              <div class="logo-text"><span style="color:#0B9BC5">WRENCH</span> <span style="color:#08C565">WISE</span> <span style="color:#64748b; font-size:12px;">BI</span></div>
              <div class="tagline">Innovate • Engineer • Excel</div>
            </div>
          </div>
          <div class="meta">
            <h2 style="margin:0; font-size:14px; text-transform:uppercase; font-weight:800; color:#111827;">${reportTitle}</h2>
            <div style="font-size:9px; color:#475569; margin-top:3px;"><strong>Company:</strong> Wrench Wise Operations</div>
            <div style="font-size:9px; color:#475569; margin-top:1px;"><strong>Generated Date:</strong> ${now}</div>
            <div style="font-size:9px; color:#0B9BC5; margin-top:1px;"><strong>Filters:</strong> ${filters}</div>
          </div>
        </div>

        ${summaryHtml}

        <table>
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Wrench Wise Business Intelligence Platform • Official Executive Document</div>
          <div>Total Records: ${rows.length} • Generated: ${now}</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
