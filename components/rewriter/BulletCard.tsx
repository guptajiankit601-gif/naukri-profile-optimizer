'use client';

import React from 'react';
import { BulletRewriterView as BaseRewriterView } from '@/components/BulletRewriterView';
import { ParsedProfile } from '@/types';

interface BulletCardProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile) => void;
}

export const BulletCard: React.FC<BulletCardProps> = (props) => {
  return <BaseRewriterView {...props} />;
};
