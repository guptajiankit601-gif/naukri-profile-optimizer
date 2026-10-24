import { ParsedProfile, ScoreReport, ComponentResult, TopFixItem } from '@/types';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { PASSIVE_PHRASES } from '@/lib/data/verbs';
import { ROLES } from '@/lib/data/roles';
import { STANDARD_SCORE_WEIGHTS, FRESHER_SCORE_WEIGHTS, normalizeWeights, ScoreWeights } from './weights';
import { SCORING_RULES } from './rules';

/**
 * Single source of truth scoring engine shared across all pages.
 * Fully transparent, configurable, zero hardcoded scores, exact 100-point total.
 */
export function calculateCompletenessScore(
  profile: ParsedProfile,
  customWeights?: Partial<ScoreWeights>
): ScoreReport {
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const allBullets = profile.experiences.flatMap(e => e.bullets);
  const totalBullets = allBullets.length;
  const metricsInBullets = allBullets.filter(b => extractMetrics(b).length > 0);
  const passiveBullets = allBullets.filter(b => PASSIVE_PHRASES.some(p => b.toLowerCase().includes(p)));

  // Detect whether profile qualifies for Fresher scoring model
  const isFresher =
    profile.experienceBand === 'Fresher' ||
    totalBullets === 0 ||
    profile.experiences.length === 0 ||
    profile.experiences.every(e => e.title.toLowerCase().includes('intern') || e.title.toLowerCase().includes('trainee'));

  // Use Fresher or Standard weights
  const activeBaseWeights: ScoreWeights = isFresher
    ? { ...FRESHER_SCORE_WEIGHTS, ...(customWeights || {}) }
    : { ...STANDARD_SCORE_WEIGHTS, ...(customWeights || {}) };

  const allWeightKeys: (keyof ScoreWeights)[] = [
    'headlineClarity',
    'summaryQuality',
    'skillKeywordRelevance',
    'experienceRelevance',
    'achievementImpact',
    'projectsPortfolio',
    'educationCertifications',
    'atsReadability',
    'targetRoleAlignment',
    'completenessConsistency'
  ];

  const { normalized: weights, note: normalizationNote } = normalizeWeights(activeBaseWeights, allWeightKeys);

  const components: ComponentResult[] = [];

  // =========================================================================
  // 1. Headline Clarity (Weight 10)
  // =========================================================================
  let headlineScore = 0;
  const headlineLower = (profile.headline || '').toLowerCase();
  const hasRoleMatch = roleConfig.topSearchKeywords.some(kw => headlineLower.includes(kw.toLowerCase()));
  const hasSpecialization = profile.headline?.includes('|') || profile.headline?.includes('•') || profile.headline?.includes('-');
  const hasExperienceIndicator = /\b(\d+\+?\s*yrs|\d+\+?\s*years|fresher|senior|lead|intern|graduate)\b/i.test(profile.headline || '');

  if (hasRoleMatch) headlineScore += 4;
  if (hasSpecialization) headlineScore += 3;
  if (hasExperienceIndicator) headlineScore += 3;

  const maxHeadline = weights.headlineClarity;
  const actualHeadline = Math.min(maxHeadline, Math.round((headlineScore / 10) * maxHeadline));
  components.push({
    key: 'headlineClarity',
    name: 'Headline Clarity & Search Indexing',
    weight: maxHeadline,
    max: maxHeadline,
    score: actualHeadline,
    headroom: maxHeadline - actualHeadline,
    status: actualHeadline >= Math.round(maxHeadline * 0.8) ? 'good' : actualHeadline >= Math.round(maxHeadline * 0.5) ? 'warn' : 'bad',
    issue: actualHeadline < Math.round(maxHeadline * 0.8)
      ? `Headline is missing ${!hasRoleMatch ? 'target role title' : !hasSpecialization ? 'pipe-separated specializations' : 'experience indicator'}.`
      : 'Headline contains key recruiter search indicators.',
    fix: 'Use the 3-part recruiter formula: [Target Role] | [Core Technologies] | [Experience or Domain Focus].',
    example: roleConfig.headlineTemplates?.naukri?.[0] || `${roleConfig.title} | Java & Spring Boot | 3+ Yrs Exp`,
    evidence: profile.headline ? [profile.headline] : ['(Empty headline)']
  });

  // =========================================================================
  // 2. Summary Quality (Weight 10)
  // =========================================================================
  let summaryScore = 0;
  const summaryWords = (profile.summary || '').trim().split(/\s+/).filter(Boolean).length;
  const hasSummaryMetrics = extractMetrics(profile.summary || '').length > 0;
  const hasObjectiveCliche = /seeking|challenging position|looking for opportunity|eager to learn|hardworking individual/i.test(profile.summary || '');

  if (summaryWords >= 25 && summaryWords <= 120) summaryScore += 4;
  else if (summaryWords > 0) summaryScore += 2;
  if (hasSummaryMetrics) summaryScore += 3;
  if (!hasObjectiveCliche && summaryWords > 15) summaryScore += 3;

  const maxSummary = weights.summaryQuality;
  const actualSummary = Math.min(maxSummary, Math.round((summaryScore / 10) * maxSummary));
  components.push({
    key: 'summaryQuality',
    name: 'Professional Summary Pitch',
    weight: maxSummary,
    max: maxSummary,
    score: actualSummary,
    headroom: maxSummary - actualSummary,
    status: actualSummary >= Math.round(maxSummary * 0.7) ? 'good' : actualSummary >= Math.round(maxSummary * 0.4) ? 'warn' : 'bad',
    issue: hasObjectiveCliche
      ? 'Contains passive objective phrasing ("seeking an opportunity") which recruiters skip.'
      : summaryWords < 25 ? 'Summary is too brief to convey your core competencies and value proposition.' : 'Well-structured professional summary.',
    fix: 'Lead with your role and years of experience, state your core tech stack, and highlight a verifiable achievement.',
    example: 'Backend Engineer with 3+ years experience building distributed Java microservices and REST APIs.',
    evidence: profile.summary ? [profile.summary.slice(0, 140) + '...'] : ['(Empty summary)']
  });

  // =========================================================================
  // 3. Skill & Keyword Relevance (Weight 15 standard, 18 fresher)
  // =========================================================================
  let skillsScore = 0;
  const skillCount = profile.skills.length;
  const mustHavesMatched = roleConfig.mustHaveSkills.filter(mh =>
    profile.skills.some(s => s.toLowerCase() === mh.toLowerCase())
  ).length;

  const mustHaveRatio = roleConfig.mustHaveSkills.length > 0 ? mustHavesMatched / roleConfig.mustHaveSkills.length : 1;
  skillsScore += Math.round(mustHaveRatio * 10);

  if (skillCount >= 8 && skillCount <= 25) skillsScore += 5;
  else if (skillCount > 3) skillsScore += 3;

  const maxSkills = weights.skillKeywordRelevance;
  const actualSkills = Math.min(maxSkills, Math.round((skillsScore / 15) * maxSkills));
  const missingMustHaves = roleConfig.mustHaveSkills.filter(mh =>
    !profile.skills.some(s => s.toLowerCase() === mh.toLowerCase())
  );

  components.push({
    key: 'skillKeywordRelevance',
    name: 'Skill & Search Keyword Relevance',
    weight: maxSkills,
    max: maxSkills,
    score: actualSkills,
    headroom: maxSkills - actualSkills,
    status: actualSkills >= Math.round(maxSkills * 0.75) ? 'good' : actualSkills >= Math.round(maxSkills * 0.5) ? 'warn' : 'bad',
    issue: missingMustHaves.length > 0
      ? `Missing ${missingMustHaves.length} core search keyword${missingMustHaves.length > 1 ? 's' : ''} for ${roleConfig.title} (${missingMustHaves.slice(0, 3).join(', ')}).`
      : skillCount > 28 ? 'Skill list is cluttered (>28 items), which dilutes keyword relevance.' : 'Strong alignment with primary recruiter search keywords.',
    fix: missingMustHaves.length > 0
      ? `Add demonstrated skills like ${missingMustHaves.slice(0, 3).join(', ')} if you possess them, or focus project work on these tools.`
      : 'Organize skills into Core, Secondary, and Tools categories.',
    example: roleConfig.mustHaveSkills.slice(0, 6).join(', '),
    evidence: profile.skills.slice(0, 6)
  });

  // =========================================================================
  // 4. Experience & Internship Relevance (Weight 15 standard, 5 fresher)
  // =========================================================================
  let expScore = 0;
  const maxExp = weights.experienceRelevance;

  if (isFresher) {
    // For freshers, evaluate internships, training, academic labs, or open-source work
    const hasInternship = profile.experiences.some(e =>
      e.title.toLowerCase().includes('intern') ||
      e.title.toLowerCase().includes('trainee') ||
      e.bullets.length > 0
    );
    if (hasInternship) expScore = maxExp;
    else if (totalBullets > 0) expScore = Math.round(maxExp * 0.8);
    else expScore = Math.round(maxExp * 0.6); // credited baseline; not penalized
  } else {
    // Experienced candidates: evaluate role alignment, active verbs, and depth
    const hasRoleMatchExp = profile.experiences.some(e =>
      e.title.toLowerCase().includes(roleConfig.title.toLowerCase()) ||
      roleConfig.topSearchKeywords.some(kw => e.title.toLowerCase().includes(kw.toLowerCase()))
    );
    if (hasRoleMatchExp) expScore += 5;
    else if (profile.experiences.length > 0) expScore += 3;

    const passiveRatio = totalBullets > 0 ? passiveBullets.length / totalBullets : 0;
    if (passiveRatio <= 0.25) expScore += 5;
    else if (passiveRatio <= 0.5) expScore += 3;
    else expScore += 1;

    if (totalBullets >= 4) expScore += 5;
    else if (totalBullets >= 2) expScore += 3;
    else expScore += 1;
  }

  const actualExp = Math.min(maxExp, expScore);
  components.push({
    key: 'experienceRelevance',
    name: isFresher ? 'Internship & Practical Experience' : 'Experience Relevance & Action Verbs',
    weight: maxExp,
    max: maxExp,
    score: actualExp,
    headroom: maxExp - actualExp,
    status: actualExp >= Math.round(maxExp * 0.75) ? 'good' : actualExp >= Math.round(maxExp * 0.45) ? 'warn' : 'bad',
    issue: isFresher
      ? (profile.experiences.length === 0 ? 'No internship or lab training documented. Projects carry primary evaluation weight.' : 'Internship documented.')
      : (passiveBullets.length > 0
          ? `${passiveBullets.length} of ${totalBullets} bullets start with passive phrasing ("Responsible for", "Helped with").`
          : 'Active verb openings throughout experience.'),
    fix: isFresher
      ? 'Include any industrial training, college labs, hackathons, or open-source contributions.'
      : 'Start every bullet with a strong action verb (Architected, Engineered, Optimized, Spearheaded).',
    example: 'Engineered high-throughput REST APIs in Spring Boot, reducing response latency by 35%.',
    evidence: passiveBullets.slice(0, 2)
  });

  // =========================================================================
  // 5. Achievement & Impact Quality (Weight 10)
  // =========================================================================
  let impactScore = 0;
  const maxImpact = weights.achievementImpact;
  const metricRatio = totalBullets > 0 ? metricsInBullets.length / totalBullets : (profile.achievements.length > 0 ? 0.6 : 0);

  if (metricRatio >= 0.5) impactScore += 6;
  else if (metricRatio >= 0.25) impactScore += 4;
  else if (metricsInBullets.length > 0) impactScore += 2;

  if (profile.achievements.length >= 2) impactScore += 4;
  else if (profile.achievements.length === 1 || metricsInBullets.length >= 2) impactScore += 3;
  else impactScore += 1;

  const actualImpact = Math.min(maxImpact, impactScore);
  components.push({
    key: 'achievementImpact',
    name: 'Achievement & Quantified Impact',
    weight: maxImpact,
    max: maxImpact,
    score: actualImpact,
    headroom: maxImpact - actualImpact,
    status: actualImpact >= Math.round(maxImpact * 0.7) ? 'good' : actualImpact >= Math.round(maxImpact * 0.4) ? 'warn' : 'bad',
    issue: metricsInBullets.length < 2
      ? `Only ${metricsInBullets.length} of ${totalBullets} bullets contain quantifiable results (%, numbers, currency, or scale).`
      : 'Strong evidence of quantifiable results.',
    fix: 'Use the XYZ formula: Accomplished [X] as measured by [Y] by doing [Z]. Where data is missing, use metric-ready placeholders.',
    example: 'Slashing query latency by 45% (from 420ms to 95ms) across 2M daily records.',
    evidence: metricsInBullets.slice(0, 2)
  });

  // =========================================================================
  // 6. Projects & Portfolio (Weight 12 standard, 19 fresher)
  // =========================================================================
  let projScore = 0;
  const maxProj = weights.projectsPortfolio;
  const projCount = profile.projects.length;

  if (isFresher) {
    if (projCount >= 3) projScore = maxProj;
    else if (projCount === 2) projScore = Math.round(maxProj * 0.85);
    else if (projCount === 1) projScore = Math.round(maxProj * 0.55);
    else projScore = Math.round(maxProj * 0.2);
  } else {
    if (projCount >= 2) projScore = maxProj;
    else if (projCount === 1) projScore = Math.round(maxProj * 0.7);
    else if (totalBullets >= 6) projScore = Math.round(maxProj * 0.6); // Credit production deliverables
    else projScore = Math.round(maxProj * 0.3);
  }

  const actualProj = Math.min(maxProj, projScore);
  components.push({
    key: 'projectsPortfolio',
    name: isFresher ? 'Independent Projects & Proof of Work' : 'Projects & Technical Portfolio',
    weight: maxProj,
    max: maxProj,
    score: actualProj,
    headroom: maxProj - actualProj,
    status: actualProj >= Math.round(maxProj * 0.7) ? 'good' : actualProj >= Math.round(maxProj * 0.4) ? 'warn' : 'bad',
    issue: projCount < 2
      ? `Profile showcases ${projCount} project${projCount === 1 ? '' : 's'}. ${isFresher ? 'For freshers, 2-3 detailed projects are essential.' : 'At least 1-2 featured projects validate hands-on technical competence.'}`
      : 'Demonstrates verified hands-on projects.',
    fix: 'Document 2 featured projects: specify problem solved, technical stack, architecture, and include GitHub / live demo links.',
    example: 'E-Commerce Order Processor: Microservice handling 5,000 req/sec with Redis queue and Spring Boot.',
    evidence: profile.projects.map(p => p.title).slice(0, 2)
  });

  // =========================================================================
  // 7. Education & Certifications (Weight 8)
  // =========================================================================
  let eduScore = 0;
  const maxEdu = weights.educationCertifications;
  const hasDegree = profile.education.some(e => e.degree && e.degree.length > 2);
  const hasInstitution = profile.education.some(e => e.institution && e.institution.length > 2);
  const hasCert = profile.certifications.length > 0;

  if (hasDegree) eduScore += 3;
  if (hasInstitution) eduScore += 2;
  if (hasCert) eduScore += 3;
  else if (profile.education.some(e => e.score && e.score.length > 1)) eduScore += 2;

  const actualEdu = Math.min(maxEdu, eduScore);
  components.push({
    key: 'educationCertifications',
    name: 'Education Credentials & Certifications',
    weight: maxEdu,
    max: maxEdu,
    score: actualEdu,
    headroom: maxEdu - actualEdu,
    status: actualEdu >= Math.round(maxEdu * 0.75) ? 'good' : actualEdu >= Math.round(maxEdu * 0.5) ? 'warn' : 'bad',
    issue: !hasCert
      ? 'No recognized industry certifications (e.g. AWS, Oracle, CKA) detected. Certifications provide strong trust signals.'
      : !hasDegree ? 'Degree or university name is not clearly segmented.' : 'Education details complete.',
    fix: 'List accredited degrees with passing year, and include valid industry certifications with credential IDs.',
    example: 'B.Tech in Computer Science · 2021 | AWS Certified Solutions Architect Associate',
    evidence: profile.education.map(e => `${e.degree} at ${e.institution}`).slice(0, 1)
  });

  // =========================================================================
  // 8. ATS & Readability (Weight 8)
  // =========================================================================
  const expConf = profile.sectionConfidence?.experience ?? 75;
  const eduConf = profile.sectionConfidence?.education ?? 75;
  const skillConf = profile.sectionConfidence?.skills ?? 75;
  const avgConf = (expConf + eduConf + skillConf) / 3;
  const maxAts = weights.atsReadability;
  const actualAts = Math.min(maxAts, Math.max(2, Math.round((avgConf / 100) * maxAts)));

  components.push({
    key: 'atsReadability',
    name: 'ATS Parseability & Section Structure',
    weight: maxAts,
    max: maxAts,
    score: actualAts,
    headroom: maxAts - actualAts,
    status: actualAts >= Math.round(maxAts * 0.75) ? 'good' : actualAts >= Math.round(maxAts * 0.5) ? 'warn' : 'bad',
    issue: actualAts < Math.round(maxAts * 0.75)
      ? 'Non-standard headings or multi-column layout degrades automated ATS parsing accuracy.'
      : 'Clean single-column structure parsed cleanly.',
    fix: 'Use standard uppercase section headers: SUMMARY, EXPERIENCE, EDUCATION, SKILLS, PROJECTS.',
    example: 'EXPERIENCE\nSenior Software Engineer | TCS | Jul 2021 - Present',
    evidence: [`Parser Confidence: ${Math.round(avgConf)}%`]
  });

  // =========================================================================
  // 9. Target Role & JD Alignment (Weight 8)
  // =========================================================================
  let roleAlignScore = 0;
  const maxRoleAlign = weights.targetRoleAlignment;
  const rawTextLower = (profile.rawText || '').toLowerCase();
  const searchKwsMatched = roleConfig.topSearchKeywords.filter(kw => rawTextLower.includes(kw.toLowerCase()));
  const kwMatchRatio = roleConfig.topSearchKeywords.length > 0 ? searchKwsMatched.length / roleConfig.topSearchKeywords.length : 1;

  roleAlignScore += Math.round(kwMatchRatio * 5);
  if (profile.targetCities.length > 0) roleAlignScore += 2;
  if (profile.targetRoleId) roleAlignScore += 1;

  const actualRoleAlign = Math.min(maxRoleAlign, roleAlignScore);
  components.push({
    key: 'targetRoleAlignment',
    name: 'Target Role & Search Alignment',
    weight: maxRoleAlign,
    max: maxRoleAlign,
    score: actualRoleAlign,
    headroom: maxRoleAlign - actualRoleAlign,
    status: actualRoleAlign >= Math.round(maxRoleAlign * 0.75) ? 'good' : actualRoleAlign >= Math.round(maxRoleAlign * 0.5) ? 'warn' : 'bad',
    issue: kwMatchRatio < 0.6
      ? `Matches ${searchKwsMatched.length} of ${roleConfig.topSearchKeywords.length} primary recruiter search queries for ${roleConfig.title}.`
      : 'Well aligned with recruiter search parameters.',
    fix: `Incorporate search terms naturally into summary and bullets: ${roleConfig.topSearchKeywords.slice(0, 4).join(', ')}.`,
    example: roleConfig.topSearchKeywords.slice(0, 4).join(', '),
    evidence: [`Target: ${profile.targetRole || roleConfig.title}`, `Cities: ${profile.targetCities.join(', ')}`]
  });

  // =========================================================================
  // 10. Completeness & Consistency (Weight 4)
  // =========================================================================
  let compScore = 0;
  const maxComp = weights.completenessConsistency;
  const hasEmail = Boolean(profile.email && profile.email.includes('@'));
  const hasPhone = Boolean(profile.phone && profile.phone.replace(/\D/g, '').length >= 10);

  if (hasEmail) compScore += 2;
  if (hasPhone) compScore += 2;

  const actualComp = Math.min(maxComp, compScore);
  components.push({
    key: 'completenessConsistency',
    name: 'Contact Integrity & Consistency',
    weight: maxComp,
    max: maxComp,
    score: actualComp,
    headroom: maxComp - actualComp,
    status: actualComp === maxComp ? 'good' : 'bad',
    issue: actualComp < maxComp ? 'Missing verified email address or valid 10-digit Indian phone number.' : 'Direct contact details verified.',
    fix: 'Ensure your professional email and 10-digit reachable mobile number (+91) are present at the top.',
    example: 'candidate@example.com | +91 98765 43210',
    evidence: [profile.email || 'No email', profile.phone || 'No phone'].filter(Boolean)
  });

  // Calculate overall score (strict sum of component points)
  const overallScore = components.reduce((sum, c) => sum + c.score, 0);
  const totalMax = components.reduce((sum, c) => sum + c.max, 0);
  const headroomTotal = Math.max(0, totalMax - overallScore);

  const verdict: 'Weak' | 'Okay' | 'Strong' | 'Needs Work' =
    overallScore >= 80 ? 'Strong' : overallScore >= 60 ? 'Okay' : 'Needs Work';

  // =========================================================================
  // SIMULATION OF PROJECTED GAINS (No hardcoded points; strictly capped by headroom)
  // =========================================================================
  const componentsWithHeadroom = components.filter(c => (c.headroom ?? (c.max - c.score)) > 0);

  const topFixes: TopFixItem[] = componentsWithHeadroom
    .map(c => {
      const componentHeadroom = c.headroom ?? (c.max - c.score);
      // Simulate fixing this specific component: projected points yield from actual headroom
      const points = Math.min(componentHeadroom, Math.max(1, componentHeadroom));
      const projectedScore = Math.min(totalMax, overallScore + points);

      let actionTab = 'dashboard';
      if (c.key === 'headlineClarity') actionTab = 'headlines';
      else if (c.key === 'skillKeywordRelevance') actionTab = 'keywords';
      else if (c.key === 'experienceRelevance' || c.key === 'achievementImpact') actionTab = 'rewriter';
      else if (c.key === 'projectsPortfolio') actionTab = 'review';
      else if (c.key === 'targetRoleAlignment') actionTab = 'job-fit';
      else if (c.key === 'educationCertifications') actionTab = 'review';

      return {
        title: `Resolve ${c.name}`,
        points,
        actionTab,
        componentKey: c.key as string,
        description: c.issue,
        projectedScore
      };
    })
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return {
    overallScore,
    verdict,
    components,
    topFixes,
    isFresher,
    totalMax,
    headroomTotal,
    normalizationNote
  };
}
