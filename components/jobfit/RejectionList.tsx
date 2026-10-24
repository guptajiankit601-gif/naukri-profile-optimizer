'use client';

import React from 'react';
import { RejectionPredictorView as BaseRejectionView } from '@/components/RejectionPredictorView';
import { ParsedProfile } from '@/types';

interface RejectionListProps {
  profile: ParsedProfile;
  onNavigateToTab?: (tabId: string) => void;
}

export const RejectionList: React.FC<RejectionListProps> = ({ profile, onNavigateToTab = () => {} }) => {
  return <BaseRejectionView profile={profile} onNavigateToTab={onNavigateToTab} />;
};
