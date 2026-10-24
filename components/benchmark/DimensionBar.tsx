'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DimensionBarProps {
  label: string;
  userValue: number | string;
  medianValue: number | string;
  top10Value: number | string;
  userPercentage: number;
  standing: 'Top 10%' | 'Average' | 'Below Median';
  gapAdvice: string;
}

export const DimensionBar: React.FC<DimensionBarProps> = ({
  label,
  userValue,
  medianValue,
  top10Value,
  userPercentage,
  standing,
  gapAdvice
}) => {
  const isTop = standing === 'Top 10%';
  const isMed = standing === 'Average';

  return (
    <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-200">{label}</span>
        <span
          className={cn(
            'text-[10px] px-2 py-0.5 rounded border font-semibold',
            isTop
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
              : isMed
              ? 'bg-sky-950/60 text-sky-300 border-sky-500/30'
              : 'bg-[#FF7582]/10 text-[#FF7582] border-[#FF7582]/30'
          )}
        >
          {standing}
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700',
            isTop ? 'bg-emerald-400' : isMed ? 'bg-sky-400' : 'bg-[#FF7582]'
          )}
          style={{ width: `${Math.min(100, Math.max(5, userPercentage))}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-slate-400">
        <span>You: <strong className="text-white">{userValue}</strong></span>
        <span>Median: {medianValue}</span>
        <span>Top 10%: {top10Value}</span>
      </div>

      <p className="text-[11px] text-slate-400 italic pt-0.5">
        Tip: {gapAdvice}
      </p>
    </div>
  );
};
