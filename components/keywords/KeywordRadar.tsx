'use client';

import React from 'react';
import { ParsedProfile } from '@/types';
import { analyzeKeywordGaps } from '@/lib/scoring/keywords';

interface KeywordRadarProps {
  profile: ParsedProfile;
}

export const KeywordRadar: React.FC<KeywordRadarProps> = ({ profile }) => {
  const analysis = analyzeKeywordGaps(profile);

  const stats = [
    { label: 'Present in Profile', count: analysis.presentCount, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30' },
    { label: 'Weak (Single Mention)', count: analysis.weakCount, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/30' },
    { label: 'Missing High Priority', count: analysis.highPriorityMissing.length, color: 'text-[#FF7582]', bg: 'bg-[rgba(255,117,130,0.1)] border-[rgba(255,117,130,0.3)]' },
    { label: 'Noise / Distractors', count: analysis.noiseCount, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-500/30' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div key={i} className={`p-4 rounded-xl border ${stat.bg} backdrop-blur-md text-center space-y-1`}>
          <div className={`text-2xl font-black ${stat.color} font-mono`}>
            {stat.count}
          </div>
          <div className="text-[11px] font-semibold text-slate-300">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
