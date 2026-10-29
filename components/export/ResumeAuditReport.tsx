'use client';

import React, { useMemo } from 'react';
import { ParsedProfile, ScoreReport } from '@/types';
import { BRAND_CONFIG } from '@/config/brand';
import { matchJobDescription } from '@/services/jd-matcher';
import { ShieldCheck, CheckCircle2, AlertCircle, FileText, CheckSquare, Printer, Crosshair } from 'lucide-react';

interface ResumeAuditReportProps {
  profile: ParsedProfile;
  scoreReport: ScoreReport;
  onPrint?: () => void;
}

export const ResumeAuditReport: React.FC<ResumeAuditReportProps> = ({
  profile,
  scoreReport,
  onPrint
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const jobMatch = useMemo(() => {
    if (!profile.targetJobDescription || profile.targetJobDescription.trim().length < 30) {
      return null;
    }
    return matchJobDescription(profile, profile.targetJobDescription, 'Target Company', profile.targetRole);
  }, [profile]);

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden when printing) */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs no-print">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Executive Resume Audit Report</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            A comprehensive, deterministic audit summary ready for PDF printing or client review.
          </p>
        </div>
        <button
          onClick={onPrint || (() => window.print())}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Audit PDF</span>
        </button>
      </div>

      {/* The Printable Document */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-8 font-sans print:p-0 print:border-0 print:shadow-none">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">
              {BRAND_CONFIG.name} · Executive Evaluation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
              Resume Diagnostic Audit
            </h1>
            <div className="text-xs text-slate-600 mt-2 space-y-0.5">
              <div><strong className="text-slate-800">Candidate:</strong> {profile.name}</div>
              <div><strong className="text-slate-800">Target Role:</strong> {profile.targetRole} ({profile.experienceBand})</div>
              <div><strong className="text-slate-800">Date of Audit:</strong> {currentDate}</div>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="inline-block p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Overall Score</div>
              <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
                {scoreReport.overallScore}<span className="text-sm font-semibold text-slate-500">/100</span>
              </div>
              <div className="text-xs font-bold text-blue-700 mt-1 uppercase tracking-wide">
                {scoreReport.verdict}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Overview */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>1. Executive Summary & Scoring Overview</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            This resume was evaluated using CareerUp&apos;s deterministic 10-factor rubrics configured for Indian market hiring standards and Applicant Tracking Systems. The candidate earned an overall score of <strong>{scoreReport.overallScore}/100</strong>, reflecting {scoreReport.overallScore >= 75 ? 'strong alignment with the target profile' : 'significant opportunity for positioning and keyword improvements'}.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Criteria Evaluated</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">10 Factors</div>
              <div className="text-[10px] text-slate-500 mt-0.5">100 Max Points</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Potential Score Gain</div>
              <div className="text-base font-bold text-blue-700 font-mono mt-0.5">+{scoreReport.headroomTotal || (100 - scoreReport.overallScore)} Pts</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Fixable gaps</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Candidate Tier</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {scoreReport.isFresher ? 'Fresher (Project Focus)' : 'Experienced Track'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Weighted rubric</div>
            </div>
          </div>
        </div>

        {/* Section 2: 10-Criteria Evaluation Matrix */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>2. 10-Criteria Evaluation Matrix</span>
          </h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <th className="p-2.5 font-bold">Evaluation Criterion</th>
                  <th className="p-2.5 font-bold text-center">Weight</th>
                  <th className="p-2.5 font-bold text-center">Score</th>
                  <th className="p-2.5 font-bold">Status & Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {scoreReport.components.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900">
                      {c.name}
                    </td>
                    <td className="p-2.5 text-center text-slate-500 font-mono">
                      {c.weight}%
                    </td>
                    <td className="p-2.5 text-center font-bold font-mono text-slate-900">
                      {c.score}/{c.max}
                    </td>
                    <td className="p-2.5 text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium mb-0.5">
                        {c.score >= c.max * 0.8 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Strong
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Needs Attention
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600">{c.issue}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Verified Strengths */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>3. Verified Strengths & Assets</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">Technical Keyword Inventory</div>
              <p className="text-slate-600">
                {profile.skills.length} skills indexed, including {profile.skills.slice(0, 5).join(', ')}.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">Tenure & Chronological History</div>
              <p className="text-slate-600">
                {profile.experiences.length} positions documented with clear organizational titles.
              </p>
            </div>
          </div>
        </div>

        {/* Optional Section: Target Job Description Alignment */}
        {jobMatch && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-teal-600" />
                <span>Target Job Description Alignment</span>
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {jobMatch.matchScore}% Match
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Matched JD Requirements ({jobMatch.matchedSkills.length})</div>
                <p className="text-slate-600 text-[11px]">
                  {jobMatch.matchedSkills.length > 0 ? jobMatch.matchedSkills.join(', ') : 'No exact overlap'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">Missing Keywords ({jobMatch.missingMustHaves.length})</div>
                <p className="text-slate-600 text-[11px]">
                  {jobMatch.missingMustHaves.length > 0 ? jobMatch.missingMustHaves.map(m => m.skill).join(', ') : 'Zero high-priority missing terms'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Action Checklist */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>4. Priority Fixes & Implementation Checklist</span>
          </h2>
          <div className="space-y-2">
            {scoreReport.topFixes.map((fix, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-slate-300 text-blue-600 shrink-0 pointer-events-none"
                  readOnly
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{fix.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                      +{fix.points} Pts
                    </span>
                  </div>
                  {fix.description && (
                    <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
                      {fix.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
          <div>Report generated by {BRAND_CONFIG.name} — {BRAND_CONFIG.descriptor}.</div>
          <div>All scoring is computed locally using deterministic rubrics. Compliant with India DPDP Act 2023.</div>
        </div>
      </div>
    </div>
  );
};
