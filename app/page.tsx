'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useReport, AppStep } from '@/lib/context/ReportContext';
import { AppShell } from '@/components/layout/AppShell';
import { UploadStep } from '@/components/onboarding/UploadStep';
import { RoleStep } from '@/components/onboarding/RoleStep';
import { TargetingStep } from '@/components/onboarding/TargetingStep';
import { ProcessingStep } from '@/components/onboarding/ProcessingStep';
import { Dashboard } from '@/components/Dashboard';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { ShareCardModal } from '@/components/ShareCardModal';
import { Hero } from '@/components/marketing/Hero';
import { RecruiterVsCandidate } from '@/components/marketing/RecruiterVsCandidate';
import { ProofSection } from '@/components/marketing/ProofSection';
import { SampleCard } from '@/components/marketing/SampleCard';
import { Faq } from '@/components/marketing/Faq';
import { Footer } from '@/components/marketing/Footer';
import { ExperienceBand } from '@/types';

export interface HomePageProps {
  initialStep?: AppStep;
  initialTab?: string;
}

export default function HomePage({
  initialStep,
  initialTab
}: HomePageProps) {
  const {
    profile,
    isDemo,
    scoreReport,
    scoreHistory,
    actionPlan,
    currentStep,
    activeTab,
    loadDemoProfile,
    setRawResumeText,
    updateTargetRole,
    confirmReview,
    updateProfile,
    resetAnalysis,
    setActiveTab,
    setCurrentStep
  } = useReport();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, setActiveTab]);

  useEffect(() => {
    if (initialStep && initialStep === 'dashboard' && profile) {
      setCurrentStep('dashboard');
    }
  }, [initialStep, profile, setCurrentStep]);

  const scrollToUpload = () => {
    if (currentStep !== 'upload') {
      setCurrentStep('upload');
    }
    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
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

  // Determine active view: if on dashboard step or direct route with no profile, show EmptyState
  const isDashboardRoute = initialStep === 'dashboard' || currentStep === 'dashboard';

  const targetRoleBadge = profile
    ? `${profile.targetRole} · ${profile.experienceBand} · ${profile.location?.split(',')[0] || 'India'}`
    : 'Deterministic Resume Audit';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1521] to-[#0F2233] text-[#F2F5F8] flex flex-col font-sans selection:bg-[#FF7582] selection:text-slate-900">
      <AppShell
        currentScore={profile && scoreReport ? scoreReport.overallScore : undefined}
        scoreReport={scoreReport || undefined}
        targetRoleBadge={targetRoleBadge}
        isDemo={isDemo}
        actionPlan={actionPlan}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        onSelectSeededProfile={loadDemoProfile}
        onReset={resetAnalysis}
        onOpenShareCard={() => setIsShareModalOpen(true)}
      >
        {/* If on a dashboard route but no resume profile is loaded, show clean Empty State */}
        {isDashboardRoute && !profile && (
          <EmptyReportState onGoToUpload={scrollToUpload} />
        )}

        {/* Normal Intake Flow */}
        {!isDashboardRoute && currentStep === 'upload' && (
          <div className="space-y-12">
            <Hero
              onGetStarted={scrollToUpload}
              onSelectPersona={loadDemoProfile}
            />

            <div ref={uploadSectionRef} className="max-w-4xl mx-auto px-4">
              <UploadStep
                onParsedTextReady={setRawResumeText}
                onSelectSeededProfile={loadDemoProfile}
              />
            </div>

            <RecruiterVsCandidate />
            <ProofSection />
            <SampleCard />
            <Faq />
            <Footer />
          </div>
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
          <ProcessingStep onComplete={() => setCurrentStep('dashboard')} />
        )}

        {/* Dashboard Active Workspace */}
        {isDashboardRoute && profile && scoreReport && (
          <Dashboard
            profile={profile}
            scoreReport={scoreReport}
            scoreHistory={scoreHistory}
            actionPlan={actionPlan}
            onUpdateProfile={updateProfile}
            onOpenShareCard={() => setIsShareModalOpen(true)}
            activeTab={activeTab}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Share Card Modal */}
        {profile && scoreReport && (
          <ShareCardModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            profile={profile}
            scoreReport={scoreReport}
          />
        )}
      </AppShell>
    </div>
  );
}
