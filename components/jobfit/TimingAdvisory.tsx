'use client';

import React from 'react';
import { Clock, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimingAdvisoryProps {
  score: number;
}

export const TimingAdvisory: React.FC<TimingAdvisoryProps> = ({ score }) => {
  const isGolden = score >= 75;

  return (
    <div
      className={cn(
        'p-4 rounded-xl border backdrop-blur-md space-y-2',
        isGolden
          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
          : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
      )}
    >
      <div className="flex items-center gap-2">
        <Clock className={cn('w-4 h-4', isGolden ? 'text-emerald-400' : 'text-amber-400')} />
        <h4 className="text-xs font-bold uppercase tracking-wider">
          {isGolden ? '48-Hour Golden Application Window Open' : 'Spend 15 Minutes Tailoring Before Applying'}
        </h4>
      </div>

      <p className="text-[11px] leading-relaxed opacity-90">
        {isGolden
          ? 'On Indian job portals (Naukri, LinkedIn), 60% of recruiter shortlists happen in the first 48 hours of posting before applicant volume surges over 300+. Apply immediately.'
          : 'Missing keywords will depress your ranking on automated recruiter search queries. Add missing skills to your profile before submitting.'}
      </p>
    </div>
  );
};
