import React from 'react';
import { ParsedProfile } from '@/types';
import { getBenchmarkForRole } from '@/data/benchmarks';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { Users, Award, ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight, Zap } from 'lucide-react';

interface PeerBenchmarkViewProps {
  profile: ParsedProfile;
}

export const PeerBenchmarkView: React.FC<PeerBenchmarkViewProps> = ({ profile }) => {
  const primaryCityTier = profile.targetCities.some(c => c.includes('Bangalore') || c.includes('Hyderabad') || c.includes('Mumbai') || c.includes('Pune'))
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

  const userHeadlineLength = profile.headline.length;
  const userHeadlineScore = profile.headline.includes('|') && userHeadlineLength > 25 ? 88 : 45;

  const comparisonRows = [
    {
      metric: 'Headline Keyword Precision',
      you: `${userHeadlineScore} pts`,
      hired: '92 pts',
      median: `${benchmark.dimensions.headlineScore.median} pts`,
      top10: `${benchmark.dimensions.headlineScore.top10} pts`,
      standing: userHeadlineScore >= benchmark.dimensions.headlineScore.top10 ? 'Top 10%' : userHeadlineScore >= benchmark.dimensions.headlineScore.median ? 'Average' : 'Below Median',
      gapAdvice: userHeadlineScore < 80 ? 'Add role specialization & metric to headline' : 'Strong recruiter headline'
    },
    {
      metric: 'Bullets with Quantified Metrics (%)',
      you: `${userBulletMetricPercent}%`,
      hired: '65%+',
      median: `${benchmark.dimensions.bulletsWithMetricsPercent.median}%`,
      top10: `${benchmark.dimensions.bulletsWithMetricsPercent.top10}%`,
      standing: userBulletMetricPercent >= benchmark.dimensions.bulletsWithMetricsPercent.top10 ? 'Top 10%' : userBulletMetricPercent >= benchmark.dimensions.bulletsWithMetricsPercent.median ? 'Average' : 'Below Median',
      gapAdvice: userBulletMetricPercent < 40 ? 'Add numbers to 2 more bullets (+12 pts)' : 'Good quantified track record'
    },
    {
      metric: 'Cloud & Modern Infrastructure Skills',
      you: `${userCloudSkills} tools`,
      hired: '3+ tools',
      median: `${benchmark.dimensions.cloudSkillsCount.median} tools`,
      top10: `${benchmark.dimensions.cloudSkillsCount.top10} tools`,
      standing: userCloudSkills >= benchmark.dimensions.cloudSkillsCount.top10 ? 'Top 10%' : userCloudSkills >= benchmark.dimensions.cloudSkillsCount.median ? 'Average' : 'Below Median',
      gapAdvice: userCloudSkills < 2 ? 'Add AWS/Docker/CI-CD (+15 pts)' : 'Meets modern cloud requirements'
    },
    {
      metric: 'Total Targeted Skills Listed',
      you: `${profile.skills.length} skills`,
      hired: '16 skills',
      median: `${benchmark.dimensions.coreSkillsCount.median} skills`,
      top10: `${benchmark.dimensions.coreSkillsCount.top10} skills`,
      standing: profile.skills.length > 28 ? 'Too Cluttered' : profile.skills.length >= 10 ? 'Ideal' : 'Too Few',
      gapAdvice: profile.skills.length > 25 ? `Cut ${profile.skills.length - 18} noise skills to prevent dilution` : 'Sharp, focused skills'
    },
    {
      metric: 'Industry Certifications Listed',
      you: `${profile.certifications.length}`,
      hired: '1 - 2 certs',
      median: '1',
      top10: '2+',
      standing: profile.certifications.length >= 2 ? 'Top 10%' : profile.certifications.length === 1 ? 'Average' : 'Below Median',
      gapAdvice: profile.certifications.length === 0 ? 'Add AWS / Vendor certification' : 'Verified credentials'
    }
  ];

  // Percentile calculation
  const userPercentile = Math.min(96, Math.max(15, Math.round(
    (userHeadlineScore / 100) * 30 +
    (userBulletMetricPercent / 100) * 40 +
    (userCloudSkills > 0 ? 20 : 5) +
    (profile.certifications.length > 0 ? 10 : 0)
  )));

  // Identify strengths & weaknesses
  const strongerIn = [];
  const weakerIn = [];

  if (profile.education.length > 0) strongerIn.push('Academic qualifications and degree criteria');
  if (profile.skills.length >= 10) strongerIn.push(`Core language fundamentals (${profile.skills.slice(0, 3).join(', ')})`);
  if (userBulletMetricPercent < 40) weakerIn.push('Measurable business impact (Only ' + bulletsWithMetricsCount + ' bullets have numbers)');
  if (userCloudSkills < 2) weakerIn.push('Cloud & distributed deployment proof (AWS, Docker, Kubernetes)');
  if (profile.skills.length > 30) weakerIn.push(`Skill dilution (${profile.skills.length} skills listed makes you look like a generalist)`);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF7582]" />
            <span>Comparison Engine (Benchmarked Against Hired Candidates)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Compare your profile directly against <strong className="text-white">people who actually got hired</strong> and the industry average in India.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-300">
          <Award className="w-3.5 h-3.5 text-[#FF7582]" />
          <span>Benchmark: Top {100 - userPercentile}% of candidates in {profile.targetRole}</span>
        </div>
      </div>

      {/* Percentile Gauge Banner */}
      <div className="bg-gradient-to-r from-[#18314A] via-[#13273A] to-[#18314A] p-6 rounded-2xl border border-[#234566] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry Benchmark</span>
          <h4 className="text-2xl font-black text-white mt-1">
            You Stand in the <span className="text-[#FF7582]">Top {100 - userPercentile}%</span> of Indian Applicants
          </h4>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {userPercentile >= 75
              ? 'Your profile is outperforming 3 out of 4 applicants. Fine-tuning your headline will cement you in the top 10% tier.'
              : userPercentile >= 50
              ? 'You are near the cohort median. Hired candidates have 65%+ bullets with metrics and 3+ cloud keywords.'
              : 'You are currently falling into the bottom 40% recruiter skip bucket due to passive phrasing and missing search keywords.'}
          </p>
        </div>
        <div className="w-28 h-28 rounded-full border-4 border-[#234566] border-t-[#FF7582] border-r-[#C56C86] flex flex-col items-center justify-center bg-[#0F2233] shadow-inner flex-shrink-0">
          <span className="text-2xl font-black text-white">{userPercentile}%</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400">Percentile</span>
        </div>
      </div>

      {/* Stronger In vs Weaker In Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stronger In */}
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Where You Are Stronger Than Average</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {strongerIn.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaker In */}
        <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Where Hired Candidates Beat Your Profile</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {weakerIn.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F2233] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-[#234566]">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-center">Your Profile</th>
                <th className="py-3 px-4 text-center">Hired at Top Cos</th>
                <th className="py-3 px-4 text-center">Industry Median</th>
                <th className="py-3 px-4 text-right">What to Improve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#234566] text-xs">
              {comparisonRows.map((row) => (
                <tr key={row.metric} className="hover:bg-[#18314A]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {row.metric}
                  </td>
                  <td className="py-3 px-4 text-center font-extrabold text-white">
                    {row.you}
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">
                    {row.hired}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 font-medium">
                    {row.median}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs text-[#FF7582] font-semibold flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{row.gapAdvice}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear Improvement Jump Tip */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#18314A] to-[#234566] border border-[#FF7582]/40 text-xs text-slate-200 flex items-start gap-3">
        <Zap className="w-5 h-5 text-[#FF7582] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Single Highest-Yield Improvement: </strong>
          Adding AWS or Docker certification and pruning noise keywords will instantly jump your profile from <span className="text-[#FF7582] font-bold">{userPercentile}%</span> to <span className="text-emerald-400 font-bold">Top 15%</span> of recruiter searches.
        </div>
      </div>
    </div>
  );
};
