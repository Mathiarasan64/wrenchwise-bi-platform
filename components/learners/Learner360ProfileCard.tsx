'use client';

import React from 'react';
import { LearnerCrmProfile } from '@/lib/learnerCrmEngine';
import { User, Briefcase, BookOpen, UserCheck, Calendar } from 'lucide-react';

interface Learner360ProfileCardProps {
  profile: LearnerCrmProfile;
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Active':
      return 'badge-success';
    case 'Hold':
      return 'badge-warning';
    case 'Dropped':
      return 'badge-danger';
    case 'Not On-boarded':
      return 'badge-info';
    case 'Onboarded - Not Active':
      return 'badge-info';
    default:
      return 'badge-secondary';
  }
};

export const Learner360ProfileCard: React.FC<Learner360ProfileCardProps> = ({ profile }) => {
  const initials = profile.customerName
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ww-card p-5 shadow-card border-l-6 border-l-[#7C3AED]">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-[#DBEAFE] border border-blue-200 flex items-center justify-center text-xl font-bold text-[#7C3AED] shrink-0">
          {initials || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[18px] font-semibold text-[#111827] truncate">
              {profile.customerName}
            </h3>
            <span className={getStatusBadgeClass(profile.learnerStatus)}>
              {profile.learnerStatus}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-xs">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <BookOpen className="w-3.5 h-3.5 text-[#0B9BC5] shrink-0" />
              <span className="font-medium text-[#111827]">{profile.course || 'Data not available'}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4B5563]">
              <Briefcase className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
              <span className="font-medium text-[#111827]">{profile.section || 'Data not available'}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4B5563]">
              <UserCheck className="w-3.5 h-3.5 text-[#08C565] shrink-0" />
              <span className="font-medium text-[#111827]">{profile.salesExecutive}</span>
            </div>
            <div className="flex items-center gap-2 text-[#4B5563]">
              <Calendar className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <span className="font-medium text-[#111827]">ID: {profile.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operations Observation */}
      <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
        <div className="flex items-center gap-1.5 mb-1">
          <User className="w-3 h-3 text-[#6B7280]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Operations Observation</span>
        </div>
        <p className="text-xs text-[#374151] leading-[1.6] font-normal">{profile.operationsObservation}</p>
      </div>
    </div>
  );
};
