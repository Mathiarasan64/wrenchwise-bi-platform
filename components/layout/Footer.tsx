'use client';

import React from 'react';
import { useZohoData } from '@/context/DataContext';
import { ShieldCheck, Database } from 'lucide-react';
import { formatCount } from '@/lib/utils';

export const Footer: React.FC = () => {
  const { records, error } = useZohoData();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-3.5 text-slate-600 text-xs transition-all no-print shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Copyright */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#08C565]" />
          <span>
            &copy; {new Date().getFullYear()}{' '}
            <strong className="text-slate-900 font-bold">Wrench Wise Operations</strong>. All rights reserved.
          </span>
        </div>

        {/* Center: Data Source */}
        <div className="flex items-center gap-2 text-slate-500">
          <Database className="w-3.5 h-3.5 text-[#0B9BC5]" />
          <span>
            Data Source:{' '}
            <strong className={error ? 'text-rose-600 font-bold' : 'text-[#08C565] font-bold'}>
              {error ? 'Disconnected' : 'Live Zoho Sheet CSV'}
            </strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            <strong className="text-[#0B9BC5] font-bold">{formatCount(records.length)}</strong> Records
          </span>
        </div>

        {/* Right: Version Tag */}
        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-gray-200 text-slate-700 font-mono text-[10px] font-bold">
          v1.0.0-live
        </span>
      </div>
    </footer>
  );
};
