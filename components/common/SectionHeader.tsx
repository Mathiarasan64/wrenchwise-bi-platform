import React from 'react';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
  action?: React.ReactNode;
  accentColor?: 'green' | 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'sky';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
  badgeText,
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#E5E7EB]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl border border-emerald-200 bg-[#DCFCE7] text-[#08C565] shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111827] tracking-normal leading-[1.3] flex items-center gap-2">
            {title}
            {badgeText && (
              <span className="badge-success text-xs font-semibold">
                {badgeText}
              </span>
            )}
          </h2>
          <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6] mt-0.5">{subtitle}</p>
        </div>
      </div>
      {action && <div className="self-end sm:self-auto shrink-0">{action}</div>}
    </div>
  );
};
