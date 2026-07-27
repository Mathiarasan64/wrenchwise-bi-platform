import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentBorderColor?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  accentBorderColor,
  children,
  className = '',
  ...props
}) => {
  const accentClass = accentBorderColor ? `border-l-6 ${accentBorderColor}` : '';

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-card transition-all duration-250 ${accentClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
