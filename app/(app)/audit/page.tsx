'use client';

import React from 'react';
import { useReport } from '@/lib/context/ReportContext';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';
import { CompleteProfileAuditView } from '@/components/audit/CompleteProfileAuditView';

export default function CompleteAuditPage() {
  const {
    profile,
    scoreReport,
    isDemo,
    demoKey,
    updateProfile,
    loadDemoProfile,
    resetAnalysis
  } = useReport();

  if (!profile || !scoreReport) {
    return (
      <EmptyReportState destinationLabel="Complete Profile Audit" />
    );
  }

  return (
    <div className="space-y-6">
      <DemoProfileBanner alwaysShow />

      <CompleteProfileAuditView
        profile={profile}
        scoreReport={scoreReport}
        onUpdateProfile={updateProfile}
      />
    </div>
  );
}
