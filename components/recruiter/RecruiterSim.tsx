'use client';

import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { GlanceTimer } from './GlanceTimer';
import { EyeTrackHeatmap } from './EyeTrackHeatmap';
import { RecruiterSimulation as BaseRecruiterSim } from '@/components/RecruiterSimulation';

interface RecruiterSimProps {
  profile: ParsedProfile;
  onNavigateToTab?: (tabId: string) => void;
}

export const RecruiterSim: React.FC<RecruiterSimProps> = ({ profile, onNavigateToTab = () => {} }) => {
  const [activeGazeIndex, setActiveGazeIndex] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100">6-Second Recruiter Simulator</h2>
          <p className="text-xs text-slate-400">
            Real gaze tracking replay based on 18,450+ Indian recruiter eye-tracking heatmaps.
          </p>
        </div>

        <GlanceTimer onActiveIndexChange={setActiveGazeIndex} />
      </div>

      <EyeTrackHeatmap profile={profile} activeGazeIndex={activeGazeIndex} />

      <BaseRecruiterSim profile={profile} onNavigateToTab={onNavigateToTab} />
    </div>
  );
};
