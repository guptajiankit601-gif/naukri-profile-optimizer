'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Briefcase, UserCheck, Settings, PlusCircle } from 'lucide-react';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { BRAND_CONFIG } from '@/config/brand';
import { CareerUpLogo, CareerUpBrand } from '@/components/brand/CareerUpLogo';
import { ThemeToggle } from './ThemeToggle';

interface GlassMenuBarProps {
  currentScore?: number;
  targetRoleBadge?: string;
  isDemo?: boolean;
  onSelectSeededProfile: (key: string) => void;
  onReset: () => void;
  onOpenShareCard?: () => void;
}

export const GlassMenuBar: React.FC<GlassMenuBarProps> = ({
  currentScore,
  targetRoleBadge = '',
  isDemo = false,
  onSelectSeededProfile,
  onReset
}) => {
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0B1422]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 shadow-xs transition-colors duration-200">
      <div className="w-full h-full flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Group (Positioned at 24px left edge with deliberate proportions and visual centering) */}
        <CareerUpBrand onClick={onReset} isDemo={isDemo} />

        {/* Center: Target Role & Experience Badge */}
        {targetRoleBadge && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-[#142236] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-xs">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate max-w-xs">{targetRoleBadge}</span>
          </div>
        )}

        {/* Secondary Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Sample Reports Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#1A2E48] text-xs font-medium flex items-center gap-1.5 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-xs"
              aria-label="View sample reports"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Sample Reports</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 px-2.5 py-1.5 tracking-wider">
                  Select Benchmark Persona:
                </div>
                {Object.entries(SEEDED_PROFILES).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectSeededProfile(key);
                      setIsDemoDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{p.targetRole} · {p.experienceBand}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Resume Score Pill */}
          {currentScore !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 shadow-xs">
              <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium hidden md:inline">Score:</span>
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200 font-mono">{currentScore}/100</span>
            </div>
          )}

          {/* Theme Selector (Light, Dark, System) */}
          <ThemeToggle />

          {/* Settings Entry */}
          <Link
            href="/settings"
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#142236] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
            title="Settings & Preferences"
            aria-label="Settings & Preferences"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* New Resume Action */}
          {currentScore !== undefined && (
            <button
              onClick={onReset}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Upload or analyze a new resume"
            >
              <PlusCircle className="w-3.5 h-3.5 hidden sm:inline" />
              <span>New Resume</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
