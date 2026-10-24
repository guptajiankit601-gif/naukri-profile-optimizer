'use client';

import React from 'react';
import { KeywordGapChecker as BaseChecker } from '@/components/KeywordGapChecker';
import { ParsedProfile } from '@/types';

interface KeywordFilterTableProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile) => void;
}

export const KeywordFilterTable: React.FC<KeywordFilterTableProps> = (props) => {
  return <BaseChecker {...props} />;
};
