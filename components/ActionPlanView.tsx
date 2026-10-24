import React, { useState } from 'react';
import { ActionPlanItem, ScoreReport } from '@/types';
import { CheckCircle2, Circle, Clock, ArrowRight, Award, Sparkles, TrendingUp } from 'lucide-react';

interface ActionPlanViewProps {
  initialPlan: ActionPlanItem[];
  scoreReport: ScoreReport;
  onNavigateToTab: (tabId: string) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({ initialPlan, scoreReport, onNavigateToTab }) => {
  const [planItems, setPlanItems] = useState<ActionPlanItem[]>(initialPlan);

  const toggleItem = (id: string) => {
    setPlanItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = planItems.filter(i => i.completed).length;
  const totalPointsPotential = planItems.reduce((acc, i) => acc + (i.completed ? 0 : i.expectedPoints), 0);
  const projectedTargetScore = Math.min(96, scoreReport.overallScore + totalPointsPotential);

  const groups: Array<ActionPlanItem['dayGroup']> = ['Today', 'Day 2', 'Day 3-4', 'Week 2'];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#FF7582]" />
            <span>Personalized 7-Day Recruiter Acceleration Plan</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Prioritized by points yield × execution speed. Checking off these tasks converts cold rejections into recruiter screening calls.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Progress:</span>
          <span className="font-extrabold text-[#FF7582] px-2.5 py-1 rounded-lg bg-[#0F2233] border border-[#234566]">
            {completedCount} of {planItems.length} Done
          </span>
        </div>
      </div>

      {/* Projection Banner Footer */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18314A] via-[#13273A] to-[#18314A] border border-[#FF7582]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF7582]/20 border border-[#FF7582]/40 flex items-center justify-center text-[#FF7582] flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Projected Profile Strength</div>
            <div className="text-slate-300 text-xs mt-0.5">
              Completing this checklist boosts score from <strong className="text-[#FF7582]">{scoreReport.overallScore}</strong> to <strong className="text-emerald-400">{projectedTargetScore} / 100</strong>.
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Expected Call Volume</div>
          <div className="text-lg font-black text-emerald-400">8 - 14 Calls / Month</div>
        </div>
      </div>

      {/* Grouped Day-by-Day Checklist */}
      <div className="space-y-6">
        {groups.map((group) => {
          const items = planItems.filter(i => i.dayGroup === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF7582] bg-[#FF7582]/10 px-2.5 py-0.5 rounded-full border border-[#FF7582]/20">
                  {group}
                </span>
                <span className="text-[11px] text-slate-400">
                  {group === 'Today' && 'Immediate Wins (< 15 mins)'}
                  {group === 'Day 2' && 'High-Impact Quantified Bullets'}
                  {group === 'Day 3-4' && 'Job Fit Targeting & Summary'}
                  {group === 'Week 2' && 'Platform Synchronization & Polish'}
                </span>
              </div>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      item.completed
                        ? 'bg-[#0F2233]/50 border-emerald-500/30 opacity-70'
                        : 'bg-[#13273A] border-[#234566] hover:border-[#725A7A] shadow-lg'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="mt-0.5 cursor-pointer text-slate-400 hover:text-[#FF7582] transition-colors"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#FF7582]" />
                            {item.estimatedMinutes} mins
                          </span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            +{item.expectedPoints} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToTab(item.targetTab)}
                      className="px-3 py-1.5 rounded-xl bg-[#18314A] hover:bg-[#725A7A] border border-[#234566] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap self-end sm:self-center"
                    >
                      <span>Fix Now</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF7582]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
