'use client';

import React, { useState } from 'react';
import { Award, ChevronDown, Check, Briefcase, MapPin, Sparkles } from 'lucide-react';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { Button } from '@/components/ui/button';

interface GlassMenuBarProps {
  currentScore?: number;
  targetRoleBadge?: string;
  onSelectSeededProfile: (key: string) => void;
  onReset: () => void;
  onOpenShareCard?: () => void;
}

export const GlassMenuBar: React.FC<GlassMenuBarProps> = ({
  currentScore = 52,
  targetRoleBadge = 'Backend Engineer · 3-5 yrs · Bengaluru',
  onSelectSeededProfile,
  onReset,
  onOpenShareCard
}) => {
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  return (
    <header className="h-16 fixed top-0 left-0 right-0 z-50 bg-[#0F2233]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={onReset}
          title="Reset to home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#355C7D] via-[#725A7A] to-[#FF7582] flex items-center justify-center shadow-md shadow-[#FF7582]/20 shrink-0">
            <span className="text-white font-extrabold text-sm tracking-tighter">N</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#F2F5F8]">
              Naukri
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 shadow-sm">
              Optimizer
            </span>
          </div>
        </div>

        {/* Center: Target Role Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14273A] border border-white/10 text-xs font-semibold text-slate-200 shadow-inner">
          <Briefcase className="w-3.5 h-3.5 text-[#FF7582] shrink-0" />
          <span className="tracking-wide text-slate-200">{targetRoleBadge}</span>
        </div>

        {/* Right: Persona Switcher + Score Pill + Share Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#14273A] border border-white/10 hover:border-white/20 text-xs font-semibold flex items-center gap-1.5 text-slate-200 transition-colors cursor-pointer"
            >
              <span className="text-[10px] text-[#8FA3B8] uppercase font-bold hidden sm:inline">Persona:</span>
              <span className="text-white font-bold">Switch</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#14273A] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] uppercase font-bold text-[#8FA3B8] px-2 py-1 tracking-wider">
                  Test Drive Personas:
                </div>
                {Object.entries(SEEDED_PROFILES).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectSeededProfile(key);
                      setIsDemoDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-[#FF7582] transition-colors">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.targetRole} · {p.experienceBand}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Score Pill ("52/100") */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14273A] border border-[#FF7582]/30 shadow-sm">
            <span className="text-[10px] font-bold text-[#8FA3B8] uppercase tracking-wider hidden sm:inline">Score</span>
            <span className="text-xs font-black text-[#FF7582] font-mono">
              {currentScore}/100
            </span>
          </div>

          {/* Primary "Share Recruiter Card" Button */}
          {onOpenShareCard && (
            <Button
              size="sm"
              onClick={onOpenShareCard}
              className="h-8 px-3.5 text-xs font-bold bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 hover:brightness-110 shadow-md shadow-[#FF7582]/20 shrink-0"
            >
              <Award className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Share Recruiter Card</span>
              <span className="sm:hidden">Share</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
