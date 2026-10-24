import { ParsedProfile } from '@/types';
import { ROLES } from '@/lib/data/roles';
import { extractMetrics } from '@/lib/parser/extract-metrics';

export interface VisibilityFactor {
  factor: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  status: 'OPTIMAL' | 'MODERATE' | 'POOR';
  observation: string;
  recommendation: string;
}

export interface VisibilityReport {
  score: number;
  factors: VisibilityFactor[];
  searchImpressionsTier: 'Top 10%' | 'Top 25%' | 'Average (40-60%)' | 'Below Average (<30%)';
  recruiterClickThroughPotential: 'High' | 'Medium' | 'Low';
}

export function calculateVisibilityScore(profile: ParsedProfile): VisibilityReport {
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const factors: VisibilityFactor[] = [];

  // 1. Search Keyword Density (Weight 25)
  const allTextLower = profile.rawText.toLowerCase();
  const matchedKeywords = roleConfig.topSearchKeywords.filter(kw => allTextLower.includes(kw.toLowerCase()));
  const kwRatio = roleConfig.topSearchKeywords.length > 0 ? matchedKeywords.length / roleConfig.topSearchKeywords.length : 1;
  const kwScore = Math.round(kwRatio * 25);
  factors.push({
    factor: 'keyword_density',
    name: 'Primary Search Keyword Density',
    weight: 25,
    score: kwScore,
    maxScore: 25,
    status: kwScore >= 20 ? 'OPTIMAL' : kwScore >= 14 ? 'MODERATE' : 'POOR',
    observation: `Profile matches ${matchedKeywords.length} of ${roleConfig.topSearchKeywords.length} top recruiter search terms.`,
    recommendation: 'Include missing tier-1 keywords naturally in your headline, summary, and experience bullets.'
  });

  // 2. Headline Recruiter CTR (Weight 20)
  let headlineScore = 8;
  const headlineLower = profile.headline.toLowerCase();
  if (roleConfig.topSearchKeywords.some(kw => headlineLower.includes(kw.toLowerCase()))) headlineScore += 6;
  if (profile.headline.includes('|') || profile.headline.includes('•')) headlineScore += 3;
  if (/\b(\d+\+?\s*yrs|fresher|senior|lead)\b/i.test(profile.headline)) headlineScore += 3;
  headlineScore = Math.min(20, headlineScore);
  factors.push({
    factor: 'headline_ctr',
    name: 'Headline Recruiter CTR Potential',
    weight: 20,
    score: headlineScore,
    maxScore: 20,
    status: headlineScore >= 16 ? 'OPTIMAL' : headlineScore >= 11 ? 'MODERATE' : 'POOR',
    observation: headlineScore >= 16 ? 'Headline has strong keyword prominence and clarity.' : 'Headline looks standard or under-optimized.',
    recommendation: 'Use the 3-part formula: Target Role | Specialization | Quantified Metric.'
  });

  // 3. Freshness / Recency Indicator (Weight 15)
  const isCurrentlyEmployed = profile.experiences.some(e => /present|current|now/i.test(e.endDate));
  const freshnessScore = isCurrentlyEmployed ? 15 : 9;
  factors.push({
    factor: 'recency',
    name: 'Profile Freshness & Recency Signal',
    weight: 15,
    score: freshnessScore,
    maxScore: 15,
    status: freshnessScore >= 14 ? 'OPTIMAL' : 'MODERATE',
    observation: isCurrentlyEmployed ? 'Current employment active.' : 'Last active role may appear stalled on job board sort algorithms.',
    recommendation: 'Keep end dates marked "Present" for active roles to ensure job board recency algorithm triggers.'
  });

  // 4. Experience Formatting & Metric Density (Weight 15)
  const allBullets = profile.experiences.flatMap(e => e.bullets);
  const metricBullets = allBullets.filter(b => extractMetrics(b).length > 0);
  const metricRatio = allBullets.length > 0 ? metricBullets.length / allBullets.length : 0;
  const expFormatScore = Math.round(metricRatio * 15);
  factors.push({
    factor: 'metric_density',
    name: 'Bullet Quantification Density',
    weight: 15,
    score: expFormatScore,
    maxScore: 15,
    status: expFormatScore >= 11 ? 'OPTIMAL' : expFormatScore >= 6 ? 'MODERATE' : 'POOR',
    observation: `${metricBullets.length} of ${allBullets.length} bullets include concrete measurable outcomes.`,
    recommendation: 'Add %, ₹, or scale metrics to at least 60% of your resume bullet points.'
  });

  // 5. Must-Have Skills Match (Weight 15)
  const matchedMustHaves = roleConfig.mustHaveSkills.filter(mh => 
    profile.skills.some(s => s.toLowerCase() === mh.toLowerCase())
  );
  const mhRatio = roleConfig.mustHaveSkills.length > 0 ? matchedMustHaves.length / roleConfig.mustHaveSkills.length : 1;
  const mhScore = Math.round(mhRatio * 15);
  factors.push({
    factor: 'must_have_skills',
    name: 'Must-Have Skills Coverage',
    weight: 15,
    score: mhScore,
    maxScore: 15,
    status: mhScore >= 12 ? 'OPTIMAL' : mhScore >= 8 ? 'MODERATE' : 'POOR',
    observation: `Matched ${matchedMustHaves.length} of ${roleConfig.mustHaveSkills.length} core mandatory skills.`,
    recommendation: 'Add missing core skills into your skills section and demonstrate them inside project bullets.'
  });

  // 6. Role Title & Target City Alignment (Weight 10)
  let locScore = 5;
  if (profile.targetCities.length > 0) locScore += 3;
  if (profile.location && profile.location.length > 3) locScore += 2;
  locScore = Math.min(10, locScore);
  factors.push({
    factor: 'location_role_fit',
    name: 'Role & Location Filter Pass-Rate',
    weight: 10,
    score: locScore,
    maxScore: 10,
    status: locScore >= 8 ? 'OPTIMAL' : 'MODERATE',
    observation: `Configured for ${profile.location} and ${profile.targetCities.join(', ')}.`,
    recommendation: 'Ensure Tier-1 metro hub preferences are explicitly tagged in job board profiles.'
  });

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);

  const searchImpressionsTier = 
    totalScore >= 85 ? 'Top 10%' :
    totalScore >= 70 ? 'Top 25%' :
    totalScore >= 50 ? 'Average (40-60%)' : 'Below Average (<30%)';

  const recruiterClickThroughPotential = 
    totalScore >= 75 ? 'High' : totalScore >= 50 ? 'Medium' : 'Low';

  return {
    score: totalScore,
    factors,
    searchImpressionsTier,
    recruiterClickThroughPotential
  };
}
