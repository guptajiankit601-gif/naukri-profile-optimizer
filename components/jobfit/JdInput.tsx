'use client';

import React from 'react';
import { JobDescriptionMatcherView as BaseJdView } from '@/components/JobDescriptionMatcherView';
import { ParsedProfile } from '@/types';

interface JdInputProps {
  profile: ParsedProfile;
  onNavigateToTab?: (tabId: string) => void;
}

export const JdInput: React.FC<JdInputProps> = ({ profile, onNavigateToTab = () => {} }) => {
  return <BaseJdView profile={profile} onNavigateToTab={onNavigateToTab} />;
};
