'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { PeerBenchmarkView } from '@/components/PeerBenchmarkView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function BenchmarksPage() {
  const router = useRouter();
  const { profile } = useReport();

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <PeerBenchmarkView profile={profile} />
    </div>
  );
}
