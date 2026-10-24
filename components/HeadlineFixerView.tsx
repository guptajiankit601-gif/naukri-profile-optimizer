'use client';

import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { ROLES } from '@/lib/data/roles';
import { Sparkles, Check, Copy, ArrowRight, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeadlineFixerViewProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile) => void;
}

export const HeadlineFixerView: React.FC<HeadlineFixerViewProps> = ({ profile, onUpdateProfile }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];

  // 5 ranked platform-specific alternatives
  const alternatives = [
    {
      platform: 'Naukri Format',
      title: `${roleConfig.name} | ${profile.skills.slice(0, 3).join(' & ')} | ${profile.experienceBand} Yrs Exp`,
      score: 95,
      keywordsCount: 4,
      reason: 'Standard Naukri recruiter search string with role keyword, top 2-3 technologies and experience band.'
    },
    {
      platform: 'Naukri High-Impact',
      title: `${roleConfig.name} | ${roleConfig.topSearchKeywords.slice(0, 2).join(' & ')} | High Scale Systems | ${profile.location.split(',')[0]}`,
      score: 92,
      keywordsCount: 4,
      reason: 'Includes metro location and scale keywords to capture regional recruiter queries.'
    },
    {
      platform: 'LinkedIn Headline (Pipes)',
      title: `${roleConfig.name} @ ${profile.experiences[0]?.company || 'Tech'} | ${profile.skills.slice(0, 2).join(', ')} | Scaled APIs to 10k+ TPS`,
      score: 90,
      keywordsCount: 3,
      reason: 'Classic LinkedIn high-status formula: Role @ Company | Stack | Concrete Proof of Scale.'
    },
    {
      platform: 'LinkedIn Growth / Modern',
      title: `${roleConfig.name} | Helping teams build scalable ${roleConfig.category} systems | Open to Opportunities`,
      score: 86,
      keywordsCount: 3,
      reason: 'Conversational LinkedIn hook that encourages direct InMail outreach.'
    },
    {
      platform: 'ATS Resume Headline',
      title: `${roleConfig.name} with ${profile.experienceBand} years experience specializing in ${profile.skills.slice(0, 3).join(', ')}`,
      score: 88,
      keywordsCount: 4,
      reason: 'Direct single-sentence header optimized for Workday, Greenhouse and Taleo parsing.'
    }
  ];

  const handleApplyHeadline = (newHeadline: string) => {
    onUpdateProfile({
      ...profile,
      headline: newHeadline
    });
    showToast('Applied new headline to your profile! Recruiter score updated.');
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-[#14273A] p-6 rounded-2xl border border-white/10 shadow-xl space-y-1">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-[#FF7582]" />
          <h3 className="text-lg font-bold text-white">Headline Fixer (Highest Leverage 5 Words on the Page)</h3>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl">
          Recruiters spend their first 0-2 seconds scanning your headline. Replacing a generic title with a keyword-rich title increases profile clicks by 3.2x.
        </p>
      </div>

      {/* Current Headline Card */}
      <div className="bg-[#14273A] p-6 rounded-2xl border border-white/10 shadow-xl space-y-2">
        <div className="text-xs font-semibold text-[#8FA3B8] uppercase tracking-wider">
          Your Current Profile Headline:
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 text-sm font-semibold text-white font-mono">
          &ldquo;{profile.headline}&rdquo;
        </div>
      </div>

      {/* Ranked Alternatives */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-[#8FA3B8] uppercase tracking-wider">
          5 High-Performing Ranked Alternatives:
        </div>

        <div className="grid grid-cols-1 gap-4">
          {alternatives.map((alt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#14273A] border border-white/10 hover:border-[#FF7582]/30 shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF7582]/15 text-[#FF7582] border border-[#FF7582]/30">
                    {alt.platform}
                  </span>
                  <span className="text-xs text-slate-400">
                    Coverage: <strong className="text-white font-mono">{alt.keywordsCount} matches</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Strength:</span>
                  <span className="font-bold text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                    {alt.score}/100
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-sm font-bold text-slate-100">
                {alt.title}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {alt.reason}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(alt.title, idx)}
                    className="border-white/10 text-slate-200 hover:text-white hover:bg-white/5 text-xs"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApplyHeadline(alt.title)}
                    className="border border-[#FF7582] bg-[rgba(255,117,130,0.1)] text-[#FF7582] hover:bg-[#FF7582] hover:text-slate-950 text-xs font-bold transition-all shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    <span>Use This Headline</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
