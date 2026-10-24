import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { predictRejectionReasons } from '@/services/jd-matcher';
import { AlertOctagon, IndianRupee, ShieldCheck, ArrowRight } from 'lucide-react';

interface RejectionPredictorViewProps {
  profile: ParsedProfile;
  onNavigateToTab: (tabId: string) => void;
}

export const RejectionPredictorView: React.FC<RejectionPredictorViewProps> = ({ profile, onNavigateToTab }) => {
  const [interactiveSalary, setInteractiveSalary] = useState<number>(profile.expectedSalaryLakhs || 16);

  const reasons = predictRejectionReasons(profile, interactiveSalary);

  const highestRisk = reasons.length > 0 ? reasons[0] : null;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-[#FF7582]" />
          <span>Explainable Rejection Predictor (Transparent Failure Checks)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          No black boxes. We pinpoint exactly why recruiters pass on your application based on Indian screening heuristics and compensation filters.
        </p>
      </div>

      {/* Interactive Salary Slider Card */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#FF7582]" />
            <span>Interactive Compensation Slider: Test Salary Gate Filter</span>
          </label>
          <span className="text-sm font-extrabold text-[#FF7582]">
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
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>₹4L (Entry Level)</span>
          <span className="text-slate-300">Live Compensation Threshold</span>
          <span>₹45L (Top 5% Product Bracket)</span>
        </div>
      </div>

      {/* Highest Risk Highlight Banner */}
      {highestRisk && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Top Rejection Vector</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {highestRisk.probabilityPercent}% Probability
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">{highestRisk.reason}</h4>
            <p className="text-xs text-slate-300 mt-1">{highestRisk.fix}</p>
          </div>
        </div>
      )}

      {/* Ranked Failure Checks List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-wider">
          All Ranked Failure Checks ({reasons.length}):
        </div>

        {reasons.map((r, idx) => (
          <div
            key={r.id || idx}
            className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl transition-all space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0F2233] text-slate-400 text-xs font-bold flex items-center justify-center border border-[#234566]">
                  {idx + 1}
                </span>
                <span className="text-xs font-extrabold text-white">{r.category}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Rejection Risk:</span>
                <span className={`font-black ${r.probabilityPercent >= 70 ? 'text-rose-400' : r.probabilityPercent >= 50 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {r.probabilityPercent}%
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-200 leading-relaxed bg-[#0F2233] p-3 rounded-xl border border-[#234566]">
              {r.reason}
            </p>

            <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-white">Recommended Fix: </strong>
                {r.fix}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Action Link */}
      <div className="p-4 rounded-xl bg-[#18314A] border border-[#234566] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          <strong className="text-white">Eliminate Rejection Triggers:</strong>
          <div className="text-[11px] text-slate-400">Add missing must-have keywords to clear ATS screening filters.</div>
        </div>
        <button
          onClick={() => onNavigateToTab('keywords')}
          className="px-4 py-2 rounded-xl bg-[#FF7582] hover:bg-[#ff5c6d] text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Open Keyword Gap Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
