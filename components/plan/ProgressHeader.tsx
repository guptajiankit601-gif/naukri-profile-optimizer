'use client';

import React from 'react';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

interface ProgressHeaderProps {
  completedCount: number;
  totalCount: number;
  currentScore: number;
  projectedScore: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  completedCount,
  totalCount,
  currentScore,
  projectedScore
}) => {
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-5 rounded-2xl bg-[rgba(26,49,69,0.4)] border border-white/10 backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#FF7582]" />
            <h3 className="text-base font-bold text-white">Action Plan Progress</h3>
          </div>
          <p className="text-xs text-slate-300">
            {completedCount} of {totalCount} high-ROI tasks completed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Score Trajectory</span>
            <span className="text-sm font-bold text-slate-200">
              <span className="text-[#FF7582]">{currentScore}</span> &rarr;{' '}
              <span className="text-emerald-400">{projectedScore} / 100</span>
            </span>
          </div>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF7582] via-[#C56C86] to-[#725A7A] transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
