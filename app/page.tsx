'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { AppShell } from '@/components/layout/AppShell';
import { ResumeIntakeScreen } from '@/components/intake/ResumeIntakeScreen';
import { RoleStep } from '@/components/onboarding/RoleStep';
import { TargetingStep } from '@/components/onboarding/TargetingStep';
import { ProcessingStep } from '@/components/onboarding/ProcessingStep';
import { ExperienceBand } from '@/types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export default function HomePage() {
  const router = useRouter();
  const {
    profile,
    scoreReport,
    isDemo,
    currentStep,
    loadDemoProfile,
    setRawResumeText,
    updateTargetRole,
    confirmReview,
    resetAnalysis,
    setCurrentStep
  } = useReport();

  const handleSelectDemo = (key: string) => {
    loadDemoProfile(key);
    router.push('/dashboard');
  };

  const handleTargetRoleConfirmed = (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
  }) => {
    updateTargetRole(data);
  };

  const handleProcessingComplete = () => {
    setCurrentStep('dashboard');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1422] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <AppShell>
        {/* If user already has an active resume session, give instant jump bar */}
        {profile && scoreReport && (
          <div className="max-w-2xl mx-auto w-full px-4 mb-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Active {isDemo ? 'Sample Demo' : 'Resume'} for{' '}
                    <span className="font-bold text-blue-600">{profile.name}</span> ({profile.targetRole})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Quality score: <span className="font-bold text-slate-900">{scoreReport.overallScore}/100</span> · All workspace tools available
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={resetAnalysis}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 font-medium text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Upload New
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Clean First-Visit Onboarding & Resume Intake */}
        {currentStep === 'upload' && (
          <ResumeIntakeScreen
            onParsedTextReady={(text, name, jd, profText) => setRawResumeText(text, name, jd, profText)}
            onSelectDemoProfile={handleSelectDemo}
          />
        )}

        {/* Step 2: Target Role & Experience Band Confirmation */}
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

        {/* Step 3: Candidate Verification Review & Field Correction */}
        {currentStep === 'review' && profile && (
          <TargetingStep
            initialProfile={profile}
            onConfirmAndAnalyze={confirmReview}
            onBack={() => setCurrentStep('target-role')}
          />
        )}

        {/* Step 4: 10-Point Deterministic Assessment Stepper */}
        {currentStep === 'analysis' && (
          <ProcessingStep onComplete={handleProcessingComplete} />
        )}

        {/* If on step 'dashboard', show quick launcher */}
        {currentStep === 'dashboard' && profile && (
          <div className="max-w-md mx-auto p-12 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-blue-600 mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900">Opening {BRAND_CONFIG.name}...</h3>
            <p className="text-xs text-slate-500">Loading your comprehensive resume assessment and recommendations.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </AppShell>
    </div>
  );
}
