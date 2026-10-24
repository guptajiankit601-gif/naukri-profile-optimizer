'use client';

import React from 'react';
import { ScoreReport, ActionPlanItem } from '@/types';
import { ScoreGauge } from '@/components/score/ScoreGauge';
import { Award, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

interface RightRailProps {
  scoreReport: ScoreReport;
  actionPlan: ActionPlanItem[];
  onNavigateTab: (tabId: string) => void;
  onOpenShareCard: () => void;
}

export const RightRail: React.FC<RightRailProps> = ({
  scoreReport,
  actionPlan,
  onNavigateTab,
  onOpenShareCard
}) => {
  const topTasks = actionPlan.filter(t => !t.completed).slice(0, 3);

  return (
    <aside className="w-80 h-[calc(100vh-64px)] sticky top-16 bg-[#0B1B2B] border-l border-[var(--border)] p-5 hidden xl:flex flex-col justify-between overflow-y-auto space-y-6">
      {/* Top: Compact 160px Score Gauge */}
      <div className="card p-4 text-center flex flex-col items-center">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#A8B8C8] mb-2">
          Visibility Standing
        </div>
        <ScoreGauge score={scoreReport.overallScore} size={160} />
        <div className="text-[11px] text-[#A8B8C8] mt-2">
          {scoreReport.overallScore >= 71
            ? 'Shortlist rate: Top 10% in Indian Metro searches'
            : 'Potential: Add numbers & cloud keywords to reach 85+'}
        </div>
      </div>

      {/* Middle: Top 3 Next Tasks with points chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#F2F5F8]">
            Priority Tasks ({topTasks.length})
          </span>
          <button
            onClick={() => onNavigateTab('action-plan')}
            className="text-[10px] text-[#FF7582] hover:underline font-bold"
          >
            Full Plan →
          </button>
        </div>

        <div className="space-y-2">
          {topTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onNavigateTab(task.targetTab)}
              className="p-3 rounded-xl bg-[#14293C] hover:bg-[#1A3145] border border-[var(--border)] hover:border-[#FF7582]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-white group-hover:text-[#FF7582] transition-colors truncate max-w-[170px]">
                  {task.title}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300">
                  +{task.expectedPoints} pts
                </span>
              </div>
              <p className="text-[10px] text-[#A8B8C8] line-clamp-1">{task.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Privacy Status & Share Card Mini CTA */}
      <div className="space-y-3 pt-3 border-t border-[var(--border)]">
        <button
          onClick={onOpenShareCard}
          className="btn-primary w-full text-xs py-2.5"
        >
          <Award className="w-4 h-4" />
          <span>Share Recruiter Card</span>
        </button>

        <div className="text-[10px] text-[#6E8397] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Client-Side · Zero Cloud Logs</span>
        </div>
      </div>
    </aside>
  );
};
