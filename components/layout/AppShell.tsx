'use client';

import React, { useState } from 'react';
import { GlassMenuBar } from './GlassMenuBar';
import { SideNav } from './SideNav';
import { RightRail } from './RightRail';
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
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F2233] text-[#F2F5F8] flex flex-col font-sans">
      {/* 1. Liquid Glass Menubar */}
      <GlassMenuBar
        currentScore={currentScore}
        activeTab={activeTab}
        onNavigateTab={onNavigateTab}
        onSelectSeededProfile={onSelectSeededProfile}
        onReset={onReset}
        onOpenShareCard={onOpenShareCard}
      />

      {/* 2. 3-Column Work Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left: SideNav */}
        {currentScore !== undefined && (
          <SideNav
            activeTab={activeTab}
            onNavigateTab={onNavigateTab}
            collapsed={sideNavCollapsed}
            onToggleCollapse={() => setSideNavCollapsed(!sideNavCollapsed)}
          />
        )}

        {/* Center: Main Content */}
        <main className={`flex-1 min-w-0 w-full px-4 py-6 md:px-6 pb-20 md:pb-8 ${currentScore === undefined ? 'max-w-4xl mx-auto' : ''}`}>
          {children}
        </main>

        {/* Right: RightRail */}
        {currentScore !== undefined && scoreReport && actionPlan && onOpenShareCard && (
          <RightRail
            scoreReport={scoreReport}
            actionPlan={actionPlan}
            onNavigateTab={onNavigateTab}
            onOpenShareCard={onOpenShareCard}
          />
        )}
      </div>

      {/* 3. Mobile Bottom Nav (<768px) */}
      {currentScore !== undefined && (
        <MobileNav
          activeTab={activeTab}
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* 4. Footer */}
      <footer className="border-t border-[var(--border)] py-6 px-4 text-center text-xs text-[#6E8397] no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Naukri Profile Optimizer · Next.js 14 App Router Monolith · Sunset Palette</span>
          <div className="flex items-center gap-3">
            <span>100% Client-Side · Zero External Storage</span>
            <span>·</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-[#FF7582] hover:underline font-semibold cursor-pointer"
            >
              DPDP Privacy Notice
            </button>
            <span>·</span>
            <span>v1.0</span>
          </div>
        </div>
      </footer>

      {/* DPDP Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
