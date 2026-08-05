import Papa from 'papaparse';
import {
  OverallCollectionRecord,
  DetectedMonth,
  OverallCollectionMetrics,
  OverallCollectionFilterState,
  MonthPaymentData,
  ValidationReportData,
} from '@/types';

export interface OverallCollectionFetchResult {
  records: OverallCollectionRecord[];
  detectedMonths: DetectedMonth[];
  headers: string[];
  validationReport: ValidationReportData | null;
  syncStatus: 'success' | 'error';
  error: string | null;
  lastSync: Date | null;
}

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

/**
 * Safely parse currency or numeric strings into floats
 */
function safeParseNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  const str = String(val).trim();
  if (!str || str === '-' || str === 'NA' || str === 'N/A' || str === 'null' || str === 'undefined') {
    return 0;
  }
  const clean = str.replace(/[^0-9.-]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * Cleans payment URLs
 */
function cleanUrl(val: any): string {
  if (!val) return '';
  const str = String(val).trim();
  if (str.startsWith('http')) return str;
  return '';
}

let cachedResult: OverallCollectionFetchResult | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30_000;

/**
 * Dynamically detects month columns and parses Overall Collection Sheet CSV rows
 */
export function parseOverallCollectionSheet(rows: string[][]): {
  records: OverallCollectionRecord[];
  detectedMonths: DetectedMonth[];
  headers: string[];
  validationReport: ValidationReportData;
} {
  if (rows.length === 0) {
    const emptyValidation: ValidationReportData = {
      rowsLoaded: 0,
      monthsDetected: [],
      totalLearners: 0,
      totalPayableFee: 0,
      amountCollected: 0,
      pendingCollection: 0,
      collectionPercentage: 0,
      pendingLearners: 0,
      paymentLinksFound: 0,
      paymentLinksMissing: 0,
    };
    return { records: [], detectedMonths: [], headers: [], validationReport: emptyValidation };
  }

  const rawHeaders = rows[0].map((h) => String(h || '').trim());
  const cleanHeaders = rawHeaders.map((h) => h.toLowerCase());

  // Helper index lookup
  const findColIndex = (keywords: string[]): number => {
    return cleanHeaders.findIndex((h) => keywords.some((kw) => h.includes(kw)));
  };

  const sNoCol = findColIndex(['s.no', 'sno', 'sl.no', 'sl no']);
  const studentNameCol = findColIndex(['students name', 'student name', 'student', 'name']);
  const salesExecCol = findColIndex(['sales executive', 'executive', 'sales rep']);
  const businessVerticalCol = findColIndex(['business vertical', 'vertical']);
  const emailCol = findColIndex(['email']);
  const phoneCol = findColIndex(['phone no', 'phone', 'mobile']);
  const courseCol = findColIndex(['course name', 'course']);
  const enrolledMonthCol = findColIndex(['enrolled month', 'enrolled']);
  const shiftCol = findColIndex(['shift']);
  const paymentTypeCol = findColIndex(['payment type', 'paymenttype']);
  const totalPriceCol = findColIndex(['total price', 'price']);
  const advanceCol = findColIndex(['advance']);
  const emiTenureCol = findColIndex(['emi tenure', 'tenure']);
  const pendingCol = findColIndex(['pending']);
  const totalPayableFeeCol = findColIndex(['total payable fee', 'payable fee']);
  const learnerStatusCol = findColIndex(['learner status']);

  // Dynamic Month Detection
  // Header matching rules:
  // 1. Header equal to month name -> Paid Amount for that month
  // 2. Header starting with "Payment Link (" -> Payment URL
  // 3. Header starting with "Expected EMI Collection for" -> Expected EMI
  // 4. Header starting with "Payment Status (" -> Payment Status
  const detectedMonths: DetectedMonth[] = [];
  
  cleanHeaders.forEach((h, idx) => {
    const trimmedH = h.trim();
    if (
      MONTH_NAMES.includes(trimmedH) &&
      !trimmedH.startsWith('payment link') &&
      !trimmedH.startsWith('expected emi') &&
      !trimmedH.startsWith('payment status')
    ) {
      const monthDisplay = rawHeaders[idx]; // Preserve exact casing e.g. 'June'
      
      const linkIdx = cleanHeaders.findIndex(
        (lh) => (lh.startsWith('payment link (') || lh.includes('payment link')) && lh.includes(trimmedH)
      );
      const expectedIdx = cleanHeaders.findIndex(
        (eh) => (eh.startsWith('expected emi collection for') || eh.includes('expected emi')) && eh.includes(trimmedH)
      );
      const statusIdx = cleanHeaders.findIndex(
        (sh) => (sh.startsWith('payment status (') || sh.includes('payment status')) && sh.includes(trimmedH)
      );

      detectedMonths.push({
        name: monthDisplay,
        amountCol: rawHeaders[idx],
        linkCol: linkIdx >= 0 ? rawHeaders[linkIdx] : '',
        expectedCol: expectedIdx >= 0 ? rawHeaders[expectedIdx] : '',
        statusCol: statusIdx >= 0 ? rawHeaders[statusIdx] : '',
      });
    }
  });

  const records: OverallCollectionRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Check if entire row is empty
    const isRowEmpty = row.every((cell) => !cell || String(cell).trim() === '');
    if (isRowEmpty) continue;

    const studentName = studentNameCol >= 0 ? String(row[studentNameCol] || '').trim() : '';
    if (!studentName || studentName.toLowerCase() === 'students name' || studentName.toLowerCase() === 'student name') {
      continue; // Skip header duplicates or empty names
    }

    const sNo = sNoCol >= 0 ? safeParseNumber(row[sNoCol]) : i;
    const salesExecutive = salesExecCol >= 0 ? String(row[salesExecCol] || '').trim() : 'Unassigned';
    const rawBv = businessVerticalCol >= 0 ? String(row[businessVerticalCol] || '').trim() : '';
    const businessVertical = rawBv ? rawBv : salesExecutive.toUpperCase().includes('PAP') ? 'PAP' : 'B2C';
    const email = emailCol >= 0 ? String(row[emailCol] || '').trim() : '';
    const phone = phoneCol >= 0 ? String(row[phoneCol] || '').trim() : '';
    const courseName = courseCol >= 0 ? String(row[courseCol] || '').trim() : 'N/A';
    const enrolledMonth = enrolledMonthCol >= 0 ? String(row[enrolledMonthCol] || '').trim() : 'N/A';
    const shift = shiftCol >= 0 ? String(row[shiftCol] || '').trim() : 'N/A';
    const paymentType = paymentTypeCol >= 0 ? String(row[paymentTypeCol] || '').trim() : 'N/A';
    const totalPrice = totalPriceCol >= 0 ? safeParseNumber(row[totalPriceCol]) : 0;
    const advance = advanceCol >= 0 ? safeParseNumber(row[advanceCol]) : 0;
    const emiTenure = emiTenureCol >= 0 ? String(row[emiTenureCol] || '').trim() : '-';
    
    const rawPayable = totalPayableFeeCol >= 0 ? safeParseNumber(row[totalPayableFeeCol]) : 0;
    const totalPayableFee = totalPrice > 0 ? totalPrice : rawPayable;
    
    const learnerStatus = learnerStatusCol >= 0 ? String(row[learnerStatusCol] || '').trim() : 'Active';

    // Parse Month Payments for detected months
    const monthPayments: Record<string, MonthPaymentData> = {};
    let monthlyPaymentsSum = 0;

    detectedMonths.forEach((m) => {
      const amountIdx = rawHeaders.indexOf(m.amountCol);
      const linkIdx = m.linkCol ? rawHeaders.indexOf(m.linkCol) : -1;
      const expectedIdx = m.expectedCol ? rawHeaders.indexOf(m.expectedCol) : -1;
      const statusIdx = m.statusCol ? rawHeaders.indexOf(m.statusCol) : -1;

      const amt = amountIdx >= 0 ? safeParseNumber(row[amountIdx]) : 0;
      const link = linkIdx >= 0 ? cleanUrl(row[linkIdx]) : '';
      const exp = expectedIdx >= 0 ? safeParseNumber(row[expectedIdx]) : 0;
      const st = statusIdx >= 0 ? String(row[statusIdx] || '').trim() : 'N/A';

      monthPayments[m.name] = {
        monthName: m.name,
        amount: amt,
        paymentLink: link,
        expectedEmi: exp,
        status: st,
      };

      monthlyPaymentsSum += amt;
    });

    // Rule 2: Amount Collected = Advance + Sum of all detected month payment columns
    const amountCollected = advance + monthlyPaymentsSum;

    const pendingColumn = pendingCol >= 0 ? safeParseNumber(row[pendingCol]) : Math.max(0, totalPayableFee - amountCollected);
    const pendingCollection = pendingColumn;
    const collectionPercentage =
      totalPayableFee > 0 ? (amountCollected / totalPayableFee) * 100 : 0;

    records.push({
      id: `coll-${i}-${studentName.replace(/\s+/g, '-').toLowerCase()}`,
      sNo,
      studentName,
      salesExecutive,
      email,
      phone,
      courseName,
      enrolledMonth,
      shift,
      paymentType,
      totalPrice,
      advance,
      emiTenure,
      pendingColumn,
      totalPayableFee,
      businessVertical,
      learnerStatus,
      monthPayments,
      amountCollected,
      pendingCollection,
      collectionPercentage,
    });
  }

  const validationReport = generateValidationReport(rows, records, detectedMonths);

  return { records, detectedMonths, headers: rawHeaders, validationReport };
}

