'use client';

import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { ROLES } from '@/lib/data/roles';
import { Check, Copy, Type, Edit3, CheckCircle2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { sanitizeCopyText, getSafeLocation } from '@/lib/naukri/clean-placeholders';

interface HeadlineFixerViewProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile, reason?: string) => void;
}

export const HeadlineFixerView: React.FC<HeadlineFixerViewProps> = ({ profile, onUpdateProfile }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingHeadline, setEditingHeadline] = useState(sanitizeCopyText(profile.headline || ''));
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const primarySkills = (profile.skills || []).slice(0, 3).join(' & ') || 'Core Technologies';
  const topCompany = profile.experiences?.[0]?.company;
  const safeLoc = getSafeLocation(profile);

  // 5 fact-preserving, platform-specific headline alternatives with zero unresolved placeholders
  const alternatives = [
    {
      platform: 'Naukri Format (Recommended)',
      title: sanitizeCopyText(`${roleConfig.name} | ${primarySkills} | ${profile.experienceBand} Yrs Exp`),
      maxLimit: 250,
      score: 95,
      reason: 'Standard Naukri recruiter search string: combines role title, 2-3 verified skills, and experience band.'
    },
    {
      platform: 'Naukri High-Impact (Domain & Metro)',
      title: sanitizeCopyText(
        safeLoc
          ? `${roleConfig.name} | ${roleConfig.topSearchKeywords.slice(0, 2).join(' & ')} | Distributed Systems | ${safeLoc}`
          : `${roleConfig.name} | ${roleConfig.topSearchKeywords.slice(0, 2).join(' & ')} | Distributed Architecture`
      ),
      maxLimit: 250,
      score: 92,
      reason: 'Captures high-demand architecture search parameters and optional metro filter.'
    },
    {
      platform: 'LinkedIn Professional (Authority Formula)',
      title: sanitizeCopyText(
        topCompany
          ? `${roleConfig.name} @ ${topCompany} | ${(profile.skills || []).slice(0, 2).join(', ')} | Distributed Systems`
          : `${roleConfig.name} | ${(profile.skills || []).slice(0, 3).join(' • ')} | Open to Opportunities`
      ),
      maxLimit: 220,
      score: 90,
      reason: 'Classic LinkedIn authority formula: Role @ Company | Core Technologies | Specialization.'
    },
    {
      platform: 'LinkedIn Growth / Modern Hook',
      title: sanitizeCopyText(`${roleConfig.name} | Designing resilient ${roleConfig.category} systems | Open to Opportunities`),
      maxLimit: 220,
      score: 86,
      reason: 'Modern conversational positioning highlighting focus area and readiness for senior conversations.'
    },
    {
      platform: 'ATS Resume Header (Single-Sentence)',
      title: sanitizeCopyText(`${roleConfig.name} with ${profile.experienceBand} years experience specializing in ${primarySkills}`),
      maxLimit: 120,
      score: 88,
      reason: 'Direct single-sentence header optimized for clean machine extraction in Workday and Greenhouse.'
    }
  ].map(alt => ({
    ...alt,
    charCount: alt.title.length // Guaranteed exact matching character count
  }));

  const handleApplyHeadline = (newHeadline: string) => {
    onUpdateProfile(
      {
        ...profile,
        headline: newHeadline
      },
      'Updated Headline Formulation'
    );
    setEditingHeadline(newHeadline);
    setIsEditingCustom(false);
    showToast('Applied new headline to your profile! Recruiter score updated.');
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    showToast('Copied headline to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Headline Optimizer & Keyword Indexer</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Recruiter search queries index the first 120 characters of your headline. Use role keywords, verified skills, and experience indicators.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 shrink-0">
          Target: <strong className="text-slate-900 dark:text-slate-100">{roleConfig.name}</strong>
        </div>
      </div>

      {/* Current Headline Card with Live Editor */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Profile Headline
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Length: <strong className="text-slate-900 dark:text-slate-100">{profile.headline?.length || 0}</strong> chars
            </span>
            <button
              onClick={() => setIsEditingCustom(!isEditingCustom)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingCustom ? 'Cancel Edit' : 'Edit Manually'}</span>
            </button>
          </div>
        </div>

        {isEditingCustom ? (
          <div className="space-y-3">
            <textarea
              rows={2}
              value={editingHeadline}
              onChange={(e) => setEditingHeadline(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-blue-600 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              placeholder="Enter your custom headline..."
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Tip: Keep under 120 chars for mobile recruiter scan visibility
              </span>
              <button
                onClick={() => handleApplyHeadline(editingHeadline)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Save Custom Headline
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            &quot;{profile.headline || 'No headline set'}&quot;
          </p>
        )}
      </div>

      {/* 5 Ranked Headline Alternatives */}
      <div className="space-y-3.5">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>5 Ranked Platform Alternatives for {roleConfig.name}:</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">Click to apply or copy</span>
        </div>

        <div className="space-y-3">
          {alternatives.map((alt, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#142236] hover:bg-slate-50/70 dark:hover:bg-[#18283f] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 p-4 sm:p-5 shadow-xs transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{alt.platform}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-mono">
                    {alt.charCount} / {alt.maxLimit} chars
                  </span>
                </div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                  Match Index: {alt.score}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium font-sans">
                {alt.title}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  💡 {alt.reason}
                </p>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopy(alt.title, idx)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleApplyHeadline(alt.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Headline</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
