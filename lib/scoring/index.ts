import { ParsedProfile, ScoreReport, ComponentResult } from '@/types';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { PASSIVE_PHRASES } from '@/lib/data/verbs';
import { ROLES } from '@/lib/data/roles';
import { COMPONENT_WEIGHTS } from './weights';

export function calculateScore(profile: ParsedProfile): ScoreReport {
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const allBullets = profile.experiences.flatMap(e => e.bullets);
  const totalBullets = allBullets.length;
  const metricsInBullets = allBullets.filter(b => extractMetrics(b).length > 0);
  const passiveBullets = allBullets.filter(b => PASSIVE_PHRASES.some(p => b.toLowerCase().includes(p)));

  const components: ComponentResult[] = [];

  // 1. Headline Clarity (Weight 12)
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
      ? 'Headline is generic or lacks targeted keywords (e.g. "Software Engineer at TCS").' 
      : 'Headline contains key role indicators.',
    fix: 'Use platform format: Role Title | Core Specialization | Top Impact Metric',
    example: roleConfig.headlineTemplates.naukri[0] || 'Senior Engineer | Distributed Systems | Cloud Native'
  });

  // 2. Summary Quality (Weight 10)
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
      ? 'Contains passive objective phrasing ("seeking an opportunity to grow") which recruiters skip.'
      : summaryWords < 20 ? 'Summary is too brief to convey your value proposition.' : 'Well balanced summary.',
    fix: 'State who you are, your core domains, and your highest quantified achievement in 3 crisp sentences.',
    example: 'Backend Engineer with 3+ years experience scaling Java/Spring Boot microservices. Reduced p99 latency by 35% across 5M daily transactions.'
  });

  // 3. Experience Bullet Quality (Weight 20)
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
      ? `Only ${metricsInBullets.length} of ${totalBullets} bullets have quantifiable numbers (%, ₹, scale).`
      : 'Good quantification across bullets.',
    fix: 'Upgrade passive openings like "Responsible for" to power verbs (Architected, Spearheaded, Optimized) and add numbers.',
    example: 'Optimized PostgreSQL queries by indexing high-cardinality keys, slashing API response times from 420ms to 95ms.'
  });

  // 4. Skills Section Structure (Weight 15)
  let skillsScore = 0;
  const skillCount = profile.skills.length;
  const mustHavesMatched = roleConfig.mustHaveSkills.filter(mh => 
    profile.skills.some(s => s.toLowerCase() === mh.toLowerCase())
  ).length;

  if (skillCount >= 8 && skillCount <= 22) skillsScore += 7;
  else if (skillCount > 22 && skillCount <= 35) skillsScore += 4;
  else if (skillCount > 35) skillsScore += 2;
  else skillsScore += 3;

  const mustHaveRatio = roleConfig.mustHaveSkills.length > 0 
    ? mustHavesMatched / roleConfig.mustHaveSkills.length 
    : 0;
  skillsScore += Math.round(mustHaveRatio * 8);

  components.push({
    key: 'skillStructure',
    name: 'Skills Section Structure',
    weight: COMPONENT_WEIGHTS.skillStructure,
    max: COMPONENT_WEIGHTS.skillStructure,
    score: Math.min(COMPONENT_WEIGHTS.skillStructure, skillsScore),
    status: skillsScore >= 11 ? 'good' : skillsScore >= 7 ? 'warn' : 'bad',
    issue: skillCount > 30
      ? `You list ${skillCount} skills. Recruiters scan top 15. Cut clutter skills to prevent dilution.`
      : mustHavesMatched < roleConfig.mustHaveSkills.length 
      ? `Missing ${roleConfig.mustHaveSkills.length - mustHavesMatched} critical role keywords.` 
      : 'Clean, focused skill inventory.',
    fix: 'Group skills into 3 clean categories: Core Technologies, Frameworks & Cloud, Tools & Methodologies. Keep under 20.',
    example: 'Core: Java 17, Spring Boot | Cloud & Data: AWS, PostgreSQL, Kafka, Redis | Tools: Docker, Git, CI/CD'
  });

  // 5. Education Detail (Weight 5)
  let eduScore = 0;
  if (profile.education.length > 0) {
    eduScore += 3;
    if (profile.education.some(e => e.year && e.score)) eduScore += 2;
    else if (profile.education.some(e => e.year)) eduScore += 1;
  }
  components.push({
    key: 'educationDetail',
    name: 'Education Detail',
    weight: COMPONENT_WEIGHTS.educationDetail,
    max: COMPONENT_WEIGHTS.educationDetail,
    score: Math.min(COMPONENT_WEIGHTS.educationDetail, eduScore),
    status: eduScore >= 4 ? 'good' : 'warn',
    issue: eduScore < 4 ? 'Missing graduation year or CGPA/percentage marks.' : 'Clear academic credentials.',
    fix: 'Provide Degree, University, Graduation Year, and CGPA/Percentage for Indian recruiter screening.',
    example: 'B.Tech in Computer Science | VTU Bengaluru | 2021 | 8.2 CGPA'
  });

  // 6. Projects & Proof (Weight 8)
  let projScore = profile.projects.length >= 2 ? 6 : profile.projects.length === 1 ? 4 : 2;
  if (profile.projects.some(p => p.technologies && p.technologies.length > 0)) projScore += 2;
  components.push({
    key: 'projectsProof',
    name: 'Projects & Proof',
    weight: COMPONENT_WEIGHTS.projectsProof,
    max: COMPONENT_WEIGHTS.projectsProof,
    score: Math.min(COMPONENT_WEIGHTS.projectsProof, projScore),
    status: projScore >= 6 ? 'good' : 'warn',
    issue: profile.projects.length === 0 ? 'No independent or open source projects listed.' : 'Project portfolio present.',
    fix: 'List 2 production-grade projects with live URLs or GitHub links and explicit technology tags.',
    example: 'E-Commerce Microservices Engine (React, Spring Boot, Kafka, AWS) - [github.com/repo]'
  });

  // 7. Certifications (Weight 5)
  const certScore = profile.certifications.length >= 2 ? 5 : profile.certifications.length === 1 ? 3 : 1;
  components.push({
    key: 'certifications',
    name: 'Certifications',
    weight: COMPONENT_WEIGHTS.certifications,
    max: COMPONENT_WEIGHTS.certifications,
    score: certScore,
    status: certScore >= 3 ? 'good' : 'warn',
    issue: profile.certifications.length === 0 ? 'No industry certifications listed.' : 'Recognized certification listed.',
    fix: 'Add recognized vendor certifications (AWS Certified Solutions Architect, Oracle OCAJP, Meta Certified).',
    example: 'AWS Certified Solutions Architect – Associate (2024)'
  });

  // 8. ATS / Parseability (Weight 10)
  const atsScore = (profile.experiences.length > 0 && profile.skills.length > 0 && profile.education.length > 0) ? 10 : 8;
  components.push({
    key: 'parseability',
    name: 'ATS / Parseability',
    weight: COMPONENT_WEIGHTS.parseability,
    max: COMPONENT_WEIGHTS.parseability,
    score: atsScore,
    status: 'good',
    issue: 'Clear text hierarchy without conflicting tables or text columns.',
    fix: 'Ensure single-column flow with standard section headers recognized by enterprise ATS.',
    example: 'Standard headings: Summary, Experience, Education, Skills, Projects'
  });

  // 9. Platform Consistency (Weight 10)
  let consistencyScore = 0;
  if (profile.targetCities.length > 0) consistencyScore += 4;
  if (profile.headline.length > 20 && profile.headline.length < 120) consistencyScore += 3;
  if (profile.experiences.every(e => e.startDate && e.endDate)) consistencyScore += 3;

  components.push({
    key: 'platformConsistency',
    name: 'Platform Consistency',
    weight: COMPONENT_WEIGHTS.platformConsistency,
    max: COMPONENT_WEIGHTS.platformConsistency,
    score: Math.min(COMPONENT_WEIGHTS.platformConsistency, consistencyScore),
    status: consistencyScore >= 7 ? 'good' : 'warn',
    issue: profile.targetCities.length === 0 ? 'No target metro cities specified.' : 'Location and timeline aligned.',
    fix: 'Ensure dates and job titles match across Naukri and LinkedIn profiles.',
    example: 'Consistent employment dates: Aug 2023 - Present'
  });

  // 10. Contact Credibility (Weight 5)
  let contactScore = 0;
  if (profile.email && profile.email.includes('@')) contactScore += 2;
  if (profile.phone && profile.phone.length >= 10) contactScore += 2;
  if (profile.location) contactScore += 1;

  components.push({
    key: 'contactCredibility',
    name: 'Contact & Credibility',
    weight: COMPONENT_WEIGHTS.contactCredibility,
    max: COMPONENT_WEIGHTS.contactCredibility,
    score: Math.min(COMPONENT_WEIGHTS.contactCredibility, contactScore),
    status: contactScore >= 4 ? 'good' : 'warn',
    issue: contactScore < 4 ? 'Missing professional contact channels.' : 'Complete contact details.',
    fix: 'Provide professional email, mobile with country code (+91), and current location city.',
    example: 'name@gmail.com | +91 98450 12345 | Bengaluru'
  });

  const overallScore = components.reduce((acc, c) => acc + c.score, 0);

  let verdict: 'Weak' | 'Okay' | 'Strong' = 'Weak';
  if (overallScore >= 71) verdict = 'Strong';
  else if (overallScore >= 41) verdict = 'Okay';

  const sortedIssues = [...components].sort((a, b) => (b.max - b.score) - (a.max - a.score));
  const topFixes = sortedIssues.slice(0, 3).map(comp => {
    let tab = 'keywords';
    if (comp.name.includes('Headline')) tab = 'headlines';
    else if (comp.name.includes('Bullet') || comp.name.includes('Experience')) tab = 'rewriter';
    else if (comp.name.includes('Skills')) tab = 'keywords';
    else if (comp.name.includes('Summary')) tab = 'rewriter';
    return {
      title: `Improve ${comp.name}: ${comp.fix.split('.')[0]}`,
      points: comp.max - comp.score,
      actionTab: tab
    };
  });

  return {
    overallScore,
    verdict,
    components,
    topFixes
  };
}
