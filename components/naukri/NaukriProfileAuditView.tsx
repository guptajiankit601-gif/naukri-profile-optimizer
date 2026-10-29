'use client';

import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { ROLES } from '@/lib/data/roles';
import { 
  Type, 
  Sparkles, 
  Copy, 
  Check, 
  CheckCircle2, 
  Edit3, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  Briefcase, 
  Code2, 
  GraduationCap, 
  Award,
  Layers,
  MapPin,
  IndianRupee,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { generatePlatformProfiles, sanitizeCopyText, getSafeLocation } from '@/lib/naukri/clean-placeholders';

interface NaukriProfileAuditViewProps {
  profile: ParsedProfile;
  onUpdateProfile: (updated: ParsedProfile, reason?: string) => void;
}

export const NaukriProfileAuditView: React.FC<NaukriProfileAuditViewProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempHeadline, setTempHeadline] = useState(sanitizeCopyText(profile.headline || ''));
  const [tempSummary, setTempSummary] = useState(sanitizeCopyText(profile.summary || ''));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopy = (text: string, key: string) => {
    const cleanText = sanitizeCopyText(text);
    navigator.clipboard.writeText(cleanText);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast(`Copied ${key} to clipboard!`);
  };

  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const platformData = generatePlatformProfiles(profile);

  const primarySkillsText = platformData.naukri.primarySkillsCluster;
  const toolSkillsText = platformData.naukri.toolsCluster;
  const architectureSkillsText = platformData.naukri.architectureCluster;
  const safeLoc = getSafeLocation(profile);

  // Headline alternatives with zero unresolved placeholders
  const topCompany = profile.experiences?.[0]?.company;
  const headlineAlternatives = [
    {
      label: 'Naukri Standard Search Optimized',
      text: sanitizeCopyText(`${roleConfig.name} | ${(profile.skills || []).slice(0, 3).join(' & ') || 'Full Stack & APIs'} | ${profile.experienceBand} Yrs Exp`),
      reason: 'Balances role title, top 3 skill tags, and experience band for search queries.'
    },
    {
      label: 'High-Impact Scale & Location',
      text: sanitizeCopyText(
        safeLoc
          ? `${roleConfig.name} | ${roleConfig.topSearchKeywords.slice(0, 2).join(' & ')} | Distributed Systems | ${safeLoc}`
          : `${roleConfig.name} | ${roleConfig.topSearchKeywords.slice(0, 2).join(' & ')} | Distributed Systems`
      ),
      reason: 'Matches recruiter filter queries for specific metro hubs and architectural keywords.'
    },
    {
      label: 'Enterprise / Brand Formula',
      text: sanitizeCopyText(
        topCompany
          ? `${roleConfig.name} @ ${topCompany} | ${(profile.skills || []).slice(0, 2).join(', ')} | Scalable Architecture`
          : `${roleConfig.name} | ${(profile.skills || []).slice(0, 2).join(', ')} | Scalable Architecture`
      ),
      reason: 'Ideal for leveraging current brand reputation and key tech competencies.'
    }
  ];

  // Naukri Profile Summary formulation
  const naukriSummaryText = platformData.naukri.summary;

  // Save headline
  const handleSaveHeadline = () => {
    onUpdateProfile({ ...profile, headline: tempHeadline }, 'Updated Naukri Headline');
    setEditingField(null);
    showToast('Saved headline to active profile!');
  };

  // Save summary
  const handleSaveSummary = () => {
    onUpdateProfile({ ...profile, summary: tempSummary }, 'Updated Profile Summary');
    setEditingField(null);
    showToast('Saved summary to active profile!');
  };

  // Apply one of the alternative headlines
  const handleApplyAlternativeHeadline = (newHeadline: string) => {
    setTempHeadline(newHeadline);
    onUpdateProfile({ ...profile, headline: newHeadline }, 'Applied Recommended Headline');
    showToast('Applied recommended headline to your profile!');
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
      <div className="bg-white dark:bg-[#142236] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Naukri Profile Audit & Copy Studio</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Optimize your Naukri profile sections for recruiter search visibility. Copy verified, character-counted blocks directly into your portal profile.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shrink-0 font-medium">
            <span>Target Role: <strong>{roleConfig.name}</strong></span>
          </div>
        </div>

        {/* Ethical Non-Scraping / Account Privacy Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold">Privacy & Platform Policy:</span>
            <p className="text-[11px] text-blue-800 dark:text-blue-300/90 leading-relaxed">
              CareerUp does not require, store, or scrape your private Naukri account credentials. All optimizations are calculated locally in your browser so you can copy and paste verified blocks safely into your Naukri dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Resume Headline (250 chars max) */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              1. Resume Headline (Naukri Search String)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
              (profile.headline?.length || 0) <= 250
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}>
              {profile.headline?.length || 0} / 250 characters
            </span>
            <button
              onClick={() => {
                if (editingField === 'headline') {
                  setEditingField(null);
                } else {
                  setTempHeadline(profile.headline || '');
                  setEditingField('headline');
                }
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingField === 'headline' ? 'Cancel' : 'Edit Headline'}</span>
            </button>
          </div>
        </div>

        {editingField === 'headline' ? (
          <div className="space-y-3">
            <textarea
              rows={2}
              value={tempHeadline}
              onChange={(e) => setTempHeadline(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-blue-600 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              placeholder="Enter your Naukri resume headline..."
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Formula: Target Role | Core Tech 1 & 2 | Years Experience | Domain / Scale
              </span>
              <button
                onClick={handleSaveHeadline}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Save & Apply to Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              {profile.headline || 'No headline set yet'}
            </p>
            <button
              onClick={() => handleCopy(profile.headline || '', 'Headline')}
              className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              {copiedKey === 'Headline' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedKey === 'Headline' ? 'Copied' : 'Copy Headline'}</span>
            </button>
          </div>
        )}

        {/* 3 Ranked Alternative Formulations */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Search-Ranked Headline Formulas:
          </span>
          <div className="space-y-2">
            {headlineAlternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{alt.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({alt.text.length} chars)</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{alt.text}</p>
                  <p className="text-[11px] text-slate-500">💡 {alt.reason}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopy(alt.text, alt.label)}
                    className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === alt.label ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === alt.label ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleApplyAlternativeHeadline(alt.text)}
                    className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: 3-Category Key Skills */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              2. Key Skills Tags (3 Separate Categories for Naukri)
            </span>
          </div>
          <span className="text-xs text-slate-500">Naukri indexes up to 25 primary tags</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Naukri recruiters filter candidates by comma-separated skill clusters. Copy each cluster into the corresponding skills field in Naukri.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category 1: Primary Core */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Category A: Core Tech</span>
              <button
                onClick={() => handleCopy(primarySkillsText, 'Core Skills')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                {copiedKey === 'Core Skills' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Core Skills' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {primarySkillsText}
            </p>
            <span className="text-[10px] text-slate-400 block">Primary search filters</span>
          </div>

          {/* Category 2: Tools & Infrastructure */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Category B: Cloud & DB</span>
              <button
                onClick={() => handleCopy(toolSkillsText, 'Cloud Tools')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                {copiedKey === 'Cloud Tools' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Cloud Tools' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {toolSkillsText}
            </p>
            <span className="text-[10px] text-slate-400 block">Secondary filters & infrastructure</span>
          </div>

          {/* Category 3: Architecture & Methodologies */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Category C: Practices</span>
              <button
                onClick={() => handleCopy(architectureSkillsText, 'Architecture Practices')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                {copiedKey === 'Architecture Practices' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Architecture Practices' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {architectureSkillsText}
            </p>
            <span className="text-[10px] text-slate-400 block">Engineering seniority keywords</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Profile Summary (Formatted for Recruiter Glance) */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              3. Profile Summary (10-Second Recruiter Pitch)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (editingField === 'summary') {
                  setEditingField(null);
                } else {
                  setTempSummary(profile.summary || '');
                  setEditingField('summary');
                }
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingField === 'summary' ? 'Cancel' : 'Edit Summary'}</span>
            </button>
            <button
              onClick={() => handleCopy(naukriSummaryText, 'Naukri Summary')}
              className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copiedKey === 'Naukri Summary' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedKey === 'Naukri Summary' ? 'Copied' : 'Copy Formatted Summary'}</span>
            </button>
          </div>
        </div>

        {editingField === 'summary' ? (
          <div className="space-y-3">
            <textarea
              rows={5}
              value={tempSummary}
              onChange={(e) => setTempSummary(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-blue-600 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveSummary}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Save Summary
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 whitespace-pre-line text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            {naukriSummaryText}
          </div>
        )}
      </div>

      {/* SECTION 4: Employment & Experience Details */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              4. Employment History (Naukri Work Experience Format)
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">{profile.experiences.length} Positions Logged</span>
        </div>

        <div className="space-y-3">
          {profile.experiences.map((exp, idx) => {
            const expCopyText = `${exp.title} | ${exp.company} (${exp.startDate} - ${exp.endDate})\n\nKey Deliverables:\n${exp.bullets.map(b => `• ${b}`).join('\n')}`;
            return (
              <div
                key={exp.id || idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {exp.title} <span className="font-normal text-slate-500">at</span> {exp.company}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(expCopyText, `Exp-${idx}`)}
                    className="self-start sm:self-auto px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    {copiedKey === `Exp-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === `Exp-${idx}` ? 'Copied' : 'Copy Entry'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  {exp.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: Academic & Personal Projects */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              5. Projects (Academic / Personal / Enterprise)
            </span>
          </div>
          <span className="text-xs text-slate-500">{profile.projects.length} Documented</span>
        </div>

        {profile.projects.length === 0 ? (
          <div className="p-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
            No independent projects extracted. For Freshers and tech candidates, adding 2 projects (with GitHub repository or live URL links) provides strong proof of work.
          </div>
        ) : (
          <div className="space-y-3">
            {profile.projects.map((proj, pIdx) => {
              const projCopyText = `${proj.title}\nTech: ${proj.technologies?.join(', ')}\n${proj.description}\nLink: ${proj.link || 'Internal/GitHub'}`;
              return (
                <div
                  key={proj.id || pIdx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{proj.title}</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(projCopyText, `Proj-${pIdx}`)}
                    className="self-start px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
                  >
                    {copiedKey === `Proj-${pIdx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === `Proj-${pIdx}` ? 'Copied' : 'Copy Project'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 6: Career Preferences Alignment (Portal Filters) */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              6. Career Preferences & Search Filter Parameters
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Recruiter Search Alignment</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Target Role Title</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">{profile.targetRole || roleConfig.name}</p>
            <span className="text-[11px] text-slate-500">Functional Area: IT Software</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Preferred Locations</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {profile.targetCities?.length > 0 ? profile.targetCities.join(', ') : profile.location}
            </p>
            <span className="text-[11px] text-slate-500">Top Indian Tech Hubs</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Target CTC Band</span>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              ₹{profile.expectedSalaryLakhs || 16} LPA
            </p>
            <span className="text-[11px] text-slate-500">Typical: ₹{roleConfig.typicalSalaryLakhs?.min} - ₹{roleConfig.typicalSalaryLakhs?.top} LPA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
