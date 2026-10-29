'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ParsedProfile, KeywordItem } from '@/types';
import { ROLE_KEYWORDS_DATA } from '@/data/keywords';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Plus, 
  Scissors, 
  FileText, 
  HelpCircle,
  X
} from 'lucide-react';

interface KeywordGapCheckerProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile) => void;
}

type KeywordGroup = 'all' | 'matched' | 'missing' | 'learning' | 'complementary' | 'clutter';

export const KeywordGapChecker: React.FC<KeywordGapCheckerProps> = ({ profile, onUpdateProfile }) => {
  const searchParams = useSearchParams();
  const groupParam = searchParams?.get('group') as KeywordGroup | null;
  const [activeGroup, setActiveGroup] = useState<KeywordGroup>(() => groupParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (groupParam && ['all', 'matched', 'missing', 'learning', 'complementary', 'clutter'].includes(groupParam)) {
      setActiveGroup(groupParam);
    }
  }, [groupParam]);

  // Skill confirmation modal state
  const [confirmSkillModal, setConfirmSkillModal] = useState<{
    isOpen: boolean;
    skillName: string;
  }>({ isOpen: false, skillName: '' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const hasTargetJd = Boolean(profile.targetJobDescription && profile.targetJobDescription.trim().length > 30);
  const roleKeywordsRaw = ROLE_KEYWORDS_DATA[profile.targetRoleId] || ROLE_KEYWORDS_DATA['backend-engineer'];
  const fullTextLower = `${profile.rawText || ''} ${(profile.skills || []).join(' ')} ${profile.headline || ''}`.toLowerCase();

  // Process keywords with classification into 5 distinct groups
  const processedKeywords = useMemo(() => {
    return roleKeywordsRaw.map(kw => {
      const regex = new RegExp(`\\b${kw.name.toLowerCase()}\\b`, 'gi');
      const matches = fullTextLower.match(regex);
      const count = matches ? matches.length : 0;

      // Group classification
      let group: 'matched' | 'missing' | 'learning' | 'complementary' | 'clutter' = 'missing';
      let statusLabel = 'Not found in your resume';

      if (kw.category === 'distractor') {
        group = 'clutter';
        statusLabel = count > 0 ? 'Present in Resume (Low Signal)' : 'Not in Resume (Safe)';
      } else if (count >= 1) {
        group = 'matched';
        statusLabel = count > 1 ? `Present (${count}x verified)` : '1 Mention (Weak)';
      } else if (kw.category === 'must-have') {
        group = 'missing';
        statusLabel = 'Not found in your resume';
      } else if (kw.category === 'high-value') {
        group = 'learning';
        statusLabel = 'Potential Learning Gap';
      } else {
        group = 'complementary';
        statusLabel = 'Optional / Complementary';
      }

      // Check if keyword is explicitly mentioned in JD
      const isMentionedInJd = hasTargetJd && profile.targetJobDescription!.toLowerCase().includes(kw.name.toLowerCase());

      return {
        ...kw,
        group,
        statusLabel,
        countInProfile: count,
        isMentionedInJd
      };
    });
  }, [roleKeywordsRaw, fullTextLower, hasTargetJd, profile.targetJobDescription]);

  // Filtered and searched list
  const filteredKeywords = useMemo(() => {
    return processedKeywords.filter(kw => {
      const matchesGroup = activeGroup === 'all' || kw.group === activeGroup;
      const matchesSearch = !searchQuery.trim() || 
        kw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kw.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [processedKeywords, activeGroup, searchQuery]);

  // Counts per group
  const groupCounts = useMemo(() => {
    return {
      all: processedKeywords.length,
      matched: processedKeywords.filter(k => k.group === 'matched').length,
      missing: processedKeywords.filter(k => k.group === 'missing').length,
      learning: processedKeywords.filter(k => k.group === 'learning').length,
      complementary: processedKeywords.filter(k => k.group === 'complementary').length,
      clutter: processedKeywords.filter(k => k.group === 'clutter').length,
    };
  }, [processedKeywords]);

  const handleOpenAddModal = (kwName: string) => {
    setConfirmSkillModal({ isOpen: true, skillName: kwName });
  };

  const handleConfirmAddSkill = () => {
    const kwName = confirmSkillModal.skillName;
    if (!profile.skills.some(s => s.toLowerCase() === kwName.toLowerCase())) {
      onUpdateProfile({
        ...profile,
        skills: [...profile.skills, kwName]
      });
      showToast(`Added verified skill "${kwName}" to profile skills.`);
    }
    setConfirmSkillModal({ isOpen: false, skillName: '' });
  };

  const handleBoostToHeadline = (kwName: string) => {
    if (!profile.headline.toLowerCase().includes(kwName.toLowerCase())) {
      const updatedHeadline = `${profile.headline} | ${kwName}`;
      onUpdateProfile({
        ...profile,
        headline: updatedHeadline
      });
      showToast(`Featured "${kwName}" in professional headline.`);
    }
  };

  const handleCutNoise = (kwName: string) => {
    onUpdateProfile({
      ...profile,
      skills: profile.skills.filter(s => !s.toLowerCase().includes(kwName.toLowerCase()))
    });
    showToast(`Removed low-signal term "${kwName}".`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Keyword &amp; Technical Skills Matrix</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Compare your resume evidence against expected technical keywords. Categorized into verified matches, missing requirements, and optional competencies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-slate-500 dark:text-slate-400">Indexed Skills:</span>
            <span className="font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
              {profile.skills.length} Extracted
            </span>
          </div>
        </div>

        {/* Guidance Context Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            {hasTargetJd ? (
              <span>
                <strong className="text-slate-900 dark:text-slate-200">Target Job Description Active: </strong>
                Findings prioritize skills explicitly cited in your provided job description for <strong>{profile.targetRole}</strong>.
              </span>
            ) : (
              <span>
                <strong className="text-slate-900 dark:text-slate-200">General Target-Role Guidance: </strong>
                Currently evaluated against standard requirements for <strong>{profile.targetRole}</strong>. You can paste a specific JD in the <a href="/job-fit" className="text-blue-600 dark:text-blue-400 underline font-medium">Job Match</a> page for opening-specific alignment.
              </span>
            )}
          </div>
        </div>

        {/* Ethical Verification Disclosure */}
        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Factual Integrity Policy:</strong> An absent keyword does not mean you lack the capability. Only add skills you can substantiate with real project or work experience during an interview.
          </span>
        </div>
      </div>

      {/* Controls: Search and Group Tabs */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, technologies, or advice..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 5 Distinct Group Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Findings', count: groupCounts.all },
            { id: 'matched', label: 'Matched by Resume', count: groupCounts.matched },
            { id: 'missing', label: 'Not Found in Resume', count: groupCounts.missing },
            { id: 'learning', label: 'Potential Learning Gaps', count: groupCounts.learning },
            { id: 'complementary', label: 'Optional / Complementary', count: groupCounts.complementary },
            { id: 'clutter', label: 'Low Signal / Clutter', count: groupCounts.clutter }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveGroup(tab.id as KeywordGroup)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                activeGroup === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-[#142236] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeGroup === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Keyword / Competency</th>
                <th className="py-3 px-4">Relevance Group</th>
                <th className="py-3 px-4">Resume Evidence</th>
                <th className="py-3 px-4">Reason It Matters</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No keywords found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((kw) => {
                  const isClutter = kw.group === 'clutter';
                  const isMatched = kw.group === 'matched';

                  return (
                    <tr key={kw.name} className="hover:bg-slate-50/70 dark:hover:bg-[#18283f] transition-colors">
                      {/* Keyword Name & JD indicator */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span>{kw.name}</span>
                          {kw.isMentionedInJd && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold font-mono">
                              In Target JD
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Group Category */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          kw.group === 'matched'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : kw.group === 'missing'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : kw.group === 'learning'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : kw.group === 'complementary'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {kw.group === 'matched' && 'Matched Evidence'}
                          {kw.group === 'missing' && 'Missing Core'}
                          {kw.group === 'learning' && 'Learning Gap'}
                          {kw.group === 'complementary' && 'Complementary'}
                          {kw.group === 'clutter' && 'Low Signal Clutter'}
                        </span>
                      </td>

                      {/* Resume Evidence Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {isMatched ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : isClutter ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                          )}
                          <span className={`font-medium ${
                            isMatched
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : isClutter
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}>
                            {kw.statusLabel}
                          </span>
                        </div>
                      </td>

                      {/* Reason It Matters */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs max-w-sm leading-relaxed">
                        {kw.recommendation}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isClutter ? (
                          <button
                            type="button"
                            onClick={() => handleCutNoise(kw.name)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold text-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            title="Remove clutter term from profile"
                          >
                            <Scissors className="w-3 h-3" />
                            <span>Prune</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {!isMatched && (
                              <button
                                type="button"
                                onClick={() => handleOpenAddModal(kw.name)}
                                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                                title="Add verified skill"
                              >
                                <Plus className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                <span>Add (If Possessed)</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleBoostToHeadline(kw.name)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold text-xs cursor-pointer inline-flex items-center gap-1 shadow-xs"
                              title="Feature in headline"
                            >
                              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span>Feature</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal: User Verification Before Adding Skill */}
      {confirmSkillModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Confirm Verified Skill
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Do you possess verified production, internship, or project experience with <strong className="text-slate-900 dark:text-slate-100 font-mono">{confirmSkillModal.skillName}</strong>?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  CareerUp strictly rejects keyword stuffing. Adding technologies you have not used risks disqualification during technical interviews.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSkillModal({ isOpen: false, skillName: '' })}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSkill}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
              >
                Yes, I Have This Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
