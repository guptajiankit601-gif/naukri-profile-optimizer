'use client';

import React from 'react';
import { Info, UploadCloud, RotateCcw } from 'lucide-react';
import { useReport } from '@/lib/context/ReportContext';

export const DemoProfileBanner: React.FC = () => {
  const { isDemo, profile, setCurrentStep, resetAnalysis } = useReport();

  if (!isDemo || !profile) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/15 via-[#725A7A]/20 to-amber-500/15 border border-amber-500/30 rounded-2xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg mb-6">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Illustrative Sample Report
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold">
              Demo Profile: {profile.name} ({profile.experienceBand})
            </span>
          </div>
          <p className="text-xs text-slate-300">
            You are viewing simulated illustrative data. Your actual resume has not been uploaded yet.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={() => setCurrentStep('upload')}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Your Resume</span>
        </button>
        <button
          onClick={resetAnalysis}
          className="px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          title="Reset to clean state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
