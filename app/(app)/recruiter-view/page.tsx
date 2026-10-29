'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { RecruiterSimulation } from '@/components/RecruiterSimulation';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function RecruiterViewPage() {
  const router = useRouter();
  const { profile } = useReport();

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  const handleNavigate = (tabOrRoute: string) => {
    switch (tabOrRoute) {
      case 'rewriter':
      case 'bullet-rewriter':
        router.push('/bullet-rewriter');
        break;
      case 'keywords':
      case 'keyword-analysis':
        router.push('/keyword-analysis');
        break;
      case 'action-plan':
        router.push('/action-plan');
        break;
      default:
        router.push('/dashboard');
        break;
    }
  };

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <RecruiterSimulation
        profile={profile}
        onNavigateToTab={handleNavigate}
      />
    </div>
  );
}
