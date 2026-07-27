'use client';

import React, { useEffect } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in application:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="ww-card p-8 sm:p-12 max-w-lg w-full flex flex-col items-center shadow-card border-l-6 border-l-[#DC2626]">
        <div className="p-4 rounded-2xl bg-[#FEE2E2] text-[#DC2626] border border-red-200 mb-4 inline-flex">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">
          Application Error Encountered
        </h1>

        <p className="text-sm text-[#6B7280] font-normal leading-[1.6] mb-4">
          An error occurred while displaying this page. Your data remains safe and synchronized with Zoho Sheet.
        </p>

        {error?.message && (
          <div className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-3 mb-6 text-left">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
              Error details
            </span>
            <code className="text-xs text-[#DC2626] font-mono break-all leading-normal block">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
