'use client';

import React, { useState } from 'react';
import { ComponentResult } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ScoreBreakdownProps {
  components: ComponentResult[];
  onActionClick?: (componentKey: string) => void;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ components, onActionClick }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
        10-Component Transparent Breakdown
      </h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {components.map((c) => {
          const isExpanded = expandedKey === c.key;
          const isGood = c.status === 'good' || c.score >= c.max * 0.8;
          const isWarn = c.status === 'warn' || (c.score >= c.max * 0.5 && !isGood);

          return (
            <div
              key={c.key || c.name}
              className={cn(
                'rounded-xl border transition-all duration-200 bg-[rgba(26,49,69,0.35)] backdrop-blur-md overflow-hidden',
                isGood
                  ? 'border-emerald-500/20 hover:border-emerald-500/40'
                  : isWarn
                  ? 'border-amber-500/25 hover:border-amber-500/50'
                  : 'border-[#FF7582]/30 hover:border-[#FF7582]/60'
              )}
            >
              <div
                onClick={() => setExpandedKey(isExpanded ? null : (c.key || c.name))}
                className="p-3.5 cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isGood ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isWarn ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#FF7582] shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 truncate">{c.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{c.issue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {c.score}/{c.max}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                      isExpanded && 'rotate-180 text-white'
                    )}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Fix Recommendation:</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">{c.fix}</p>
                  </div>

                  {c.example && (
                    <div className="p-2 rounded bg-slate-950/50 border border-white/5 font-mono text-[10px] text-emerald-300">
                      <span className="text-slate-500 block font-sans">Exemplar Snippet:</span>
                      {c.example}
                    </div>
                  )}

                  {onActionClick && c.key && (
                    <button
                      onClick={() => onActionClick(c.key!)}
                      className="text-[11px] font-bold text-[#FF7582] hover:underline pt-1 block"
                    >
                      Fix This in Editor &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
