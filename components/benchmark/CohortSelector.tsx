'use client';

import React from 'react';
import { PeerBenchmarkView as BaseBenchmarkView } from '@/components/PeerBenchmarkView';
import { ParsedProfile } from '@/types';

interface CohortSelectorProps {
  profile: ParsedProfile;
}

export const CohortSelector: React.FC<CohortSelectorProps> = ({ profile }) => {
  return <BaseBenchmarkView profile={profile} />;
};
