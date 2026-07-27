'use client';

import React from 'react';

/* ─── Skeleton Primitives (Light Mode) ─── */
const ShimmerBlock: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div className={`skeleton-shimmer ${className}`} style={style} />
);

/* ─── Table Skeleton ─── */
export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-0 rounded-xl overflow-hidden border border-gray-200 bg-white">
      {/* Header row */}
      <div className="flex items-center gap-4 px-4 py-3 bg-slate-100 border-b border-gray-200">
        {[120, 160, 200, 140, 100, 120].map((w, i) => (
          <ShimmerBlock key={i} className="h-3" style={{ width: `${w}px` }} />
        ))}
      </div>
      {/* Data rows */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 ${i % 2 === 0 ? 'bg-slate-50/50' : ''}`}
        >
          <ShimmerBlock className="h-3 w-[8%]" />
          <ShimmerBlock className="h-3 w-[15%]" />
          <ShimmerBlock className="h-3 w-[22%]" />
          <ShimmerBlock className="h-3 w-[12%]" />
          <ShimmerBlock className="h-3 w-[10%]" />
          <ShimmerBlock className="h-3 w-[13%]" />
        </div>
      ))}
    </div>
  );
};

/* ─── Card Skeleton ─── */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="flex items-start justify-between">
        <ShimmerBlock className="h-3 w-24" />
        <ShimmerBlock className="h-10 w-10 rounded-xl" />
      </div>
      <ShimmerBlock className="h-8 w-32" />
      <ShimmerBlock className="h-2.5 w-20" />
      <div className="pt-1">
        <ShimmerBlock className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
};

/* ─── KPI Grid Skeleton ─── */
export const KPIGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShimmerBlock className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <ShimmerBlock className="h-4 w-48" />
          <ShimmerBlock className="h-2.5 w-72" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

/* ─── Chart Skeleton ─── */
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <ShimmerBlock className="h-9 w-9 rounded-xl" />
        <div className="space-y-2">
          <ShimmerBlock className="h-3.5 w-36" />
          <ShimmerBlock className="h-2.5 w-56" />
        </div>
      </div>
      <div className="h-64 flex items-end gap-3 px-4 pt-4">
        {[65, 85, 45, 90, 55, 70, 40].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <ShimmerBlock className="rounded-t-md" style={{ height: `${h}%` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 px-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-1">
            <ShimmerBlock className="h-2 mx-auto w-8" />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Page Skeleton ─── */
export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ShimmerBlock className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <ShimmerBlock className="h-6 w-56" />
            <ShimmerBlock className="h-3 w-80" />
          </div>
        </div>
        <ShimmerBlock className="h-8 w-36 rounded-xl" />
      </div>

      <ShimmerBlock className="h-14 w-full rounded-2xl" />

      <KPIGridSkeleton count={4} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <TableSkeleton />
    </div>
  );
};