/**
 * Generate Validation Report Data
 */
export function generateValidationReport(
  rows: string[][],
  records: OverallCollectionRecord[],
  detectedMonths: DetectedMonth[]
): ValidationReportData {
  const rowsLoaded = rows.length;
  const monthsDetected = detectedMonths.map((m) => m.name);
  
  // Calculate validation metrics for Active + Inactive learners (excluding Closed)
  const nonClosedRecords = records.filter(
    (r) => r.learnerStatus.toLowerCase().trim() !== 'closed'
  );
  const metrics = calculateOverallCollectionMetrics(nonClosedRecords);

  let paymentLinksFound = 0;
  let paymentLinksMissing = 0;

  records.forEach((r) => {
    Object.values(r.monthPayments).forEach((m) => {
      if (m.paymentLink && m.paymentLink.startsWith('http')) {
        paymentLinksFound++;
      } else {
        paymentLinksMissing++;
      }
    });
  });

  return {
    rowsLoaded,
    monthsDetected,
    totalLearners: metrics.totalLearners,
    totalPayableFee: metrics.totalPayableFee,
    amountCollected: metrics.amountCollected,
    pendingCollection: metrics.pendingCollection,
    collectionPercentage: metrics.collectionPercentage,
    pendingLearners: metrics.pendingLearners,
    paymentLinksFound,
    paymentLinksMissing,
  };
}

