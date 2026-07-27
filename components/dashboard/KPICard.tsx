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
      className="ww-card ww-card-hover p-5 flex flex-col justify-between"
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Top Bar: Title, Tooltip, Icon */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[18px] font-semibold text-[#111827] leading-[1.3] truncate">
              {title}
            </span>
            <KPITooltip
              title={title}
              calculation={calculation || tooltipText}
              importance={importance || 'Key operational metric tracked by management for strategic decision-making.'}
            />
          </div>

          {/* Green Icon (#08C565) or Blue Icon (#0B9BC5) */}
          <div className={`p-2.5 rounded-xl ${iconBgClass} shrink-0`}>
            {icon}
          </div>
        </div>

        {/* Main KPI Value (Black text #111827) */}
        <div className="mt-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-normal font-mono text-[#111827]">
              {value}
            </div>

            {/* Trend Indicator */}
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  trend.type === 'positive'
                    ? 'badge-success'
                    : trend.type === 'negative'
                    ? 'badge-danger'
                    : 'bg-[#F3F4F6] text-[#374151]'
                }`}
              >
                {trend.type === 'positive' && <ArrowUpRight className="w-3.5 h-3.5" />}
                {trend.type === 'negative' && <ArrowDownRight className="w-3.5 h-3.5" />}
                {trend.type === 'neutral' && <Minus className="w-3.5 h-3.5" />}
                {trend.value}
              </span>
            )}
          </div>

          {/* Description (Gray #4B5563 / #6B7280) */}
          {subText && (
            <div className="text-[14px] font-normal text-[#4B5563] mt-1.5 leading-[1.6]">
              {subText}
            </div>
          )}
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
