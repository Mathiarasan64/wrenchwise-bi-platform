'use client';

import React, { useMemo } from 'react';
import { useOverallCollectionData } from '@/context/OverallCollectionContext';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const OverallCollectionFilterBar: React.FC = () => {
  const { records, filters, setFilters, searchQuery, setSearchQuery, resetFilters } =
    useOverallCollectionData();

  // Extract unique options for filter dropdowns dynamically from data
  const options = useMemo(() => {
    const businessVerticals = Array.from(
      new Set(records.map((r) => r.businessVertical).filter(Boolean))
    ).sort();

    const salesExecutives = Array.from(
      new Set(records.map((r) => r.salesExecutive).filter(Boolean))
    ).sort();

    const courseNames = Array.from(
      new Set(records.map((r) => r.courseName).filter(Boolean))
    ).sort();

    const enrolledMonths = Array.from(
      new Set(records.map((r) => r.enrolledMonth).filter(Boolean))
    ).sort();

    const shifts = Array.from(
      new Set(records.map((r) => r.shift).filter(Boolean))
    ).sort();

    const paymentTypes = Array.from(
      new Set(records.map((r) => r.paymentType).filter(Boolean))
    ).sort();

    const learnerStatuses = Array.from(
      new Set(records.map((r) => r.learnerStatus).filter(Boolean))
    ).sort();

    const paymentStatuses = ['Paid', 'Pending', 'Completed'];

    return {
      businessVerticals,
      salesExecutives,
      courseNames,
      enrolledMonths,
      shifts,
      paymentTypes,
      learnerStatuses,
      paymentStatuses,
    };
  }, [records]);

  const hasActiveFilters =
    filters.businessVertical !== 'All' ||
    filters.salesExecutive !== 'All' ||
    filters.courseName !== 'All' ||
    filters.enrolledMonth !== 'All' ||
    filters.shift !== 'All' ||
    filters.paymentType !== 'All' ||
    filters.learnerStatus !== 'All' ||
    filters.paymentStatus !== 'All' ||
    searchQuery.trim() !== '';

  return (
    <div className="ww-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search Bar & Reset Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search by Student Name, Email, or Phone Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-xs text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#08C565] focus:border-transparent transition-all"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ww-button ww-button-secondary text-xs flex items-center justify-center gap-1.5 self-end md:self-auto py-2.5 px-4"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#6B7280]" />
            Reset All Filters
          </button>
        )}
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-2.5">
        {/* 1. Business Vertical */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Vertical
          </label>
          <select
            value={filters.businessVertical}
            onChange={(e) => setFilters((p) => ({ ...p, businessVertical: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Verticals</option>
            {options.businessVerticals.map((bv) => (
              <option key={bv} value={bv}>
                {bv}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Sales Executive */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Executive
          </label>
          <select
            value={filters.salesExecutive}
            onChange={(e) => setFilters((p) => ({ ...p, salesExecutive: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Representatives</option>
            {options.salesExecutives.map((se) => (
              <option key={se} value={se}>
                {se}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Course Name */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Course Name
          </label>
          <select
            value={filters.courseName}
            onChange={(e) => setFilters((p) => ({ ...p, courseName: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Courses</option>
            {options.courseNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Enrolled Month */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Enrolled Month
          </label>
          <select
            value={filters.enrolledMonth}
            onChange={(e) => setFilters((p) => ({ ...p, enrolledMonth: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Months</option>
            {options.enrolledMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Shift */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Shift
          </label>
          <select
            value={filters.shift}
            onChange={(e) => setFilters((p) => ({ ...p, shift: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Shifts</option>
            {options.shifts.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Payment Type */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Payment Type
          </label>
          <select
            value={filters.paymentType}
            onChange={(e) => setFilters((p) => ({ ...p, paymentType: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Types</option>
            {options.paymentTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>

        {/* 7. Learner Status */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Learner Status
          </label>
          <select
            value={filters.learnerStatus}
            onChange={(e) => setFilters((p) => ({ ...p, learnerStatus: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Statuses</option>
            {options.learnerStatuses.map((ls) => (
              <option key={ls} value={ls}>
                {ls}
              </option>
            ))}
          </select>
        </div>

        {/* 8. Payment Status */}
        <div>
          <label className="block text-[11px] font-semibold text-[#374151] mb-1">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters((p) => ({ ...p, paymentStatus: e.target.value }))}
            className="w-full py-1.5 px-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[11px] text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#08C565]"
          >
            <option value="All">All Payment Statuses</option>
            {options.paymentStatuses.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
