'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { ActionPlanView } from '@/components/ActionPlanView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';
import { ActionPlanItem } from '@/types';

export default function ActionPlanPage() {
  const router = useRouter();
  const { profile, scoreReport, actionPlan } = useReport();

  if (!profile || !scoreReport) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  const handleNavigate = (tabId: string, item?: ActionPlanItem) => {
    if (item?.id === 'plan-1' || item?.title.toLowerCase().includes('headline')) {
      router.push('/headline-fixer?section=headline');
      return;
    }
    if (item?.id === 'plan-2' || item?.title.toLowerCase().includes('keyword') || item?.title.toLowerCase().includes('skill')) {
      router.push('/keyword-analysis?group=missing');
      return;
    }
    if (item?.id === 'plan-3' || item?.title.toLowerCase().includes('bullet') || item?.title.toLowerCase().includes('verb')) {
      router.push('/bullet-rewriter?target=passive');
      return;
    }
    if (item?.id === 'plan-4' || item?.title.toLowerCase().includes('summary') || item?.title.toLowerCase().includes('about')) {
      router.push('/headline-fixer?section=summary');
      return;
    }
    if (item?.id === 'plan-5' || tabId === 'job-fit') {
      router.push('/job-fit');
      return;
    }
    if (item?.id === 'plan-6' || tabId === 'export') {
      router.push('/resume-export');
      return;
    }

    switch (tabId) {
      case 'keywords':
      case 'keyword-analysis':
        router.push('/keyword-analysis?group=missing');
        break;
      case 'rewriter':
      case 'bullet-rewriter':
        router.push('/bullet-rewriter?target=passive');
        break;
      case 'headlines':
      case 'headline-fixer':
        router.push('/headline-fixer');
        break;
      case 'recruiter-sim':
      case 'recruiter-view':
        router.push('/recruiter-view');
        break;
      case 'job-fit':
        router.push('/job-fit');
        break;
      default:
        router.push('/dashboard');
        break;
    }
  };

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <ActionPlanView
        initialPlan={actionPlan}
        scoreReport={scoreReport}
        onNavigateToTab={handleNavigate}
      />
    </div>
  );
}
