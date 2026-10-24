'use client';

import React, { useState } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem, ExperienceBand } from '@/types';
import { SEEDED_PROFILES } from '@/data/seeded-profiles';
import { parseRawResumeText } from '@/services/parser';
import { calculateProfileScore } from '@/services/scorer';
import { generatePersonalizedActionPlan } from '@/services/action-plan';
import { AppShell } from '@/components/layout/AppShell';
import { UploadStep } from '@/components/UploadStep';
import { TargetRoleStep } from '@/components/TargetRoleStep';
import { ReviewStep } from '@/components/ReviewStep';
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { Dashboard } from '@/components/Dashboard';
import { ShareCardModal } from '@/components/ShareCardModal';

type AppStep = 'upload' | 'target-role' | 'review' | 'analysis' | 'dashboard';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('recruiter-sim');
  const [profile, setProfile] = useState<ParsedProfile>(SEEDED_PROFILES.arjun);
  const [scoreReport, setScoreReport] = useState<ScoreReport>(() => calculateProfileScore(SEEDED_PROFILES.arjun));
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryPoint[]>([
    {
      date: 'Today',
      timestamp: Date.now(),
      score: calculateProfileScore(SEEDED_PROFILES.arjun).overallScore,
      changeReason: 'Initial Profile Intake'
    }
  ]);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(() => 
    generatePersonalizedActionPlan(SEEDED_PROFILES.arjun, calculateProfileScore(SEEDED_PROFILES.arjun))
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleSelectSeededProfile = (key: string) => {
    const seeded = SEEDED_PROFILES[key] || SEEDED_PROFILES.arjun;
    const report = calculateProfileScore(seeded);
    const plan = generatePersonalizedActionPlan(seeded, report);

    setProfile(seeded);
    setScoreReport(report);
    setScoreHistory([
      {
        date: 'Today',
        timestamp: Date.now(),
        score: report.overallScore,
        changeReason: `Loaded ${seeded.label} Demo`
      }
    ]);
    setActionPlan(plan);
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
    const report = calculateProfileScore(profile);
    const plan = generatePersonalizedActionPlan(profile, report);

    setScoreReport(report);
    setActionPlan(plan);
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
    const newReport = calculateProfileScore(updatedProfile);
    const newPlan = generatePersonalizedActionPlan(updatedProfile, newReport);

    setProfile(updatedProfile);
    setScoreReport(newReport);
    setActionPlan(newPlan);
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
    <div className="min-h-screen bg-[#0F2233] text-[#F2F5F8] flex flex-col font-sans selection:bg-[#FF7582] selection:text-slate-900">
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
          <UploadStep
            onParsedTextReady={handleParsedTextReady}
            onSelectSeededProfile={handleSelectSeededProfile}
          />
        )}

        {currentStep === 'target-role' && (
          <TargetRoleStep
            initialRoleId={profile.targetRoleId}
            initialBand={profile.experienceBand}
            initialCities={profile.targetCities}
            initialSalary={profile.expectedSalaryLakhs || 16}
            onConfirm={handleTargetRoleConfirmed}
            onBack={() => setCurrentStep('upload')}
          />
        )}

        {currentStep === 'review' && (
          <ReviewStep
            initialProfile={profile}
            onConfirmAndAnalyze={handleReviewConfirmed}
            onBack={() => setCurrentStep('target-role')}
          />
        )}

        {currentStep === 'analysis' && (
          <AnalysisProgress onComplete={handleAnalysisComplete} />
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

        {/* Share Card Modal (F14) */}
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
