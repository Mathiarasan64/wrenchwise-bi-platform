'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './Sidebar';
import { WrenchWiseLogo } from '@/components/common/WrenchWiseLogo';
import { X, ChevronRight, LayoutDashboard, TrendingUp, GraduationCap, UserCheck, Wrench, FileSpreadsheet, Lightbulb, Info } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm search-overlay"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex flex-col w-4/5 max-w-sm bg-white border-r border-gray-200 p-5 z-10 shadow-2xl animate-slideInRight">
        <div className="flex items-center justify-between pb-5 border-b border-gray-200">
          <WrenchWiseLogo showTagline={true} size="sm" />

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 border border-gray-200 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-[#08C565] border border-[#08C565]/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {renderIcon(item.iconName, 'w-5 h-5')}
                <span className="flex-1">{item.name}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-gray-200 text-xs text-slate-500 text-center font-medium">
          Wrench Wise BI • Innovate. Engineer. Excel
        </div>
      </div>
    </div>
  );
};
