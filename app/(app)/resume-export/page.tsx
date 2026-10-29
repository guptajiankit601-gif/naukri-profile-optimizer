'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { ExportView } from '@/components/ExportView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function ResumeExportPage() {
  const router = useRouter();
  const { profile } = useReport();

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <ExportView profile={profile} />
    </div>
  );
}
