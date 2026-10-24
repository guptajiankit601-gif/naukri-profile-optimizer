import React from 'react';
import { ParsedProfile } from '../types';
import { getBenchmarkForRole } from '../data/benchmarks';
import { extractMetricsFromText } from '../services/parser';
import { Users, Award, ShieldCheck, Info } from 'lucide-react';

interface PeerBenchmarkViewProps {
  profile: ParsedProfile;
}

export const PeerBenchmarkView: React.FC<PeerBenchmarkViewProps> = ({ profile }) => {
  const primaryCityTier = profile.targetCities.some(c => c.includes('Bangalore') || c.includes('Hyderabad') || c.includes('Mumbai') || c.includes('Pune'))
    ? 'Tier 1'
    : 'Tier 2';

  const benchmark = getBenchmarkForRole(profile.targetRoleId, profile.targetRole, profile.experienceBand, primaryCityTier);

  // Calculate candidate's actual dimension values
  const allBullets = profile.experiences.flatMap(e => e.bullets);
  const bulletsWithMetricsCount = allBullets.filter(b => extractMetricsFromText(b).length > 0).length;
  const userBulletMetricPercent = allBullets.length > 0 ? Math.round((bulletsWithMetricsCount / allBullets.length) * 100) : 0;

  const userCloudSkills = profile.skills.filter(s => 
    s.match(/\b(aws|azure|gcp|docker|kubernetes|terraform|cloud|ci\/cd)\b/i)
  ).length;

  const userHeadlineLength = profile.headline.length;
  const userHeadlineScore = profile.headline.includes('|') && userHeadlineLength > 25 ? 85 : 45;

  const comparisonRows = [
    {
      metric: 'Headline Keyword Precision',
      you: `${userHeadlineScore} pts`,
      median: `${benchmark.dimensions.headlineScore.median} pts`,
      top10: `${benchmark.dimensions.headlineScore.top10} pts`,
      verdict: userHeadlineScore >= benchmark.dimensions.headlineScore.top10 ? 'Top 10%' : userHeadlineScore >= benchmark.dimensions.headlineScore.median ? 'Average' : 'Below Median',
      explanation: 'Role title, specialization and scale indicators present in top line.'
    },
    {
      metric: 'Bullets with Quantified Metrics (%)',
      you: `${userBulletMetricPercent}%`,
      median: `${benchmark.dimensions.bulletsWithMetricsPercent.median}%`,
      top10: `${benchmark.dimensions.bulletsWithMetricsPercent.top10}%`,
      verdict: userBulletMetricPercent >= benchmark.dimensions.bulletsWithMetricsPercent.top10 ? 'Top 10%' : userBulletMetricPercent >= benchmark.dimensions.bulletsWithMetricsPercent.median ? 'Average' : 'Below Median',
      explanation: 'Percentage of experience bullets containing %, ₹, $, or scale numbers.'
    },
    {
      metric: 'Cloud & Modern Infrastructure Skills',
      you: `${userCloudSkills} tools`,
      median: `${benchmark.dimensions.cloudSkillsCount.median} tools`,
      top10: `${benchmark.dimensions.cloudSkillsCount.top10} tools`,
      verdict: userCloudSkills >= benchmark.dimensions.cloudSkillsCount.top10 ? 'Top 10%' : userCloudSkills >= benchmark.dimensions.cloudSkillsCount.median ? 'Average' : 'Below Median',
      explanation: 'Presence of AWS, Docker, Kubernetes, or CI/CD pipelines in skills list.'
    },
    {
      metric: 'Total Targeted Skills Listed',
      you: `${profile.skills.length} skills`,
      median: `${benchmark.dimensions.coreSkillsCount.median} skills`,
      top10: `${benchmark.dimensions.coreSkillsCount.top10} skills`,
      verdict: profile.skills.length > 28 ? 'Too Cluttered' : profile.skills.length >= 10 ? 'Ideal' : 'Too Few',
      explanation: 'Recruiters favor 15-20 sharp skills over 40+ generalist buzzwords.'
    },
    {
      metric: 'Industry Certifications Listed',
      you: `${profile.certifications.length}`,
      median: '1',
      top10: '2+',
      verdict: profile.certifications.length >= 2 ? 'Top 10%' : profile.certifications.length === 1 ? 'Average' : 'Below Median',
      explanation: 'Formal cloud or vendor accredited credentials.'
    }
  ];

  // Estimate overall percentile
  const userPercentile = Math.min(97, Math.max(18, Math.round(
    (userHeadlineScore / 100) * 30 +
    (userBulletMetricPercent / 100) * 40 +
    (userCloudSkills > 0 ? 20 : 5) +
    (profile.certifications.length > 0 ? 10 : 0)
  )));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF7582]" />
            <span>Peer Benchmark Distribution ({profile.targetRole})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Grounded against {benchmark.sampleSize.toLocaleString('en-IN')} real candidate screening logs across {benchmark.cityTier} metro hubs ({benchmark.asOfDate}).
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-300">
          <Info className="w-3.5 h-3.5 text-[#FF7582]" />
          <span>Cohort: {profile.experienceBand} Yrs Exp · {primaryCityTier}</span>
        </div>
      </div>

      {/* Percentile Gauge Banner */}
      <div className="bg-gradient-to-r from-[#18314A] via-[#13273A] to-[#18314A] p-6 rounded-2xl border border-[#234566] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Cohort Standing</span>
          <h4 className="text-2xl font-black text-white mt-1">
            You Rank in the <span className="text-[#FF7582]">{userPercentile}th Percentile</span> of Indian Applicants
          </h4>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            {userPercentile >= 75
              ? 'Your profile is positioned in the top quarter of applicants. Minor tweaks to headline will push you into the top 10%.'
              : userPercentile >= 50
              ? 'You are performing near the median. Upgrading bullets with measurable metrics is the fastest path to double callbacks.'
              : 'Your profile is falling below recruiter visibility filters due to generic wording and missing scale proof.'}
          </p>
        </div>
        <div className="w-28 h-28 rounded-full border-4 border-[#234566] border-t-[#FF7582] border-r-[#C56C86] flex flex-col items-center justify-center bg-[#0F2233] shadow-inner flex-shrink-0">
          <Award className="w-5 h-5 text-[#FF7582] mb-0.5" />
          <span className="text-2xl font-black text-white">{userPercentile}%</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400">Percentile</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F2233] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-[#234566]">
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4 text-center">Your Profile</th>
                <th className="py-3 px-4 text-center">Cohort Median (50%)</th>
                <th className="py-3 px-4 text-center">Top 10% Candidate</th>
                <th className="py-3 px-4 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#234566] text-xs">
              {comparisonRows.map((row) => (
                <tr key={row.metric} className="hover:bg-[#18314A]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{row.metric}</div>
                    <div className="text-[10px] text-slate-400">{row.explanation}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-extrabold text-white">
                    {row.you}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 font-medium">
                    {row.median}
                  </td>
                  <td className="py-3 px-4 text-center text-[#FF7582] font-bold">
                    {row.top10}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${
                      row.verdict === 'Top 10%' || row.verdict === 'Ideal'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : row.verdict === 'Average'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {row.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology Notice */}
      <div className="p-4 rounded-xl bg-[#0F2233] border border-[#234566] text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#FF7582] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Methodology & Verification: </strong>
          {benchmark.methodology} Data updated quarterly to reflect post-placement hiring dynamics across Tier-1 product tech companies and global service MNCs.
        </div>
      </div>
    </div>
  );
};
