'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { AppShell } from '@/components/layout/AppShell';
import { ResumeIntakeScreen } from '@/components/intake/ResumeIntakeScreen';
import { RoleStep } from '@/components/onboarding/RoleStep';
import { TargetingStep } from '@/components/onboarding/TargetingStep';
import { ProcessingStep } from '@/components/onboarding/ProcessingStep';
import { ExperienceBand } from '@/types';

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const {
    profile,
    currentStep,
    loadDemoProfile,
    setRawResumeText,
    updateTargetRole,
    confirmReview,
    setCurrentStep
  } = useReport();

  const handleSelectDemo = (key: string) => {
    loadDemoProfile(key);
    router.push(redirectTarget || '/dashboard');
  };

  const handleTargetRoleConfirmed = (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
    jobDescription?: string;
  }) => {
    updateTargetRole(data);
  };

  const handleProcessingComplete = () => {
    setCurrentStep('dashboard');
    router.push(redirectTarget || '/dashboard');
  };

  return (
    <>
      {currentStep === 'upload' && (
        <ResumeIntakeScreen
          onParsedTextReady={(text, name, jd, profText) => setRawResumeText(text, name, jd, profText)}
          onSelectDemoProfile={handleSelectDemo}
          preserveDestination={redirectTarget}
        />
      )}

      {currentStep === 'target-role' && profile && (
        <RoleStep
          initialRoleId={profile.targetRoleId}
          initialBand={profile.experienceBand}
          initialCities={profile.targetCities}
          initialSalary={profile.expectedSalaryLakhs || 16}
          onConfirm={handleTargetRoleConfirmed}
          onBack={() => setCurrentStep('upload')}
        />
      )}

      {currentStep === 'review' && profile && (
        <TargetingStep
          initialProfile={profile}
          onConfirmAndAnalyze={confirmReview}
          onBack={() => setCurrentStep('target-role')}
        />
      )}

      {currentStep === 'analysis' && (
        <ProcessingStep onComplete={handleProcessingComplete} />
      )}
    </>
  );
}

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1422] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <AppShell>
        <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs">Loading CareerUp...</div>}>
          <WelcomeContent />
        </Suspense>
      </AppShell>
    </div>
  );
}

