'use client';

import React, { useState } from 'react';
import { FilterProvider } from '@/context/FilterContext';
import { DataProvider } from '@/context/DataContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

export const ShellLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  return (
    <FilterProvider>
      <DataProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#08C565] selection:text-white">
          {/* Header */}
          <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />

          {/* Main Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />

            {/* Mobile Navigation Drawer */}
            <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

            {/* Page Content Container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col min-w-0">
              <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">{children}</div>
            </main>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </DataProvider>
    </FilterProvider>
  );
};
