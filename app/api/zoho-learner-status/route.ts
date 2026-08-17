import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Zoho Sheet 3 — Learner Status Tracker
 *
 * Reads the sheet URL from ZOHO_LEARNER_STATUS_SHEET_URL env var.
 * The URL is never hardcoded in application code.
 */

function getLearnerStatusUrl(): string {
  const envUrl = process.env.ZOHO_LEARNER_STATUS_SHEET_URL
    ? process.env.ZOHO_LEARNER_STATUS_SHEET_URL.trim()
    : '';
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }
  // Fallback to env var only — if not set, return empty and surface an error
  return '';
}

let serverCache: { csvText: string; ts: number } | null = null;
const SERVER_CACHE_TTL_MS = 30_000; // 30 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isForceRefresh =
    searchParams.get('refresh') === 'true' || searchParams.has('t');

  const now = Date.now();

  if (isForceRefresh) {
    serverCache = null;
  }

  if (!isForceRefresh && serverCache && now - serverCache.ts < SERVER_CACHE_TTL_MS) {
    return new NextResponse(serverCache.csvText, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Cache': 'HIT',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  const baseUrl = getLearnerStatusUrl();

  if (!baseUrl) {
    return new NextResponse(
      JSON.stringify({
        error:
          'ZOHO_LEARNER_STATUS_SHEET_URL environment variable is not configured.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const targetUrl = baseUrl.includes('?')
    ? `${baseUrl}&_t=${now}`
    : `${baseUrl}?_t=${now}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv,text/plain,*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(
        `Zoho Learner Status Sheet HTTP ${response.status}: ${response.statusText}`
      );
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error(
        'Received empty CSV data from Zoho Learner Status Sheet.'
      );
    }

    serverCache = { csvText, ts: now };

    return new NextResponse(csvText, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Cache': 'MISS',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (err: any) {
    console.error('Zoho Learner Status API Fetch Error:', err.message);

    if (serverCache) {
      return new NextResponse(serverCache.csvText, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'X-Cache': 'STALE',
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        error: err.message || 'Unable to fetch Zoho Learner Status Sheet.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
