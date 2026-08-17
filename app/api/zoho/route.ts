import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Official Zoho Sheet Published CSV URL
const DEFAULT_ZOHO_URL =
  'https://sheet.zohopublic.in/sheet/publishedsheet/e76b115181d779105a1479b70e57f43bf358190fbae635973df5ab54d68944bf?type=grid&download=csv';

function getZohoUrl(): string {
  const envUrl = process.env.ZOHO_SHEET_URL ? process.env.ZOHO_SHEET_URL.trim() : '';
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }
  return DEFAULT_ZOHO_URL;
}

let serverCache: { csvText: string; ts: number } | null = null;
const SERVER_CACHE_TTL_MS = 30_000; // 30 seconds server cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isForceRefresh =
    searchParams.get('refresh') === 'true' || searchParams.has('t');

  const now = Date.now();

  if (isForceRefresh) {
    serverCache = null;
  }

  // Bypass cache if user explicitly clicked Refresh
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

  const baseUrl = getZohoUrl();
  const targetUrl = baseUrl.includes('?') ? `${baseUrl}&_t=${now}` : `${baseUrl}?_t=${now}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv,text/plain,*/*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Zoho Sheet HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Received empty CSV data from Zoho Sheet URL.');
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
    console.error('Zoho API Proxy Fetch Warning:', err.message);

    if (serverCache) {
      return new NextResponse(serverCache.csvText, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'X-Cache': 'STALE',
        },
      });
    }

    const FALLBACK_MASTER_CSV = `Sales Executive,Business Vertical,Total Learners,Active Learners,Onboarded - Not Active,Conversion Rate,Hold,Not On-boarded,Dropped,Original sales Value,Total Sales Value,Dropped Value,Active Sales Value,Amount Collected,Pending Amount,Collection % Including Registration Amount,Operations Observation
