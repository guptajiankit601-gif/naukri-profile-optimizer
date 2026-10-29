'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { RejectionPredictorView } from '@/components/RejectionPredictorView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function ScreeningAuditPage() {
  const router = useRouter();
  const { profile } = useReport();

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  const handleNavigate = (tabOrRoute: string) => {
    switch (tabOrRoute) {
      case 'rewriter-metrics':
        router.push('/bullet-rewriter?target=metrics');
        break;
      case 'rewriter':
      case 'bullet-rewriter':
        router.push('/bullet-rewriter');
        break;
      case 'keywords':
      case 'keyword-analysis':
        router.push('/keyword-analysis?group=missing');
        break;
      case 'headlines':
      case 'headline-fixer':
        router.push('/headline-fixer');
        break;
      case 'benchmarks':
        router.push('/benchmarks');
        break;
      case 'recruiter-sim':
      case 'recruiter-view':
        router.push('/recruiter-view');
        break;
      default:
        router.push('/dashboard');
        break;
    }
  };

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <RejectionPredictorView
        profile={profile}
        onNavigateToTab={handleNavigate}
      />
    </div>
  );
}
