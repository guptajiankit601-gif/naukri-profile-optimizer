'use client';

import React from 'react';
import { X, ShieldCheck, Lock, Database, Brain, Trash2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Data Handling & Privacy Transparency</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Client-side processing and data protection practices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 text-xs text-slate-600 dark:text-slate-300 max-h-[70vh] overflow-y-auto pr-2">
          {/* Section 1: Client-Side Processing */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Where Your Data is Processed</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              Resume file parsing (PDF, DOCX, TXT), section segmentation, and scoring rule evaluations run <strong>locally in your web browser</strong> using client-side JavaScript. Your resume document is never uploaded to an external storage bucket or sold to third-party recruiters.
            </p>
          </div>

          {/* Section 2: AI Minimization */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Optional AI Polish (Google Gemini) — OFF by Default</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              The entire core diagnostic scoring engine operates deterministically without external AI APIs. If you explicitly toggle &quot;AI bullet polish&quot;, <strong>only the single sentence being edited is transmitted</strong> to the backend Gemini service. Full resume documents, contact details, phone numbers, and employer names are omitted from AI prompts.
            </p>
          </div>

          {/* Section 3: Credentials & Account Privacy */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero Password Policy · No Account Scraping</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              We never ask for your job portal passwords. We do not perform authenticated scraping of your private profile. We never monetize or broker candidate data to recruitment agencies.
            </p>
          </div>

          {/* Section 4: Clear Data Action */}
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Clear Current Resume & Session State</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Permanently erase the loaded resume and analysis report from your browser memory.
              </p>
            </div>
            <button
              onClick={handleClearData}
              disabled={!profile}
              className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/50 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              Clear Data Now
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Aligned with Indian Digital Personal Data Protection (DPDP) principles</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
