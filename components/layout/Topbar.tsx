'use client';

import React from 'react';
import { GlassMenuBar } from './GlassMenuBar';

export interface TopbarProps {
  currentScore?: number;
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  onSelectSeededProfile?: (key: string) => void;
  onReset?: () => void;
  onOpenShareCard?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentScore = 68,
  activeTab = 'recruiter-sim',
  onNavigateTab = () => {},
  onSelectSeededProfile = () => {},
  onReset = () => {},
  onOpenShareCard = () => {},
}) => {
  return (
    <GlassMenuBar
      currentScore={currentScore}
      activeTab={activeTab}
      onNavigateTab={onNavigateTab}
      onSelectSeededProfile={onSelectSeededProfile}
      onReset={onReset}
      onOpenShareCard={onOpenShareCard}
    />
  );
};
