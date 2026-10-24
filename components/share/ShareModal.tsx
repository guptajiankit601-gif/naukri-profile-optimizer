'use client';

import React from 'react';
import { ShareCardModal as BaseShareModal } from '@/components/ShareCardModal';
import { ParsedProfile, ScoreReport } from '@/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ParsedProfile;
  scoreReport: ScoreReport;
}

export const ShareModal: React.FC<ShareModalProps> = (props) => {
  return <BaseShareModal {...props} />;
};
