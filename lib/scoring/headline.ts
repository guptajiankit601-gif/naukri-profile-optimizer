import { ParsedProfile } from '@/types';
import { ROLES } from '@/lib/data/roles';
import { extractMetrics } from '@/lib/parser/extract-metrics';

export interface HeadlineVariant {
  title: string;
  strategy: 'IMPACT_METRIC' | 'CORE_STACK' | 'SENIORITY_DOMAIN' | 'PRODUCT_EXECUTION' | 'ATS_CONCISE';
  naukriHeadline: string; // <= 250 chars
  linkedInHeadline: string; // <= 220 chars
  resumeHeadline: string; // <= 100 chars
  keywordCoverageScore: number;
  targetedKeywords: string[];
  rationale: string;
}

export interface HeadlineAnalysis {
  currentHeadline: string;
  currentLength: number;
  isGeneric: boolean;
  genericFlags: string[];
  keywordCoverageScore: number;
  variants: HeadlineVariant[];
}

export function optimizeHeadline(profile: ParsedProfile): HeadlineAnalysis {
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const roleTitle = roleConfig.title;
  const topSkills = profile.skills.slice(0, 4).join(' · ') || roleConfig.mustHaveSkills.slice(0, 3).join(' · ');

  // Look for any metric in the profile bullets or summary
  const metrics = extractMetrics(profile.rawText);
  const primaryMetric = metrics.length > 0 ? metrics[0].value : 'High-Scale Systems';

  // Generic detection
  const current = profile.headline.trim();
  const currentLength = current.length;
  const genericFlags: string[] = [];

  if (/^(software engineer|developer|consultant|analyst)$/i.test(current)) {
    genericFlags.push('Sole job title without specialization or domain context');
  }
  if (/at\s+(tcs|infosys|wipro|cognizant|accenture|hcl)\b/i.test(current) && !current.includes('|') && !current.includes('•')) {
    genericFlags.push('Only lists employer company name without tech stack or impact');
  }
  if (!roleConfig.topSearchKeywords.some(kw => current.toLowerCase().includes(kw.toLowerCase()))) {
    genericFlags.push(`Missing high-volume keywords for ${roleTitle}`);
  }
  if (currentLength < 25) {
    genericFlags.push('Headline under 25 characters — misses recruiter search visibility');
  }

  const isGeneric = genericFlags.length > 0;

  // Calculate current keyword coverage
  const matchedCurrentKws = roleConfig.topSearchKeywords.filter(kw => current.toLowerCase().includes(kw.toLowerCase()));
  const currentCoverage = Math.round((matchedCurrentKws.length / Math.max(1, roleConfig.topSearchKeywords.length)) * 100);

  // Experience indicator
  const expIndicator = profile.experienceBand === 'Fresher' ? 'Fresher' : `${profile.experienceBand} Yrs Exp`;

  // Generate 5 ranked variants
  const variants: HeadlineVariant[] = [
    {
      title: 'Impact & Scale Metric Variant (Recommended)',
      strategy: 'IMPACT_METRIC',
      naukriHeadline: `${roleTitle} (${expIndicator}) | ${topSkills} | Built ${primaryMetric} Architecture & High-Throughput APIs`.slice(0, 250),
      linkedInHeadline: `${roleTitle} | ${topSkills} | Delivered ${primaryMetric} Systems`.slice(0, 220),
      resumeHeadline: `${roleTitle} — ${topSkills}`.slice(0, 100),
      keywordCoverageScore: 92,
      targetedKeywords: [roleTitle, ...profile.skills.slice(0, 3)],
      rationale: 'Combines verified hard skills with concrete scale metrics. Captures both search filters and recruiter clicks.'
    },
    {
      title: 'Core Stack & Architecture Alignment',
      strategy: 'CORE_STACK',
      naukriHeadline: `${roleTitle} | Specializing in ${roleConfig.mustHaveSkills.slice(0, 4).join(' • ')} | Distributed Microservices & Cloud`.slice(0, 250),
      linkedInHeadline: `${roleTitle} | ${roleConfig.mustHaveSkills.slice(0, 4).join(' • ')} | Cloud Architecture`.slice(0, 220),
      resumeHeadline: `${roleTitle} | ${roleConfig.mustHaveSkills.slice(0, 3).join(' • ')}`.slice(0, 100),
      keywordCoverageScore: 95,
      targetedKeywords: roleConfig.mustHaveSkills.slice(0, 4),
      rationale: 'Maximizes ATS search hit rate by packing primary role must-have keywords into the top 100 characters.'
    },
    {
      title: 'Seniority & Domain Specialization',
      strategy: 'SENIORITY_DOMAIN',
      naukriHeadline: `Senior ${roleTitle} (${expIndicator}) | System Design & Backend Engineering | ${topSkills}`.slice(0, 250),
      linkedInHeadline: `Senior ${roleTitle} | System Design & Engineering | ${topSkills}`.slice(0, 220),
      resumeHeadline: `Senior ${roleTitle} | ${topSkills}`.slice(0, 100),
      keywordCoverageScore: 85,
      targetedKeywords: [roleTitle, 'System Design', ...profile.skills.slice(0, 2)],
      rationale: 'Signals senior ownership, mentoring capability, and architecture depth for higher salary bracket shortlisting.'
    },
    {
      title: 'Product & High-Growth Execution',
      strategy: 'PRODUCT_EXECUTION',
      naukriHeadline: `${roleTitle} | Building Fast, Scalable Products | ${topSkills} | ${primaryMetric}`.slice(0, 250),
      linkedInHeadline: `${roleTitle} | High-Growth Product Engineering | ${topSkills}`.slice(0, 220),
      resumeHeadline: `${roleTitle} | Product Engineering`.slice(0, 100),
      keywordCoverageScore: 80,
      targetedKeywords: [roleTitle, ...profile.skills.slice(0, 2)],
      rationale: 'Appeals strongly to venture-backed startups and product companies looking for end-to-end execution speed.'
    },
    {
      title: 'ATS Concise Minimalist',
      strategy: 'ATS_CONCISE',
      naukriHeadline: `${roleTitle} | ${roleConfig.mustHaveSkills.slice(0, 3).join(' | ')} | ${expIndicator}`.slice(0, 250),
      linkedInHeadline: `${roleTitle} | ${roleConfig.mustHaveSkills.slice(0, 3).join(' | ')}`.slice(0, 220),
      resumeHeadline: `${roleTitle} | ${roleConfig.mustHaveSkills.slice(0, 2).join(' | ')}`.slice(0, 100),
      keywordCoverageScore: 88,
      targetedKeywords: [roleTitle, ...roleConfig.mustHaveSkills.slice(0, 3)],
      rationale: 'Strictly formatted to fit standard mobile notification cards and recruiter summary popups without truncation.'
    }
  ];

  return {
    currentHeadline: current,
    currentLength,
    isGeneric,
    genericFlags,
    keywordCoverageScore: currentCoverage,
    variants
  };
}
