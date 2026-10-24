'use client';

import React from 'react';
import { HeadlineFixerView as BaseHeadlineView } from '@/components/HeadlineFixerView';
import { ParsedProfile } from '@/types';

interface HeadlineGeneratorProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile) => void;
}

export const HeadlineGenerator: React.FC<HeadlineGeneratorProps> = (props) => {
  return <BaseHeadlineView {...props} />;
};
