'use client';

import React from 'react';
import { X, ShieldCheck, Lock, Clock, Database, Brain, Trash2, CheckCircle2 } from 'lucide-react';
import { useReport } from '@/lib/context/ReportContext';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({ isOpen, onClose }) => {
  const { profile, resetAnalysis } = useReport();

  if (!isOpen) return null;

  const handleClearData = () => {
    resetAnalysis();
    onClose();
  };

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
              <h3 className="text-base font-bold text-white">Data Handling & Privacy Transparency</h3>
              <p className="text-[11px] text-[#A8B8C8]">Client-side processing and data protection practices</p>
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
          {/* Section 1: Client-Side Processing */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Database className="w-4 h-4 text-[#FF7582]" />
              <span>Where Your Data is Processed</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Resume file parsing (PDF, DOCX, TXT), section segmentation, and scoring rule evaluations run <strong>100% locally in your web browser</strong> using client-side JavaScript. Your resume document is never uploaded to an external storage bucket or sold to third-party recruiters.
            </p>
          </div>

          {/* Section 2: AI Minimization */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Optional AI Polish (Google Gemini) — OFF by Default</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              The entire core diagnostic scoring engine operates deterministically without external AI APIs. If you explicitly toggle "AI bullet polish", <strong>only the single sentence being edited is transmitted</strong> to the backend Gemini service. Full resume documents, contact details, phone numbers, and employer names are omitted from AI prompts.
            </p>
          </div>

          {/* Section 3: Credentials & Account Privacy */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Password Policy · No Account Scraping</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              We never ask for your Naukri or LinkedIn login passwords. We do not perform authenticated scraping of your private profile. We never monetize or broker candidate data to recruitment agencies.
            </p>
          </div>

          {/* Section 4: Clear Data Action */}
          <div className="p-3.5 rounded-xl bg-[#14293C] border border-[#24405A] flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-xs flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Clear Current Resume & Session State</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Permanently erase the loaded resume and analysis report from your browser memory.
              </p>
            </div>
            <button
              onClick={handleClearData}
              disabled={!profile}
              className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              Clear Data Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#24405A] flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Aligned with Indian Digital Personal Data Protection (DPDP) principles</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-bold text-xs hover:opacity-95 cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
