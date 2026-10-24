'use client';

import React from 'react';
import { ParsedProfile } from '@/types';
import { getBenchmarkForRole } from '@/data/benchmarks';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { Users, ShieldCheck, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';

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
  if (profile.skills.length > 28) opportunities.push(`Skill Scannability: ${profile.skills.length} skills listed. Prune generic terms (e.g. MS Office, typing) to focus recruiter attention.`);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF7582]" />
              <span>Illustrative Cohort Benchmark & Diagnostic Self-Assessment</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Compare your profile architecture against typical profile baselines for <strong className="text-white">{profile.targetRole}</strong> ({profile.experienceBand} Experience).
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Diagnostic Reference</span>
          </div>
        </div>

        {/* Source & Methodology Disclosure */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-[#FF7582] shrink-0 mt-0.5" />
          <span>
            <strong>Cohort Methodology & Transparency Note:</strong> Baseline statistics represent an illustrative reference distribution synthesized from sample candidate profiles across Indian metro tech hubs (Bengaluru, Hyderabad, Pune, NCR). Updated: Q1 2025. These criteria provide directional diagnostic insight and do not constitute certified percentile rankings or guaranteed hiring outcomes.
          </span>
        </div>
      </div>

      {/* Diagnostic Strengths & Opportunities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#13273A] rounded-2xl border border-white/10 p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {strengths.length > 0 ? (
              strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400">Add detailed experience and skills to identify strengths.</li>
            )}
          </ul>
        </div>

        <div className="bg-[#13273A] rounded-2xl border border-white/10 p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF7582] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>High-Priority Improvement Opportunities</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {opportunities.length > 0 ? (
              opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#FF7582] mt-0.5">•</span>
                  <span>{o}</span>
                </li>
              ))
            ) : (
              <li className="text-emerald-400">Profile matches key baseline criteria cleanly.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Dimension Comparison Table */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0F2233] border-b border-[#234566] flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Detailed Dimension Comparison
          </span>
          <span className="text-[11px] text-slate-400">Sample Reference n = 2,400</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F2233] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-[#234566]">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4">Your Resume</th>
                <th className="py-3 px-4">Cohort Median</th>
                <th className="py-3 px-4">Top Tier Baseline</th>
                <th className="py-3 px-4">Standing</th>
                <th className="py-3 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#234566] text-xs">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#18314A]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {row.metric}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#FF7582]">
                    {row.you}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {row.median}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">
                    {row.highBenchmark}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      row.standing.includes('Strong') || row.standing.includes('Optimal') || row.standing.includes('Aligned') || row.standing.includes('High Impact') || row.standing.includes('Verified')
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : row.standing.includes('Adequate') || row.standing.includes('Standard')
                        ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {row.standing}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-300">
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
