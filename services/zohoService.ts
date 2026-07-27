/**
 * Dedicated Zoho Data Service
 * Encapsulates live Zoho Sheet CSV fetching, CORS proxy handling, parsing, and caching.
 */
export { fetchZohoCSVData, ZOHO_LIVE_CSV_URL } from '@/lib/zoho/zohoService';
export type { ZohoFetchResult } from '@/lib/zoho/zohoService';
