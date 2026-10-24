'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MatchRingProps {
  score: number;
  verdict?: string;
  size?: number;
}

export const MatchRing: React.FC<MatchRingProps> = ({ score, verdict = 'Apply Now', size = 120 }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const isHigh = score >= 75;
  const isMed = score >= 50 && !isHigh;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={isHigh ? '#34D399' : isMed ? '#FBBF24' : '#FF7582'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-white font-mono">
          {score}%
        </span>
        <span
          className={cn(
            'text-[9px] font-bold uppercase tracking-wider',
            isHigh ? 'text-emerald-400' : isMed ? 'text-amber-400' : 'text-[#FF7582]'
          )}
        >
          {verdict}
        </span>
      </div>
    </div>
  );
};
