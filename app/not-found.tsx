'use client';

import React from 'react';
import Link from 'next/link';
import { WrenchWiseLogo } from '@/components/common/WrenchWiseLogo';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="ww-card p-8 sm:p-12 max-w-lg w-full flex flex-col items-center shadow-card border-l-6 border-l-[#0B9BC5]">
        <div className="mb-6">
          <WrenchWiseLogo showTagline={true} size="lg" />
        </div>

        <div className="p-4 rounded-2xl bg-[#DBEAFE] text-[#0B9BC5] border border-sky-200 mb-4 inline-flex">
          <AlertCircle className="w-10 h-10" />
        </div>

        <span className="text-4xl font-extrabold text-[#111827] font-mono mb-2">404</span>

        <h1 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-[#6B7280] font-normal leading-[1.6] mb-8">
          The requested page or module could not be found. Please check the URL or return to the Executive Dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Executive Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
