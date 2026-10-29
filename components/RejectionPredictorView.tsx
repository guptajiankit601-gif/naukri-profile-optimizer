'use client';

import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { predictRejectionReasons } from '@/services/jd-matcher';
import { ShieldCheck, IndianRupee, Info, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface RejectionPredictorViewProps {
  profile: ParsedProfile;
  onNavigateToTab: (tabId: string) => void;
}

export const RejectionPredictorView: React.FC<RejectionPredictorViewProps> = ({ profile, onNavigateToTab }) => {
  const [interactiveSalary, setInteractiveSalary] = useState<number>(profile.expectedSalaryLakhs || 16);
  const [minAcceptableSalary, setMinAcceptableSalary] = useState<number>(Math.max(3, Math.round((profile.expectedSalaryLakhs || 16) * 0.75)));

  const filterChecks = predictRejectionReasons(profile, interactiveSalary);
  const primaryConcern = filterChecks.length > 0 ? filterChecks[0] : null;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Screening Gate & Filter Audit</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Understand automated portal filter criteria (salary brackets, location preferences, and experience band requirements) that recruiters use during initial screening.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shrink-0 font-medium">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Diagnostic Checklist</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Screening Guidance:</strong> These checks reflect standard screening filters commonly applied on job boards. They are diagnostic guidelines to prevent automatic screening drop-offs, not a guaranteed rejection prediction. Never lower your baseline compensation expectations merely to appease an algorithm.
          </span>
        </div>
      </div>

      {/* Interactive Salary & Compensation Evaluation Card */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Target vs. Minimum Acceptable CTC Simulation</span>
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Compare target aspiration against walking baseline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target CTC Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Target CTC (Desired Goal)</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono text-sm">₹{interactiveSalary} LPA</span>
            </div>
            <input
              type="range"
              min={3}
              max={50}
              step={1}
              value={interactiveSalary}
              onChange={(e) => setInteractiveSalary(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>₹3L</span>
              <span>Primary Goal</span>
              <span>₹50L+</span>
            </div>
          </div>

          {/* Minimum Acceptable CTC Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Minimum Acceptable CTC (Floor)</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono text-sm">₹{minAcceptableSalary} LPA</span>
            </div>
            <input
              type="range"
              min={3}
              max={interactiveSalary}
              step={1}
              value={minAcceptableSalary}
              onChange={(e) => setMinAcceptableSalary(parseInt(e.target.value, 10))}
              className="w-full accent-slate-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>₹3L</span>
              <span>Walk-away Baseline</span>
              <span>₹{interactiveSalary}L</span>
            </div>
          </div>
        </div>

        {(() => {
          const buffer = Math.max(0, interactiveSalary - minAcceptableSalary);
          const percent = Math.round((buffer / (interactiveSalary || 1)) * 100);
          return (
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Negotiation Buffer Breakdown:</span>
                  <span className="font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-bold">
                    Target ₹{interactiveSalary}L - Floor ₹{minAcceptableSalary}L = Buffer ₹{buffer}L ({percent}%)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {buffer > 0 ? 'Flexible Bargaining Range' : 'Firm Single-Point Anchor'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1 leading-relaxed">
                Your minimum acceptable CTC is your walk-away boundary. Your target CTC is your initial anchor. The ₹{buffer} LPA buffer provides realistic negotiation flexibility while safeguarding your compensation floor.
              </p>
            </div>
          );
        })()}
      </div>

      {/* Primary Concern Highlight Banner */}
      {primaryConcern && (
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 shadow-xs flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Primary Screening Consideration</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold uppercase">
                {primaryConcern.category}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{primaryConcern.reason}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{primaryConcern.fix}</p>
          </div>
        </div>
      )}

      {/* Detailed Filter Checks List */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Screening Filter Evaluation ({filterChecks.length} Criteria Evaluated)
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Automated gate logic</span>
        </div>

        <div className="space-y-3">
          {filterChecks.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.category === 'Salary' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : item.category === 'Experience' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.reason}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{item.fix}</p>
              </div>

              <button
                onClick={() => {
                  const cat = (item.category || '').toLowerCase();
                  const id = item.id || '';
                  if (id === 'rej-metric' || cat.includes('metric') || cat.includes('deliverable')) {
                    onNavigateToTab('rewriter-metrics');
                  } else if (id === 'rej-loc' || cat.includes('location')) {
                    onNavigateToTab('headlines');
                  } else if (id === 'rej-sal' || cat.includes('compensation') || cat.includes('salary')) {
                    onNavigateToTab('benchmarks');
                  } else if (cat.includes('skill')) {
                    onNavigateToTab('keywords');
                  } else {
                    onNavigateToTab('recruiter-sim');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold self-start sm:self-auto shrink-0 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <span>Review In Editor</span>
                <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          ))}

          {filterChecks.length === 0 && (
            <div className="p-6 text-center text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>All standard portal screening filters cleared for current target parameters.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
