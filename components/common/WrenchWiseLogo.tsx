'use client';

import React from 'react';

interface WrenchWiseLogoProps {
  showTagline?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WrenchWiseLogo: React.FC<WrenchWiseLogoProps> = ({
  showTagline = true,
  className = '',
  size = 'md',
}) => {
  const heightMap = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Logo Image Container */}
      <div className="relative overflow-hidden rounded-xl bg-white p-1 border border-slate-200 shadow-sm shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wrenchwise-logo.jpg"
          alt="Wrench Wise Logo"
          className={`${heightMap[size]} w-auto object-contain rounded-lg`}
        />
      </div>

      <div>
        <div className="flex items-center gap-1.5 font-black tracking-tight text-slate-900 leading-none text-base sm:text-lg">
          <span className="text-[#0B9BC5]">WRENCH</span>
          <span className="text-[#08C565]">WISE</span>
          <span className="text-slate-600 text-xs px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold ml-1">
            BI
          </span>
        </div>
        {showTagline && (
          <div className="text-[10px] font-semibold text-[#08C565] tracking-wide mt-0.5">
            Innovate. Engineer. Excel
          </div>
        )}
      </div>
    </div>
  );
};
