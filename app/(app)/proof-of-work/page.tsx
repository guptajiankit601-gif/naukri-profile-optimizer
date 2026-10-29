'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';
import { ProofOfWorkVaultView } from '@/components/projects/ProofOfWorkVaultView';

export default function ProofOfWorkPage() {
  const router = useRouter();
  const { profile, updateProfile } = useReport();

  if (!profile) {
    return <EmptyReportState destinationLabel="Proof of Work Vault" onGoToUpload={() => router.push('/')} />;
  }

  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <ProofOfWorkVaultView profile={profile} onUpdateProfile={updateProfile} />
    </div>
  );
}
