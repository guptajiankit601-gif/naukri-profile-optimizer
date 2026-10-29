'use client';

import React from 'react';
import { ActionPlanItem, ScoreReport } from '@/types';
import { useReport } from '@/lib/context/ReportContext';
import { CheckCircle2, Circle, Clock, ArrowRight, TrendingUp, Info, CheckSquare, GraduationCap, Code, ExternalLink, Trophy, ShieldCheck } from 'lucide-react';

interface ActionPlanViewProps {
  initialPlan?: ActionPlanItem[];
  scoreReport: ScoreReport;
  onNavigateToTab: (tabId: string, item?: ActionPlanItem) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({ 
  initialPlan, 
  scoreReport, 
  onNavigateToTab 
}) => {
  const { actionPlan, toggleActionPlanItem } = useReport();
  const planItems = actionPlan.length > 0 ? actionPlan : (initialPlan || []);

  const completedCount = planItems.filter(i => i.completed).length;
  const headroomTotal = scoreReport.headroomTotal || (100 - scoreReport.overallScore);

  const groups: Array<ActionPlanItem['dayGroup']> = ['Today', 'Day 2', 'Day 3-4', 'Week 2'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Optimization Action Plan</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Prioritized task list mapped directly to high-impact resume improvement areas. Track your editing progress and open dedicated tools to apply fixes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Checklist Progress:</span>
          <span className="font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 font-mono">
            {completedCount} of {planItems.length} Checked
          </span>
        </div>
      </div>

      {/* Headroom & Score Clarity Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Current Score &amp; Potential Score Gain
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                Current verified score: <strong className="text-slate-900 dark:text-slate-100 font-mono">{scoreReport.overallScore}/100</strong>. Areas you could improve: <strong className="text-blue-600 dark:text-blue-400 font-mono">+{headroomTotal} pts potential gain</strong>.
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Scoring Model</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Deterministic 10-Criteria Audit</div>
          </div>
        </div>

        {/* Scoring Integrity Disclosure */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Task Workflow vs Assessed Score:</strong> Checking off tasks marks your workflow progress. Your Resume Quality Score updates automatically when genuine resume edits (e.g. headlines, skills, experience bullets) are accepted and reassessed in the editor.
          </span>
        </div>
      </div>

      {/* Fresher & Student Proof-of-Work Checklist (Rendered when profile qualifies for Fresher scoring) */}
      {scoreReport.isFresher && (
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-blue-200 dark:border-blue-900/60 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Fresher & Student Proof-of-Work Checklist
              </span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono font-semibold">
              Project Weight: 19%
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Without multi-year corporate tenure, recruiters evaluate freshers primarily through verified technical projects, capstone prototypes, and coding proof of work.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>1. Problem-Tech-Outcome Structure</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                State what real problem the project solved, the libraries and database used, and your personal contribution.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>2. Working Demo & GitHub Repo</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Provide public GitHub links with clear setup instructions and live deployments (Vercel, Render, or Netlify).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>3. Internships & Hackathons</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Highlight university capstone work, open-source pull requests, coding competition ranks, or summer internships.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>4. Verifiable Competencies</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Only list languages and frameworks you can comfortably discuss or code in during an entry-level technical interview.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Day-by-Day Checklist */}
      <div className="space-y-6">
        {groups.map((group) => {
          const items = planItems.filter(i => i.dayGroup === group);
          if (items.length === 0) return null;

          return (
            <div key={group} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  {group}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {group === 'Today' && 'Quick-Win Score Fixes (< 15 mins)'}
                  {group === 'Day 2' && 'Experience Verification & Power Bullets'}
                  {group === 'Day 3-4' && 'Job Description Tailoring & Summary'}
                  {group === 'Week 2' && 'ATS Structure & Portfolio Evidence'}
                </span>
              </div>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      item.completed
                        ? 'bg-slate-50/70 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-75'
                        : 'bg-white dark:bg-[#142236] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleActionPlanItem(item.id)}
                        className="mt-0.5 cursor-pointer text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
                        title={item.completed ? 'Mark task incomplete' : 'Mark task completed'}
                        aria-label={item.completed ? 'Mark task incomplete' : 'Mark task completed'}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-xs sm:text-sm font-semibold ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {item.title}
                          </h3>
                          {item.criteria && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono">
                              {item.criteria}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                        {item.reason && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <strong>Why it matters:</strong> {item.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
                          +{item.headroomPoints || item.expectedPoints} pts potential gain
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          <span>~{item.estimatedMinutes} mins</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigateToTab(item.targetTab, item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <span>Fix Now</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
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
