import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupee notation: ₹12,45,000
 */
export function formatCurrency(amount: number): string {
  if (amount === 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Alias that matches the Indian locale requirement */
export const formatINR = formatCurrency;

/**
 * Format percentage: 82.4%
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format count with unit: 1,245 Learners
 */
export function formatCount(value: number, unit?: string): string {
  const formatted = new Intl.NumberFormat('en-IN').format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format date and time in IST: "27 Jul 2026, 09:15 AM"
 */
export function formatDateTime(date: Date | string | number | null | undefined): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(d);
  } catch {
    return 'N/A';
  }
}

/**
 * Format relative time: "2 minutes ago", "just now"
 */
export function formatRelativeTime(date: Date | string | number | null | undefined): string {
  if (!date) return 'Never';
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return 'Just now';
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    return formatDateTime(d);
  } catch {
    return 'Just now';
  }
}

/**
 * Get stagger animation class for index-based card entrance
 */
export function getStaggerClass(index: number): string {
  const capped = Math.min(index, 7) + 1;
  return `opacity-0 animate-stagger-${capped}`;
}
