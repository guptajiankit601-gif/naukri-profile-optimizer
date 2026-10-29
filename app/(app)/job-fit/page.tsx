'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { JobDescriptionMatcherView } from '@/components/JobDescriptionMatcherView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function JobFitPage() {
  const router = useRouter();
  const { profile, updateProfile } = useReport();

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  const handleNavigate = (tabId: string, param?: string) => {
    switch (tabId) {
      case 'keywords':
      case 'keyword-analysis':
        router.push('/keyword-analysis');
        break;
      case 'rewriter':
      case 'bullet-rewriter':
        router.push(param ? `/bullet-rewriter?keyword=${encodeURIComponent(param)}` : '/bullet-rewriter');
        break;
      case 'headlines':
      case 'headline-fixer':
        router.push('/headline-fixer');
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
      <JobDescriptionMatcherView
        profile={profile}
        onNavigateToTab={handleNavigate}
        onUpdateProfile={(updated, reason) => updateProfile(updated, reason || 'Updated Job Fit Requirements')}
      />
    </div>
  );
}
