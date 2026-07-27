'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useZohoData } from '@/context/DataContext';
import { useFilters } from '@/context/FilterContext';
import {
  Search,
  X,
  UserCheck,
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardList,
  CornerDownLeft,
} from 'lucide-react';

interface SearchResult {
  id: string;
  label: string;
  category: 'Sales Executive' | 'Learner' | 'Course' | 'Batch' | 'Observation';
  href: string;
  filterKey?: string;
  filterValue?: string;
  meta?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Sales Executive': <UserCheck className="w-4 h-4 text-[#08C565]" />,
  Learner: <GraduationCap className="w-4 h-4 text-[#0B9BC5]" />,
  Course: <BookOpen className="w-4 h-4 text-[#2563EB]" />,
  Batch: <Layers className="w-4 h-4 text-[#F59E0B]" />,
  Observation: <ClipboardList className="w-4 h-4 text-[#0B9BC5]" />,
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { records } = useZohoData();
  const { setSalesExecutive, setSearchQuery } = useFilters();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }
  }, [isOpen, onClose]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const seen = new Set<string>();
    const items: SearchResult[] = [];

    records.forEach((r) => {
      if (r.salesExecutive && r.salesExecutive.toLowerCase().includes(q)) {
        const key = `exec-${r.salesExecutive}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({
            id: key,
            label: r.salesExecutive,
            category: 'Sales Executive',
            href: '/sales-executive',
            filterKey: 'salesExecutive',
            filterValue: r.salesExecutive,
            meta: `${r.section}`,
          });
        }
      }

      if (r.customerName && r.customerName.toLowerCase().includes(q)) {
        const key = `learner-${r.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({
            id: key,
            label: r.customerName,
            category: 'Learner',
            href: '/learners',
            meta: `${r.salesExecutive} • ${r.learnerStatus}`,
          });
        }
      }

      if (r.course && r.course.toLowerCase().includes(q)) {
        const key = `course-${r.course}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({
            id: key,
            label: r.course,
            category: 'Course',
            href: '/learners',
            meta: `${r.section}`,
          });
        }
      }

      if (r.section && r.section.toLowerCase().includes(q)) {
        const key = `batch-${r.section}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({
            id: key,
            label: r.section,
            category: 'Batch',
            href: '/',
            meta: 'Operations MIS',
          });
        }
      }

      if (r.operationsObservation && r.operationsObservation.toLowerCase().includes(q) && r.operationsObservation !== 'No observations recorded.') {
        const key = `obs-${r.id}`;
        if (!seen.has(key) && items.filter((i) => i.category === 'Observation').length < 5) {
          seen.add(key);
          items.push({
            id: key,
            label: r.operationsObservation.substring(0, 80) + (r.operationsObservation.length > 80 ? '…' : ''),
            category: 'Observation',
            href: '/operations',
            meta: r.salesExecutive,
          });
        }
      }
    });

    return items.slice(0, 20);
  }, [query, records]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [results]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    },
    [results, activeIndex]
  );

  const handleSelect = (result: SearchResult) => {
    if (result.filterKey === 'salesExecutive' && result.filterValue) {
      setSalesExecutive(result.filterValue);
    } else {
      setSearchQuery(result.label.substring(0, 30));
    }
    router.push(result.href);
    onClose();
  };

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] search-overlay" onClick={onClose}>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl mx-4 bg-white border border-[#E5E7EB] rounded-[16px] shadow-2xl overflow-hidden search-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#6B7280] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search executives, learners, courses, observations..."
            className="flex-1 bg-transparent text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none font-normal"
          />
          <div className="flex items-center gap-1.5">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-[#E5E7EB] rounded text-[10px] font-mono text-[#6B7280]">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-[#6B7280] hover:text-[#111827] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-5 py-8 text-center">
              <div className="text-sm font-semibold text-[#111827] mb-2">Start typing to search across all data</div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6B7280] font-normal">
                <span className="px-2.5 py-1 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">Sales Executives</span>
                <span className="px-2.5 py-1 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">Learners</span>
                <span className="px-2.5 py-1 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">Courses</span>
                <span className="px-2.5 py-1 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">Batches</span>
                <span className="px-2.5 py-1 bg-[#F8FAFC] rounded-md border border-[#E5E7EB]">Observations</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <div className="text-sm font-semibold text-[#111827] mb-1">No results found</div>
              <div className="text-xs text-[#6B7280]">
                Try a different search term or check spelling
              </div>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    {category}
                  </div>
                  {items.map((item) => {
                    const idx = flatIndex++;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          idx === activeIndex
                            ? 'bg-[#DCFCE7] text-[#166534]'
                            : 'text-[#374151] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        <div className="shrink-0">{CATEGORY_ICONS[category]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{item.label}</div>
                          {item.meta && (
                            <div className="text-xs text-[#6B7280] truncate font-normal">{item.meta}</div>
                          )}
                        </div>
                        {idx === activeIndex && (
                          <CornerDownLeft className="w-4 h-4 text-[#08C565] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#E5E7EB] text-xs text-[#6B7280] bg-[#F8FAFC]">
            <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white border border-[#E5E7EB] rounded text-[10px] font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white border border-[#E5E7EB] rounded text-[10px] font-mono">↵</kbd>
                Select
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
