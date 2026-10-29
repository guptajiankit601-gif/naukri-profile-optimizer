'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { ScoreHistoryPoint } from '@/types';
import { ProgressTrackerView } from '@/components/ProgressTrackerView';
import { VersionComparisonView } from '@/components/history/VersionComparisonView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';
import { GitCompare, TrendingUp } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const { profile, scoreReport, scoreHistory, versions } = useReport();
  const [activeTab, setActiveTab] = useState<'compare' | 'timeline'>('compare');

  if (!profile || !scoreReport) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  const effectiveHistory: ScoreHistoryPoint[] = scoreHistory.length > 0
    ? scoreHistory
    : [{ date: 'Today', timestamp: Date.now(), score: scoreReport.overallScore, changeReason: 'Initial Audit' }];

  return (
    <div className="w-full space-y-6">
      <DemoProfileBanner />

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'compare'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Version Comparison & Diff</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
            {versions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Score Progression Chart</span>
        </button>
      </div>

      {activeTab === 'compare' ? (
        <VersionComparisonView />
      ) : (
        <ProgressTrackerView
          scoreHistory={effectiveHistory}
          currentScore={scoreReport.overallScore}
        />
      )}
    </div>
  );
}
