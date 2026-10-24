'use client';

import React, { useState } from 'react';
import { ParsedProfile, JobDescriptionMatch } from '@/types';
import { SAMPLE_JOBS_BY_ROLE, matchJobDescription } from '@/services/jd-matcher';
import { Sparkles, CheckCircle2, AlertTriangle, Briefcase, Plus, Send, Info, Check } from 'lucide-react';

interface JobDescriptionMatcherViewProps {
  profile: ParsedProfile;
  onNavigateToTab: (tabId: string) => void;
}

export const JobDescriptionMatcherView: React.FC<JobDescriptionMatcherViewProps> = ({ profile, onNavigateToTab }) => {
  const sampleJobs = SAMPLE_JOBS_BY_ROLE[profile.targetRoleId] || SAMPLE_JOBS_BY_ROLE['backend-engineer'] || [];
  
  const [activeTab, setActiveTab] = useState<'match' | 'apply-skip'>('match');
  const [customCompany, setCustomCompany] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customJdText, setCustomJdText] = useState(sampleJobs[0]?.description || '');
  const [activeMatch, setActiveMatch] = useState<JobDescriptionMatch>(() => 
    matchJobDescription(profile, sampleJobs[0]?.description || '', sampleJobs[0]?.company || 'Target Company', sampleJobs[0]?.title || 'Target Role')
  );

  const [savedJobs, setSavedJobs] = useState<JobDescriptionMatch[]>(() => {
    return sampleJobs.map(sj => matchJobDescription(profile, sj.description, sj.company, sj.title));
  });

  const handleRunMatch = () => {
    if (!customJdText.trim()) return;
    const res = matchJobDescription(profile, customJdText, customCompany || 'Custom Target Job', customTitle || profile.targetRole);
    setActiveMatch(res);

    if (!savedJobs.some(j => j.company === res.company && j.title === res.title)) {
      setSavedJobs(prev => [res, ...prev]);
    }
  };

  const handleSelectSampleJob = (sj: typeof sampleJobs[0]) => {
    setCustomCompany(sj.company);
    setCustomTitle(sj.title);
    setCustomJdText(sj.description);
    const res = matchJobDescription(profile, sj.description, sj.company, sj.title);
    setActiveMatch(res);
  };

  const applyNowJobs = savedJobs.filter(j => j.verdict === 'Apply Now');
  const applyWithTweaksJobs = savedJobs.filter(j => j.verdict === 'Apply With Tweaks');
  const improveFirstJobs = savedJobs.filter(j => j.verdict === 'Improve First');
  const skipJobs = savedJobs.filter(j => j.verdict === 'Skip');

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF7582]" />
            <span>Job Description Alignment & Requirement Gap Audit</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Compare your resume against a target job posting to identify matched criteria, missing evidence, and tailoring recommendations.
          </p>
        </div>
        <div className="flex rounded-xl bg-[#0F2233] p-1 border border-[#234566] shrink-0">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'match' ? 'bg-[#FF7582] text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            JD Matcher
          </button>
          <button
            onClick={() => setActiveTab('apply-skip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'apply-skip' ? 'bg-[#FF7582] text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Comparison Matrix
          </button>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-[#FF7582] shrink-0 mt-0.5" />
        <span>
          <strong>Indicative Alignment Notice:</strong> This audit compares technical keywords, experience seniority, and location preferences against the supplied job description text. It serves as an indicative checklist to guide resume tailoring, not a hiring guarantee or candidate ranking.
        </span>
      </div>

      {activeTab === 'match' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 5 Cols - JD Input & Sample Pills */}
          <div className="lg:col-span-5 bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sample Job Postings ({profile.targetRole}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleJobs.map((sj) => (
                  <button
                    key={sj.id}
                    onClick={() => handleSelectSampleJob(sj)}
                    className="px-2.5 py-1 rounded-lg bg-[#0F2233] hover:bg-[#725A7A] border border-[#234566] text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    {sj.company} ({sj.salaryBand})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company & Title</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="Company Name (e.g. Swiggy)"
                    className="bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Role Title (e.g. Backend Engineer)"
                    className="bg-[#0F2233] border border-[#234566] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Paste Job Description (JD):
                </label>
                <textarea
                  rows={9}
                  value={customJdText}
                  onChange={(e) => setCustomJdText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full bg-[#0F2233] border border-[#234566] rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF7582]"
                />
              </div>

              <button
                type="button"
                onClick={handleRunMatch}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-extrabold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Evaluate JD Alignment</span>
              </button>
            </div>
          </div>

          {/* Right: 7 Cols - Match Breakdown & Verdict */}
          <div className="lg:col-span-7 space-y-4">
            {/* Verdict Card */}
            <div className={`p-5 rounded-2xl border shadow-xl flex items-center justify-between gap-4 ${
              activeMatch.verdict === 'Apply Now'
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : activeMatch.verdict === 'Apply With Tweaks'
                ? 'bg-amber-950/40 border-amber-500/40'
                : activeMatch.verdict === 'Improve First'
                ? 'bg-purple-950/40 border-purple-500/40'
                : 'bg-rose-950/40 border-rose-500/40'
            }`}>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Match Readiness</span>
                <h4 className="text-xl font-black text-white mt-0.5">
                  {activeMatch.company} — <span className={
                    activeMatch.verdict === 'Apply Now' ? 'text-emerald-400' 
                    : activeMatch.verdict === 'Apply With Tweaks' ? 'text-amber-400'
                    : 'text-[#FF7582]'
                  }>{activeMatch.verdict}</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md">{activeMatch.positioningAdvice}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">Alignment Score</div>
                <div className={`text-4xl font-black ${
                  activeMatch.matchScore >= 70 ? 'text-emerald-400' : activeMatch.matchScore >= 50 ? 'text-amber-400' : 'text-[#FF7582]'
                }`}>
                  {activeMatch.matchScore}%
                </div>
              </div>
            </div>

            {/* Sub-scores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { label: 'Skill Match', score: activeMatch.subScores.skills },
                { label: 'Experience', score: activeMatch.subScores.experience },
                { label: 'Location Fit', score: activeMatch.subScores.location },
                { label: 'Salary Target', score: activeMatch.subScores.salary },
                { label: 'Education', score: activeMatch.subScores.education }
              ].map(sub => (
                <div key={sub.label} className="p-3 rounded-xl bg-[#13273A] border border-[#234566] text-center">
                  <div className="text-[10px] text-slate-400 font-semibold">{sub.label}</div>
                  <div className="text-sm font-extrabold text-white mt-1">{sub.score}%</div>
                </div>
              ))}
            </div>

            {/* Matched vs Missing Skills */}
            <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-4">
              <div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matched Requirements ({activeMatch.matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeMatch.matchedSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                      ✓ {s}
                    </span>
                  ))}
                  {activeMatch.matchedSkills.length === 0 && (
                    <span className="text-xs text-slate-400">No exact skill matches detected.</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing Evidence ({activeMatch.missingMustHaves.length})</span>
                </div>
                <div className="space-y-1.5">
                  {activeMatch.missingMustHaves.map(m => (
                    <div key={m.skill} className="flex items-center justify-between p-2 rounded-lg bg-[#0F2233] border border-[#234566] text-xs">
                      <span className="font-semibold text-rose-300">✗ {m.skill}</span>
                      <span className="text-[11px] text-slate-400">Frequent requirement for this role</span>
                    </div>
                  ))}
                  {activeMatch.missingMustHaves.length === 0 && (
                    <span className="text-xs text-emerald-400">All core JD requirements matched in resume text!</span>
                  )}
                </div>
              </div>

              {/* Best Practice Note */}
              <div className="p-3 rounded-xl bg-[#18314A] border border-[#234566] text-xs text-slate-300 flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#FF7582] flex-shrink-0" />
                <span>
                  <strong>Application Guidance:</strong> If you meet at least 60-70% of core technical requirements, consider applying with a tailored resume that emphasizes your overlapping skills and demonstrated projects.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison List Table */}
      {activeTab === 'apply-skip' && (
        <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Evaluated Target Roles Matrix ({savedJobs.length} Positions)
            </span>
            <span className="text-[11px] text-slate-400">Indicative match comparison</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Column 1: Ready to Apply */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Strong Alignment (75%+)</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">{applyNowJobs.length}</span>
              </div>
              <div className="space-y-2">
                {applyNowJobs.map(job => (
                  <div key={job.company} className="p-2.5 rounded-lg bg-[#14273A] border border-white/5 text-xs text-white">
                    <div className="font-bold">{job.company}</div>
                    <div className="text-[10px] text-slate-400">{job.title} · {job.matchScore}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Apply With Minor Tweaks */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Moderate Alignment (60-74%)</span>
                <span className="text-xs font-bold text-amber-400 font-mono">{applyWithTweaksJobs.length}</span>
              </div>
              <div className="space-y-2">
                {applyWithTweaksJobs.map(job => (
                  <div key={job.company} className="p-2.5 rounded-lg bg-[#14273A] border border-white/5 text-xs text-white">
                    <div className="font-bold">{job.company}</div>
                    <div className="text-[10px] text-slate-400">{job.title} · {job.matchScore}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Skill Gaps */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider">Skill Gap Focus (40-59%)</span>
                <span className="text-xs font-bold text-purple-400 font-mono">{improveFirstJobs.length}</span>
              </div>
              <div className="space-y-2">
                {improveFirstJobs.map(job => (
                  <div key={job.company} className="p-2.5 rounded-lg bg-[#14273A] border border-white/5 text-xs text-white">
                    <div className="font-bold">{job.company}</div>
                    <div className="text-[10px] text-slate-400">{job.title} · {job.matchScore}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Low Match */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider">Low Match (&lt;40%)</span>
                <span className="text-xs font-bold text-rose-400 font-mono">{skipJobs.length}</span>
              </div>
              <div className="space-y-2">
                {skipJobs.map(job => (
                  <div key={job.company} className="p-2.5 rounded-lg bg-[#14273A] border border-white/5 text-xs text-white">
                    <div className="font-bold">{job.company}</div>
                    <div className="text-[10px] text-slate-400">{job.title} · {job.matchScore}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
