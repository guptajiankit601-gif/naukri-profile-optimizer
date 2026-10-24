import { useState } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem, ExperienceBand } from './types';
import { SEEDED_PROFILES } from './data/seeded-profiles';
import { parseRawResumeText } from './services/parser';
import { calculateProfileScore } from './services/scorer';
import { generatePersonalizedActionPlan } from './services/action-plan';
import { Navbar } from './components/Navbar';
import { UploadStep } from './components/UploadStep';
import { TargetRoleStep } from './components/TargetRoleStep';
import { ReviewStep } from './components/ReviewStep';
import { AnalysisProgress } from './components/AnalysisProgress';
import { Dashboard } from './components/Dashboard';
import { ShareCardModal } from './components/ShareCardModal';

type AppStep = 'upload' | 'target-role' | 'review' | 'analysis' | 'dashboard';

export function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
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

  // 1-Click Load Seeded Profile Demo
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

  // Step 1: Text extracted from file or paste
  const handleParsedTextReady = (rawText: string) => {
    const initialParsed = parseRawResumeText(rawText);
    setProfile(initialParsed);
    setCurrentStep('target-role');
  };

  // Step 2: Target role confirmed
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

  // Step 3: Verified in review step -> start animated analysis
  const handleReviewConfirmed = (updatedProfile: ParsedProfile) => {
    setProfile(updatedProfile);
    setCurrentStep('analysis');
  };

  // Step 4: Analysis completed
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

  // Live profile updates from keyword additions or bullet rewrites
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
    <div className="min-h-screen bg-[#0A1722] text-slate-100 flex flex-col font-sans selection:bg-[#FF7582] selection:text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentScore={currentStep === 'dashboard' ? scoreReport.overallScore : undefined}
        onSelectSeededProfile={handleSelectSeededProfile}
        onReset={handleReset}
        onOpenShareCard={() => setIsShareModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1">
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
          />
        )}
      </main>

      {/* Share Card Modal (F14) */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        scoreReport={scoreReport}
      />

      {/* Footer */}
      <footer className="border-t border-[#234566] py-6 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Naukri Profile Optimizer · Free, No-Auth Local Web App · Sunset Palette</span>
          <div className="flex items-center gap-3">
            <span>Client-side only · Zero external data storage</span>
            <span>·</span>
            <span>Version 1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
