'use client';

import React from 'react';
import { UploadStep as BaseUploadStep } from '@/components/UploadStep';

interface OnboardingUploadProps {
  onParsedTextReady: (text: string, sourceName?: string) => void;
  onSelectSeededProfile: (key: string) => void;
}

export const UploadStep: React.FC<OnboardingUploadProps> = (props) => {
  return <BaseUploadStep {...props} />;
};
