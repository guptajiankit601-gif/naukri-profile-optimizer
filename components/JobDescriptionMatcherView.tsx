'use client';

import React, { useState, useEffect } from 'react';
import { ParsedProfile, JobDescriptionMatch } from '@/types';
import { SAMPLE_JOBS_BY_ROLE, matchJobDescription } from '@/services/jd-matcher';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Info, 
  BookOpen, 
  Plus, 
  FileEdit, 
  Check, 
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface JobDescriptionMatcherViewProps {
  profile: ParsedProfile;
  onNavigateToTab: (tabId: string, param?: string) => void;
  onUpdateProfile?: (updated: ParsedProfile, changeReason?: string) => void;
}

export const JobDescriptionMatcherView: React.FC<JobDescriptionMatcherViewProps> = ({ 
  profile, 
  onNavigateToTab,
  onUpdateProfile 
}) => {
  const sampleJobs = SAMPLE_JOBS_BY_ROLE[profile.targetRoleId] || SAMPLE_JOBS_BY_ROLE['backend-engineer'] || [];
  
  const [activeTab, setActiveTab] = useState<'match' | 'apply-skip'>('match');
  const [customCompany, setCustomCompany] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customJdText, setCustomJdText] = useState(profile.targetJobDescription || sampleJobs[0]?.description || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal state for confirming addition of verified skill
  const [confirmSkillModal, setConfirmSkillModal] = useState<{
    isOpen: boolean;
    skill: string;
  }>({ isOpen: false, skill: '' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [activeMatch, setActiveMatch] = useState<JobDescriptionMatch>(() => 
    matchJobDescription(
      profile, 
      profile.targetJobDescription || sampleJobs[0]?.description || '', 
      sampleJobs[0]?.company || 'Target Company', 
      sampleJobs[0]?.title || profile.targetRole
    )
  );

  const [savedJobs, setSavedJobs] = useState<JobDescriptionMatch[]>(() => {
    return sampleJobs.map(sj => matchJobDescription(profile, sj.description, sj.company, sj.title));
  });

  // Re-run match whenever profile changes (e.g. after adding a verified skill or rewriting a bullet)
  useEffect(() => {
    const res = matchJobDescription(
      profile, 
      customJdText || sampleJobs[0]?.description || '', 
      customCompany || sampleJobs[0]?.company || 'Target Company', 
      customTitle || profile.targetRole
    );
    setActiveMatch(res);
    setSavedJobs(sampleJobs.map(sj => matchJobDescription(profile, sj.description, sj.company, sj.title)));
  }, [profile, customJdText, customCompany, customTitle, sampleJobs]);

  const handleRunMatch = () => {
    if (!customJdText.trim()) return;
    const res = matchJobDescription(profile, customJdText, customCompany || 'Custom Target Job', customTitle || profile.targetRole);
    setActiveMatch(res);

    if (!savedJobs.some(j => j.company === res.company && j.title === res.title)) {
      setSavedJobs(prev => [res, ...prev]);
    }
  };

  const handleSelectSampleJob = (sj: { company: string; title: string; description: string }) => {
    setCustomCompany(sj.company);
    setCustomTitle(sj.title);
    setCustomJdText(sj.description);
    const res = matchJobDescription(profile, sj.description, sj.company, sj.title);
    setActiveMatch(res);
  };

  const handleSelectJobMatch = (job: JobDescriptionMatch) => {
    const foundSample = sampleJobs.find(sj => sj.company === job.company);
    setCustomCompany(job.company);
    setCustomTitle(job.title);
    if (foundSample) {
      setCustomJdText(foundSample.description);
    }
    setActiveMatch(job);
    setActiveTab('match');
  };

  const handleConfirmAddSkill = () => {
    const skillToAdd = confirmSkillModal.skill;
    if (!skillToAdd) return;

    if (!profile.skills.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      const updated: ParsedProfile = {
        ...profile,
        skills: [...profile.skills, skillToAdd]
      };
      if (onUpdateProfile) {
        onUpdateProfile(updated, `Added Verified Skill: ${skillToAdd}`);
      }
      showToast(`Added ${skillToAdd} to profile! Recalculated JD alignment.`);
    } else {
      showToast(`${skillToAdd} is already present in your skills inventory.`);
    }

    setConfirmSkillModal({ isOpen: false, skill: '' });
  };

  const applyNowJobs = savedJobs.filter(j => j.verdict === 'Apply Now');
  const applyWithTweaksJobs = savedJobs.filter(j => j.verdict === 'Apply With Tweaks');
  const improveFirstJobs = savedJobs.filter(j => j.verdict === 'Improve First');
  const skipJobs = savedJobs.filter(j => j.verdict === 'Skip');

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
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Job Description Match & Requirement Gap Audit</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Compare your resume against a target job posting to identify matched criteria, missing resume evidence, and genuine learning gaps.
          </p>
        </div>
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'match' 
                ? 'bg-white dark:bg-[#142236] text-slate-900 dark:text-slate-100 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            JD Matcher
          </button>
          <button
            onClick={() => setActiveTab('apply-skip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'apply-skip' 
                ? 'bg-white dark:bg-[#142236] text-slate-900 dark:text-slate-100 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Comparison Matrix
          </button>
        </div>
      </div>

      {/* Important Transparency Notice */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong>Fair Evaluation Principle:</strong> A skill identified as <em>&quot;Missing from Resume&quot;</em> means the keyword was not detected in your resume text — it does <strong>not</strong> prove you lack the competency. Review each finding and incorporate verified evidence where you have hands-on experience.
        </span>
      </div>

      {/* Main Matcher Tab */}
      {activeTab === 'match' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 5 Cols - JD Input & Sample Roles */}
          <div className="lg:col-span-5 bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Role & Description
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {customJdText.length} chars
              </span>
            </div>

            {/* Quick Sample Selector */}
            {sampleJobs.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Pre-configured Benchmark JDs:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {sampleJobs.map((sj, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSampleJob(sj)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        customCompany === sj.company
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-800 dark:text-blue-200 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {sj.company} ({sj.title.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Company</label>
                <input
                  type="text"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="Target Company"
                  className="w-full mt-1 bg-slate-50 dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Job Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={profile.targetRole}
                  className="w-full mt-1 bg-slate-50 dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Job Description Text (Requirements, Responsibilities, Tech Stack):
              </label>
              <textarea
                rows={9}
                value={customJdText}
                onChange={(e) => setCustomJdText(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full mt-1 bg-slate-50 dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Evaluates 5 sub-criteria</span>
              <button
                type="button"
                onClick={handleRunMatch}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Re-Analyze Match</span>
              </button>
            </div>
          </div>

          {/* Right: 7 Cols - Match Breakdown & 3-Category Requirements */}
          <div className="lg:col-span-7 space-y-4">
            {/* Verdict Card */}
            <div className={`p-5 rounded-2xl border shadow-xs flex items-center justify-between gap-4 ${
              activeMatch.verdict === 'Apply Now'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                : activeMatch.verdict === 'Apply With Tweaks'
                ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                : activeMatch.verdict === 'Improve First'
                ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50'
                : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Match Assessment</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeMatch.company} — <span className={
                    activeMatch.verdict === 'Apply Now' ? 'text-emerald-700 dark:text-emerald-400' 
                    : activeMatch.verdict === 'Apply With Tweaks' ? 'text-amber-700 dark:text-amber-400'
                    : 'text-rose-700 dark:text-rose-400'
                  }>{activeMatch.verdict}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md">{activeMatch.positioningAdvice}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Alignment Score</div>
                <div className={`text-4xl font-extrabold font-mono ${
                  activeMatch.matchScore >= 70 ? 'text-emerald-700 dark:text-emerald-400' : activeMatch.matchScore >= 50 ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'
                }`}>
                  {activeMatch.matchScore}%
                </div>
              </div>
            </div>

            {/* Sub-scores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { label: 'Skills Match', score: activeMatch.subScores.skills },
                { label: 'Experience', score: activeMatch.subScores.experience },
                { label: 'Location Fit', score: activeMatch.subScores.location },
                { label: 'Compensation', score: activeMatch.subScores.salary },
                { label: 'Education', score: activeMatch.subScores.education }
              ].map(sub => (
                <div key={sub.label} className="p-3 rounded-xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{sub.label}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">{sub.score}%</div>
                </div>
              ))}
            </div>

            {/* 3 Structured Requirement Categories */}
            <div className="space-y-4">
              {/* Category 1: Matched Requirements */}
              <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>1. Matched Resume Evidence ({activeMatch.matchedEvidence?.length || activeMatch.matchedSkills.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Found in Resume</span>
                </div>

                <div className="space-y-2">
                  {activeMatch.matchedEvidence && activeMatch.matchedEvidence.length > 0 ? (
                    activeMatch.matchedEvidence.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-200 dark:border-emerald-900/50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300">✓ {item.skill}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {item.foundIn}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-1">
                          {item.evidence}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {activeMatch.matchedSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category 2: Missing from Resume — Actionable with Direct Improve Actions */}
              <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>2. Missing from Resume — Tailoring Opportunity ({activeMatch.missingFromResume?.length || 0})</span>
                  </div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">Actionable Fixes</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  These keywords are in the JD and closely relate to your stack, but are missing from your text. If you have practical experience, add them to your profile or draft a bullet:
                </p>

                <div className="space-y-2.5">
                  {activeMatch.missingFromResume && activeMatch.missingFromResume.length > 0 ? (
                    activeMatch.missingFromResume.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900/50 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 dark:text-amber-300 text-sm">{item.skill}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {item.context}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          👉 <strong>Tailoring Advice:</strong> {item.recommendation}
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => onNavigateToTab('rewriter', item.skill)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <FileEdit className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span>Draft Bullet in Rewriter</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmSkillModal({ isOpen: true, skill: item.skill })}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Verified Skill</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">No adjacent tailoring gaps detected.</span>
                  )}
                </div>
              </div>

              {/* Category 3: Potential Learning Gaps */}
              <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-purple-800 dark:text-purple-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>3. Potential Learning Gaps ({activeMatch.learningGaps?.length || 0})</span>
                  </div>
                  <span className="text-[10px] text-purple-700 dark:text-purple-400 font-mono">Upskill Guidance</span>
                </div>

                <div className="space-y-2">
                  {activeMatch.learningGaps && activeMatch.learningGaps.length > 0 ? (
                    activeMatch.learningGaps.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-purple-200 dark:border-purple-900/50 text-xs flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-purple-900 dark:text-purple-300">{item.skill}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">{item.reason}</div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                          item.difficulty === 'Core Prerequisite'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : item.difficulty === 'Quick Add'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {item.difficulty}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-700 dark:text-emerald-400">No major domain learning gaps identified.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison List Table (Clicking any role inspects it) */}
      {activeTab === 'apply-skip' && (
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Evaluated Target Roles Matrix ({savedJobs.length} Positions)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Click any card to inspect in JD Matcher</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Column 1: Ready to Apply */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Strong Alignment (75%+)</span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">{applyNowJobs.length}</span>
              </div>
              <div className="space-y-2">
                {applyNowJobs.map(job => (
                  <button
                    key={job.company}
                    onClick={() => handleSelectJobMatch(job)}
                    className="w-full text-left p-2.5 rounded-lg bg-white dark:bg-[#142236] hover:bg-emerald-50/80 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-900 dark:text-slate-100 shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{job.company}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{job.title} · {job.matchScore}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Apply With Minor Tweaks */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Moderate (60-74%)</span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 font-mono">{applyWithTweaksJobs.length}</span>
              </div>
              <div className="space-y-2">
                {applyWithTweaksJobs.map(job => (
                  <button
                    key={job.company}
                    onClick={() => handleSelectJobMatch(job)}
                    className="w-full text-left p-2.5 rounded-lg bg-white dark:bg-[#142236] hover:bg-amber-50/80 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-slate-900 dark:text-slate-100 shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{job.company}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{job.title} · {job.matchScore}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Skill Gaps */}
            <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">Skill Gap (40-59%)</span>
                <span className="text-xs font-bold text-purple-800 dark:text-purple-300 font-mono">{improveFirstJobs.length}</span>
              </div>
              <div className="space-y-2">
                {improveFirstJobs.map(job => (
                  <button
                    key={job.company}
                    onClick={() => handleSelectJobMatch(job)}
                    className="w-full text-left p-2.5 rounded-lg bg-white dark:bg-[#142236] hover:bg-purple-50/80 dark:hover:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs text-slate-900 dark:text-slate-100 shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{job.company}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{job.title} · {job.matchScore}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 4: Low Fit */}
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">Low Match (&lt;40%)</span>
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 font-mono">{skipJobs.length}</span>
              </div>
              <div className="space-y-2">
                {skipJobs.map(job => (
                  <button
                    key={job.company}
                    onClick={() => handleSelectJobMatch(job)}
                    className="w-full text-left p-2.5 rounded-lg bg-white dark:bg-[#142236] hover:bg-rose-50/80 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-slate-900 dark:text-slate-100 shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{job.company}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{job.title} · {job.matchScore}%</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Adding Verified Skill */}
      {confirmSkillModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Add Verified Skill
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Factual verification check
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmSkillModal({ isOpen: false, skill: '' })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Do you have practical, hands-on experience with <strong className="text-slate-900 dark:text-slate-100 underline decoration-emerald-500 underline-offset-2">{confirmSkillModal.skill}</strong>?
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              Adding this keyword will update your profile skills inventory and immediately recalculate your match score against this job description.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmSkillModal({ isOpen: false, skill: '' })}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSkill}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Confirm &amp; Add Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
