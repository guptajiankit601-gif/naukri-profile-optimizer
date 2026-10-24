'use client';

import React from 'react';
import { ComponentResult } from '@/types';

interface ScoreBarProps {
  component: ComponentResult;
  index: number;
  onClick?: () => void;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ component, index, onClick }) => {
  const percentage = Math.min(100, Math.round((component.score / component.max) * 100));
  const isGood = percentage >= 75;
  const isWarn = percentage >= 45 && percentage < 75;

  return (
    <div
      onClick={onClick}
      className="p-3 rounded-xl bg-[var(--navy-850)] hover:bg-[var(--navy-800)] border border-[var(--border)] hover:border-[var(--border-light)] transition-all cursor-pointer group space-y-1.5"
      style={{
        animationDelay: `${index * 60}ms`
      }}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#F2F5F8] group-hover:text-white transition-colors">
          {component.name}
        </span>
        <span className="font-mono font-bold text-[#A8B8C8] tabular-nums">
          {component.score} / {component.max}
        </span>
      </div>

      {/* 8px Track */}
      <div className="w-full bg-[var(--navy-700)] h-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: isGood ? 'var(--success)' : isWarn ? 'var(--warning)' : 'var(--coral-500)'
          }}
        />
      </div>

      <div className="text-[11px] text-[#A8B8C8] line-clamp-1">
        {component.issue}
      </div>
    </div>
  );
};
