'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopFixItem {
  title: string;
  points: number;
  actionTab?: string;
  description?: string;
}

interface TopFixesCardProps {
  fixes: TopFixItem[];
  onNavigateTab?: (tabId: string) => void;
}

export const TopFixesCard: React.FC<TopFixesCardProps> = ({ fixes, onNavigateTab }) => {
  return (
    <div className="p-6 rounded-2xl bg-[rgba(26,49,69,0.45)] border border-[rgba(255,117,130,0.25)] backdrop-blur-xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[rgba(255,117,130,0.15)] flex items-center justify-center text-[#FF7582]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100">Top ROI Fixes</h3>
            <p className="text-[11px] text-slate-400">Highest points left on the table</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,117,130,0.1)] text-[#FF7582] border border-[rgba(255,117,130,0.2)] font-semibold">
          +{fixes.reduce((sum, f) => sum + f.points, 0)} Potential Gain
        </span>
      </div>

      <div className="space-y-3">
        {fixes.map((fix, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs font-bold text-slate-200 truncate">{fix.title}</p>
              </div>
              {fix.description && (
                <p className="text-[11px] text-slate-400 pl-7 truncate">{fix.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                +{fix.points} pts
              </span>

              {onNavigateTab && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onNavigateTab(fix.actionTab || 'rewriter')}
                  className="h-7 px-2 text-[11px] text-[#FF7582] hover:bg-[#FF7582]/10"
                >
                  Fix
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
