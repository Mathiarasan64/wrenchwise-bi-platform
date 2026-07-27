'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Info, Calculator, Target } from 'lucide-react';

interface KPITooltipProps {
  title: string;
  calculation: string;
  importance: string;
}

export const KPITooltip: React.FC<KPITooltipProps> = ({ title, calculation, importance }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition(rect.top < 220 ? 'bottom' : 'top');
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onClick={() => setIsVisible((p) => !p)}
        className="text-[#6B7280] hover:text-[#08C565] transition-colors p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08C565]"
        aria-label={`Information about ${title}`}
      >
        <Info className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-72 pointer-events-none animate-fadeIn ${
            position === 'top'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-2.5'
              : 'top-full left-1/2 -translate-x-1/2 mt-2.5'
          }`}
        >
          <div className="bg-[#111827] border border-slate-800 rounded-xl shadow-xl overflow-hidden text-white p-3.5 space-y-2.5">
            {/* Header */}
            <div className="pb-1.5 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#08C565]">
                {title}
              </span>
            </div>

            {/* Calculation */}
            <div className="flex items-start gap-2">
              <Calculator className="w-3.5 h-3.5 text-[#08C565] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5">
                  How it&apos;s calculated
                </span>
                <span className="text-xs text-white leading-normal font-normal">{calculation}</span>
              </div>
            </div>

            {/* Importance */}
            <div className="flex items-start gap-2 pt-1 border-t border-slate-800/80">
              <Target className="w-3.5 h-3.5 text-[#0B9BC5] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-0.5">
                  Why it matters
                </span>
                <span className="text-xs text-slate-200 leading-normal font-normal">{importance}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${
              position === 'top' ? 'top-full -mt-[1px]' : 'bottom-full -mb-[1px] rotate-180'
            }`}
          >
            <div className="border-[6px] border-transparent border-t-[#111827]" />
          </div>
        </div>
      )}
    </div>
  );
};
