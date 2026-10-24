'use client';

import React from 'react';
import { AnalysisProgress as BaseAnalysisProgress } from '@/components/AnalysisProgress';

interface ProcessingStepProps {
  onComplete: () => void;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = (props) => {
  return <BaseAnalysisProgress {...props} />;
};