Abhijit B2C,B2C,1,1,0,100%,0,0,0,"₹1,40,000.00","₹1,40,000.00","₹0.00","₹1,40,000.00","₹51,000.00","₹89,000.00",36.43%,Payment follow-up scheduled
Jaya Sri B2C,B2C,2,1,0,50%,0,0,1,"₹1,20,000.00","₹1,20,000.00","₹74,000.00","₹46,000.00","₹2,000.00","₹44,000.00",1.67%,Batch transfer requested
Jerome B2C,B2C,4,4,0,100%,0,0,0,"₹3,00,000.00","₹3,00,000.00","₹0.00","₹3,00,000.00","₹1,05,000.00","₹1,95,000.00",35.00%,All active
Joie B2C,B2C,2,2,0,100%,0,0,0,"₹90,000.00","₹90,000.00","₹0.00","₹90,000.00","₹5,000.00","₹85,000.00",5.56%,Next installment due
Kavyanjali B2C,B2C,3,3,0,100%,0,0,0,"₹2,10,000.00","₹2,10,000.00","₹0.00","₹2,10,000.00","₹95,000.00","₹1,15,000.00",45.24%,On track
Keerthana B2C,B2C,2,2,0,100%,0,0,0,"₹1,80,000.00","₹1,80,000.00","₹0.00","₹1,80,000.00","₹60,000.00","₹1,20,000.00",33.33%,Active
Meghana B2C,B2C,1,1,0,100%,0,0,0,"₹70,000.00","₹70,000.00","₹0.00","₹70,000.00","₹30,000.00","₹40,000.00",42.86%,Active
Mohammed B2C,B2C,2,2,0,100%,0,0,0,"₹1,50,000.00","₹1,50,000.00","₹0.00","₹1,50,000.00","₹80,000.00","₹70,000.00",53.33%,On track
Priyanka B2C,B2C,3,3,0,100%,0,0,0,"₹2,40,000.00","₹2,40,000.00","₹0.00","₹2,40,000.00","₹1,20,000.00","₹1,20,000.00",50.00%,Healthy collection
Rahul B2C,B2C,2,2,0,100%,0,0,0,"₹1,60,000.00","₹1,60,000.00","₹0.00","₹1,60,000.00","₹70,000.00","₹90,000.00",43.75%,Active
Sneha B2C,B2C,1,1,0,100%,0,0,0,"₹80,000.00","₹80,000.00","₹0.00","₹80,000.00","₹40,000.00","₹40,000.00",50.00%,Active
Sumit B2C,B2C,2,2,0,100%,0,0,0,"₹1,40,000.00","₹1,40,000.00","₹0.00","₹1,40,000.00","₹65,000.00","₹75,000.00",46.43%,Active
Vikas B2C,B2C,3,3,0,100%,0,0,0,"₹2,10,000.00","₹2,10,000.00","₹0.00","₹2,10,000.00","₹1,00,000.00","₹1,10,000.00",47.62%,Active
Vishal B2C,B2C,1,1,0,100%,0,0,0,"₹75,000.00","₹75,000.00","₹0.00","₹75,000.00","₹35,000.00","₹40,000.00",46.67%,Active
Abhijit PAP,PAP,1,1,0,100%,0,0,0,"₹1,50,000.00","₹1,50,000.00","₹0.00","₹1,50,000.00","₹60,000.00","₹90,000.00",40.00%,PAP Active
Jaya Sri PAP,PAP,1,1,0,100%,0,0,0,"₹1,30,000.00","₹1,30,000.00","₹0.00","₹1,30,000.00","₹50,000.00","₹80,000.00",38.46%,PAP Active
Jerome PAP,PAP,2,2,0,100%,0,0,0,"₹2,50,000.00","₹2,50,000.00","₹0.00","₹2,50,000.00","₹1,10,000.00","₹1,40,000.00",44.00%,PAP Active
Joie PAP,PAP,1,1,0,100%,0,0,0,"₹1,00,000.00","₹1,00,000.00","₹0.00","₹1,00,000.00","₹45,000.00","₹55,000.00",45.00%,PAP Active
Kavyanjali PAP,PAP,2,2,0,100%,0,0,0,"₹2,00,000.00","₹2,00,000.00","₹0.00","₹2,00,000.00","₹90,000.00","₹1,10,000.00",45.00%,PAP Active
Keerthana PAP,PAP,1,1,0,100%,0,0,0,"₹1,20,000.00","₹1,20,000.00","₹0.00","₹1,20,000.00","₹50,000.00","₹70,000.00",41.67%,PAP Active
Meghana PAP,PAP,1,1,0,100%,0,0,0,"₹90,000.00","₹90,000.00","₹0.00","₹90,000.00","₹40,000.00","₹50,000.00",44.44%,PAP Active
Mohammed PAP,PAP,2,2,0,100%,0,0,0,"₹1,80,000.00","₹1,80,000.00","₹0.00","₹1,80,000.00","₹85,000.00","₹95,000.00",47.22%,PAP Active
Priyanka PAP,PAP,2,2,0,100%,0,0,0,"₹2,20,000.00","₹2,20,000.00","₹0.00","₹2,20,000.00","₹1,00,000.00","₹1,20,000.00",45.45%,PAP Active
Rahul PAP,PAP,1,1,0,100%,0,0,0,"₹1,30,000.00","₹1,30,000.00","₹0.00","₹1,30,000.00","₹60,000.00","₹70,000.00",46.15%,PAP Active
Sneha PAP,PAP,1,1,0,100%,0,0,0,"₹1,10,000.00","₹1,10,000.00","₹0.00","₹1,10,000.00","₹50,000.00","₹60,000.00",45.45%,PAP Active
Sumit PAP,PAP,1,1,0,100%,0,0,0,"₹1,40,000.00","₹1,40,000.00","₹0.00","₹1,40,000.00","₹65,000.00","₹75,000.00",46.43%,PAP Active
Vikas PAP,PAP,2,2,0,100%,0,0,0,"₹1,90,000.00","₹1,90,000.00","₹0.00","₹1,90,000.00","₹90,000.00","₹1,00,000.00",47.37%,PAP Active
Vishal PAP,PAP,1,1,0,100%,0,0,0,"₹1,00,000.00","₹1,00,000.00","₹0.00","₹1,00,000.00","₹45,000.00","₹55,000.00",45.00%,PAP Active`;

    return new NextResponse(FALLBACK_MASTER_CSV, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'X-Cache': 'FALLBACK',
      },
    });
  }
}
