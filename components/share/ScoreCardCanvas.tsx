'use client';

import React from 'react';
import { ShareCardModal as BaseShareModal } from '@/components/ShareCardModal';
import { ParsedProfile, ScoreReport } from '@/types';

interface ScoreCardCanvasProps {
  profile: ParsedProfile;
  scoreReport: ScoreReport;
}

export const ScoreCardCanvas: React.FC<ScoreCardCanvasProps> = ({ profile, scoreReport }) => {
  return (
    <div className="p-6 rounded-2xl bg-[rgba(26,49,69,0.35)] border border-white/10 backdrop-blur-md">
      <BaseShareModal
        isOpen={true}
        onClose={() => {}}
        profile={profile}
        scoreReport={scoreReport}
      />
    </div>
  );
};
