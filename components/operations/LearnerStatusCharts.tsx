'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { ZohoRecord } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Users, PieChart as PieChartIcon } from 'lucide-react';

interface LearnerStatusChartsProps {
  records: ZohoRecord[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-semibold text-white mb-1">{payload[0].name}</p>
        <p style={{ color: payload[0].color || payload[0].fill }} className="font-mono font-bold">
          Count: {payload[0].value} Candidates
        </p>
      </div>
    );
  }
  return null;
};

export const LearnerStatusCharts: React.FC<LearnerStatusChartsProps> = ({ records }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  let active = 0;
  let onboardedNotActive = 0;
  let hold = 0;
  let notOnboarded = 0;
  let dropped = 0;

  records.forEach((r) => {
    active += r.activeLearners || 0;
    onboardedNotActive += r.onboardedNotActive || 0;
    hold += r.hold || 0;
    notOnboarded += r.notOnboarded || 0;
    dropped += r.dropped || 0;
  });

  const learnerBreakdownData = [
    { name: 'Active Learners', value: active, color: '#08C565' },
    { name: 'Onboarded - Not Active', value: onboardedNotActive, color: '#0B9BC5' },
    { name: 'Hold Learners', value: hold, color: '#F59E0B' },
    { name: 'Not On-boarded', value: notOnboarded, color: '#2563EB' },
    { name: 'Dropped Learners', value: dropped, color: '#DC2626' },
  ];

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <SectionHeader
          icon={<Users className="w-5 h-5 text-[#08C565]" />}
          title="Learner Status Analysis"
          subtitle="Distribution across active training, pending batch launches, hold status, and discontinued candidates"
          badgeText="Learner Analytics"
        />
        <div className="ww-card p-5 h-80 flex items-center justify-center text-xs font-medium text-[#6B7280]">
          Loading status chart...
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Users className="w-5 h-5 text-[#08C565]" />}
        title="Learner Status Analysis"
        subtitle="Distribution across active training, pending batch launches, hold status, and discontinued candidates"
        badgeText="Learner Analytics"
      />

      <div className="ww-card p-5 shadow-card flex flex-col hover-lift">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
          <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#08C565] border border-emerald-200">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-[#111827]">Learner Lifecycle Distribution</h3>
            <p className="text-[14px] text-[#4B5563] font-normal leading-[1.6]">Five-stage candidate lifecycle volume breakdown</p>
          </div>
        </div>

        <div className="h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={learnerBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }: any) => `${name}: ${value}`}
              >
                {learnerBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '13px', color: '#111827' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
