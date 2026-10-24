import React from 'react';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';

interface NavbarProps {
  currentScore?: number;
  onSelectSeededProfile: (key: string) => void;
  onReset: () => void;
  onOpenShareCard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScore,
  onSelectSeededProfile,
  onReset,
  onOpenShareCard
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0F2233]/90 backdrop-blur-md border-b border-[#234566] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7582] via-[#C56C86] to-[#725A7A] flex items-center justify-center shadow-lg shadow-[#FF7582]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#FF7582] bg-clip-text text-transparent">
                Naukri Profile Optimizer
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7582]/15 text-[#FF7582] border border-[#FF7582]/30">
                v1.0 Free
              </span>
            </div>
            <p className="text-xs text-slate-400">Recruiter-perspective analysis for Indian job boards</p>
          </div>
        </div>

        {/* Demo profiles & privacy pill */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13273A] border border-[#234566] text-xs text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local & Private · Zero Cloud Storage</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#13273A] p-1 rounded-lg border border-[#234566]">
            <span className="text-[11px] font-semibold text-slate-400 px-2">Try Demo:</span>
            <button
              onClick={() => onSelectSeededProfile('arjun')}
              className="text-xs px-2.5 py-1 rounded-md bg-[#18314A] hover:bg-[#725A7A] text-slate-200 transition-colors font-medium cursor-pointer"
              title="3-Yr Backend Java @ TCS"
            >
              Arjun (3-Yr Java)
            </button>
            <button
              onClick={() => onSelectSeededProfile('priya')}
              className="text-xs px-2.5 py-1 rounded-md bg-[#18314A] hover:bg-[#725A7A] text-slate-200 transition-colors font-medium cursor-pointer"
              title="Fresher CSE / Tier-2 College"
            >
              Priya (Fresher)
            </button>
            <button
              onClick={() => onSelectSeededProfile('sneha')}
              className="text-xs px-2.5 py-1 rounded-md bg-[#18314A] hover:bg-[#725A7A] text-slate-200 transition-colors font-medium cursor-pointer"
              title="6-Yr Marketing Lead"
            >
              Sneha (Marketing)
            </button>
          </div>

          {currentScore !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-[#18314A] to-[#234566] border border-[#C56C86]/40 shadow">
                <span className="text-xs text-slate-300 font-medium">Score:</span>
                <span className={`text-sm font-black ${currentScore >= 71 ? 'text-emerald-400' : currentScore >= 41 ? 'text-amber-400' : 'text-[#FF7582]'}`}>
                  {currentScore}/100
                </span>
              </div>
              {onOpenShareCard && (
                <button
                  onClick={onOpenShareCard}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FF7582] hover:bg-[#ff5c6d] text-slate-900 font-bold text-xs shadow-md shadow-[#FF7582]/20 transition-all cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Share Card</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
