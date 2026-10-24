'use client';

import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PercentileChartProps {
  percentile: number;
  sampleSize?: number;
  roleTitle?: string;
}

export const PercentileChart: React.FC<PercentileChartProps> = ({
  percentile,
  sampleSize = 1240,
  roleTitle = 'Backend Engineer'
}) => {
  const isTopDecile = percentile >= 90;
  const isTopQuartile = percentile >= 75;

  return (
    <div className="p-6 rounded-2xl bg-[rgba(26,49,69,0.4)] border border-white/10 backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7582]">
            Recruiter Search Ranking
          </span>
          <h3 className="text-xl font-black text-white">
            {percentile}th Percentile
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Ahead of {percentile}% of {roleTitle} profiles in Tier-1 Metro Hubs (n = {sampleSize.toLocaleString()})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-bold border',
              isTopDecile
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                : isTopQuartile
                ? 'bg-sky-950/60 text-sky-300 border-sky-500/30'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
            )}
          >
            {isTopDecile ? 'Top 10% Shortlist Tier' : isTopQuartile ? 'Top 25% Competitive' : 'Average Visibility'}
          </span>
        </div>
      </div>

      {/* Visual Percentile Bar */}
      <div className="space-y-1.5 pt-2">
        <div className="h-3 w-full rounded-full bg-white/10 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF7582] via-[#C56C86] to-[#725A7A] rounded-full transition-all duration-1000"
            style={{ width: `${percentile}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>p10 (Bottom)</span>
          <span>p50 (Median)</span>
          <span>p75</span>
          <span>p90 (Top 10%)</span>
        </div>
      </div>
    </div>
  );
};
