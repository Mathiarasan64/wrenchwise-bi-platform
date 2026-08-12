import Papa from 'papaparse';

/**
 * Zoho Sheet 3 — Learner Status Tracker
 * Dedicated service: does NOT reuse zohoService.ts or overallCollectionService.ts
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LearnerStatusRecord {
  id: string;
  salesExecutive: string;
  learnerName: string;
  learnerStatus: string;
}

export interface LearnerStatusFetchResult {
  records: LearnerStatusRecord[];
  salesExecutives: string[];   // unique, sorted list
  learnerStatuses: string[];   // unique, sorted list from sheet
  syncStatus: 'success' | 'error';
  error: string | null;
  lastSync: Date | null;
}

// ─── Module-level cache (30 s TTL) ───────────────────────────────────────────

let cachedResult: LearnerStatusFetchResult | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30_000;

// ─── CSV Parser ───────────────────────────────────────────────────────────────

/**
 * Parses raw 2-D CSV rows into LearnerStatusRecords.
 * Header detection is dynamic — it looks for the first row containing
 * recognisable column names (case-insensitive).
 */
export function parseLearnerStatusSheet(rows: string[][]): {
  records: LearnerStatusRecord[];
  salesExecutives: string[];
  learnerStatuses: string[];
} {
  if (!rows || rows.length === 0) {
    return { records: [], salesExecutives: [], learnerStatuses: [] };
  }

  // ── 1. Detect header row ──────────────────────────────────────────────────
  let headerRowIndex = -1;
  let colSalesExec = -1;
  let colLearnerName = -1;
  let colLearnerStatus = -1;

  const SALES_EXEC_ALIASES = ['sales executive', 'sales exec', 'executive', 'se name'];
  const LEARNER_NAME_ALIASES = ['learner name', 'student name', 'name', 'learner'];
  const LEARNER_STATUS_ALIASES = ['learner status', 'status', 'onboarding status'];

  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i].map((c) => String(c || '').trim().toLowerCase());

    const seIdx = row.findIndex((c) => SALES_EXEC_ALIASES.some((a) => c === a || c.includes(a)));
    const lnIdx = row.findIndex((c) => LEARNER_NAME_ALIASES.some((a) => c === a || c.includes(a)));
    const lsIdx = row.findIndex((c) => LEARNER_STATUS_ALIASES.some((a) => c === a || c.includes(a)));

    // Require at least learner name + one other column to confirm this is the header row
    if (lnIdx >= 0 && (seIdx >= 0 || lsIdx >= 0)) {
      headerRowIndex = i;
      colSalesExec = seIdx;
      colLearnerName = lnIdx;
      colLearnerStatus = lsIdx;
      break;
    }
  }

  if (headerRowIndex === -1 || colLearnerName === -1) {
    // Could not detect header — return empty
    return { records: [], salesExecutives: [], learnerStatuses: [] };
  }

  // ── 2. Parse data rows ────────────────────────────────────────────────────
  const records: LearnerStatusRecord[] = [];
  const seSet = new Set<string>();
  const statusSet = new Set<string>();

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const cleaned = row.map((c) => String(c || '').trim());

    // Skip empty rows
    if (cleaned.every((c) => c === '')) continue;

    const learnerName = colLearnerName >= 0 ? cleaned[colLearnerName] : '';
    if (!learnerName) continue; // Skip rows without a learner name

    const salesExecutive =
      colSalesExec >= 0 && cleaned[colSalesExec]
        ? cleaned[colSalesExec]
        : 'Unassigned';

    const learnerStatus =
      colLearnerStatus >= 0 && cleaned[colLearnerStatus]
        ? cleaned[colLearnerStatus]
        : 'Unknown';

    seSet.add(salesExecutive);
    statusSet.add(learnerStatus);

    records.push({
      id: `lst-${i}-${learnerName.replace(/\s+/g, '-').toLowerCase()}`,
      salesExecutive,
      learnerName,
      learnerStatus,
    });
  }

  // ── 3. Build sorted option lists ──────────────────────────────────────────
  const salesExecutives = Array.from(seSet).sort((a, b) =>
    a.localeCompare(b)
  );
  const learnerStatuses = Array.from(statusSet).sort((a, b) =>
    a.localeCompare(b)
  );

  return { records, salesExecutives, learnerStatuses };
}

// ─── Fetch Function ───────────────────────────────────────────────────────────

/**
 * Fetches live Learner Status data from Zoho Sheet 3 via /api/zoho-learner-status.
 * Uses a module-level 30-second cache; pass forceRefresh=true to bypass it.
 */
export async function fetchLearnerStatusData(
  forceRefresh = false
): Promise<LearnerStatusFetchResult> {
  const now = Date.now();

  if (forceRefresh) {
    cachedResult = null;
    lastFetchTime = 0;
  }

  if (!forceRefresh && cachedResult && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedResult;
  }

  const targetUrl = forceRefresh
    ? `/api/zoho-learner-status?refresh=true&t=${now}`
    : '/api/zoho-learner-status';

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
      } catch {
        // ignore JSON parse error on non-JSON responses
      }
      throw new Error(
        `Connection Error: Unable to fetch Learner Status Sheet (${errorText})`
      );
    }

    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data || [];
          const { records, salesExecutives, learnerStatuses } =
            parseLearnerStatusSheet(rows);

          if (records.length === 0) {
            resolve({
              records: [],
              salesExecutives: [],
              learnerStatuses: [],
              syncStatus: 'error',
              error:
                'Failed to extract learner records from Zoho Learner Status Sheet CSV. ' +
                'Please verify the sheet has columns: Sales Executive, Learner Name, Learner Status.',
              lastSync: new Date(),
            });
            return;
          }

          const successRes: LearnerStatusFetchResult = {
            records,
            salesExecutives,
            learnerStatuses,
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
            salesExecutives: [],
            learnerStatuses: [],
            syncStatus: 'error',
            error: `CSV Parsing Error: ${err.message}`,
            lastSync: new Date(),
          });
        },
      });
    });
  } catch (err: any) {
    console.error('Learner Status Sheet fetch error:', err);

    if (cachedResult) {
      return cachedResult;
    }

    return {
      records: [],
      salesExecutives: [],
      learnerStatuses: [],
      syncStatus: 'error',
      error:
        err.message ||
        'Connection Error: Unable to fetch Zoho Learner Status Sheet CSV.',
      lastSync: new Date(),
    };
  }
}
