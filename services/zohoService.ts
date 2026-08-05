import Papa from 'papaparse';
import { ZohoRecord, SyncStatus } from '@/types';

export interface ZohoFetchResult {
  records: ZohoRecord[];
  headers: string[];
  syncStatus: SyncStatus;
  dataSource: 'live';
  error: string | null;
  lastSync: Date | null;
}

let cachedResult: ZohoFetchResult | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30_000; // 30 seconds

/**
 * Universal safe numeric parser for raw values, currency strings, percentage strings, blank cells, null & undefined.
 */
function parseNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).trim();
  if (str === '' || str === '-' || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') return 0;
  const cleaned = str.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return 0;
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse raw 2D array of rows from Zoho Sheet CSV into structured ZohoRecords
 */
export function parseZohoSheetRows(rows: string[][]): {
  records: ZohoRecord[];
  headers: string[];
} {
  if (!rows || rows.length === 0) {
    return { records: [], headers: [] };
  }

  const records: ZohoRecord[] = [];
  let headerColMap: Record<string, number> = {};
  let headerRowFound = false;
  let extractedHeaders: string[] = [];

  rows.forEach((row, index) => {
    if (!row || row.length === 0) return;

    const cleanedRow = row.map((cell) => (cell ? String(cell).trim() : ''));
    const firstCell = cleanedRow.find((c) => c !== '') || '';

    // 1. Identify single master table header row
    if (!headerRowFound) {
      const isHeaderRow = cleanedRow.some(
        (c) =>
          c.toLowerCase() === 'sales executive' ||
          c.toLowerCase() === 'business vertical' ||
          c.toLowerCase() === 'businessvertical'
      );

      if (isHeaderRow) {
        headerColMap = {};
        extractedHeaders = cleanedRow.filter((c) => c !== '');
        cleanedRow.forEach((colName, colIdx) => {
          if (colName) {
            headerColMap[colName.trim().toLowerCase()] = colIdx;
          }
        });
        headerRowFound = true;
        return;
      }
    }

    // 2. Parse data rows under single master table
    const execIdx = headerColMap['sales executive'] ?? 0;
    const salesExecName = cleanedRow[execIdx] || firstCell;

    if (
      !salesExecName ||
      salesExecName.toLowerCase() === 'sales executive' ||
      salesExecName.toLowerCase().includes('operations mis') ||
      salesExecName.startsWith(',') ||
      salesExecName === '-'
    ) {
      return;
    }

    const getVal = (possibleNames: string[]): string => {
      for (const name of possibleNames) {
        const idx = headerColMap[name.trim().toLowerCase()];
        if (idx !== undefined && cleanedRow[idx] !== undefined) {
          return cleanedRow[idx].trim();
        }
      }
      return '';
    };

    const activeLearners = parseNumber(getVal(['active learners']));
    const onboardedNotActive = parseNumber(
      getVal(['onboarded - not active', 'onboarded not active'])
    );
    const hold = parseNumber(getVal(['hold']));
    const notOnboarded = parseNumber(
      getVal(['not on-boarded', 'not onboarded'])
    );
    const dropped = parseNumber(getVal(['dropped']));

    const rawTotalLearners = parseNumber(getVal(['total learners']));
    const totalLearners =
      rawTotalLearners > 0
        ? rawTotalLearners
        : activeLearners + onboardedNotActive + hold + notOnboarded + dropped;

    const rawConversionRate = parseNumber(getVal(['conversion rate']));
    const conversionRate =
      rawConversionRate > 0
        ? rawConversionRate
        : totalLearners > 0
        ? (activeLearners / totalLearners) * 100
        : 0;

    const originalSalesValue = parseNumber(
      getVal(['original sales value', 'original sales', 'original amount'])
    );
    const totalSalesValue = parseNumber(
      getVal(['total sales value', 'total sales', 'amount'])
    );
    const droppedValue = parseNumber(
      getVal(['dropped value', 'dropped sales value'])
    );

    const rawActiveSalesValue = parseNumber(
      getVal(['active sales value', 'active sales'])
    );
    const activeSalesValue =
      rawActiveSalesValue > 0
        ? rawActiveSalesValue
        : totalSalesValue > 0
        ? Math.max(0, totalSalesValue - droppedValue)
        : 0;

    const amountCollected = parseNumber(
      getVal(['amount collected', 'collected amount', 'collected'])
    );

    // Business Rule derived KPI: Pending Amount = Active Sales Value - Amount Collected
    const pendingAmount = Math.max(0, activeSalesValue - amountCollected);

    const rawCollectionPct = parseNumber(
      getVal([
        'collection % including registration amount',
        'collection %',
        'collection percentage',
      ])
    );
    const collectionPercentage =
      rawCollectionPct > 0
        ? rawCollectionPct
        : totalSalesValue > 0
        ? (amountCollected / totalSalesValue) * 100
        : 0;

    const obs = getVal(['operations observation', 'observation', 'notes']);

    const status =
      activeLearners > 0
        ? 'Closed Won'
        : dropped > 0
        ? 'Lost'
        : hold > 0
        ? 'Hold'
        : 'In Pipeline';

    const learnerStatus =
      activeLearners > 0
        ? 'Active'
        : dropped > 0
        ? 'Dropped'
        : hold > 0
        ? 'Hold'
        : 'Not On-boarded';

    const businessVertical: 'B2C' | 'PAP' = (() => {
      const bvRaw = getVal(['business vertical', 'businessvertical', 'vertical']);
      if (bvRaw) {
        const bvClean = bvRaw.trim().toUpperCase();
        if (bvClean.includes('PAP')) return 'PAP';
      }
      return 'B2C';
    })();

    const section = businessVertical === 'PAP' ? 'B2C - PAP Operations MIS' : 'B2C Operations MIS';

    records.push({
      id: `ZH-${businessVertical}-${salesExecName.replace(/\s+/g, '')}-${index}`,
      section,
      businessVertical,
      salesExecutive: salesExecName,
      totalLearners,
      activeLearners,
      onboardedNotActive,
      conversionRate,
      hold,
      notOnboarded,
      dropped,
      originalSalesValue,
      totalSalesValue,
      amount: totalSalesValue,
      droppedValue,
      activeSalesValue,
      amountCollected,
      pendingAmount,
      collectionPercentage,
      operationsObservation: obs || 'No observations recorded.',
      customerName: `${salesExecName} Client Group`,
      course: section,
      date: new Date().toISOString().split('T')[0],
      status,
      learnerStatus,
      region: 'Pan India',
      leadSource: 'Zoho Live Sheet',
    });
  });

  return { records, headers: extractedHeaders };
}

/**
 * Live Data Service fetching data directly from Zoho Sheet CSV API via /api/zoho
 */
export async function fetchZohoData(forceRefresh = false): Promise<ZohoFetchResult> {
  const now = Date.now();

  if (!forceRefresh && cachedResult && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedResult;
  }

  const targetUrl = forceRefresh
    ? `/api/zoho?refresh=true&t=${now}`
    : '/api/zoho';

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
      throw new Error(`Connection Error: Unable to fetch live Zoho Sheet (${errorText})`);
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data || [];
          const { records, headers } = parseZohoSheetRows(rows);

          if (records.length === 0) {
            const errRes: ZohoFetchResult = {
              records: [],
              headers: [],
              syncStatus: 'error',
              dataSource: 'live',
              error: 'Failed to extract Sales Executive records from live Zoho Sheet CSV.',
              lastSync: new Date(),
            };
            resolve(errRes);
            return;
          }

          const successRes: ZohoFetchResult = {
            records,
            headers,
            syncStatus: 'success',
            dataSource: 'live',
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
            headers: [],
            syncStatus: 'error',
            dataSource: 'live',
            error: `CSV Parsing Error: ${err.message}`,
            lastSync: new Date(),
          });
        },
      });
    });
  } catch (err: any) {
    console.error('Zoho Sheet fetch error:', err);

    if (cachedResult) {
      return cachedResult;
    }

    return {
      records: [],
      headers: [],
      syncStatus: 'error',
      dataSource: 'live',
      error: err.message || 'Connection Error: Unable to fetch live Zoho Sheet CSV.',
      lastSync: new Date(),
    };
  }
}