/**
 * Fetch Live Overall Collection Data from /api/zoho-overall-collection
 */
export async function fetchOverallCollectionData(
  forceRefresh = false
): Promise<OverallCollectionFetchResult> {
  const now = Date.now();

  if (!forceRefresh && cachedResult && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedResult;
  }

  const targetUrl = forceRefresh
    ? `/api/zoho-overall-collection?refresh=true&t=${now}`
    : '/api/zoho-overall-collection';

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv,text/plain,*/*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorText = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const json = await response.json();
        if (json.error) errorText = json.error;
      } catch {}
      throw new Error(errorText);
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data || [];
          const { records, detectedMonths, headers, validationReport } = parseOverallCollectionSheet(rows);

          if (records.length === 0) {
            const errRes: OverallCollectionFetchResult = {
              records: [],
              detectedMonths: [],
              headers: [],
              validationReport: null,
              syncStatus: 'error',
              error: 'Failed to extract Overall Collection learner records from live CSV.',
              lastSync: new Date(),
            };
            resolve(errRes);
            return;
          }

          const successRes: OverallCollectionFetchResult = {
            records,
            detectedMonths,
            headers,
            validationReport,
            syncStatus: 'success',
            error: null,
            lastSync: new Date(),
          };

          cachedResult = successRes;
          lastFetchTime = Date.now();
          resolve(successRes);
        },
        error: (err: any) => {
          resolve({
            records: [],
            detectedMonths: [],
            headers: [],
            validationReport: null,
            syncStatus: 'error',
            error: `CSV Parsing Error: ${err.message}`,
            lastSync: new Date(),
          });
        },
      });
    });
  } catch (err: any) {
    console.error('Overall Collection fetch error:', err);

    if (cachedResult) {
      return cachedResult;
    }

    return {
      records: [],
      detectedMonths: [],
      headers: [],
      validationReport: null,
      syncStatus: 'error',
      error: err.message || 'Connection Error: Unable to fetch live Overall Collection Sheet.',
      lastSync: new Date(),
    };
  }
}

/**
 * Calculates 6 Summary KPI Metrics directly from filtered records
 * Supports cumulative 'Overall' mode or specific Month mode (e.g. 'June', 'July', etc.)
 */
export function calculateOverallCollectionMetrics(
  records: OverallCollectionRecord[],
  selectedMonth: string = 'Overall'
): OverallCollectionMetrics {
  const isMonthSelected = selectedMonth && selectedMonth !== 'Overall';

  if (isMonthSelected) {
    let expectedEmiCollection = 0;
    let amountCollected = 0;
    let paidLearners = 0;
    let pendingLearners = 0;

    records.forEach((r) => {
      const monthData = r.monthPayments[selectedMonth];
      if (monthData) {
        expectedEmiCollection += monthData.expectedEmi || 0;
        amountCollected += monthData.amount || 0;

        const st = (monthData.status || '').toLowerCase().trim();
        if (st === 'paid' || st === 'completed') {
          paidLearners++;
        } else {
          pendingLearners++;
        }
      }
    });

    const pendingCollection = Math.max(0, expectedEmiCollection - amountCollected);
    const collectionPercentage =
      expectedEmiCollection > 0 ? (amountCollected / expectedEmiCollection) * 100 : 0;
    const totalLearners = records.length;
    const totalPayableFee = records.reduce((sum, r) => sum + r.totalPayableFee, 0);

    return {
      totalLearners,
      totalPayableFee,
      amountCollected,
      pendingCollection,
      collectionPercentage,
      pendingLearners,
      expectedEmiCollection,
      paidLearners,
      selectedMonth,
    };
  }

  // Cumulative 'Overall' View
  const totalLearners = records.length;
  const totalPayableFee = records.reduce((sum, r) => sum + r.totalPayableFee, 0);
  const amountCollected = records.reduce((sum, r) => sum + r.amountCollected, 0);
  const pendingCollection = records.reduce((sum, r) => sum + r.pendingCollection, 0);
  const collectionPercentage =
    totalPayableFee > 0 ? (amountCollected / totalPayableFee) * 100 : 0;
  
  // Pending Learners: Count ONLY learners where Pending > 0 AND Learner Status != Closed
  const pendingLearners = records.filter(
    (r) => r.pendingCollection > 0 && r.learnerStatus.toLowerCase().trim() !== 'closed'
  ).length;

  return {
    totalLearners,
    totalPayableFee,
    amountCollected,
    pendingCollection,
    collectionPercentage,
    pendingLearners,
    selectedMonth: 'Overall',
  };
}

/**
 * Filter Overall Collection dataset according to business rules:
 * - ALL (default): Display ONLY Active + Inactive (Exclude Closed)
 * - ACTIVE: Show only Active learners
 * - INACTIVE: Show only Inactive learners
 * - CLOSED: Show only Closed learners
 */
export function filterOverallCollectionDataset(
  records: OverallCollectionRecord[],
  filters: OverallCollectionFilterState
): OverallCollectionRecord[] {
  return records.filter((r) => {
    if (filters.businessVertical && filters.businessVertical !== 'All' && r.businessVertical !== filters.businessVertical) {
      return false;
    }
    if (filters.salesExecutive && filters.salesExecutive !== 'All' && r.salesExecutive !== filters.salesExecutive) {
      return false;
    }
    if (filters.courseName && filters.courseName !== 'All' && r.courseName !== filters.courseName) {
      return false;
    }
    if (filters.enrolledMonth && filters.enrolledMonth !== 'All' && r.enrolledMonth !== filters.enrolledMonth) {
      return false;
    }
    if (filters.shift && filters.shift !== 'All' && r.shift !== filters.shift) {
      return false;
    }
    if (filters.paymentType && filters.paymentType !== 'All' && r.paymentType !== filters.paymentType) {
      return false;
    }
    
    // Learner Status Filter Logic (Rules 6 & 7)
    if (!filters.learnerStatus || filters.learnerStatus === 'All') {
      // Exclude Closed learners under 'All'
      if (r.learnerStatus.toLowerCase().trim() === 'closed') {
        return false;
      }
    } else {
      if (r.learnerStatus.toLowerCase().trim() !== filters.learnerStatus.toLowerCase().trim()) {
        return false;
      }
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'All') {
      const matchesStatus = Object.values(r.monthPayments).some(
        (m) => m.status.toLowerCase() === filters.paymentStatus.toLowerCase()
      );
      if (!matchesStatus) return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matches =
        r.studentName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

