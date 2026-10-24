'use client';

import React from 'react';
import { ActionPlanView as BasePlanView } from '@/components/ActionPlanView';
import { ActionPlanItem, ScoreReport } from '@/types';

interface ActionPlanListProps {
  initialPlan: ActionPlanItem[];
  scoreReport: ScoreReport;
  onNavigateToTab?: (tabId: string) => void;
}

export const ActionPlanList: React.FC<ActionPlanListProps> = ({
  initialPlan,
  scoreReport,
  onNavigateToTab = () => {}
}) => {
  return <BasePlanView initialPlan={initialPlan} scoreReport={scoreReport} onNavigateToTab={onNavigateToTab} />;
};
