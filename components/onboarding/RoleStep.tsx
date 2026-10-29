'use client';

import React from 'react';
import { TargetRoleStep as BaseRoleStep } from '@/components/TargetRoleStep';
import { ExperienceBand } from '@/types';

interface RoleStepProps {
  initialRoleId: string;
  initialBand: ExperienceBand;
  initialCities: string[];
  initialSalary: number;
  onConfirm: (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
    jobDescription?: string;
  }) => void;
  onBack: () => void;
}

export const RoleStep: React.FC<RoleStepProps> = (props) => {
  return <BaseRoleStep {...props} />;
};
