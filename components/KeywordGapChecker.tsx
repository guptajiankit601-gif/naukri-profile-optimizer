import React, { useState } from 'react';
import { ParsedProfile, KeywordItem } from '@/types';
import { ROLE_KEYWORDS_DATA } from '@/data/keywords';
import { Plus, Scissors, Sparkles, AlertTriangle, CheckCircle2, Volume2, ShieldAlert } from 'lucide-react';

interface KeywordGapCheckerProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile) => void;
}

export const KeywordGapChecker: React.FC<KeywordGapCheckerProps> = ({ profile, onUpdateProfile }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'must-have' | 'high-value' | 'booster' | 'distractor'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const roleKeywordsRaw = ROLE_KEYWORDS_DATA[profile.targetRoleId] || ROLE_KEYWORDS_DATA['backend-engineer'];
  const fullTextLower = (profile.rawText + ' ' + profile.skills.join(' ') + ' ' + profile.headline).toLowerCase();

  // Compute keyword statuses
  const keywordsWithStatus: KeywordItem[] = roleKeywordsRaw.map(kw => {
    const regex = new RegExp(`\\b${kw.name.toLowerCase()}\\b`, 'gi');
    const matches = fullTextLower.match(regex);
    const count = matches ? matches.length : 0;

    let status: 'present' | 'weak' | 'missing' | 'noise' = 'missing';
    if (kw.category === 'distractor') {
      status = count > 0 ? 'noise' : 'missing';
    } else {
      if (count >= 2) status = 'present';
      else if (count === 1) status = 'weak';
      else status = 'missing';
    }

    return {
      ...kw,
      countInProfile: count,
      status
    };
  });

  const filtered = filterCategory === 'all' 
    ? keywordsWithStatus 
    : keywordsWithStatus.filter(k => k.category === filterCategory);

  const skillCount = profile.skills.length;
  const isSkillCountCluttered = skillCount > 25;

  const handleAddKeyword = (kwName: string) => {
    if (!profile.skills.some(s => s.toLowerCase() === kwName.toLowerCase())) {
      onUpdateProfile({
        ...profile,
        skills: [...profile.skills, kwName]
      });
      showToast(`+ Added "${kwName}" to your skills! Score improved.`);
    }
  };

  const handleBoostToHeadline = (kwName: string) => {
    if (!profile.headline.toLowerCase().includes(kwName.toLowerCase())) {
      const updatedHeadline = `${profile.headline} | ${kwName}`;
      onUpdateProfile({
        ...profile,
        headline: updatedHeadline
      });
      showToast(`⚡ Boosted "${kwName}" into headline! Recruiter visibility maximized.`);
    }
  };

  const handleCutNoise = (kwName: string) => {
    onUpdateProfile({
      ...profile,
      skills: profile.skills.filter(s => !s.toLowerCase().includes(kwName.toLowerCase()))
    });
    showToast(`✂ Cut noise keyword "${kwName}". Visual scan clarity improved.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF7582]" />
              <span>Naukri & ATS Recruiter Keyword Gap Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Indian recruiters filter candidates by exact-match search volume. Having 2+ mentions moves your profile into top search results.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total Skills:</span>
            <span className={`font-bold px-2.5 py-1 rounded-lg ${isSkillCountCluttered ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {skillCount} Listed
            </span>
          </div>
        </div>

        {/* Skill Count Warning */}
        {isSkillCountCluttered && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white">Skill Overload Warning: </strong>
              You list {skillCount} skills. Recruiters scan at most 15-20. Cut {skillCount - 18} clutter skills below to avoid looking like a generalist.
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'must-have', 'high-value', 'booster', 'distractor'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-[#FF7582] text-slate-900 border-[#FF7582] shadow'
                : 'bg-[#13273A] text-slate-300 border-[#234566] hover:border-[#725A7A]'
            }`}
          >
            {cat === 'all' ? 'All Keywords' : cat}
          </button>
        ))}
      </div>

      {/* Keywords Table */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F2233] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-[#234566]">
                <th className="py-3 px-4">Keyword</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Searches / Mo</th>
                <th className="py-3 px-4">Your Status</th>
                <th className="py-3 px-4">Recruiter Advice</th>
                <th className="py-3 px-4 text-right">Instant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#234566] text-xs">
              {filtered.map((kw) => {
                const isNoise = kw.category === 'distractor';
                const isPresent = kw.status === 'present';
                const isWeak = kw.status === 'weak';
                const isMissing = kw.status === 'missing';

                return (
                  <tr key={kw.name} className="hover:bg-[#18314A]/50 transition-colors">
                    {/* Keyword Name */}
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      {isNoise && <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{kw.name}</span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        kw.category === 'must-have'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : kw.category === 'high-value'
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : kw.category === 'booster'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {kw.category}
                      </span>
                    </td>

                    {/* Monthly Searches */}
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {kw.monthlySearches.toLocaleString('en-IN')} /mo
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {isPresent && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present ({kw.countInProfile}x)</span>
                        </span>
                      )}
                      {isWeak && (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Weak (1x only)</span>
                        </span>
                      )}
                      {isMissing && !isNoise && (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span>Missing (0x)</span>
                        </span>
                      )}
                      {isNoise && (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Noise / Clutter</span>
                        </span>
                      )}
                    </td>

                    {/* Recruiter Advice */}
                    <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs leading-relaxed">
                      {kw.recommendation}
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      {isNoise ? (
                        <button
                          onClick={() => handleCutNoise(kw.name)}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-[10px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Scissors className="w-3 h-3" />
                          <span>Cut</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleAddKeyword(kw.name)}
                            className="px-2.5 py-1 rounded-lg bg-[#18314A] hover:bg-[#725A7A] border border-[#234566] text-slate-200 font-bold text-[10px] cursor-pointer inline-flex items-center gap-1"
                            title="Add to Skills section"
                          >
                            <Plus className="w-3 h-3 text-[#FF7582]" />
                            <span>Add</span>
                          </button>
                          <button
                            onClick={() => handleBoostToHeadline(kw.name)}
                            className="px-2.5 py-1 rounded-lg bg-[#FF7582]/15 hover:bg-[#FF7582]/30 border border-[#FF7582]/40 text-[#FF7582] font-bold text-[10px] cursor-pointer inline-flex items-center gap-1"
                            title="Boost into headline for maximum recruiter visibility"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Boost</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
