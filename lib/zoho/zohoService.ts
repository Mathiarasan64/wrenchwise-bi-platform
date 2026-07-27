import Papa from 'papaparse';
import { ZohoRecord, SyncStatus } from '@/types';

export const ZOHO_LIVE_CSV_URL =
  'https://sheet.zohopublic.in/sheet/publishedsheet/e76b115181d779105a1479b70e57f43bf358190fbae635973df5ab54d68944bf?type=grid&download=csv';

export interface ZohoFetchResult {
  records: ZohoRecord[];
  headers: string[];
  syncStatus: SyncStatus;
  dataSource: 'live';
  error: string | null;
  lastSync: Date;
}

// In-memory cache to prevent duplicate network calls across page navigation
let cachedResult: ZohoFetchResult | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60_000;       // 60 seconds in-memory TTL
const LS_KEY = 'ww_zoho_cache';    // localStorage key
const LS_TTL_MS = 5 * 60_000;     // 5 minutes — safe to show slightly stale data on refresh

/** Attempt to load a previously cached result from localStorage (browser only) */
function loadFromLocalStorage(): ZohoFetchResult | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { result, ts } = JSON.parse(raw);
    if (Date.now() - ts > LS_TTL_MS) return null; // expired
    if (result && result.lastSync) {
      result.lastSync = new Date(result.lastSync);
    }
    return result as ZohoFetchResult;
  } catch {
    return null;
  }
}

/** Persist a successful result to localStorage for fast subsequent loads */
function saveToLocalStorage(result: ZohoFetchResult): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LS_KEY, JSON.stringify({ result, ts: Date.now() }));
  } catch {
    // localStorage can be unavailable (private mode, quota exceeded) — ignore
  }
}

/**
 * Helper to parse currency or numeric strings like "₹3,00,000.00", "50%", "-", ""
 */
function parseNumber(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).trim();
  if (str === '-' || str === '' || str.toLowerCase() === 'null') return 0;
  const cleaned = str.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Live Data Service fetching and parsing Zoho Sheet CSV via Next.js API Proxy (bypasses browser CORS)
 */
export async function fetchZohoCSVData(customUrl?: string, forceRefresh = false): Promise<ZohoFetchResult> {
  const now = Date.now();

  // 1. In-memory cache hit (fastest path — same tab, within 60s)
  if (!forceRefresh && cachedResult && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedResult;
  }

  // 2. localStorage hit — serve instantly on page refresh / new tab
  if (!forceRefresh && !cachedResult) {
    const lsResult = loadFromLocalStorage();
    if (lsResult) {
      // Restore into memory cache so subsequent calls within same session are fast
      cachedResult = lsResult;
      lastFetchTime = now - 1000; // treat as 1s old to allow background refresh
      // Schedule a background refresh so data stays current without blocking UI
      setTimeout(() => fetchZohoCSVData(customUrl, true), 100);
      return lsResult;
    }
  }

  // If running in browser, call Next.js API proxy /api/zoho to bypass CORS
  const isBrowser = typeof window !== 'undefined';
  const targetUrl = customUrl || (isBrowser ? '/api/zoho' : (process.env.NEXT_PUBLIC_ZOHO_CSV_URL || process.env.NEXT_PUBLIC_ZOHO_SHEET_CSV_URL || ZOHO_LIVE_CSV_URL));

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv,text/plain,*/*',
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
          const records: ZohoRecord[] = [];
          let currentSection = 'B2C Operations MIS';
          let headerColMap: Record<string, number> = {};

          rows.forEach((row, index) => {
            if (!row || row.length === 0) return;

            const cleanedRow = row.map((cell) => (cell ? String(cell).trim() : ''));
            const firstCell = cleanedRow.find((c) => c !== '') || '';

            if (firstCell.toLowerCase().includes('operations mis')) {
              currentSection = firstCell;
              return;
            }

            if (cleanedRow.some((c) => c.toLowerCase() === 'sales executive')) {
              headerColMap = {};
              cleanedRow.forEach((colName, colIdx) => {
                if (colName) {
                  headerColMap[colName.toLowerCase()] = colIdx;
                }
              });
              return;
            }

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
                const idx = headerColMap[name.toLowerCase()];
                if (idx !== undefined && cleanedRow[idx] !== undefined) {
                  return cleanedRow[idx];
                }
              }
              return '';
            };

            const totalLearners = parseNumber(getVal(['total learners']));
            const activeLearners = parseNumber(getVal(['active learners']));
            const onboardedNotActive = parseNumber(getVal(['onboarded - not active', 'onboarded not active']));
            const conversionRate = parseNumber(getVal(['conversion rate']));
            const hold = parseNumber(getVal(['hold']));
            const notOnboarded = parseNumber(getVal(['not on-boarded', 'not onboarded']));
            const dropped = parseNumber(getVal(['dropped']));

            const originalSalesValue = parseNumber(getVal(['original sales value', 'original amount']));
            const totalSalesValue = parseNumber(getVal(['total sales value', 'amount']));
            const droppedValue = parseNumber(getVal(['dropped value']));
            const activeSalesValue = parseNumber(getVal(['active sales value']));
            const amountCollected = parseNumber(getVal(['amount collected']));
            const pendingAmount = parseNumber(getVal(['pending amount']));
            const collectionPct = parseNumber(getVal(['collection % including registration amount', 'collection %']));
            const obs = getVal(['operations observation', 'observation', 'notes']);

            const status = activeLearners > 0 ? 'Closed Won' : dropped > 0 ? 'Lost' : hold > 0 ? 'Hold' : 'In Pipeline';
            const learnerStatus = activeLearners > 0 ? 'Active' : dropped > 0 ? 'Dropped' : hold > 0 ? 'Hold' : 'Not On-boarded';

            const businessVertical = (() => {
              const bvRaw = getVal(['business vertical', 'businessvertical']);
              if (bvRaw) {
                const bvClean = bvRaw.trim().toUpperCase();
                if (bvClean === 'PAP') return 'PAP';
                if (bvClean === 'B2C') return 'B2C';
              }
              // Fallback: derive from section name
              return currentSection.includes('PAP') ? 'PAP' : 'B2C';
            })();

            records.push({
              id: `ZH-${businessVertical}-${salesExecName.replace(/\s+/g, '')}-${index}`,
              section: currentSection,
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
              collectionPercentage: collectionPct,
              operationsObservation: obs || 'No observations recorded.',
              customerName: `${salesExecName} Client Group`,
              course: currentSection,
              date: new Date().toISOString().split('T')[0],
              status,
              learnerStatus,
              region: 'Pan India',
              leadSource: 'Zoho Live Sheet',
            });
          });

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
            headers: Object.keys(headerColMap),
            syncStatus: 'success',
            dataSource: 'live',
            error: null,
            lastSync: new Date(),
          };

          cachedResult = successRes;
          lastFetchTime = Date.now();
          saveToLocalStorage(successRes); // persist for fast reload
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
    console.error('Zoho CSV fetch error:', err);
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
