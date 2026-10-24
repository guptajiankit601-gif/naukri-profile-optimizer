'use client';

import React from 'react';
import { ParsedProfile } from '@/types';
import { cn } from '@/lib/utils';

interface EyeTrackHeatmapProps {
  profile: ParsedProfile;
  activeGazeIndex?: number;
}

export const EyeTrackHeatmap: React.FC<EyeTrackHeatmapProps> = ({ profile, activeGazeIndex = 0 }) => {
  const gazeSteps = [
    { id: 0, label: '0.8s: Headline & Role Title', target: 'headline' },
    { id: 1, label: '2.4s: Most Recent Company & Duration', target: 'recent_exp' },
    { id: 2, label: '4.2s: Top Quantified Metric', target: 'metric' },
    { id: 3, label: '5.8s: Degree & Core Tech Keywords', target: 'skills_edu' }
  ];

  const firstExp = profile.experiences[0];
  const firstBullet = firstExp?.bullets[0] || 'Engineered high-scale backend services';

  return (
    <div className="relative p-6 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-xs space-y-4">
      {/* Gaze Tracker Legend */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/10 text-[10px] text-slate-400 font-sans">
        <span className="font-semibold text-slate-200">Gaze Fixation Path:</span>
        {gazeSteps.map((step) => (
          <span
            key={step.id}
            className={cn(
              'px-2 py-0.5 rounded border transition-colors',
              activeGazeIndex === step.id
                ? 'bg-[#FF7582] text-slate-950 font-bold border-[#FF7582]'
                : 'bg-white/5 text-slate-400 border-white/5'
            )}
          >
            {step.label}
          </span>
        ))}
      </div>

      {/* Simulated Document with Heatmap Rings */}
      <div className="space-y-4 relative">
        {/* Spot 1: Headline */}
        <div
          className={cn(
            'p-3 rounded-lg border transition-all duration-300 relative',
            activeGazeIndex === 0
              ? 'border-[#FF7582] bg-[rgba(255,117,130,0.15)] ring-2 ring-[#FF7582]/40'
              : 'border-white/5 bg-white/5'
          )}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mb-1">
            <span className="font-bold text-[#FF7582]">FIXATION #1 (0.8s)</span>
            <span>Headline & Value Hook</span>
          </div>
          <p className="text-sm font-bold text-white font-sans">{profile.name}</p>
          <p className="text-xs text-slate-200 font-sans">{profile.headline}</p>
        </div>

        {/* Spot 2: Recent Role */}
        <div
          className={cn(
            'p-3 rounded-lg border transition-all duration-300 relative',
            activeGazeIndex === 1
              ? 'border-[#FF7582] bg-[rgba(255,117,130,0.15)] ring-2 ring-[#FF7582]/40'
              : 'border-white/5 bg-white/5'
          )}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mb-1">
            <span className="font-bold text-[#FF7582]">FIXATION #2 (2.4s)</span>
            <span>Current Title & Tenure</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {firstExp?.title || 'Software Engineer'} · {firstExp?.company || 'Company'} ({firstExp?.startDate || '2021'} - {firstExp?.endDate || 'Present'})
          </p>
        </div>

        {/* Spot 3: Top Bullet Metric */}
        <div
          className={cn(
            'p-3 rounded-lg border transition-all duration-300 relative',
            activeGazeIndex === 2
              ? 'border-[#FF7582] bg-[rgba(255,117,130,0.15)] ring-2 ring-[#FF7582]/40'
              : 'border-white/5 bg-white/5'
          )}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mb-1">
            <span className="font-bold text-[#FF7582]">FIXATION #3 (4.2s)</span>
            <span>Quantified Proof Scan</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            • {firstBullet}
          </p>
        </div>

        {/* Spot 4: Skills & Education */}
        <div
          className={cn(
            'p-3 rounded-lg border transition-all duration-300 relative',
            activeGazeIndex === 3
              ? 'border-[#FF7582] bg-[rgba(255,117,130,0.15)] ring-2 ring-[#FF7582]/40'
              : 'border-white/5 bg-white/5'
          )}
        >
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mb-1">
            <span className="font-bold text-[#FF7582]">FIXATION #4 (5.8s)</span>
            <span>Filter Keyword & Degree Verification</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Skills: {profile.skills.slice(0, 6).join(', ')}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Edu: {profile.education[0]?.degree || 'B.Tech CS'} · {profile.education[0]?.institution || 'University'}
          </p>
        </div>
      </div>
    </div>
  );
};
