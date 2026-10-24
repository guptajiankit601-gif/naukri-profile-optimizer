'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Award, Bell, Menu, X, ChevronDown, Check } from 'lucide-react';
import { SEEDED_PROFILES } from '@/data/seeded-profiles';

interface GlassMenuBarProps {
  currentScore?: number;
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
  onSelectSeededProfile: (key: string) => void;
  onReset: () => void;
  onOpenShareCard?: () => void;
}

export const GlassMenuBar: React.FC<GlassMenuBarProps> = ({
  currentScore,
  activeTab = 'recruiter-sim',
  onNavigateTab,
  onSelectSeededProfile,
  onReset,
  onOpenShareCard
}) => {
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'recruiter-sim', label: 'Recruiter View' },
    { id: 'keywords', label: 'Keywords' },
    { id: 'rewriter', label: 'Rewriter' },
    { id: 'job-fit', label: 'Job Fit' },
    { id: 'benchmarks', label: 'Benchmark' },
    { id: 'action-plan', label: 'Action Plan' }
  ];

  return (
    <>
      <header className="glass-menubar">
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          {/* Logo Mark: 32px rounded square with grad-sunset */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#355C7D] via-[#725A7A] to-[#FF7582] flex items-center justify-center shadow-md shadow-[#FF7582]/20 flex-shrink-0">
            <span className="text-white font-extrabold text-sm tracking-tighter">N</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#F2F5F8]">
                Naukri
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF7582]/15 text-[#FF7582] border border-[#FF7582]/30">
                Optimizer
              </span>
            </div>
            <p className="text-[10px] text-[#6E8397] tracking-wider uppercase hidden sm:block">
              Recruiter-Perspective Analysis
            </p>
          </div>
        </div>

        {/* Center: Nav Items with Animated Sunset Underline (Desktop ≥1024px) */}
        {currentScore !== undefined && onNavigateTab && (
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  data-active={isActive ? 'true' : 'false'}
                  className="nav-item"
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Cluster: Demo Switcher + Score Badge + Actions */}
        <div className="flex items-center gap-2.5">
          {/* Pre-loaded Persona Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
              className="btn-glass text-xs py-1.5 px-2.5 flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <span className="text-[11px] text-[#A8B8C8]">Persona:</span>
              <span className="font-semibold text-white">Switch Demo</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#14293C] border border-[#24405A] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] uppercase font-bold text-[#6E8397] px-2 py-1">
                  1-Click Test Drive Profiles:
                </div>
                {Object.entries(SEEDED_PROFILES).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectSeededProfile(key);
                      setIsDemoDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#1A3145] transition-colors flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-[#FF7582] transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-[#A8B8C8]">{p.targetRole} · {p.experienceBand} yrs</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Score Badge: Glass pill with grad-text clip */}
          {currentScore !== undefined && (
            <div className="glass-panel px-3 py-1 flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#A8B8C8]">Score:</span>
              <span className={`text-sm font-black tabular-nums ${
                currentScore >= 71 ? 'text-[#3FBF8F]' : currentScore >= 41 ? 'text-[#F5A524]' : 'text-[#FF7582]'
              }`}>
                {currentScore}/100
              </span>
            </div>
          )}

          {/* Primary CTA: Share Card Button using coral-600 with white text */}
          {onOpenShareCard && currentScore !== undefined && (
            <button
              onClick={onOpenShareCard}
              className="btn-primary text-xs py-1.5 px-3 hidden sm:inline-flex"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Share Card</span>
            </button>
          )}

          {/* Mobile Hamburger (<1024px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#14293C] border border-[#24405A] text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-72 bg-[#0B1B2B] h-full p-6 border-l border-[#24405A] shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#24405A]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF7582]">Navigation Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {navLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab?.(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      activeTab === item.id ? 'bg-[#FF7582]/15 text-[#FF7582] border border-[#FF7582]/30' : 'text-slate-300 hover:bg-[#14293C]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeTab === item.id && <Check className="w-3.5 h-3.5 text-[#FF7582]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#24405A] space-y-3">
              <div className="text-[11px] text-[#A8B8C8] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Local & Private · Zero Cloud Storage</span>
              </div>
              {onOpenShareCard && (
                <button
                  onClick={() => {
                    onOpenShareCard();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full text-xs py-2.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Download Score Card</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
