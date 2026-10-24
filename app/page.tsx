'use client';

import React, { useState, useRef } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem, ExperienceBand } from '@/types';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { parseRawResumeText } from '@/lib/parser';
import { calculateScore } from '@/lib/scoring';
import { generateActionPlan } from '@/lib/plan/generate';
import { AppShell } from '@/components/layout/AppShell';
import { UploadStep } from '@/components/onboarding/UploadStep';
import { RoleStep } from '@/components/onboarding/RoleStep';
import { TargetingStep } from '@/components/onboarding/TargetingStep';
import { ProcessingStep } from '@/components/onboarding/ProcessingStep';
import { Dashboard } from '@/components/Dashboard';
import { ShareCardModal } from '@/components/ShareCardModal';
import { Hero } from '@/components/marketing/Hero';
import { RecruiterVsCandidate } from '@/components/marketing/RecruiterVsCandidate';
import { ProofSection } from '@/components/marketing/ProofSection';
import { SampleCard } from '@/components/marketing/SampleCard';
import { Faq } from '@/components/marketing/Faq';
import { Footer } from '@/components/marketing/Footer';

export type AppStep = 'upload' | 'target-role' | 'review' | 'analysis' | 'dashboard';

export interface HomePageProps {
  initialStep?: AppStep;
  initialTab?: string;
}

export default function HomePage({
  initialStep = 'upload',
  initialTab = 'recruiter-sim'
}: HomePageProps) {
  const [currentStep, setCurrentStep] = useState<AppStep>(initialStep);
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>(initialTab);
  const [profile, setProfile] = useState<ParsedProfile>(SEEDED_PROFILES.arjun);
  const [scoreReport, setScoreReport] = useState<ScoreReport>(() => calculateScore(SEEDED_PROFILES.arjun));
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryPoint[]>([
    {
      date: 'Today',
      timestamp: Date.now(),
      score: calculateScore(SEEDED_PROFILES.arjun).overallScore,
      changeReason: 'Initial Profile Intake'
    }
  ]);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(() => 
    generateActionPlan(SEEDED_PROFILES.arjun).items
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectSeededProfile = (key: string) => {
    const seeded = SEEDED_PROFILES[key] || SEEDED_PROFILES.arjun;
    const report = calculateScore(seeded);
    const planSummary = generateActionPlan(seeded);

    setProfile(seeded);
    setScoreReport(report);
    setScoreHistory([
      {
        date: 'Today',
        timestamp: Date.now(),
        score: report.overallScore,
        changeReason: `Loaded ${seeded.name} Demo`
      }
    ]);
    setActionPlan(planSummary.items);
    setCurrentStep('dashboard');
  };

  const handleParsedTextReady = (rawText: string) => {
    const initialParsed = parseRawResumeText(rawText);
    setProfile(initialParsed);
    setCurrentStep('target-role');
  };

  const handleTargetRoleConfirmed = (data: {
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
    setCurrentStep('review');
  };

  const handleReviewConfirmed = (updatedProfile: ParsedProfile) => {
    setProfile(updatedProfile);
    setCurrentStep('analysis');
  };

  const handleAnalysisComplete = () => {
    const report = calculateScore(profile);
    const planSummary = generateActionPlan(profile);

    setScoreReport(report);
    setActionPlan(planSummary.items);
    setScoreHistory([
      {
        date: 'Today',
        timestamp: Date.now(),
        score: report.overallScore,
        changeReason: 'Initial Recruiter Scan Intake'
      }
    ]);
    setCurrentStep('dashboard');
  };

  const handleUpdateProfile = (updatedProfile: ParsedProfile, changeReason: string = 'Profile Optimization') => {
    const newReport = calculateScore(updatedProfile);
    const newPlan = generateActionPlan(updatedProfile);

    setProfile(updatedProfile);
    setScoreReport(newReport);
    setActionPlan(newPlan.items);
    setScoreHistory(prev => [
      ...prev,
      {
        date: 'Today',
        timestamp: Date.now(),
        score: newReport.overallScore,
        changeReason
      }
    ]);
  };

  const handleReset = () => {
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1521] to-[#0F2233] text-[#F2F5F8] flex flex-col font-sans selection:bg-[#FF7582] selection:text-slate-900">
      <AppShell
        currentScore={currentStep === 'dashboard' ? scoreReport.overallScore : undefined}
        scoreReport={currentStep === 'dashboard' ? scoreReport : undefined}
        actionPlan={currentStep === 'dashboard' ? actionPlan : undefined}
        activeTab={activeDashboardTab}
        onNavigateTab={setActiveDashboardTab}
        onSelectSeededProfile={handleSelectSeededProfile}
        onReset={handleReset}
        onOpenShareCard={() => setIsShareModalOpen(true)}
      >
        {currentStep === 'upload' && (
          <div className="space-y-12">
            <Hero
              onGetStarted={scrollToUpload}
              onSelectPersona={handleSelectSeededProfile}
            />

            <div ref={uploadSectionRef} className="max-w-4xl mx-auto px-4">
              <UploadStep
                onParsedTextReady={handleParsedTextReady}
                onSelectSeededProfile={handleSelectSeededProfile}
              />
            </div>

            <RecruiterVsCandidate />
            <ProofSection />
            <SampleCard />
            <Faq />
            <Footer />
          </div>
        )}

        {currentStep === 'target-role' && (
          <RoleStep
            initialRoleId={profile.targetRoleId}
            initialBand={profile.experienceBand}
            initialCities={profile.targetCities}
            initialSalary={profile.expectedSalaryLakhs || 16}
            onConfirm={handleTargetRoleConfirmed}
            onBack={() => setCurrentStep('upload')}
          />
        )}

        {currentStep === 'review' && (
          <TargetingStep
            initialProfile={profile}
            onConfirmAndAnalyze={handleReviewConfirmed}
            onBack={() => setCurrentStep('target-role')}
          />
        )}

        {currentStep === 'analysis' && (
          <ProcessingStep onComplete={handleAnalysisComplete} />
        )}

        {currentStep === 'dashboard' && (
          <Dashboard
            profile={profile}
            scoreReport={scoreReport}
            scoreHistory={scoreHistory}
            actionPlan={actionPlan}
            onUpdateProfile={handleUpdateProfile}
            onOpenShareCard={() => setIsShareModalOpen(true)}
            activeTab={activeDashboardTab}
            onNavigateTab={setActiveDashboardTab}
          />
        )}

        {/* Share Card Modal */}
        <ShareCardModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          profile={profile}
          scoreReport={scoreReport}
        />
      </AppShell>
    </div>
  );
}
