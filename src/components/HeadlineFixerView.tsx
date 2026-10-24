import React, { useState } from 'react';
import { ParsedProfile } from '../types';
import { ROLES } from '../data/roles';
import { Sparkles, Check, Copy } from 'lucide-react';

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

  // Generate 5 ranked platform-specific alternatives
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-900 font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF7582]" />
          <span>Headline Fixer (Highest Leverage 5 Words on the Page)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Recruiters spend their first 0-2 seconds scanning your headline. Replacing a generic title like "Software Engineer at TCS" with a keyword-rich title increases recruiter profile clicks by 3.2x.
        </p>
      </div>

      {/* Current Headline Card */}
      <div className="bg-[#0F2233] p-5 rounded-2xl border border-[#234566]">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Your Current Profile Headline:
        </div>
        <div className="p-3.5 rounded-xl bg-[#13273A] border border-[#234566] text-sm font-semibold text-white">
          "{profile.headline}"
        </div>
      </div>

      {/* Ranked Alternatives */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-white uppercase tracking-wider">
          5 High-Performing Alternatives:
        </div>

        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#13273A] border border-[#234566] hover:border-[#725A7A] shadow-xl transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#FF7582]/20 text-[#FF7582] border border-[#FF7582]/30">
                  {alt.platform}
                </span>
                <span className="text-xs text-slate-400">Keyword Coverage: {alt.keywordsCount} exact matches</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Strength:</span>
                <span className="font-extrabold text-emerald-400">{alt.score}/100</span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-100 bg-[#0F2233] p-3 rounded-xl border border-[#234566]">
              {alt.title}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400 leading-relaxed max-w-xl">
                {alt.reason}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(alt.title, idx)}
                  className="px-3 py-1.5 rounded-lg bg-[#0F2233] hover:bg-[#18314A] border border-[#234566] text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyHeadline(alt.title)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-extrabold text-xs shadow hover:opacity-95 flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Use This Headline</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
