'use client';

import React from 'react';
import { GlassMenuBar } from './GlassMenuBar';

export interface TopbarProps {
  currentScore?: number;
  targetRoleBadge?: string;
  onSelectSeededProfile?: (key: string) => void;
  onReset?: () => void;
  onOpenShareCard?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentScore = 52,
  targetRoleBadge = 'Backend Engineer · 3-5 yrs · Bengaluru',
  onSelectSeededProfile = () => {},
  onReset = () => {},
  onOpenShareCard = () => {}
}) => {
  return (
    <GlassMenuBar
      currentScore={currentScore}
      targetRoleBadge={targetRoleBadge}
      onSelectSeededProfile={onSelectSeededProfile}
      onReset={onReset}
      onOpenShareCard={onOpenShareCard}
    />
  );
};

export const Navbar = Topbar;
