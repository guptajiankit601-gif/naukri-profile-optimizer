'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { UploadStep } from '@/components/onboarding/UploadStep';
import { RoleStep } from '@/components/onboarding/RoleStep';
import { TargetingStep } from '@/components/onboarding/TargetingStep';
import { ProcessingStep } from '@/components/onboarding/ProcessingStep';
import { ParsedProfile, ScoreReport, ActionPlanItem, ExperienceBand } from '@/types';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { parseRawResumeText } from '@/lib/parser';
import { calculateScore } from '@/lib/scoring';
import { generateActionPlan } from '@/lib/plan/generate';
import { cn } from '@/lib/utils';

type OnboardingStep = 'upload' | 'role' | 'targeting' | 'processing';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('upload');
  const [profile, setProfile] = useState<ParsedProfile>(SEEDED_PROFILES.arjun);

  const stepsList: { key: OnboardingStep; label: string }[] = [
    { key: 'upload', label: '1. Resume Upload' },
    { key: 'role', label: '2. Target Role' },
    { key: 'targeting', label: '3. Verify & Review' },
    { key: 'processing', label: '4. Recruiter Scan' }
  ];

  const currentStepIndex = stepsList.findIndex(s => s.key === step);

  const handleSelectSeededProfile = (key: string) => {
    const seeded = SEEDED_PROFILES[key] || SEEDED_PROFILES.arjun;
    setProfile(seeded);
    setStep('processing');
  };

  const handleParsedTextReady = (rawText: string) => {
    const parsed = parseRawResumeText(rawText);
    setProfile(parsed);
    setStep('role');
  };

  const handleRoleConfirm = (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
  }) => {
    setProfile(prev => ({
      ...prev,
      targetRoleId: data.targetRoleId,
      targetRole: data.targetRole,
      experienceBand: data.experienceBand,
      targetCities: data.targetCities,
      expectedSalaryLakhs: data.expectedSalaryLakhs
    }));
    setStep('targeting');
  };

  const handleTargetingConfirm = (updatedProfile: ParsedProfile) => {
    setProfile(updatedProfile);
    setStep('processing');
  };

  const handleProcessingComplete = () => {
    // Navigate to dashboard
    router.push('/dashboard');
  };

  return (
    <AppShell
      activeTab="upload"
      onNavigateTab={(tabId) => router.push(`/${tabId}`)}
      onSelectSeededProfile={handleSelectSeededProfile}
      onReset={() => setStep('upload')}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Animated Stepper Header */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            {stepsList.map((s, idx) => (
              <span
                key={s.key}
                className={cn(
                  'transition-colors',
                  idx === currentStepIndex
                    ? 'text-[#FF7582] font-bold'
                    : idx < currentStepIndex
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                )}
              >
                {s.label}
              </span>
            ))}
          </div>

          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF7582] via-[#C56C86] to-[#725A7A] transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / stepsList.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Steps */}
        {step === 'upload' && (
          <UploadStep
            onParsedTextReady={handleParsedTextReady}
            onSelectSeededProfile={handleSelectSeededProfile}
          />
        )}

        {step === 'role' && (
          <RoleStep
            initialRoleId={profile.targetRoleId}
            initialBand={profile.experienceBand}
            initialCities={profile.targetCities}
            initialSalary={profile.expectedSalaryLakhs || 16}
            onConfirm={handleRoleConfirm}
            onBack={() => setStep('upload')}
          />
        )}

        {step === 'targeting' && (
          <TargetingStep
            initialProfile={profile}
            onConfirmAndAnalyze={handleTargetingConfirm}
            onBack={() => setStep('role')}
          />
        )}

        {step === 'processing' && (
          <ProcessingStep onComplete={handleProcessingComplete} />
        )}
      </div>
    </AppShell>
  );
}
