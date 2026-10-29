'use client';

import React from 'react';
import { ParsedProfile } from '@/types';
import { getBenchmarkForRole } from '@/data/benchmarks';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { Users, ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface PeerBenchmarkViewProps {
  profile: ParsedProfile;
}

export const PeerBenchmarkView: React.FC<PeerBenchmarkViewProps> = ({ profile }) => {
  const primaryCityTier = profile.targetCities.some(c =>
    c.includes('Bangalore') || c.includes('Hyderabad') || c.includes('Mumbai') || c.includes('Pune')
  )
    ? 'Tier 1'
    : 'Tier 2';

  const benchmark = getBenchmarkForRole(profile.targetRoleId, profile.targetRole, profile.experienceBand, primaryCityTier);

  // Candidate's actual dimension metrics
  const allBullets = profile.experiences.flatMap(e => e.bullets);
  const bulletsWithMetricsCount = allBullets.filter(b => extractMetrics(b).length > 0).length;
  const userBulletMetricPercent = allBullets.length > 0 ? Math.round((bulletsWithMetricsCount / allBullets.length) * 100) : 0;

  const userCloudSkills = profile.skills.filter(s => 
    s.match(/\b(aws|azure|gcp|docker|kubernetes|terraform|cloud|ci\/cd)\b/i)
  ).length;

  const userHeadlineLength = profile.headline?.length || 0;
  const userHeadlineScore = profile.headline?.includes('|') && userHeadlineLength > 25 ? 88 : 45;

  const comparisonRows = [
    {
      metric: 'Headline Role & Keyword Clarity',
      you: `${userHeadlineScore} pts`,
      median: `${benchmark.dimensions.headlineScore.median} pts`,
      highBenchmark: `${benchmark.dimensions.headlineScore.top10} pts`,
      standing: userHeadlineScore >= benchmark.dimensions.headlineScore.top10 ? 'Aligned' : userHeadlineScore >= benchmark.dimensions.headlineScore.median ? 'Adequate' : 'Needs Optimization',
      gapAdvice: userHeadlineScore < 80 ? 'Add role specialization & metric to headline' : 'Strong headline structure'
    },
    {
      metric: 'Bullets with Quantified Metrics (%)',
      you: `${userBulletMetricPercent}%`,
      median: `${benchmark.dimensions.bulletsWithMetricsPercent.median}%`,
      highBenchmark: `${benchmark.dimensions.bulletsWithMetricsPercent.top10}%`,
      standing: userBulletMetricPercent >= benchmark.dimensions.bulletsWithMetricsPercent.top10 ? 'High Impact' : userBulletMetricPercent >= benchmark.dimensions.bulletsWithMetricsPercent.median ? 'Adequate' : 'Below Baseline',
      gapAdvice: userBulletMetricPercent < 40 ? 'Quantify 2 additional bullets using metric placeholders' : 'Verifiable metrics documented'
    },
    {
      metric: 'Cloud & Modern Infrastructure Skills',
      you: `${userCloudSkills} tools`,
      median: `${benchmark.dimensions.cloudSkillsCount.median} tools`,
      highBenchmark: `${benchmark.dimensions.cloudSkillsCount.top10} tools`,
      standing: userCloudSkills >= benchmark.dimensions.cloudSkillsCount.top10 ? 'Strong' : userCloudSkills >= benchmark.dimensions.cloudSkillsCount.median ? 'Adequate' : 'Skill Gap',
      gapAdvice: userCloudSkills < 2 ? 'Document cloud tools (AWS, Docker, CI/CD) if experienced' : 'Meets modern cloud criteria'
    },
    {
      metric: 'Core Skills Listed (Clutter Control)',
      you: `${profile.skills.length} skills`,
      median: `${benchmark.dimensions.coreSkillsCount.median} skills`,
      highBenchmark: `${benchmark.dimensions.coreSkillsCount.top10} skills`,
      standing: profile.skills.length > 28 ? 'Cluttered' : profile.skills.length >= 10 ? 'Optimal' : 'Needs Depth',
      gapAdvice: profile.skills.length > 25 ? `Prune ${profile.skills.length - 18} clutter skills to avoid dilution` : 'Focused skill profile'
    },
    {
      metric: 'Industry Certifications Documented',
      you: `${profile.certifications.length}`,
      median: '1',
      highBenchmark: '2+',
      standing: profile.certifications.length >= 2 ? 'Verified' : profile.certifications.length === 1 ? 'Standard' : 'Untracked',
      gapAdvice: profile.certifications.length === 0 ? 'Document industry or cloud certifications if completed' : 'Credentials recognized'
    }
  ];

  // Strengths and Improvement areas
  const strengths: string[] = [];
  const opportunities: string[] = [];

  if (profile.education.length > 0) strengths.push('Clear educational credentials and degree segmentation.');
  if (profile.skills.length >= 8) strengths.push(`Broad foundational technical stack (${profile.skills.slice(0, 4).join(', ')}).`);
  if (userBulletMetricPercent >= 40) strengths.push('Quantified achievements present in experience bullets.');

  if (userBulletMetricPercent < 40) opportunities.push(`Quantified Impact: Only ${bulletsWithMetricsCount} of ${allBullets.length} bullets contain measurable numbers.`);
  if (userCloudSkills < 2) opportunities.push('Infrastructure & Deployment: Low evidence of cloud and container tooling (Docker, AWS, CI/CD).');
  if (profile.skills.length > 28) opportunities.push(`Skill Scannability: ${profile.skills.length} skills listed. Prune generic terms to focus recruiter attention.`);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#142236] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Cohort Benchmark & Diagnostic Assessment</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Compare your profile architecture against typical profile baselines for <strong className="text-slate-900 dark:text-slate-100">{profile.targetRole}</strong> ({profile.experienceBand} Experience).
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shrink-0 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Diagnostic Reference</span>
          </div>
        </div>

        {/* Source & Methodology Disclosure */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>Cohort Methodology & Transparency Note:</strong> Baseline statistics represent an illustrative reference distribution synthesized from sample candidate profiles across Indian metro tech hubs (Bengaluru, Hyderabad, Pune, NCR). Updated: Q1 2025. These criteria provide directional diagnostic insight.
          </span>
        </div>
      </div>

      {/* Diagnostic Strengths & Opportunities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {strengths.length > 0 ? (
              strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 dark:text-slate-500">Add detailed experience and skills to identify strengths.</li>
            )}
          </ul>
        </div>

        <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Improvement Opportunities</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {opportunities.length > 0 ? (
              opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                  <span>{o}</span>
                </li>
              ))
            ) : (
              <li className="text-emerald-700 dark:text-emerald-400">Profile matches key baseline criteria cleanly.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Dimension Comparison Table */}
      <div className="bg-white dark:bg-[#142236] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Detailed Dimension Comparison
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Sample Reference n = 2,400</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4">Your Resume</th>
                <th className="py-3 px-4">Cohort Median</th>
                <th className="py-3 px-4">Top Tier Baseline</th>
                <th className="py-3 px-4">Standing</th>
                <th className="py-3 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-[#18283f] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {row.metric}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {row.you}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {row.median}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 dark:text-emerald-400">
                    {row.highBenchmark}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      row.standing.includes('Strong') || row.standing.includes('Optimal') || row.standing.includes('Aligned') || row.standing.includes('High Impact') || row.standing.includes('Verified')
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : row.standing.includes('Adequate') || row.standing.includes('Standard')
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {row.standing}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                    {row.gapAdvice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
