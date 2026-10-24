'use client';

import React, { useState } from 'react';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { calculateScore, calculateVisibilityScore } from '@/lib/scoring';
import { Award, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SampleCard: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('arjun');
  const profile = SEEDED_PROFILES[activeKey] || SEEDED_PROFILES.arjun;
  const scoreReport = calculateScore(profile);
  const visibility = calculateVisibilityScore(profile);

  return (
    <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
          Interactive Live Scorecard Preview
        </h2>
        <p className="text-sm text-slate-300">
          Select a realistic Indian tech profile to preview the deterministic score breakdown.
        </p>

        {/* Profile Switcher */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {Object.entries(SEEDED_PROFILES).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setActiveKey(key)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeKey === key
                  ? 'bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 font-bold shadow'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              )}
            >
              {p.name} ({p.experienceBand})
            </button>
          ))}
        </div>
      </div>

      {/* Card UI */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[rgba(26,49,69,0.45)] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-100">{profile.name}</h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[rgba(255,117,130,0.15)] text-[#FF7582] border border-[rgba(255,117,130,0.3)] font-semibold">
                {profile.experienceBand} Experience
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-mono">{profile.headline}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Completeness</p>
              <div className="text-3xl font-black text-[#FF7582]">
                {scoreReport.overallScore}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,117,130,0.1)] border border-[rgba(255,117,130,0.2)] flex items-center justify-center text-[#FF7582]">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 10-Component Progress Bars */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Transparent Component Breakdown
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {scoreReport.components.slice(0, 6).map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/40 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{c.name}</span>
                  <span className="font-mono text-slate-300">{c.score} / {c.max}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      c.score >= c.max * 0.8 ? 'bg-emerald-400' : c.score >= c.max * 0.5 ? 'bg-amber-400' : 'bg-[#FF7582]'
                    )}
                    style={{ width: `${(c.score / c.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fix Banner */}
        {scoreReport.topFixes.length > 0 && (
          <div className="p-4 rounded-xl bg-[rgba(255,117,130,0.08)] border border-[rgba(255,117,130,0.2)] flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#FF7582] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-200">
                Top Priority Fix: {scoreReport.topFixes[0].title} (+{scoreReport.topFixes[0].points} pts)
              </p>
              <p className="text-slate-300">
                Action: {scoreReport.components.find(c => c.key === 'bulletQuality')?.fix || 'Upgrade passive openings with power verbs and metrics.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
