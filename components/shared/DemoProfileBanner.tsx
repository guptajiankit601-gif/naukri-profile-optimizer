'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Info, UploadCloud, RotateCcw } from 'lucide-react';
import { useReport } from '@/lib/context/ReportContext';

interface DemoProfileBannerProps {
  alwaysShow?: boolean;
}

export const DemoProfileBanner: React.FC<DemoProfileBannerProps> = ({ alwaysShow = false }) => {
  const pathname = usePathname();
  const { isDemo, profile, setCurrentStep, resetAnalysis } = useReport();

  if (!isDemo || !profile) return null;

  // Show detailed banner primarily on dashboard to avoid visual clutter across every subpage
  if (!alwaysShow && pathname !== '/dashboard') {
    return null;
  }

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-850/60 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
            Sample Report
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100/70 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
            {profile.name} · {profile.targetRole}
          </span>
          <span className="text-xs text-amber-800/80 dark:text-amber-400 hidden md:inline">
            — Upload your resume to see your real personalized score.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={() => setCurrentStep('upload')}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Resume</span>
        </button>
        <button
          onClick={resetAnalysis}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset to clean state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
