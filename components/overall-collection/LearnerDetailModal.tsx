'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { OverallCollectionRecord } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Wallet,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useOverallCollectionData } from '@/context/OverallCollectionContext';

interface LearnerDetailModalProps {
  learner: OverallCollectionRecord | string | null;
  onClose: () => void;
}

export const LearnerDetailModal: React.FC<LearnerDetailModalProps> = ({ learner, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Accordion state: Section 1 (Learner Profile) expanded by default
  const [openSections, setOpenSections] = useState<number[]>([1]);
  const { records, selectedMonth } = useOverallCollectionData();

  // Resolve complete learner record from dataset in memory
  const activeLearner = useMemo<OverallCollectionRecord | null>(() => {
    if (!learner) return null;

    if (typeof learner === 'object' && learner.studentName && learner.studentName.trim() !== '') {
      return learner;
    }

    const targetId = typeof learner === 'string' ? learner : (learner as any).id;
    if (!targetId) return typeof learner === 'object' ? learner : null;

    const found = records.find(
      (r) =>
        r.id === targetId ||
        String(r.sNo) === String(targetId) ||
        r.studentName.toLowerCase().trim() === String(targetId).toLowerCase().trim()
    );

    return found || (typeof learner === 'object' ? (learner as OverallCollectionRecord) : null);
  }, [learner, records]);

  // Handle Escape key listener, auto-focus, & body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (activeLearner) {
      setOpenSections([1]);
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Focus drawer container so keyboard arrows and PageUp/PageDown scroll immediately
      setTimeout(() => {
        if (drawerRef.current) {
          drawerRef.current.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLearner, onClose]);

  if (!activeLearner) return null;

  const handleCopyText = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleSection = (sectionNum: number) => {
    setOpenSections((prev) =>
      prev.includes(sectionNum)
        ? prev.filter((num) => num !== sectionNum)
        : [...prev, sectionNum]
    );
  };

  const monthEntries = activeLearner.monthPayments ? Object.entries(activeLearner.monthPayments) : [];
  const isMonthSelected = selectedMonth && selectedMonth !== 'Overall';

  // Extract latest payment link available for candidate
  let latestLink = '';
  monthEntries.forEach(([_, data]) => {
    if (data && data.paymentLink && data.paymentLink.startsWith('http')) {
      latestLink = data.paymentLink;
    }
  });

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    if (s === 'paid' || s === 'completed') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
          Paid
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
          Pending
        </span>
      );
    }
    if (s === 'overdue') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-red-50 text-red-700 border-red-200">
          Overdue
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
        {status || 'N/A'}
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn overscroll-contain"
      onClick={onClose}
    >
      {/* 
        Fixed Enterprise CRM Learner Detail Drawer Container:
        - Fixed positioning (top-0, right-0, h-screen)
        - min-h-0 & overflow-hidden forces flex-1 child to calculate height & scroll cleanly
      */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="bg-white border-l border-[#E5E7EB] shadow-2xl w-full sm:w-[480px] md:w-[75%] md:max-w-[560px] lg:w-[500px] h-screen max-h-screen flex flex-col min-h-0 overflow-hidden outline-none animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Top Header (shrink-0 prevents header from squeezing) */}
        <div className="flex items-start justify-between p-4 border-b border-[#E5E7EB] bg-[#F8FAFC] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              {(activeLearner.studentName || 'S').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[#111827] flex items-center gap-2 truncate">
                <span className="truncate">{activeLearner.studentName || 'Learner Details'}</span>
                {activeLearner.businessVertical && (
                  <span className="badge-secondary text-[10px] font-semibold shrink-0">
                    {activeLearner.businessVertical}
                  </span>
                )}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                    (activeLearner.learnerStatus || '').toLowerCase() === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : (activeLearner.learnerStatus || '').toLowerCase() === 'inactive'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {activeLearner.learnerStatus || 'Active'}
                </span>
              </h2>
              {/* Candidate ID directly below student name in small grey font */}
              <p className="text-xs text-[#6B7280] font-mono mt-0.5 truncate">
                Candidate ID: <span className="font-semibold text-[#374151]">{activeLearner.id || 'N/A'}</span>
              </p>
              <p className="text-[11px] text-[#6B7280] font-normal truncate mt-0.5">
                Sales Rep: <span className="font-semibold text-[#111827]">{activeLearner.salesExecutive || 'Unassigned'}</span>
              </p>
            </div>
          </div>

          {/* Top-Right Small X Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB] transition-all shrink-0 ml-2"
            aria-label="Close Drawer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 
          Independent Scrollable Drawer Body:
          - flex-1 + min-h-0 allows flexbox to calculate remaining height
          - overflow-y-auto enables smooth vertical scrolling for mouse, trackpad, touch & keyboard
        */}
        <div className="p-3.5 space-y-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar overscroll-contain touch-pan-y">
          {/* ========================================================
              SECTION 1: 👤 Learner Profile (Expanded by Default)
             ======================================================== */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => toggleSection(1)}
              className="w-full flex items-center justify-between p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-left font-bold text-xs text-[#111827] uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#08C565]" />
                <span>1. Learner Profile</span>
              </div>
              {openSections.includes(1) ? (
                <ChevronUp className="w-4 h-4 text-[#6B7280]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              )}
            </button>

            {openSections.includes(1) && (
              <div className="p-3 space-y-2 text-xs text-[#374151] border-t border-[#E5E7EB] animate-fadeIn">
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Student Name</span>
                  <span className="font-bold text-[#111827]">{activeLearner.studentName || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Candidate ID</span>
                  <span className="font-mono font-semibold text-[#111827]">{activeLearner.id || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Sales Executive</span>
                  <span className="font-semibold text-[#111827]">{activeLearner.salesExecutive || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Business Vertical</span>
                  <span className="font-semibold text-[#111827]">{activeLearner.businessVertical || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Email</span>
                  <span className="font-mono text-[#111827] select-all truncate max-w-[180px]">
                    {activeLearner.email || '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Phone Number</span>
                  <span className="font-mono text-[#111827] select-all">
                    {activeLearner.phone || '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Course Name</span>
                  <span className="font-semibold text-[#111827] truncate max-w-[200px]" title={activeLearner.courseName}>
                    {activeLearner.courseName || '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Enrolled Month</span>
                  <span className="font-medium text-[#111827]">{activeLearner.enrolledMonth || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Shift</span>
                  <span className="font-medium text-[#111827]">{activeLearner.shift || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">Payment Type</span>
                  <span className="font-semibold text-[#111827]">{activeLearner.paymentType || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="font-medium text-[#6B7280]">EMI Tenure</span>
                  <span className="font-semibold text-[#111827]">{activeLearner.emiTenure || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-[#6B7280]">Learner Status</span>
                  <span className="font-bold text-[#111827]">{activeLearner.learnerStatus || 'Active'}</span>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              SECTION 2: 💰 Fee Summary (Compact KPI Cards)
             ======================================================== */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => toggleSection(2)}
              className="w-full flex items-center justify-between p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-left font-bold text-xs text-[#111827] uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#0B9BC5]" />
                <span>2. Fee Summary</span>
              </div>
              {openSections.includes(2) ? (
                <ChevronUp className="w-4 h-4 text-[#6B7280]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              )}
            </button>

            {openSections.includes(2) && (
              <div className="p-3 grid grid-cols-2 gap-2.5 border-t border-[#E5E7EB] animate-fadeIn">
                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                  <p className="text-[10px] font-semibold text-[#6B7280]">Total Price</p>
                  <p className="text-xs font-bold font-mono text-[#111827] mt-0.5">
                    {formatCurrency(activeLearner.totalPrice || 0)}
                  </p>
                </div>

                <div className="p-2.5 bg-[#DCFCE7]/40 rounded-lg border border-emerald-200">
                  <p className="text-[10px] font-semibold text-[#08C565]">Advance Paid</p>
                  <p className="text-xs font-bold font-mono text-[#08C565] mt-0.5">
                    {formatCurrency(activeLearner.advance || 0)}
                  </p>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                  <p className="text-[10px] font-semibold text-[#6B7280]">Total Payable Fee</p>
                  <p className="text-xs font-bold font-mono text-[#111827] mt-0.5">
                    {formatCurrency(activeLearner.totalPayableFee || 0)}
                  </p>
                </div>

                <div className="p-2.5 bg-[#DCFCE7]/50 rounded-lg border border-emerald-200">
                  <p className="text-[10px] font-semibold text-[#08C565]">Amount Collected</p>
                  <p className="text-xs font-bold font-mono text-[#08C565] mt-0.5">
                    {formatCurrency(activeLearner.amountCollected || 0)}
                  </p>
                </div>

                <div className="p-2.5 bg-[#FEF3C7]/50 rounded-lg border border-amber-200">
                  <p className="text-[10px] font-semibold text-[#F59E0B]">Pending Amount</p>
                  <p className="text-xs font-bold font-mono text-[#F59E0B] mt-0.5">
                    {formatCurrency(activeLearner.pendingCollection || 0)}
                  </p>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
                  <p className="text-[10px] font-semibold text-[#6B7280]">Collection %</p>
                  <p className="text-xs font-bold font-mono text-[#08C565] mt-0.5">
                    {formatPercent(activeLearner.collectionPercentage || 0)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              SECTION 3: 💳 Payment History (Dynamic Month Table)
             ======================================================== */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => toggleSection(3)}
              className="w-full flex items-center justify-between p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-left font-bold text-xs text-[#111827] uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9333EA]" />
                <span>3. Payment History</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#6B7280]">
                  {monthEntries.length} Months Tracked
                </span>
                {openSections.includes(3) ? (
                  <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                )}
              </div>
            </button>

            {openSections.includes(3) && (
              <div className="border-t border-[#E5E7EB] animate-fadeIn">
                {monthEntries.length === 0 ? (
                  <div className="p-3 text-center text-xs text-[#6B7280]">
                    No monthly payment history recorded for this candidate.
                  </div>
                ) : (
                  <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                        <tr className="border-b border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                          <th className="py-2 px-3">Month</th>
                          <th className="py-2 px-3 text-right">Expected EMI</th>
                          <th className="py-2 px-3 text-right">Paid Amount</th>
                          <th className="py-2 px-3 text-center">Status</th>
                          <th className="py-2 px-3 text-center">Payment Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                        {monthEntries.map(([monthName, data]) => {
                          const hasLink = Boolean(data && data.paymentLink && data.paymentLink.startsWith('http'));
                          const keyStr = `${activeLearner.id}-${monthName}-hist`;
                          const isCopied = copiedKey === keyStr;
                          const isSelected =
                            isMonthSelected &&
                            monthName.toLowerCase().trim() === selectedMonth.toLowerCase().trim();

                          return (
                            <tr
                              key={monthName}
                              className={`transition-colors ${
                                isSelected ? 'bg-[#DCFCE7]/40 font-semibold' : 'hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <td className="py-2 px-3 font-bold text-[#111827]">
                                {monthName}
                              </td>

                              <td className="py-2 px-3 text-right font-mono text-[#4B5563]">
                                {data && data.expectedEmi > 0 ? formatCurrency(data.expectedEmi) : '—'}
                              </td>

                              <td className="py-2 px-3 text-right font-mono font-bold text-[#08C565]">
                                {formatCurrency(data ? data.amount : 0)}
                              </td>

                              <td className="py-2 px-3 text-center">
                                {getStatusBadge(data ? data.status : '')}
                              </td>

                              <td className="py-2 px-3 text-center">
                                {hasLink ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <a
                                      href={data.paymentLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ww-button ww-button-primary text-[9px] py-0.5 px-2 flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-2.5 h-2.5" />
                                      Open
                                    </a>
                                    <button
                                      onClick={() => handleCopyText(data.paymentLink, keyStr)}
                                      className="ww-button ww-button-secondary text-[9px] py-0.5 px-2 flex items-center gap-1"
                                    >
                                      {isCopied ? (
                                        <Check className="w-2.5 h-2.5 text-[#08C565]" />
                                      ) : (
                                        <Copy className="w-2.5 h-2.5 text-[#6B7280]" />
                                      )}
                                      Copy
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-[#9CA3AF] italic">No Link</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================
              SECTION 4: ⚡ Quick Actions (Compact Buttons)
             ======================================================== */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => toggleSection(4)}
              className="w-full flex items-center justify-between p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors text-left font-bold text-xs text-[#111827] uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F59E0B]" />
                <span>4. Quick Actions</span>
              </div>
              {openSections.includes(4) ? (
                <ChevronUp className="w-4 h-4 text-[#6B7280]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              )}
            </button>

            {openSections.includes(4) && (
              <div className="p-3 grid grid-cols-2 gap-2 border-t border-[#E5E7EB] animate-fadeIn">
                {/* 1. Open Payment Link */}
                <a
                  href={latestLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!latestLink) {
                      e.preventDefault();
                      alert('No valid payment link available for this candidate.');
                    }
                  }}
                  className={`ww-button text-xs py-2 px-2.5 flex items-center justify-center gap-1.5 font-semibold shadow-2xs truncate ${
                    latestLink
                      ? 'ww-button-primary'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Open Payment Link</span>
                </a>

                {/* 2. Copy Payment Link */}
                <button
                  onClick={() => handleCopyText(latestLink, 'act-link')}
                  disabled={!latestLink}
                  className="ww-button ww-button-secondary text-xs py-2 px-2.5 flex items-center justify-center gap-1.5 font-semibold shadow-2xs disabled:opacity-40 truncate"
                >
                  {copiedKey === 'act-link' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#08C565] shrink-0" />
                      <span className="truncate">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#08C565] shrink-0" />
                      <span className="truncate">Copy Payment Link</span>
                    </>
                  )}
                </button>

                {/* 3. Copy Email */}
                <button
                  onClick={() => handleCopyText(activeLearner.email, 'act-email')}
                  disabled={!activeLearner.email}
                  className="ww-button ww-button-secondary text-xs py-2 px-2.5 flex items-center justify-center gap-1.5 font-semibold shadow-2xs disabled:opacity-40 truncate"
                >
                  {copiedKey === 'act-email' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#08C565] shrink-0" />
                      <span className="truncate">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-[#0B9BC5] shrink-0" />
                      <span className="truncate">Copy Email</span>
                    </>
                  )}
                </button>

                {/* 4. Copy Phone Number */}
                <button
                  onClick={() => handleCopyText(activeLearner.phone, 'act-phone')}
                  disabled={!activeLearner.phone}
                  className="ww-button ww-button-secondary text-xs py-2 px-2.5 flex items-center justify-center gap-1.5 font-semibold shadow-2xs disabled:opacity-40 truncate"
                >
                  {copiedKey === 'act-phone' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#08C565] shrink-0" />
                      <span className="truncate">Phone Copied!</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-3.5 h-3.5 text-[#9333EA] shrink-0" />
                      <span className="truncate">Copy Phone</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
