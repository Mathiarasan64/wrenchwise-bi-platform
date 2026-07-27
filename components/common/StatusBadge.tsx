'use client';

import React from 'react';

export type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'active' | 'dropped' | 'hold' | string;

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  let styleClass = 'bg-[#DBEAFE] text-[#1D4ED8]'; // Default Information

  if (
    normalized === 'success' ||
    normalized === 'active' ||
    normalized === 'closed won' ||
    normalized === 'completed' ||
    normalized === 'excellent'
  ) {
    styleClass = 'bg-[#DCFCE7] text-[#166534]'; // Success
  } else if (
    normalized === 'warning' ||
    normalized === 'hold' ||
    normalized === 'paused' ||
    normalized === 'in pipeline' ||
    normalized === 'average'
  ) {
    styleClass = 'bg-[#FEF3C7] text-[#92400E]'; // Warning
  } else if (
    normalized === 'danger' ||
    normalized === 'dropped' ||
    normalized === 'lost' ||
    normalized === 'critical'
  ) {
    styleClass = 'bg-[#FEE2E2] text-[#991B1B]'; // Danger
  } else if (normalized === 'info' || normalized === 'information' || normalized === 'good') {
    styleClass = 'bg-[#DBEAFE] text-[#1D4ED8]'; // Information
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full uppercase tracking-wider ${paddingClass} ${styleClass}`}>
      {label || status}
    </span>
  );
};
