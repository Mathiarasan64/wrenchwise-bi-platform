'use client';

import React from 'react';
import { LearnerRiskAssessment } from '@/lib/learnerCrmEngine';
import { ShieldAlert, AlertTriangle, Shield, ShieldCheck } from 'lucide-react';

interface LearnerRiskAssessmentCardProps {
  risk: LearnerRiskAssessment;
}

const riskConfig: Record<string, { color: string; badgeCls: string; Icon: typeof Shield; ring: string }> = {
  'Low Risk': { color: 'text-[#08C565]', badgeCls: 'badge-success', Icon: ShieldCheck, ring: '#08C565' },
  'Medium Risk': { color: 'text-[#F59E0B]', badgeCls: 'badge-warning', Icon: Shield, ring: '#F59E0B' },
  'High Risk': { color: 'text-[#F59E0B]', badgeCls: 'badge-warning', Icon: ShieldAlert, ring: '#F59E0B' },
  'Critical Risk': { color: 'text-[#DC2626]', badgeCls: 'badge-danger', Icon: AlertTriangle, ring: '#DC2626' },
};

export const LearnerRiskAssessmentCard: React.FC<LearnerRiskAssessmentCardProps> = ({ risk }) => {
  const cfg = riskConfig[risk.category] || riskConfig['Low Risk'];
  const RiskIcon = cfg.Icon;

  // SVG dial calculations
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (risk.score / 100) * circumference;

  return (
    <div className="ww-card p-5 shadow-card border-l-6 border-l-[#DC2626]">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-xl bg-[#FEE2E2] ${cfg.color} border border-red-200`}>
          <RiskIcon className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[18px] font-semibold text-[#111827]">Risk Assessment</span>
          <span className="text-xs text-[#6B7280] block font-normal">Automated risk engine (0-100)</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Risk Dial */}
        <div className="relative shrink-0">
          <svg width="128" height="128" className="-rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={cfg.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold font-mono ${cfg.color}`}>{risk.score}</span>
            <span className="text-xs text-[#6B7280] font-semibold">/100</span>
          </div>
        </div>

        {/* Risk details */}
        <div className="flex-1 min-w-0">
          <div className={`inline-flex items-center gap-1.5 ${cfg.badgeCls} mb-3`}>
            <RiskIcon className="w-3.5 h-3.5" />
            {risk.category}
          </div>
          <p className="text-xs text-[#374151] leading-[1.6] font-normal">{risk.riskExplanation}</p>
        </div>
      </div>
    </div>
  );
};
