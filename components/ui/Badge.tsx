import React from 'react';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  children,
  className = '',
}) => {
  const variantClass =
    variant === 'success'
      ? 'bg-[#DCFCE7] text-[#166534]'
      : variant === 'warning'
      ? 'bg-[#FEF3C7] text-[#92400E]'
      : variant === 'danger'
      ? 'bg-[#FEE2E2] text-[#991B1B]'
      : variant === 'secondary'
      ? 'bg-[#F3F4F6] text-[#374151]'
      : 'bg-[#DBEAFE] text-[#1D4ED8]';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
