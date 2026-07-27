'use client';

import React, { useState, useEffect } from 'react';
import { useZohoData } from '@/context/DataContext';
import { WrenchWiseLogo } from '@/components/common/WrenchWiseLogo';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { formatRelativeTime } from '@/lib/utils';
import { RefreshCw, Search, Calendar, Menu, Command } from 'lucide-react';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { lastSync, refetchData, isLoading, error } = useZohoData();
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const syncTimeLabel = formatRelativeTime(lastSync);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-3 transition-all shadow-xs">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Mobile Toggle & Wrench Wise Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 text-[#374151] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-xl transition-colors"
              aria-label="Open Mobile Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <WrenchWiseLogo showTagline={true} size="md" />
          </div>

          {/* Center/Right: Search, Date, Connection, Refresh */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-sm text-[#374151] transition-all font-normal"
              aria-label="Open search"
            >
              <Search className="w-4 h-4 text-[#6B7280]" />
              <span className="hidden md:inline">Search executive, learner, course...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 ml-2 px-1.5 py-0.5 bg-white border border-[#E5E7EB] rounded text-[10px] font-mono text-[#6B7280]">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>

            {/* Current Date & Time */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-sm font-medium text-[#374151]">
              <Calendar className="w-4 h-4 text-[#08C565]" />
              <span className="font-mono text-xs font-semibold">{currentDateTime || '...'}</span>
            </div>

            {/* Live Data Connection Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isLoading ? 'bg-amber-400' : error ? 'bg-red-400' : 'bg-[#08C565]'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isLoading ? 'bg-amber-500' : error ? 'bg-red-500' : 'bg-[#08C565]'
                  }`}
                />
              </span>
              <span className="font-semibold text-[#111827]">
                {isLoading ? 'Syncing...' : error ? 'Disconnected' : 'Live Zoho Connected'}
              </span>
              <span className="text-[#9CA3AF]">•</span>
              <span className="text-[#6B7280] font-mono font-medium">{syncTimeLabel}</span>
            </div>

            {/* Primary Green Button (#08C565) */}
            <button
              onClick={() => refetchData()}
              disabled={isLoading}
              className="btn-primary flex items-center gap-1.5 disabled:opacity-50"
              title="Refresh data from Zoho Sheet"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Overlay */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
