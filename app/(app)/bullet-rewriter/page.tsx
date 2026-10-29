'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { BulletRewriterView } from '@/components/BulletRewriterView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function BulletRewriterPage() {
  const router = useRouter();
  const { profile, updateProfile } = useReport();

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading bullet optimizer...</div>}>
        <BulletRewriterView
          profile={profile}
          onUpdateProfile={(updated, reason) => updateProfile(updated, reason || 'Accepted Bullet Rewrite')}
        />
      </Suspense>
    </div>
  );
}
