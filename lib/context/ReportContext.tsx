'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem, ExperienceBand } from '@/types';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { parseRawResumeText } from '@/lib/parser';
import { calculateScore } from '@/lib/scoring';
import { generateActionPlan } from '@/lib/plan/generate';

export type AppStep = 'upload' | 'target-role' | 'review' | 'analysis' | 'dashboard';

interface ReportContextType {
  profile: ParsedProfile | null;
  isDemo: boolean;
  demoKey: string | null;
  scoreReport: ScoreReport | null;
  scoreHistory: ScoreHistoryPoint[];
  actionPlan: ActionPlanItem[];
  currentStep: AppStep;
  activeTab: string;
  loadDemoProfile: (key: string) => void;
  setRawResumeText: (text: string, sourceName?: string) => void;
  updateTargetRole: (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
  }) => void;
  confirmReview: (updatedProfile: ParsedProfile) => void;
  updateProfile: (updatedProfile: ParsedProfile, changeReason?: string) => void;
  resetAnalysis: () => void;
  setActiveTab: (tab: string) => void;
  setCurrentStep: (step: AppStep) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const STORAGE_KEY = 'npo:active_report_session';

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [demoKey, setDemoKey] = useState<string | null>(null);
  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryPoint[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>([]);
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [activeTab, setActiveTab] = useState<string>('recruiter-sim');

  // Load from sessionStorage on initial browser mount if available
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.profile) {
            setProfile(parsed.profile);
            setIsDemo(Boolean(parsed.isDemo));
            setDemoKey(parsed.demoKey || null);
            const report = calculateScore(parsed.profile);
            const plan = generateActionPlan(parsed.profile);
            setScoreReport(report);
            setActionPlan(plan.items);
            setScoreHistory(parsed.scoreHistory || [{
              date: 'Today',
              timestamp: Date.now(),
              score: report.overallScore,
              changeReason: 'Restored Active Session'
            }]);
            setCurrentStep('dashboard');
          }
        }
      }
    } catch {
      // sessionStorage unavailable or disabled; maintain in-memory state cleanly
    }
  }, []);

  // Save session state to sessionStorage
  const persistSession = (p: ParsedProfile | null, demo: boolean, key: string | null, history: ScoreHistoryPoint[]) => {
    try {
      if (typeof window !== 'undefined') {
        if (!p) {
          sessionStorage.removeItem(STORAGE_KEY);
        } else {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            profile: p,
            isDemo: demo,
            demoKey: key,
            scoreHistory: history
          }));
        }
      }
    } catch {
      // Ignore storage errors
    }
  };

  const loadDemoProfile = (key: string) => {
    const seeded = SEEDED_PROFILES[key] || SEEDED_PROFILES.arjun;
    const report = calculateScore(seeded);
    const plan = generateActionPlan(seeded);
    const history: ScoreHistoryPoint[] = [
      {
        date: 'Today',
        timestamp: Date.now(),
        score: report.overallScore,
        changeReason: `Loaded Illustrative Demo (${seeded.name})`
      }
    ];

    setProfile(seeded);
    setIsDemo(true);
    setDemoKey(key);
    setScoreReport(report);
    setActionPlan(plan.items);
    setScoreHistory(history);
    setCurrentStep('dashboard');
    persistSession(seeded, true, key, history);
  };

  const setRawResumeText = (rawText: string, sourceName?: string) => {
    const parsed = parseRawResumeText(rawText);
    if (sourceName) {
      parsed.name = parsed.name === 'Candidate' ? sourceName.replace(/\.[^/.]+$/, '') : parsed.name;
    }
    setProfile(parsed);
    setIsDemo(false);
    setDemoKey(null);
    setCurrentStep('target-role');
  };

  const updateTargetRole = (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
  }) => {
    if (!profile) return;
    const updated: ParsedProfile = {
      ...profile,
      targetRoleId: data.targetRoleId,
      targetRole: data.targetRole,
      experienceBand: data.experienceBand,
      targetCities: data.targetCities,
      expectedSalaryLakhs: data.expectedSalaryLakhs
    };
    setProfile(updated);
    setCurrentStep('review');
  };

  const confirmReview = (updatedProfile: ParsedProfile) => {
    setProfile(updatedProfile);
    setCurrentStep('analysis');
    // Process analysis
    setTimeout(() => {
      const report = calculateScore(updatedProfile);
      const plan = generateActionPlan(updatedProfile);
      const history: ScoreHistoryPoint[] = [
        {
          date: 'Today',
          timestamp: Date.now(),
          score: report.overallScore,
          changeReason: 'Initial Profile Audit'
        }
      ];
      setScoreReport(report);
      setActionPlan(plan.items);
      setScoreHistory(history);
      setCurrentStep('dashboard');
      persistSession(updatedProfile, false, null, history);
    }, 600);
  };

  const updateProfile = (updatedProfile: ParsedProfile, changeReason: string = 'Profile Optimization') => {
    const report = calculateScore(updatedProfile);
    const plan = generateActionPlan(updatedProfile);
    const newHistory = [
      ...scoreHistory,
      {
        date: 'Today',
        timestamp: Date.now(),
        score: report.overallScore,
        changeReason
      }
    ];
    setProfile(updatedProfile);
    setScoreReport(report);
    setActionPlan(plan.items);
    setScoreHistory(newHistory);
    persistSession(updatedProfile, isDemo, demoKey, newHistory);
  };

  const resetAnalysis = () => {
    setProfile(null);
    setIsDemo(false);
    setDemoKey(null);
    setScoreReport(null);
    setScoreHistory([]);
    setActionPlan([]);
    setCurrentStep('upload');
    setActiveTab('recruiter-sim');
    persistSession(null, false, null, []);
  };

  return (
    <ReportContext.Provider
      value={{
        profile,
        isDemo,
        demoKey,
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
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
}
