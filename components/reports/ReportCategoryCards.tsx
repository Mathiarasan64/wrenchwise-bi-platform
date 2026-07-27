'use client';

import React from 'react';
import { REPORT_CONFIGS, ReportCategory } from '@/lib/reportEngine';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FileSpreadsheet, DollarSign, UserCheck, GraduationCap, Wrench, Clock, Eye, Download } from 'lucide-react';

interface ReportCategoryCardsProps {
  activeCategory: ReportCategory;
  onSelectCategory: (id: ReportCategory) => void;
  onExportCategory: (id: ReportCategory) => void;
}

const getAccentBorderClass = (id: ReportCategory) => {
  switch (id) {
    case 'executive-summary':
      return 'border-l-6 border-l-[#08C565] border-t border-r border-b border-[#E5E7EB]';
    case 'sales-executive':
      return 'border-l-6 border-l-[#08C565] border-t border-r border-b border-[#E5E7EB]';
    case 'revenue':
      return 'border-l-6 border-l-[#0B9BC5] border-t border-r border-b border-[#E5E7EB]';
    case 'learner-status':
      return 'border-l-6 border-l-[#7C3AED] border-t border-r border-b border-[#E5E7EB]';
    case 'operations-mis':
      return 'border-l-6 border-l-[#F59E0B] border-t border-r border-b border-[#E5E7EB]';
    case 'pending-collection':
      return 'border-l-6 border-l-[#16A34A] border-t border-r border-b border-[#E5E7EB]';
    default:
      return 'border-l-6 border-l-[#2563EB] border-t border-r border-b border-[#E5E7EB]';
  }
};

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'FileSpreadsheet':
      return <FileSpreadsheet className="w-5 h-5 text-[#08C565]" />;
    case 'DollarSign':
      return <DollarSign className="w-5 h-5 text-[#0B9BC5]" />;
    case 'UserCheck':
      return <UserCheck className="w-5 h-5 text-[#08C565]" />;
    case 'GraduationCap':
      return <GraduationCap className="w-5 h-5 text-[#7C3AED]" />;
    case 'Wrench':
      return <Wrench className="w-5 h-5 text-[#F59E0B]" />;
    case 'Clock':
      return <Clock className="w-5 h-5 text-[#16A34A]" />;
    default:
      return <FileSpreadsheet className="w-5 h-5 text-[#08C565]" />;
  }
};

export const ReportCategoryCards: React.FC<ReportCategoryCardsProps> = ({
  activeCategory,
  onSelectCategory,
  onExportCategory,
}) => {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<FileSpreadsheet className="w-5 h-5 text-[#08C565]" />}
        title="Business Report Categories"
        subtitle="Select a report template to preview live data, customize columns, or export immediately"
        badgeText="6 Report Templates"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_CONFIGS.map((config) => {
          const isSelected = activeCategory === config.id;
          const accentClass = getAccentBorderClass(config.id);

          return (
            <div
              key={config.id}
              onClick={() => onSelectCategory(config.id)}
              className={`bg-white rounded-2xl p-5 shadow-card cursor-pointer transition-all duration-250 flex flex-col justify-between hover-lift ${accentClass} ${
                isSelected
                  ? 'ring-2 ring-[#08C565]/30'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] shrink-0">
                    {renderIcon(config.iconName)}
                  </div>
                  {isSelected && (
                    <span className="badge-success text-[10px]">
                      Active Preview
                    </span>
                  )}
                </div>

                <h3 className="text-[18px] font-semibold text-[#111827]">{config.title}</h3>
                <p className="text-[14px] text-[#4B5563] mt-1.5 leading-[1.6] font-normal">{config.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(config.id);
                  }}
                  className="btn-ghost text-xs inline-flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-[#0B9BC5]" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExportCategory(config.id);
                  }}
                  className="btn-primary text-xs inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
