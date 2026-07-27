import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClass = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClass =
    variant === 'primary'
      ? 'bg-[#08C565] hover:bg-[#059669] text-white shadow-xs'
      : variant === 'secondary'
      ? 'bg-white border border-[#08C565] text-[#08C565] hover:bg-[#F0FDF4]'
      : variant === 'danger'
      ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs'
      : 'bg-transparent text-[#374151] hover:bg-[#F8FAFC] border border-[#E5E7EB]';

  const sizeClass =
    size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
