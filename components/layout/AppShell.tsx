'use client';

import React, { useState } from 'react';
import { GlassMenuBar } from './GlassMenuBar';
import { SideNav } from './SideNav';
import { MobileNav } from './MobileNav';
import { Breadcrumbs } from './Breadcrumbs';
import { PrivacyNoticeModal } from '@/components/PrivacyNoticeModal';
import { ShareCardModal } from '@/components/ShareCardModal';
import { useReport } from '@/lib/context/ReportContext';
import { ScoreReport, ActionPlanItem } from '@/types';
import { BRAND_CONFIG } from '@/config/brand';

interface AppShellProps {
  currentScore?: number;
  scoreReport?: ScoreReport;
  targetRoleBadge?: string;
  isDemo?: boolean;
  actionPlan?: ActionPlanItem[];
  activeTab?: string;
  onNavigateTab?: (tabId: string) => void;
  onSelectSeededProfile?: (key: string) => void;
  onReset?: () => void;
  onOpenShareCard?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentScore: propScore,
  scoreReport: propReport,
  targetRoleBadge: propBadge,
  isDemo: propIsDemo,
  onSelectSeededProfile: propOnSelect,
  onReset: propOnReset,
  onOpenShareCard: propOnOpenShare,
  children
}) => {
  const {
    profile,
    scoreReport: contextReport,
    isDemo: contextIsDemo,
    loadDemoProfile,
    resetAnalysis
  } = useReport();

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const activeScore = propScore !== undefined ? propScore : contextReport?.overallScore;
  const isDemoActive = propIsDemo !== undefined ? propIsDemo : contextIsDemo;

  const targetRoleBadge = propBadge || (
    profile
      ? `${profile.targetRole} · ${profile.experienceBand}`
      : ''
  );

  const handleSelectDemo = (key: string) => {
    if (propOnSelect) propOnSelect(key);
    else loadDemoProfile(key);
  };

  const handleReset = () => {
    if (propOnReset) propOnReset();
    else resetAnalysis();
  };

  const handleOpenShare = () => {
    if (propOnOpenShare) propOnOpenShare();
    else setIsShareModalOpen(true);
  };

  const hasActiveResume = Boolean(profile);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1422] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Header Navigation */}
      <GlassMenuBar
        currentScore={activeScore}
        targetRoleBadge={targetRoleBadge}
        isDemo={isDemoActive}
        onSelectSeededProfile={handleSelectDemo}
        onReset={handleReset}
        onOpenShareCard={handleOpenShare}
      />

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex w-full pt-16">
        {/* Left Sidebar only when active resume report exists */}
        {hasActiveResume && <SideNav />}

        {/* Main Content Workspace */}
        <main className={`flex-1 min-w-0 w-full px-4 sm:px-6 py-6 pb-24 lg:pb-12 ${hasActiveResume ? 'max-w-7xl mx-auto' : 'max-w-4xl mx-auto'}`}>
          <Breadcrumbs />
          {children}
        </main>
      </div>

      {/* 3. Mobile Navigation (only when resume is active) */}
      {hasActiveResume && <MobileNav />}

      {/* 4. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1422] py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 no-print mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>{BRAND_CONFIG.name} · {BRAND_CONFIG.descriptor}</span>
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <span>{BRAND_CONFIG.privacyBadge}</span>
            <span>·</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium cursor-pointer"
            >
              Privacy Notice
            </button>
            <span>·</span>
            <span>v{BRAND_CONFIG.version}</span>
          </div>
        </div>
      </footer>

      {/* Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Share Score Card Modal */}
      {profile && (propReport || contextReport) && (
        <ShareCardModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          profile={profile}
          scoreReport={propReport || contextReport!}
        />
      )}
    </div>
  );
};
