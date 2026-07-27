import { NextResponse } from 'next/server';

// Server-side in-memory cache — shared across all requests within the Node process
let serverCache: { csv: string; ts: number } | null = null;
const SERVER_CACHE_TTL_MS = 60_000; // 60 seconds

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = Date.now();

  // Return server-cached CSV if still fresh
  if (serverCache && now - serverCache.ts < SERVER_CACHE_TTL_MS) {
    return new NextResponse(serverCache.csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Cache': 'HIT',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      },
    });
  }

  const targetUrl =
    process.env.NEXT_PUBLIC_ZOHO_CSV_URL ||
    process.env.NEXT_PUBLIC_ZOHO_SHEET_CSV_URL ||
    'https://sheet.zohopublic.in/sheet/publishedsheet/e76b115181d779105a1479b70e57f43bf358190fbae635973df5ab54d68944bf?type=grid&download=csv';

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv,text/plain,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      // Allow Next.js to cache at fetch level too
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Zoho Sheet HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const csvText = await response.text();

    // Store in server-side memory cache
    serverCache = { csv: csvText, ts: now };

    return new NextResponse(csvText, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      },
    });
  } catch (err: any) {
    console.error('API route Zoho fetch error:', err);

    // If we have stale cache, return it on network error rather than fully failing
    if (serverCache) {
      return new NextResponse(serverCache.csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'X-Cache': 'STALE',
        },
      });
    }

    return NextResponse.json(
      { error: err.message || 'Failed to fetch live Zoho Sheet CSV from server proxy.' },
      { status: 500 }
    );
  }
}
