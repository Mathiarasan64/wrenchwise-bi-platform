import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_COLLECTION_URL =
  'https://sheet.zohopublic.in/sheet/publishedsheet/4d5f2c36dda0f43d7fd37f957be0a9476f723df7622d8be747ebb4ceadae9568?type=grid&download=csv';

function getCollectionUrl(): string {
  const envUrl = process.env.ZOHO_COLLECTION_SHEET_URL
    ? process.env.ZOHO_COLLECTION_SHEET_URL.trim()
    : '';
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }
  return DEFAULT_COLLECTION_URL;
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

  const baseUrl = getCollectionUrl();
  const targetUrl = baseUrl.includes('?') ? `${baseUrl}&_t=${now}` : `${baseUrl}?_t=${now}`;

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
      throw new Error(`Zoho Overall Collection HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Received empty CSV data from Overall Collection Zoho Sheet.');
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
    console.error('Zoho Overall Collection API Fetch Error:', err.message);

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
      JSON.stringify({ error: err.message || 'Unable to fetch Overall Collection Zoho Sheet.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
