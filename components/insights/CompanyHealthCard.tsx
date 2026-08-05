'use client';

import React from 'react';
import { CompanyHealthResult } from '@/lib/companyHealthMetrics';
import { ShieldCheck, Activity, TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface CompanyHealthCardProps {
  health: CompanyHealthResult;
}

export const CompanyHealthCard: React.FC<CompanyHealthCardProps> = ({ health }) => {
  const categoryStyles = {
    Excellent: {
      bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
      glow: 'from-emerald-500/20 to-teal-500/10',
      text: 'text-emerald-400',
    },
    Good: {
      bg: 'bg-sky-500/20 border-sky-500/40 text-sky-300',
      glow: 'from-sky-500/20 to-blue-500/10',
      text: 'text-sky-400',
    },
    Average: {
      bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
      glow: 'from-amber-500/20 to-orange-500/10',
      text: 'text-amber-400',
    },
    Critical: {
      bg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
      glow: 'from-rose-500/20 to-pink-500/10',
      text: 'text-rose-400',
    },
  };

  const style = categoryStyles[health.category];

  return (
    <div className={`bg-gradient-to-r ${style.glow} bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border ${style.bg} shrink-0`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                Company Business Health Score
              </h2>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${style.bg}`}>
                {health.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Comprehensive 30-second operational vitality score calculated dynamically from operational figures
            </p>
          </div>
        </div>

        {/* Big Counter */}
        <div className="flex items-baseline gap-2 self-end sm:self-auto">
          <div className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight ${style.text}`}>
            {health.score}
          </div>
          <span className="text-sm text-slate-500 font-extrabold">/ 100</span>
        </div>
      </div>

      {/* Score Composition Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Collection Weight</div>
          <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">
            +{health.collectionContribution.toFixed(1)} pts
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">35% max weight</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conversion Weight</div>
          <div className="text-base font-extrabold text-cyan-400 font-mono mt-1">
            +{health.conversionContribution.toFixed(1)} pts
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">25% max weight</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Candidates</div>
          <div className="text-base font-extrabold text-purple-400 font-mono mt-1">
            +{health.activeContribution.toFixed(1)} pts
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">20% max weight</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Penalty</div>
          <div className="text-base font-extrabold text-amber-400 font-mono mt-1">
            -{health.pendingPenalty.toFixed(1)} pts
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">-10% penalty</div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Leakage Penalty</div>
          <div className="text-base font-extrabold text-rose-400 font-mono mt-1">
            -{health.droppedPenalty.toFixed(1)} pts
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">-10% penalty</div>
        </div>
      </div>
    </div>
  );
};
