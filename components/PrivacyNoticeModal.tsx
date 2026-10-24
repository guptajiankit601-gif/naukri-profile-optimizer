'use client';

import React from 'react';
import { X, ShieldCheck, Lock, Clock, Database, Brain, Trash2 } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0F2233] border border-[#24405A] rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#24405A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Privacy Notice (DPDP Act 2023 Alignment)</h3>
              <p className="text-[11px] text-[#A8B8C8]">Data Fiduciary & Retention Guarantee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#14293C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 text-xs text-slate-300 max-h-[70vh] overflow-y-auto pr-2">
          {/* Card 1: What & Why */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Database className="w-4 h-4 text-[#FF7582]" />
              <span>What We Collect & Why</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              <strong>What we collect:</strong> Your resume text, target role title, target cities, and calculated analysis results.
              <br />
              <strong>Why:</strong> Strictly to evaluate your profile against Indian recruiter search heuristics, score your visibility, detect keyword gaps, rewrite bullets, and produce your 7-day action plan.
            </p>
          </div>

          {/* Card 2: Retention */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>How Long We Keep Data (Automated TTL)</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              <strong>Guest / Anonymous Use (M2):</strong> 24 hours. Automatically purged by daily server cron at 03:00 IST without human intervention.
              <br />
              <strong>User Account (M3):</strong> 90 days of inactivity. User-deletable at any time with a 1-click permanent cascade forget path.
            </p>
          </div>

          {/* Card 3: AI Minimization */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>AI Processing (Google Gemini) — OFF by Default</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              The entire application operates 100% deterministically without external APIs. If you opt into AI polishing, <strong>only the specific sentence you are actively rewriting is sent to Gemini</strong> inside isolated delimiters. Your full resume, name, phone, email, employer history, and institutions are never sent.
            </p>
          </div>

          {/* Card 4: Data Protection */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Selling · Zero Recruiter Sharing</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              We never sell your resume data, never use it to train public AI models, and never share or sell contact details to recruiters or third-party lead brokers. All processing operates in India-region compliance.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#24405A] flex items-center justify-between">
          <span className="text-[10px] text-slate-500">DPDP Act 2023 & Indian IT Act Compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-bold text-xs hover:opacity-95 cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
