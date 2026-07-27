'use client';

import React, { useState, useMemo } from 'react';
import { ZohoRecord } from '@/types';
import { simulateScenario } from '@/lib/decisionIntelligenceEngine';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { Sliders, TrendingUp, DollarSign, Wallet, Activity, RotateCcw } from 'lucide-react';

interface WhatIfSimulationToolProps {
  records: ZohoRecord[];
}

export const WhatIfSimulationTool: React.FC<WhatIfSimulationToolProps> = ({ records }) => {
  const [collectionPct, setCollectionPct] = useState<number>(10); // +10%
  const [pendingPct, setPendingPct] = useState<number>(15); // -15%
  const [conversionPct, setConversionPct] = useState<number>(5); // +5%

  const simulation = useMemo(
    () => simulateScenario(records, collectionPct, pendingPct, conversionPct),
    [records, collectionPct, pendingPct, conversionPct]
  );

  const handleReset = () => {
    setCollectionPct(10);
    setPendingPct(15);
    setConversionPct(5);
  };

  return (
    <div className="ww-card p-6 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <SectionHeader
          icon={<Sliders className="w-5 h-5 text-[#08C565]" />}
          title="Interactive What-If Scenario Decision Simulator"
          subtitle="Model strategic decision scenarios and simulate projected financial outcomes in real time"
          badgeText="Scenario Simulator"
        />

        <button
          onClick={handleReset}
          className="btn-ghost flex items-center gap-1.5 text-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulator</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slider 1: Increase Collection % */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#111827]">
            <span>Increase Collection Efficiency</span>
            <span className="font-mono text-[#08C565]">+{collectionPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={collectionPct}
            onChange={(e) => setCollectionPct(Number(e.target.value))}
            className="w-full accent-[#08C565] cursor-pointer"
          />
          <p className="text-xs text-[#4B5563]">Accelerates realized cash collections from active deals.</p>
        </div>

        {/* Slider 2: Decrease Pending % */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#111827]">
            <span>Reduce Outstanding Pending Balance</span>
            <span className="font-mono text-[#F59E0B]">-{pendingPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={pendingPct}
            onChange={(e) => setPendingPct(Number(e.target.value))}
            className="w-full accent-[#F59E0B] cursor-pointer"
          />
          <p className="text-xs text-[#4B5563]">Clears past-due accounts through targeted recovery campaigns.</p>
        </div>

        {/* Slider 3: Improve Conversion % */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#111827]">
            <span>Improve Proposal Conversion Rate</span>
            <span className="font-mono text-[#0B9BC5]">+{conversionPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={conversionPct}
            onChange={(e) => setConversionPct(Number(e.target.value))}
            className="w-full accent-[#0B9BC5] cursor-pointer"
          />
          <p className="text-xs text-[#4B5563]">Converts open proposal quotations into contracted sales.</p>
        </div>
      </div>

      {/* Recalculated Simulated KPI Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Projected Revenue */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#0B9BC5]" /> Projected Revenue
          </div>
          <div className="text-xl font-extrabold font-mono text-[#111827] mt-2">
            {formatCurrency(simulation.projectedRevenue)}
          </div>
          <div className="text-xs text-[#08C565] mt-1 font-semibold">
            +{formatCurrency(simulation.revenueDelta)} growth
          </div>
        </div>

        {/* Projected Collection */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-[#08C565]" /> Projected Cash Collection
          </div>
          <div className="text-xl font-extrabold font-mono text-[#08C565] mt-2">
            {formatCurrency(simulation.projectedCollection)}
          </div>
          <div className="text-xs text-[#4B5563] mt-1">Realized liquid cash inflow</div>
        </div>

        {/* Projected Pending Balance */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#F59E0B]" /> Projected Receivables
          </div>
          <div className="text-xl font-extrabold font-mono text-[#F59E0B] mt-2">
            {formatCurrency(simulation.projectedPending)}
          </div>
          <div className="text-xs text-[#08C565] mt-1 font-semibold">
            -{pendingPct}% uncollected balance reduced
          </div>
        </div>

        {/* Projected Health Score */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#08C565]" /> Projected Health Score
          </div>
          <div className="text-xl font-extrabold font-mono text-[#08C565] mt-2">
            {simulation.projectedHealthScore}/100
          </div>
          <div className="text-xs text-[#08C565] mt-1 font-semibold">
            +{simulation.scoreDelta} pts score improvement
          </div>
        </div>
      </div>
    </div>
  );
};
