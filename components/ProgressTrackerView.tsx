'use client';

import React from 'react';
import { ScoreHistoryPoint } from '@/types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ProgressTrackerViewProps {
  scoreHistory: ScoreHistoryPoint[];
  currentScore: number;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({ scoreHistory, currentScore }) => {
  const initialScore = scoreHistory[0]?.score || currentScore;
  const delta = currentScore - initialScore;

  const chartData = scoreHistory.map((item, idx) => ({
    name: idx === 0 ? 'Intake' : `Rev #${idx}`,
    score: item.score,
    reason: item.changeReason
  }));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Before / After Optimization Progress Tracker</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Track your profile&apos;s recruiter visibility gains as you refine keywords and impact statements.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Improvement:</span>
          <span className={`text-xs font-bold flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
            <ArrowUpRight className="w-4 h-4" />
            +{Math.max(0, delta)} Points
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Starting Baseline Score</div>
          <div className="text-3xl font-bold text-slate-700 dark:text-slate-300 font-mono">{initialScore}/100</div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Initial uploaded resume</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Current Optimized Score</div>
          <div className={`text-3xl font-bold font-mono ${currentScore >= 71 ? 'text-emerald-700 dark:text-emerald-400' : currentScore >= 41 ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
            {currentScore}/100
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Status: {currentScore >= 71 ? 'Strong Readiness' : currentScore >= 41 ? 'Moderate Readiness' : 'Needs Work'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">ATS Screening Readiness</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{currentScore >= 75 ? 'Tier 1' : currentScore >= 50 ? 'Tier 2' : 'Tier 3'}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentScore >= 75 ? 'High match probability' : currentScore >= 50 ? 'Medium match probability' : 'Significant keyword gaps'}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Profile Strength Score Over Iterations
          </h4>
          <span className="text-xs text-slate-400 dark:text-slate-500">{scoreHistory.length} checkpoints recorded</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any, _name: any, item: any) => [`${val}/100`, item?.payload?.reason || 'Score Update']}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 8, fill: '#1D4ED8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
          Change History Log:
        </div>
        <div className="space-y-2">
          {scoreHistory.map((pt, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{pt.changeReason}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 dark:text-slate-500 text-xs">{pt.date}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{pt.score} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
