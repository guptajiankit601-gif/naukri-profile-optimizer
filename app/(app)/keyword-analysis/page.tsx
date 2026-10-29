'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { KeywordGapChecker } from '@/components/KeywordGapChecker';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function KeywordAnalysisPage() {
  const router = useRouter();
  const { profile, updateProfile } = useReport();

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading keywords...</div>}>
        <KeywordGapChecker
          profile={profile}
          onUpdateProfile={(updated) => updateProfile(updated, 'Updated Keyword Inventory')}
        />
      </Suspense>
    </div>
  );
}
