'use client';

import React, { useState, useEffect } from 'react';
import { useZohoData } from '@/context/DataContext';
import { useOverallCollectionData } from '@/context/OverallCollectionContext';
import { WrenchWiseLogo } from '@/components/common/WrenchWiseLogo';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { formatRelativeTime } from '@/lib/utils';
import { RefreshCw, Search, Calendar, Menu, Command, CheckCircle } from 'lucide-react';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { lastSync: masterSync, refetchData: refetchMaster, isLoading: masterLoading } = useZohoData();
  const { lastSync: collectionSync, refetchData: refetchCollection, isLoading: collectionLoading } = useOverallCollectionData();
  
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<{ message: string; timestamp: string } | null>(null);

  const activeLastSync = collectionSync || masterSync;
  const isGlobalLoading = masterLoading || collectionLoading || isSyncing;

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

  const handleFullSync = async () => {
    setIsSyncing(true);
    try {
      await Promise.all([refetchMaster(), refetchCollection(true)]);
      const d = new Date();
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      const timestampStr = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;

      setSyncToast({
        message: 'Dashboard synchronized successfully.',
        timestamp: timestampStr,
      });

      setTimeout(() => {
        setSyncToast(null);
      }, 5000);
    } catch (err) {
      console.error('Full Sync Error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

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

            {/* Last Updated Timestamp */}
            {activeLastSync && (
              <div
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs font-mono text-[#374151]"
                suppressHydrationWarning
              >
                <span className="font-semibold text-[#6B7280]">
                  {(() => {
                    const d = activeLastSync;
                    const day = String(d.getDate()).padStart(2, '0');
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = monthNames[d.getMonth()];
                    const year = d.getFullYear();
                    const hours = String(d.getHours()).padStart(2, '0');
                    const minutes = String(d.getMinutes()).padStart(2, '0');
                    const seconds = String(d.getSeconds()).padStart(2, '0');
                    return `Last Synced: ${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
                  })()}
                </span>
              </div>
            )}

            {/* Primary Green Refresh Button (#08C565) */}
            <button
              onClick={handleFullSync}
              disabled={isGlobalLoading}
              className="btn-primary flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="Full Sync: Fetch latest data and dynamic schema from BOTH Zoho Sheets"
              aria-label="Refresh data from Zoho Sheets"
            >
              <RefreshCw className={`w-4 h-4 ${isGlobalLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGlobalLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sync Success Toast Banner */}
      {syncToast && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#111827] text-white rounded-xl shadow-2xl border border-emerald-500/40 animate-slideInRight">
          <div className="p-1 rounded-full bg-[#08C565] text-white shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#08C565]">{syncToast.message}</div>
            <div className="text-[10px] text-gray-300 font-mono mt-0.5">Last Synced: {syncToast.timestamp}</div>
          </div>
        </div>
      )}

      {/* Global Search Overlay */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
