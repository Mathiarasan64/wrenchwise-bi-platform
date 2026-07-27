'use client';

import React from 'react';
import {
  ExecutiveSummaryStats,
  generateActionRecommendations,
} from '@/lib/salesExecutiveMetrics';
import { SectionHeader } from '@/components/common/SectionHeader';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  AlertTriangle,
  Trophy,
  Percent,
  Clock,
  Users,
  CheckCircle2,
  Lightbulb,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface ExecutiveInsightsAndAlertsProps {
  execStats: ExecutiveSummaryStats[];
}

export const ExecutiveInsightsAndAlerts: React.FC<ExecutiveInsightsAndAlertsProps> = ({ execStats }) => {
  const recommendations = generateActionRecommendations(execStats);

  // Derive Top Performers
  const sortedRev = [...execStats].sort((a, b) => b.totalSalesValue - a.totalSalesValue);
  const sortedCol = [...execStats].sort((a, b) => b.collectionPercentage - a.collectionPercentage);
  const sortedConv = [...execStats].sort((a, b) => b.conversionRate - a.conversionRate);
  const sortedLowPending = [...execStats].filter((e) => e.totalSalesValue > 0).sort((a, b) => a.pendingAmount - b.pendingAmount);
  const sortedActive = [...execStats].sort((a, b) => b.activeLearners - a.activeLearners);

  const topRevenue = sortedRev[0];
  const topCollection = sortedCol[0];
  const topConversion = sortedConv[0];
  const lowestPending = sortedLowPending[0];
  const highestActive = sortedActive[0];

  // Derive Attention Required Items
  const highPendingList = execStats.filter((e) => e.pendingAmount > 100000);
  const highDroppedList = execStats.filter((e) => e.dropped > 0 || e.droppedValue > 0);
  const lowCollectionList = execStats.filter((e) => e.totalSalesValue > 0 && e.collectionPercentage < 20);
  const lowConversionList = execStats.filter((e) => e.totalLearners >= 2 && e.conversionRate === 0);

  return (
    <div className="space-y-8">
      {/* 1. TOP PERFORMERS RECOGNITION */}
      <div>
        <SectionHeader
          icon={<Trophy className="w-5 h-5 text-[#08C565]" />}
          title="Top Performers Recognition"
          subtitle="Sales representatives leading across sales volume, cash collection ratio, and learner engagement"
          badgeText="Top Performers"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topRevenue && (
            <div className="card-success p-5 flex flex-col justify-between hover-lift">
              <div>
                <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-[#16A34A]" /> Top Revenue
                </div>
                <div className="text-[18px] font-semibold text-[#111827] mt-1.5">{topRevenue.name}</div>
              </div>
              <div className="text-sm font-mono font-bold text-[#0B9BC5] mt-2">
                {formatCurrency(topRevenue.totalSalesValue)}
              </div>
            </div>
          )}

          {topCollection && (
            <div className="card-success p-5 flex flex-col justify-between hover-lift">
              <div>
                <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-[#16A34A]" /> Top Collection %
                </div>
                <div className="text-[18px] font-semibold text-[#111827] mt-1.5">{topCollection.name}</div>
              </div>
              <div className="text-sm font-mono font-bold text-[#08C565] mt-2">
                {formatPercent(topCollection.collectionPercentage)} Realized
              </div>
            </div>
          )}

          {topConversion && (
            <div className="card-info p-5 flex flex-col justify-between hover-lift">
              <div>
                <div className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" /> Top Conversion
                </div>
                <div className="text-[18px] font-semibold text-[#111827] mt-1.5">{topConversion.name}</div>
              </div>
              <div className="text-sm font-mono font-bold text-[#0B9BC5] mt-2">
                {formatPercent(topConversion.conversionRate)} Active Rate
              </div>
            </div>
          )}

          {lowestPending && (
            <div className="card-info p-5 flex flex-col justify-between hover-lift">
              <div>
                <div className="text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2563EB]" /> Lowest Pending
                </div>
                <div className="text-[18px] font-semibold text-[#111827] mt-1.5">{lowestPending.name}</div>
              </div>
              <div className="text-sm font-mono font-bold text-[#0B9BC5] mt-2">
                {formatCurrency(lowestPending.pendingAmount)} Pending
              </div>
            </div>
          )}

          {highestActive && (
            <div className="card-success p-5 flex flex-col justify-between hover-lift">
              <div>
                <div className="text-xs font-semibold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#16A34A]" /> Highest Active
                </div>
                <div className="text-[18px] font-semibold text-[#111827] mt-1.5">{highestActive.name}</div>
              </div>
              <div className="text-sm font-mono font-bold text-[#08C565] mt-2">
                {highestActive.activeLearners} Active Learners
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. ATTENTION REQUIRED ALERT CARDS (White Cards, 6px Left Border) */}
      <div>
        <SectionHeader
          icon={<AlertTriangle className="w-5 h-5 text-[#DC2626]" />}
          title="Attention Required Signals"
          subtitle="Operational bottleneck alerts flagging high pending amounts, low conversion rates, and revenue leakage"
          badgeText="Operational Risk Alerts"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* High Pending Critical Alert Card */}
          <div className="card-critical hover-lift">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-[#991B1B] font-semibold text-[18px]">
                <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0" />
                <span>High Pending Balance</span>
              </div>
              <span className="badge-critical">Critical</span>
            </div>
            <p className="text-[14px] text-[#374151] leading-[1.6] font-normal">
              {highPendingList.length > 0
                ? `${highPendingList.map((e) => e.name).join(', ')} exceed ₹1,00,000 in uncollected balance.`
                : 'No representatives currently exceed high pending thresholds.'}
            </p>
          </div>

          {/* High Dropped Critical Alert Card */}
          <div className="card-critical hover-lift">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-[#991B1B] font-semibold text-[18px]">
                <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0" />
                <span>Learner Drop-offs</span>
              </div>
              <span className="badge-critical">Critical</span>
            </div>
            <p className="text-[14px] text-[#374151] leading-[1.6] font-normal">
              {highDroppedList.length > 0
                ? `${highDroppedList.map((e) => `${e.name} (${e.dropped} dropped)`).join(', ')} recorded learner drop-offs.`
                : 'Zero dropped learner cancellations recorded across active sales.'}
            </p>
          </div>

          {/* Low Collection Warning Alert Card */}
          <div className="card-warning hover-lift">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-[#92400E] font-semibold text-[18px]">
                <Clock className="w-5 h-5 text-[#F59E0B] shrink-0" />
                <span>Low Collection %</span>
              </div>
              <span className="badge-warning">Warning</span>
            </div>
            <p className="text-[14px] text-[#374151] leading-[1.6] font-normal">
              {lowCollectionList.length > 0
                ? `${lowCollectionList.map((e) => `${e.name} (${formatPercent(e.collectionPercentage)})`).join(', ')} have <20% collection efficiency.`
                : 'All representatives maintain collection efficiency above target threshold.'}
            </p>
          </div>

          {/* Low Conversion Warning Alert Card */}
          <div className="card-warning hover-lift">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-[#92400E] font-semibold text-[18px]">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
                <span>Low Conversion Rate</span>
              </div>
              <span className="badge-warning">Warning</span>
            </div>
            <p className="text-[14px] text-[#374151] leading-[1.6] font-normal">
              {lowConversionList.length > 0
                ? `${lowConversionList.map((e) => e.name).join(', ')} currently have 0% active learner conversion.`
                : 'All active representatives have active candidate conversions.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. DATA-DRIVEN RECOMMENDATION CARDS (White Card, Green 6px Left Border) */}
      <div>
        <SectionHeader
          icon={<Lightbulb className="w-5 h-5 text-[#08C565]" />}
          title="Data-Driven Action Recommendations"
          subtitle="Automated operational recommendations generated dynamically from live Zoho Sheet figures"
          badgeText="Action Engine"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const badgeClass =
              rec.type === 'urgent'
                ? 'badge-priority-critical'
                : rec.type === 'warning'
                ? 'badge-priority-high'
                : 'badge-priority-medium';

            return (
              <div
                key={rec.id}
                className="card-recommendation p-5 flex flex-col justify-between hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[18px] font-semibold text-[#111827] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#08C565] shrink-0" />
                      {rec.title}
                    </span>
                    <span className={badgeClass}>
                      {rec.targetExecutive}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#374151] leading-[1.6] font-normal mb-3">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-[#4B5563] font-normal">
                    Recommended Action: <strong className="text-[#111827] font-semibold">{rec.recommendedAction}</strong>
                  </span>
                  <button className="btn-secondary text-xs flex items-center gap-1 shrink-0 self-start sm:self-auto">
                    <span>Execute Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
