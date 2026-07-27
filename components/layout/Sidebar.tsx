'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFilters } from '@/context/FilterContext';
import { NavigationItem } from '@/types';
import {
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  UserCheck,
  Wrench,
  FileSpreadsheet,
  Lightbulb,
  Info,
  ChevronRight,
  ChevronLeft,
  Building2,
} from 'lucide-react';

export const NAV_ITEMS: NavigationItem[] = [
  {
    name: 'Executive Dashboard',
    href: '/',
    iconName: 'LayoutDashboard',
    description: 'High-level business overview',
  },
  {
    name: 'Revenue Analytics',
    href: '/revenue',
    iconName: 'TrendingUp',
    description: 'Financial & course revenue metrics',
  },
  {
    name: 'Learner Analytics',
    href: '/learners',
    iconName: 'GraduationCap',
    description: 'Student & batch enrolment tracking',
  },
  {
    name: 'Sales Executive',
    href: '/sales-executive',
    iconName: 'UserCheck',
    description: 'Sales rep performance & pipeline',
  },
  {
    name: 'Operations MIS',
    href: '/operations',
    iconName: 'Wrench',
    description: 'Workshop & inventory operations',
  },
  {
    name: 'Reports & Export',
    href: '/reports',
    iconName: 'FileSpreadsheet',
    description: 'CSV data export & custom reports',
  },
  {
    name: 'Business Insights',
    href: '/insights',
    iconName: 'Lightbulb',
    description: 'Automated growth & anomaly signals',
  },
  {
    name: 'About Dashboard',
    href: '/about',
    iconName: 'Info',
    description: 'Platform info & KPI definitions',
  },
];

const renderIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'LayoutDashboard':
      return <LayoutDashboard className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'Lightbulb':
      return <Lightbulb className={className} />;
    case 'Info':
      return <Info className={className} />;
    default:
      return <LayoutDashboard className={className} />;
  }
};

const VERTICAL_OPTIONS = [
  { value: 'All', label: 'All', short: 'All' },
  { value: 'B2C', label: 'B2C', short: 'B2C' },
  { value: 'PAP', label: 'PAP', short: 'PAP' },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();
  const { filters, setBusinessVertical } = useFilters();

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-[#E5E7EB] bg-white transition-all duration-300 relative z-20 ${
        isCollapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* ── Business Vertical Filter ── */}
      <div className={`border-b border-[#E5E7EB] ${isCollapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <Building2 className="w-3.5 h-3.5 text-[#08C565]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              Business Vertical
            </span>
          </div>
        )}

        {isCollapsed ? (
          /* Collapsed: stack tiny buttons */
          <div className="flex flex-col items-center gap-1">
            {VERTICAL_OPTIONS.map((opt) => {
              const isActive = filters.businessVertical === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setBusinessVertical(opt.value)}
                  title={`Business Vertical: ${opt.label}`}
                  className={`w-full flex items-center justify-center py-1 rounded-lg text-[9px] font-extrabold transition-all ${
                    isActive
                      ? 'bg-[#08C565] text-white shadow-sm'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {opt.short}
                </button>
              );
            })}
          </div>
        ) : (
          /* Expanded: segmented pill control */
          <div className="flex items-center bg-[#F3F4F6] rounded-xl p-0.5 gap-0.5">
            {VERTICAL_OPTIONS.map((opt) => {
              const isActive = filters.businessVertical === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setBusinessVertical(opt.value)}
                  aria-label={`Filter by Business Vertical: ${opt.label}`}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-[10px] transition-all duration-150 ${
                    isActive
                      ? 'bg-[#08C565] text-white shadow-sm'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Analytics Modules
            </span>
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-[#08C565] text-white shadow-xs'
                  : 'text-[#374151] hover:bg-[#F3F4F6]'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <div
                className={`p-1 rounded-md shrink-0 ${
                  isActive ? 'text-white' : 'text-[#6B7280]'
                }`}
              >
                {renderIcon(item.iconName, 'w-4 h-4')}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="truncate block font-medium">{item.name}</span>
                </div>
              )}

              {isActive && !isCollapsed && (
                <ChevronRight className="w-4 h-4 text-white shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="p-3 border-t border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </aside>
  );
};
