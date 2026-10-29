'use client';

import React, { useState } from 'react';
import { ParsedProfile } from '@/types';
import { Download, Copy, Check, Printer, FileText, CheckCircle2, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ResumeAuditReport } from './export/ResumeAuditReport';
import { calculateScore } from '@/lib/scoring';
import { generatePlatformProfiles, sanitizeCopyText, formatContactLine } from '@/lib/naukri/clean-placeholders';

interface ExportViewProps {
  profile: ParsedProfile;
}

export const ExportView: React.FC<ExportViewProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'audit'>('resume');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scoreReport = calculateScore(profile);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = (text: string, key: string) => {
    const cleanText = sanitizeCopyText(text);
    navigator.clipboard.writeText(cleanText);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast(`Copied ${key} to clipboard!`);
  };

  const handlePrintResume = () => {
    window.print();
  };

  const platformData = generatePlatformProfiles(profile);
  const coreSkills = platformData.naukri.primarySkillsCluster;
  const cloudTools = platformData.naukri.toolsCluster;
  const methodologies = platformData.naukri.architectureCluster;
  const naukriAbout = platformData.naukri.summary;
  const linkedInHeadline = platformData.linkedIn.headline;
  const linkedInAbout = platformData.linkedIn.about;
  const contactLine = formatContactLine(profile);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Export & Documentation Studio</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Choose between a machine-readable 1-column ATS resume or a full executive-ready diagnostic audit report.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-white dark:bg-[#142236] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              ATS Resume
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white dark:bg-[#142236] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Audit Report
            </button>
          </div>

          <button
            onClick={handlePrintResume}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{activeTab === 'resume' ? 'Print ATS PDF' : 'Print Audit PDF'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <ResumeAuditReport
          profile={profile}
          scoreReport={scoreReport}
          onPrint={handlePrintResume}
        />
      ) : (
        <>
          {/* ATS Readability Diagnostic Audit */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 no-print">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>ATS Parseability Diagnostic Audit</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold font-mono">
            {profile.experiences.length > 0 && profile.education.length > 0 ? 'High Extractability' : 'Moderate Extractability'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Standard Sections</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold mt-1 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>5 of 5 Delineated</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Summary, Exp, Edu, Skills, Projects</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Experience Dates</div>
            {profile.experiences.length === 0 ? (
              <>
                <div className="text-slate-700 dark:text-slate-300 font-semibold mt-1 flex items-center gap-1.5 text-xs">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>No dated experience entries</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Fresher / Project-based profile</p>
              </>
            ) : (
              <>
                <div className="text-slate-900 dark:text-slate-100 font-bold mt-1 flex items-center gap-1.5">
                  {profile.experiences.filter(e => e.startDate).length === profile.experiences.length ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span>{profile.experiences.filter(e => e.startDate).length} of {profile.experiences.length} Formatted</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Chronological tenure</p>
              </>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Extracted Skills</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold mt-1 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{profile.skills.length} Keyword Nodes</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Plain comma & bullet delimited</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Layout Safety</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold mt-1 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Single Column Text</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Zero complex tables or sidebars</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>ATS Advisory Notice:</strong> Different Applicant Tracking Systems (e.g. Workday, Greenhouse, Taleo, iCIMS, Naukri) use proprietary text parsers. While this single-column layout follows best practices for machine readability, no software can guarantee automated hiring acceptance.
          </span>
        </div>
      </div>

      {/* Grid of Copy-Ready Blocks (Naukri & LinkedIn) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        {/* Naukri Copy Blocks */}
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Naukri Profile Ready Blocks</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Exact character counts</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Naukri Resume Headline</label>
              <button
                onClick={() => copyToClipboard(profile.headline, 'Naukri Headline')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'Naukri Headline' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Naukri Headline' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
              {profile.headline}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Naukri Key Skills (3 Categories)</label>
              <button
                onClick={() => copyToClipboard(`Core: ${coreSkills}\nCloud/DB: ${cloudTools}\nPractices: ${methodologies}`, 'Naukri Skills')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'Naukri Skills' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Naukri Skills' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 font-mono">
              <div><strong className="text-slate-500 dark:text-slate-400">Core Tech:</strong> {coreSkills}</div>
              <div><strong className="text-slate-500 dark:text-slate-400">Cloud & Data:</strong> {cloudTools}</div>
              <div><strong className="text-slate-500 dark:text-slate-400">Architecture:</strong> {methodologies}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Naukri Profile Summary</label>
              <button
                onClick={() => copyToClipboard(naukriAbout, 'Naukri Summary')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'Naukri Summary' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'Naukri Summary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line">
              {naukriAbout}
            </div>
          </div>
        </div>

        {/* LinkedIn Copy Blocks */}
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">LinkedIn Profile Ready Blocks</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Algorithm optimized</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">LinkedIn Pipe-Separated Headline</label>
              <button
                onClick={() => copyToClipboard(linkedInHeadline, 'LinkedIn Headline')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'LinkedIn Headline' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'LinkedIn Headline' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
              {linkedInHeadline}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">LinkedIn About Section</label>
              <button
                onClick={() => copyToClipboard(linkedInAbout, 'LinkedIn About')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'LinkedIn About' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'LinkedIn About' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line max-h-48 overflow-y-auto">
              {linkedInAbout}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Featured Section Recommendations</div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>• Pin your top GitHub repo or architecture diagram</div>
              <div>• Attach your AWS / Vendor certification verification link</div>
              <div>• Feature a screenshot of your highest-impact production project</div>
            </div>
          </div>
        </div>
      </div>

      {/* ATS 1-Column Printable Template Preview */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-xs max-w-4xl mx-auto border border-slate-200">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-900">{profile.name}</h1>
          {contactLine && (
            <div className="text-xs font-medium text-slate-600 mt-1">
              {contactLine}
            </div>
          )}
          {profile.headline && (
            <div className="text-xs font-bold text-slate-800 mt-1 uppercase tracking-wider">
              {sanitizeCopyText(profile.headline)}
            </div>
          )}
        </div>

        {/* Summary */}
        {profile.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {sanitizeCopyText(profile.summary)}
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {profile.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Technical Competencies
            </h2>
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold">Core Technologies: </span>
              {profile.skills.join(', ')}
            </div>
          </div>
        )}

        {/* Work Experience (if present) */}
        {profile.experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {profile.experiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                    <span>{exp.title} | {exp.company}</span>
                    <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-xs text-slate-700 leading-relaxed">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Projects & Portfolio (Especially vital for Freshers) */}
        {profile.projects && profile.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Technical Projects & Portfolio
            </h2>
            <div className="space-y-3">
              {profile.projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                    <span>{proj.title}{proj.role ? ` — ${proj.role}` : ''}</span>
                    {proj.link && <span className="text-slate-500 font-normal">{proj.link}</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-700 leading-relaxed">{proj.description}</p>
                  {proj.metrics && (
                    <div className="text-[11px] text-slate-700 font-medium mt-0.5">
                      <span className="font-semibold">Impact: </span>{proj.metrics}
                    </div>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      <span className="font-semibold">Tools: </span>{proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-900">
            Education
          </h2>
          {profile.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline text-xs text-slate-900">
              <span className="font-semibold">{edu.degree} — {edu.institution}</span>
              <span className="text-slate-500">{edu.year} {edu.score && `(${edu.score})`}</span>
            </div>
          ))}
        </div>

        {/* Projects / Certifications */}
        {profile.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-1 mb-2 text-slate-900">
              Certifications & Credentials
            </h2>
            <div className="text-xs text-slate-700 space-y-0.5">
              {profile.certifications.map((cert, idx) => (
                <div key={idx}>• {cert}</div>
              ))}
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
