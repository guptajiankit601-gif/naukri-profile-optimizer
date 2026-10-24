import { ParsedProfile, ScoreReport, ComponentResult } from '@/types';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { PASSIVE_PHRASES } from '@/lib/data/verbs';
import { ROLES } from '@/lib/data/roles';
import { COMPONENT_WEIGHTS } from './weights';
import { SCORING_RULES } from './rules';

export function calculateCompletenessScore(profile: ParsedProfile): ScoreReport {
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const allBullets = profile.experiences.flatMap(e => e.bullets);
  const totalBullets = allBullets.length;
  const metricsInBullets = allBullets.filter(b => extractMetrics(b).length > 0);
  const passiveBullets = allBullets.filter(b => PASSIVE_PHRASES.some(p => b.toLowerCase().includes(p)));

  const components: ComponentResult[] = [];

  // 1. Headline Clarity (Weight 12) - R-COMP-01
  let headlineScore = 0;
  const headlineLower = profile.headline.toLowerCase();
  const hasRoleMatch = roleConfig.topSearchKeywords.some(kw => headlineLower.includes(kw.toLowerCase()));
  const hasSpecialization = profile.headline.includes('|') || profile.headline.includes('•') || profile.headline.includes('-');
  const hasExperienceIndicator = /\b(\d+\+?\s*yrs|\d+\+?\s*years|fresher|senior|lead)\b/i.test(profile.headline);

  if (hasRoleMatch) headlineScore += 6;
  if (hasSpecialization) headlineScore += 3;
  if (hasExperienceIndicator) headlineScore += 3;

  components.push({
    key: 'headlineClarity',
    name: 'Headline Clarity',
    weight: COMPONENT_WEIGHTS.headlineClarity,
    max: COMPONENT_WEIGHTS.headlineClarity,
    score: Math.min(COMPONENT_WEIGHTS.headlineClarity, headlineScore),
    status: headlineScore >= 9 ? 'good' : headlineScore >= 6 ? 'warn' : 'bad',
    issue: headlineScore < 8 
      ? '[R-COMP-01] Headline is generic or lacks targeted keywords (e.g. "Software Engineer at TCS").' 
      : 'Headline contains key role indicators.',
    fix: SCORING_RULES['R-COMP-01'].fixTemplate,
    example: roleConfig.headlineTemplates?.naukri?.[0] || SCORING_RULES['R-COMP-01'].exampleSnippet
  });

  // 2. Summary Quality (Weight 10) - R-COMP-02
  let summaryScore = 0;
  const summaryWords = profile.summary.trim().split(/\s+/).filter(Boolean).length;
  const hasSummaryMetrics = extractMetrics(profile.summary).length > 0;
  const hasObjectiveCliche = /seeking|challenging position|looking for opportunity|eager to learn/i.test(profile.summary);

  if (summaryWords >= 25 && summaryWords <= 90) summaryScore += 4;
  else if (summaryWords > 0) summaryScore += 2;
  if (hasSummaryMetrics) summaryScore += 3;
  if (!hasObjectiveCliche && summaryWords > 15) summaryScore += 3;

  components.push({
    key: 'summaryQuality',
    name: 'Summary / About Quality',
    weight: COMPONENT_WEIGHTS.summaryQuality,
    max: COMPONENT_WEIGHTS.summaryQuality,
    score: Math.min(COMPONENT_WEIGHTS.summaryQuality, summaryScore),
    status: summaryScore >= 7 ? 'good' : summaryScore >= 4 ? 'warn' : 'bad',
    issue: hasObjectiveCliche
      ? '[R-COMP-02] Contains passive objective phrasing ("seeking an opportunity to grow") which recruiters skip.'
      : summaryWords < 20 ? '[R-COMP-02] Summary is too brief to convey your value proposition.' : 'Well balanced summary.',
    fix: SCORING_RULES['R-COMP-02'].fixTemplate,
    example: SCORING_RULES['R-COMP-02'].exampleSnippet
  });

  // 3. Experience Bullet Quality (Weight 20) - R-COMP-03
  let bulletScore = 0;
  const metricRatio = totalBullets > 0 ? metricsInBullets.length / totalBullets : 0;
  const passiveRatio = totalBullets > 0 ? passiveBullets.length / totalBullets : 0;

  if (metricRatio >= 0.6) bulletScore += 10;
  else if (metricRatio >= 0.3) bulletScore += 6;
  else if (metricsInBullets.length > 0) bulletScore += 3;

  if (passiveRatio <= 0.2) bulletScore += 10;
  else if (passiveRatio <= 0.5) bulletScore += 5;
  else bulletScore += 2;

  components.push({
    key: 'bulletQuality',
    name: 'Experience Bullet Quality',
    weight: COMPONENT_WEIGHTS.bulletQuality,
    max: COMPONENT_WEIGHTS.bulletQuality,
    score: Math.min(COMPONENT_WEIGHTS.bulletQuality, bulletScore),
    status: bulletScore >= 14 ? 'good' : bulletScore >= 8 ? 'warn' : 'bad',
    issue: metricRatio < 0.4
      ? `[R-COMP-03] Only ${metricsInBullets.length} of ${totalBullets} bullets have quantifiable numbers (%, ₹, scale).`
      : 'Good quantification across bullets.',
    fix: SCORING_RULES['R-COMP-03'].fixTemplate,
    example: SCORING_RULES['R-COMP-03'].exampleSnippet
  });

  // 4. Skills Section Structure (Weight 15) - R-COMP-04
  let skillsScore = 0;
  const skillCount = profile.skills.length;
  const mustHavesMatched = roleConfig.mustHaveSkills.filter(mh => 
    profile.skills.some(s => s.toLowerCase() === mh.toLowerCase())
  ).length;

  if (skillCount >= 8 && skillCount <= 22) skillsScore += 7;
  else if (skillCount > 3) skillsScore += 4;

  const mustHaveRatio = roleConfig.mustHaveSkills.length > 0 ? mustHavesMatched / roleConfig.mustHaveSkills.length : 1;
  skillsScore += Math.round(mustHaveRatio * 8);

  components.push({
    key: 'skillStructure',
    name: 'Skills Architecture',
    weight: COMPONENT_WEIGHTS.skillStructure,
    max: COMPONENT_WEIGHTS.skillStructure,
    score: Math.min(COMPONENT_WEIGHTS.skillStructure, skillsScore),
    status: skillsScore >= 11 ? 'good' : skillsScore >= 7 ? 'warn' : 'bad',
    issue: mustHavesMatched < roleConfig.mustHaveSkills.length
      ? `[R-COMP-04] Missing ${roleConfig.mustHaveSkills.length - mustHavesMatched} tier-1 must-have skills for ${roleConfig.title}.`
      : 'Skills align cleanly with recruiter search queries.',
    fix: SCORING_RULES['R-COMP-04'].fixTemplate,
    example: roleConfig.mustHaveSkills.slice(0, 6).join(', ')
  });

  // 5. Education Credibility (Weight 5) - R-COMP-05
  const hasDegree = profile.education.some(e => e.degree && e.degree.length > 2);
  const hasCollege = profile.education.some(e => e.institution && e.institution.length > 2);
  const educationScore = (hasDegree ? 3 : 0) + (hasCollege ? 2 : 0);

  components.push({
    key: 'educationDetail',
    name: 'Education Credentials',
    weight: COMPONENT_WEIGHTS.educationDetail,
    max: COMPONENT_WEIGHTS.educationDetail,
    score: educationScore,
    status: educationScore === 5 ? 'good' : educationScore > 0 ? 'warn' : 'bad',
    issue: educationScore < 5 ? '[R-COMP-05] Degree or institution name is incomplete or not properly segmented.' : 'Education details complete.',
    fix: SCORING_RULES['R-COMP-05'].fixTemplate,
    example: SCORING_RULES['R-COMP-05'].exampleSnippet
  });

  // 6. Projects & Proof of Work (Weight 8) - R-COMP-06
  let projectsScore = 0;
  if (profile.projects.length >= 2) projectsScore = 8;
  else if (profile.projects.length === 1) projectsScore = 5;
  else if (totalBullets >= 6) projectsScore = 4; // Credit if experience section is heavy with deliverables

  components.push({
    key: 'projectsProof',
    name: 'Demonstrated Projects & Proof',
    weight: COMPONENT_WEIGHTS.projectsProof,
    max: COMPONENT_WEIGHTS.projectsProof,
    score: projectsScore,
    status: projectsScore >= 6 ? 'good' : projectsScore >= 4 ? 'warn' : 'bad',
    issue: projectsScore < 6 ? '[R-COMP-06] Lacks independent project showcases or verifiable live links.' : 'Demonstrates verified work.',
    fix: SCORING_RULES['R-COMP-06'].fixTemplate,
    example: SCORING_RULES['R-COMP-06'].exampleSnippet
  });

  // 7. Certifications & Badges (Weight 5) - R-COMP-07
  const certScore = profile.certifications.length >= 2 ? 5 : profile.certifications.length === 1 ? 3 : 1;

  components.push({
    key: 'certifications',
    name: 'Certifications & Credentials',
    weight: COMPONENT_WEIGHTS.certifications,
    max: COMPONENT_WEIGHTS.certifications,
    score: certScore,
    status: certScore >= 4 ? 'good' : certScore >= 2 ? 'warn' : 'bad',
    issue: certScore < 3 ? '[R-COMP-07] No industry-standard cloud or domain credentials detected.' : 'Certifications valid.',
    fix: SCORING_RULES['R-COMP-07'].fixTemplate,
    example: SCORING_RULES['R-COMP-07'].exampleSnippet
  });

  // 8. ATS Parseability (Weight 10) - R-COMP-08
  const expConf = profile.sectionConfidence?.experience || 50;
  const eduConf = profile.sectionConfidence?.education || 50;
  const skillConf = profile.sectionConfidence?.skills || 50;
  const avgConf = (expConf + eduConf + skillConf) / 3;
  const parseScore = Math.round((avgConf / 100) * 10);

  components.push({
    key: 'parseability',
    name: 'ATS Parseability',
    weight: COMPONENT_WEIGHTS.parseability,
    max: COMPONENT_WEIGHTS.parseability,
    score: Math.min(10, Math.max(2, parseScore)),
    status: parseScore >= 8 ? 'good' : parseScore >= 6 ? 'warn' : 'bad',
    issue: parseScore < 7 ? '[R-COMP-08] Non-standard section names or layout makes automated parsing unreliable.' : 'Clean document structure.',
    fix: SCORING_RULES['R-COMP-08'].fixTemplate,
    example: SCORING_RULES['R-COMP-08'].exampleSnippet
  });

  // 9. Platform Optimization & Format (Weight 10) - R-COMP-09
  let platformScore = 7;
  if (profile.headline.length > 240) platformScore -= 3;
  if (profile.skills.length > 30) platformScore -= 2;
  if (profile.experiences.length > 0 && profile.experiences[0].bullets.length >= 3) platformScore += 3;
  platformScore = Math.min(10, Math.max(2, platformScore));

  components.push({
    key: 'platformConsistency',
    name: 'Job Board Alignment',
    weight: COMPONENT_WEIGHTS.platformConsistency,
    max: COMPONENT_WEIGHTS.platformConsistency,
    score: platformScore,
    status: platformScore >= 8 ? 'good' : platformScore >= 5 ? 'warn' : 'bad',
    issue: platformScore < 8 ? '[R-COMP-09] Length or structure exceeds ideal recruiter scannability thresholds.' : 'Formatted for recruiter glance.',
    fix: SCORING_RULES['R-COMP-09'].fixTemplate,
    example: SCORING_RULES['R-COMP-09'].exampleSnippet
  });

  // 10. Contact Details & Credibility (Weight 5) - R-COMP-10
  const hasEmail = Boolean(profile.email && profile.email.includes('@'));
  const hasPhone = Boolean(profile.phone && profile.phone.length >= 10);
  const contactScore = (hasEmail ? 3 : 0) + (hasPhone ? 2 : 0);

  components.push({
    key: 'contactCredibility',
    name: 'Contact & Profile Identity',
    weight: COMPONENT_WEIGHTS.contactCredibility,
    max: COMPONENT_WEIGHTS.contactCredibility,
    score: contactScore,
    status: contactScore === 5 ? 'good' : 'bad',
    issue: contactScore < 5 ? '[R-COMP-10] Missing clean email or reachable 10-digit phone number.' : 'Direct contact details verified.',
    fix: SCORING_RULES['R-COMP-10'].fixTemplate,
    example: SCORING_RULES['R-COMP-10'].exampleSnippet
  });

  // Sum total score
  const overallScore = components.reduce((sum, c) => sum + c.score, 0);

  // Verdict
  const verdict: 'Strong' | 'Okay' | 'Needs Work' = 
    overallScore >= 78 ? 'Strong' : overallScore >= 55 ? 'Okay' : 'Needs Work';

  // Prioritize top 3 fixes with highest points left on table
  const topFixes = components
    .filter(c => c.score < c.max)
    .map(c => ({
      title: `Improve ${c.name}`,
      points: c.max - c.score,
      actionTab: c.key === 'headlineClarity' ? 'headline' : c.key === 'bulletQuality' ? 'rewriter' : c.key === 'skillStructure' ? 'keywords' : 'profile'
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return {
    overallScore,
    verdict,
    components,
    topFixes
  };
}
