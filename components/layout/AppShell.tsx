'use client';

import React, { useState } from 'react';
import { GlassMenuBar } from './GlassMenuBar';
import { SideNav } from './SideNav';
import { MobileNav } from './MobileNav';
import { PrivacyNoticeModal } from '@/components/PrivacyNoticeModal';
import { ScoreReport, ActionPlanItem } from '@/types';

interface AppShellProps {
  currentScore?: number;
  scoreReport?: ScoreReport;
  actionPlan?: ActionPlanItem[];
  activeTab: string;
  onNavigateTab: (tabId: string) => void;
  onSelectSeededProfile: (key: string) => void;
  onReset: () => void;
  onOpenShareCard?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentScore,
  scoreReport,
  actionPlan,
  activeTab,
  onNavigateTab,
  onSelectSeededProfile,
  onReset,
  onOpenShareCard,
  children
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1521] to-[#0F2233] text-[#F2F5F8] flex flex-col font-sans">
      {/* 1. Liquid Glass Topbar */}
      <GlassMenuBar
        currentScore={currentScore}
        targetRoleBadge="Backend Engineer · 3-5 yrs · Bengaluru"
        onSelectSeededProfile={onSelectSeededProfile}
        onReset={onReset}
        onOpenShareCard={onOpenShareCard}
      />

      {/* 2. Fluid Work Area (Sidebar + Spacious Main Content) */}
      <div className="flex-1 flex w-full">
        {/* Left: Primary SideNav */}
        {currentScore !== undefined && (
          <SideNav
            activeTab={activeTab}
            onNavigateTab={onNavigateTab}
          />
        )}

        {/* Fluid Workspace with No Pushing Right Rail */}
        <main className="flex-1 min-w-0 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* 3. Mobile Nav (<1024px) */}
      {currentScore !== undefined && (
        <MobileNav
          activeTab={activeTab}
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* 4. Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Naukri Profile Optimizer · Recruiter-Perspective Analysis · Sunset Palette</span>
          <div className="flex items-center gap-3">
            <span>100% Client-Side · Zero Disk PII</span>
            <span>·</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-[#FF7582] hover:underline font-semibold cursor-pointer"
            >
              DPDP Privacy Notice
            </button>
            <span>·</span>
            <span>v2.0.0</span>
          </div>
        </div>
      </footer>

      {/* Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
