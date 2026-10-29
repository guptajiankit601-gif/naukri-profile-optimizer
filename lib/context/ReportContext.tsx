'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParsedProfile, ScoreReport, ScoreHistoryPoint, ActionPlanItem, ExperienceBand, ProfileVersion } from '@/types';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { parseRawResumeText } from '@/lib/parser';
import { calculateScore } from '@/lib/scoring';
import { generateActionPlan } from '@/lib/plan/generate';

export type AppStep = 'upload' | 'target-role' | 'review' | 'analysis' | 'dashboard';

interface ReportContextType {
  profile: ParsedProfile | null;
  originalProfile: ParsedProfile | null;
  versions: ProfileVersion[];
  isDemo: boolean;
  demoKey: string | null;
  scoreReport: ScoreReport | null;
  scoreHistory: ScoreHistoryPoint[];
  actionPlan: ActionPlanItem[];
  currentStep: AppStep;
  activeTab: string;
  scoreDelta: number;
  canUndo: boolean;
  toggleActionPlanItem: (id: string) => void;
  loadDemoProfile: (key: string) => void;
  setRawResumeText: (rawText: string, sourceName?: string, jobDescription?: string, professionalProfileText?: string) => void;
  updateTargetRole: (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
    jobDescription?: string;
  }) => void;
  confirmReview: (updatedProfile: ParsedProfile) => void;
  updateProfile: (updatedProfile: ParsedProfile, changeReason?: string) => void;
  saveVersion: (label?: string) => void;
  restoreVersion: (versionId: string) => void;
  undoLastEdit: () => void;
  resetAnalysis: () => void;
  setActiveTab: (tab: string) => void;
  setCurrentStep: (step: AppStep) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const STORAGE_KEY = 'npo:active_report_session';

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<ParsedProfile | null>(null);
  const [versions, setVersions] = useState<ProfileVersion[]>([]);
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
            setOriginalProfile(parsed.originalProfile || parsed.profile);
            setVersions(parsed.versions || []);
            setIsDemo(Boolean(parsed.isDemo));
            setDemoKey(parsed.demoKey || null);
            const report = calculateScore(parsed.profile);
            const plan = generateActionPlan(parsed.profile);
            setScoreReport(report);
            
            const savedPlan = parsed.actionPlanItems as ActionPlanItem[] | undefined;
            if (savedPlan && Array.isArray(savedPlan)) {
              const completedMap = new Map(savedPlan.map(i => [i.id, i.completed]));
              setActionPlan(plan.items.map(i => ({
                ...i,
                completed: completedMap.get(i.id) ?? false
              })));
            } else {
              setActionPlan(plan.items);
            }

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
  const persistSession = (
    p: ParsedProfile | null,
    origP: ParsedProfile | null,
    demo: boolean,
    key: string | null,
    history: ScoreHistoryPoint[],
    vers: ProfileVersion[],
    planItems?: ActionPlanItem[]
  ) => {
    try {
      if (typeof window !== 'undefined') {
        if (!p) {
          sessionStorage.removeItem(STORAGE_KEY);
        } else {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            profile: p,
            originalProfile: origP,
            isDemo: demo,
            demoKey: key,
            scoreHistory: history,
            versions: vers,
            actionPlanItems: planItems || actionPlan
          }));
        }
      }
    } catch {
      // Ignore storage errors
    }
  };

  const toggleActionPlanItem = (id: string) => {
    setActionPlan(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item));
      persistSession(profile, originalProfile, isDemo, demoKey, scoreHistory, versions, updated);
      return updated;
    });
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

    const initialVersion: ProfileVersion = {
      id: `ver-${Date.now()}`,
      timestamp: Date.now(),
      label: 'Original Demo Profile',
      role: seeded.targetRole,
      score: report.overallScore,
      profile: seeded,
      changeReason: 'Baseline Profile Audit'
    };

    setProfile(seeded);
    setOriginalProfile(seeded);
    setVersions([initialVersion]);
    setIsDemo(true);
    setDemoKey(key);
    setScoreReport(report);
    setActionPlan(plan.items);
    setScoreHistory(history);
    setCurrentStep('dashboard');
    persistSession(seeded, seeded, true, key, history, [initialVersion]);
  };

  const setRawResumeText = (
    rawText: string, 
    sourceName?: string, 
    jobDescription?: string, 
    professionalProfileText?: string
  ) => {
    try {
      if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
        throw new Error('Resume text is empty');
      }
      const parsed = parseRawResumeText(rawText);
      if (sourceName) {
        parsed.name = parsed.name === 'Candidate' ? sourceName.replace(/\.[^/.]+$/, '') : parsed.name;
      }
      if (jobDescription && jobDescription.trim().length > 10) {
        parsed.targetJobDescription = jobDescription.trim();
      }
      if (professionalProfileText && professionalProfileText.trim().length > 10) {
        parsed.professionalProfile = {
          rawText: professionalProfileText.trim(),
          updatedAt: Date.now()
        };
      }
      setProfile(parsed);
      setOriginalProfile(parsed);
      setVersions([]);
      setIsDemo(false);
      setDemoKey(null);
      setCurrentStep('target-role');
    } catch (err) {
      console.error('Failed to parse resume text:', err);
      // Keep previously valid report intact; re-throw for UI error feedback
      throw err;
    }
  };

  const updateTargetRole = (data: {
    targetRoleId: string;
    targetRole: string;
    experienceBand: ExperienceBand;
    targetCities: string[];
    expectedSalaryLakhs: number;
    jobDescription?: string;
  }) => {
    if (!profile) return;
    const updated: ParsedProfile = {
      ...profile,
      targetRoleId: data.targetRoleId,
      targetRole: data.targetRole,
      experienceBand: data.experienceBand,
      targetCities: data.targetCities,
      expectedSalaryLakhs: data.expectedSalaryLakhs,
      targetJobDescription: data.jobDescription || profile.targetJobDescription
    };
    setProfile(updated);
    setCurrentStep('review');
  };

  const confirmReview = (updatedProfile: ParsedProfile) => {
    setProfile(updatedProfile);
    setOriginalProfile(updatedProfile);
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

      const baselineVersion: ProfileVersion = {
        id: `ver-${Date.now()}`,
        timestamp: Date.now(),
        label: 'Original Uploaded Baseline',
        role: updatedProfile.targetRole,
        score: report.overallScore,
        profile: updatedProfile,
        changeReason: 'Initial Audit'
      };

      setScoreReport(report);
      setActionPlan(plan.items);
      setScoreHistory(history);
      setVersions([baselineVersion]);
      setCurrentStep('dashboard');
      persistSession(updatedProfile, updatedProfile, false, null, history, [baselineVersion]);
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

    const newVersion: ProfileVersion = {
      id: `ver-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      label: changeReason,
      role: updatedProfile.targetRole,
      score: report.overallScore,
      profile: updatedProfile,
      changeReason
    };

    const newVersions = [...versions, newVersion];

    setProfile(updatedProfile);
    setScoreReport(report);
    setActionPlan(plan.items);
    setScoreHistory(newHistory);
    setVersions(newVersions);
    persistSession(updatedProfile, originalProfile, isDemo, demoKey, newHistory, newVersions);
  };

  const saveVersion = (label?: string) => {
    if (!profile || !scoreReport) return;
    const versionLabel = label || `Revision ${versions.length + 1} (${profile.targetRole})`;
    const customVersion: ProfileVersion = {
      id: `ver-${Date.now()}`,
      timestamp: Date.now(),
      label: versionLabel,
      role: profile.targetRole,
      score: scoreReport.overallScore,
      profile,
      changeReason: 'Manual Snapshot'
    };
    const updated = [...versions, customVersion];
    setVersions(updated);
    persistSession(profile, originalProfile, isDemo, demoKey, scoreHistory, updated);
  };

  const restoreVersion = (versionId: string) => {
    const target = versions.find(v => v.id === versionId);
    if (!target) return;
    const report = calculateScore(target.profile);
    const plan = generateActionPlan(target.profile);
    const newHistory = [
      ...scoreHistory,
      {
        date: 'Today',
        timestamp: Date.now(),
        score: report.overallScore,
        changeReason: `Restored: ${target.label}`
      }
    ];
    setProfile(target.profile);
    setScoreReport(report);
    setActionPlan(plan.items);
    setScoreHistory(newHistory);
    persistSession(target.profile, originalProfile, isDemo, demoKey, newHistory, versions);
  };

  const undoLastEdit = () => {
    if (versions.length <= 1) {
      if (originalProfile) {
        const report = calculateScore(originalProfile);
        const plan = generateActionPlan(originalProfile);
        setProfile(originalProfile);
        setScoreReport(report);
        setActionPlan(plan.items);
        persistSession(originalProfile, originalProfile, isDemo, demoKey, scoreHistory, versions);
      }
      return;
    }

    const previousVersion = versions[versions.length - 2];
    const newVersions = versions.slice(0, versions.length - 1);
    const report = calculateScore(previousVersion.profile);
    const plan = generateActionPlan(previousVersion.profile);
    const newHistory = [
      ...scoreHistory,
      {
        date: 'Today',
        timestamp: Date.now(),
        score: report.overallScore,
        changeReason: 'Reverted Last Edit'
      }
    ];

    setProfile(previousVersion.profile);
    setScoreReport(report);
    setActionPlan(plan.items);
    setScoreHistory(newHistory);
    setVersions(newVersions);
    persistSession(previousVersion.profile, originalProfile, isDemo, demoKey, newHistory, newVersions);
  };

  const resetAnalysis = () => {
    setProfile(null);
    setOriginalProfile(null);
    setVersions([]);
    setIsDemo(false);
    setDemoKey(null);
    setScoreReport(null);
    setScoreHistory([]);
    setActionPlan([]);
    setCurrentStep('upload');
    setActiveTab('recruiter-sim');
    persistSession(null, null, false, null, [], []);
  };

  // Calculate score difference vs baseline
  const originalScore = originalProfile ? calculateScore(originalProfile).overallScore : (scoreReport?.overallScore ?? 0);
  const currentScore = scoreReport?.overallScore ?? 0;
  const scoreDelta = currentScore - originalScore;
  const canUndo = versions.length > 1 || (originalProfile !== null && profile !== null && JSON.stringify(profile) !== JSON.stringify(originalProfile));

  return (
    <ReportContext.Provider
      value={{
        profile,
        originalProfile,
        versions,
        isDemo,
        demoKey,
        scoreReport,
        scoreHistory,
        actionPlan,
        currentStep,
        activeTab,
        scoreDelta,
        canUndo,
        toggleActionPlanItem,
        loadDemoProfile,
        setRawResumeText,
        updateTargetRole,
        confirmReview,
        updateProfile,
        saveVersion,
        restoreVersion,
        undoLastEdit,
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
