'use client';

import React, { memo } from 'react';
import { KPITooltip } from '@/components/common/KPITooltip';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tooltipText: string;
  calculation?: string;
  importance?: string;
  accentColor?: 'green' | 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'sky' | 'cyan';
  subText?: string;
  trend?: {
    type: 'positive' | 'negative' | 'neutral';
    value: string;
  };
  progressValue?: number;
}

export const KPICard: React.FC<KPICardProps> = memo(function KPICard({
  title,
  value,
  icon,
  tooltipText,
  calculation,
  importance,
  accentColor = 'green',
  subText,
  trend,
  progressValue,
}) {
  const isBlueIcon = accentColor === 'blue' || accentColor === 'sky' || accentColor === 'indigo';
  const iconBgClass = isBlueIcon
    ? 'bg-[#DBEAFE] text-[#0B9BC5] border border-sky-200'
    : 'bg-[#DCFCE7] text-[#08C565] border border-emerald-200';

  return (
    <div
      className="ww-card ww-card-hover p-4 sm:p-5 flex flex-col justify-between h-full w-full min-w-0 overflow-hidden"
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Top Bar: Title, Tooltip, Icon */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-[#111827] leading-tight break-words">
              {title}
            </span>
            <KPITooltip
              title={title}
              calculation={calculation || tooltipText}
              importance={importance || 'Key operational metric tracked by management for strategic decision-making.'}
            />
          </div>

          {/* Icon */}
          <div className={`p-2 rounded-xl ${iconBgClass} shrink-0`}>
            {icon}
          </div>
        </div>

        {/* Main KPI Value */}
        <div className="mt-2.5">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight font-mono text-[#111827] truncate">
            {value}
          </div>

          {/* Subtext and Trend Indicator Row */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap min-w-0">
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                  trend.type === 'positive'
                    ? 'badge-success'
                    : trend.type === 'negative'
                    ? 'badge-danger'
                    : 'bg-[#F3F4F6] text-[#374151]'
                }`}
              >
                {trend.type === 'positive' && <ArrowUpRight className="w-3 h-3" />}
                {trend.type === 'negative' && <ArrowDownRight className="w-3 h-3" />}
                {trend.type === 'neutral' && <Minus className="w-3 h-3" />}
                {trend.value}
              </span>
            )}

            {subText && (
              <span className="text-xs font-normal text-[#4B5563] leading-snug break-words">
                {subText}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {typeof progressValue === 'number' && (
        <div className="mt-4 pt-2.5 border-t border-[#E5E7EB]">
          <div className="flex justify-between text-xs font-medium text-[#4B5563] mb-1">
            <span>Progress</span>
            <span className="font-semibold text-[#111827]">{Math.min(100, Math.max(0, progressValue)).toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-[#08C565]"
              style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
