'use client';

import React from 'react';
import { ReviewStep as BaseReviewStep } from '@/components/ReviewStep';
import { ParsedProfile } from '@/types';

interface TargetingStepProps {
  initialProfile: ParsedProfile;
  onConfirmAndAnalyze: (updatedProfile: ParsedProfile) => void;
  onBack: () => void;
}

export const TargetingStep: React.FC<TargetingStepProps> = (props) => {
  return <BaseReviewStep {...props} />;
};
