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

  const filterChecks = predictRejectionReasons(profile, interactiveSalary);
  const primaryConcern = filterChecks.length > 0 ? filterChecks[0] : null;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF7582]" />
              <span>Screening Gate & Filter Audit (Indian Job Board Heuristics)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Understand automated portal filter criteria (salary brackets, location preferences, and experience band requirements) that recruiters use during initial screening.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400 shrink-0">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Indicative Checklist</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-[#FF7582] shrink-0 mt-0.5" />
          <span>
            <strong>Screening Guidance:</strong> These checks reflect standard screening filters commonly applied on job portals. They are diagnostic guidelines to prevent automatic screening drop-offs, not a guaranteed rejection prediction.
          </span>
        </div>
      </div>

      {/* Interactive Salary Slider Card */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#FF7582]" />
            <span>Target CTC Filter Simulation: Test Portal Salary Thresholds</span>
          </label>
          <span className="text-sm font-extrabold text-[#FF7582] font-mono">
            Targeting: ₹{interactiveSalary} LPA
          </span>
        </div>
        <input
          type="range"
          min={4}
          max={45}
          step={1}
          value={interactiveSalary}
          onChange={(e) => setInteractiveSalary(parseInt(e.target.value, 10))}
          className="w-full accent-[#FF7582] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>₹4L (Entry Level)</span>
          <span className="text-slate-300">Target Compensation Band</span>
          <span>₹45L (Senior Product Bracket)</span>
        </div>
      </div>

      {/* Primary Concern Highlight Banner */}
      {primaryConcern && (
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 shadow-xl flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Primary Screening Consideration</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                {primaryConcern.category}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">{primaryConcern.reason}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{primaryConcern.fix}</p>
          </div>
        </div>
      )}

      {/* Detailed Filter Checks List */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Screening Filter Evaluation ({filterChecks.length} Criteria Evaluated)
          </span>
          <span className="text-[11px] text-slate-400">Automated gate logic</span>
        </div>

        <div className="space-y-3">
          {filterChecks.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.category === 'Salary' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : item.category === 'Experience' ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-white">{item.reason}</span>
                </div>
                <p className="text-[11px] text-slate-400">{item.fix}</p>
              </div>

              <button
                onClick={() => onNavigateToTab(item.category === 'Skills' ? 'keywords' : 'recruiter-sim')}
                className="px-3 py-1.5 rounded-lg bg-[#18314A] hover:bg-[#725A7A] border border-[#234566] text-slate-200 text-xs font-semibold self-start sm:self-auto shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Review In Editor</span>
                <ArrowRight className="w-3 h-3 text-[#FF7582]" />
              </button>
            </div>
          ))}

          {filterChecks.length === 0 && (
            <div className="p-6 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>All standard portal screening filters cleared for current target parameters.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
