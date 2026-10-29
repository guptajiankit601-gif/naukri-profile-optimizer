import { ParsedProfile } from '@/types';
import { ROLES } from '@/lib/data/roles';

/**
 * Strips unresolved placeholders like [Phone Number], [Email Address], [Add URL], [add verified metric...]
 * from text to produce clean, copy-ready outputs.
 */
export function sanitizeCopyText(raw: string): string {
  if (!raw) return '';

  let cleaned = raw
    // Remove specific known bracketed placeholders
    .replace(/\[(?:Phone\s*Number|Phone|Email\s*Address|Email|Add\s*URL|URL|Your\s*Location|Location|Company|Target\s*Company)\]/gi, '')
    // Remove [add verified metric...] placeholders
    .replace(/\[(?:add\s*verified\s*[^\]]+)\]/gi, '');

  // Repeatedly clean stranded delimiters until edges and multiples are stripped
  for (let i = 0; i < 4; i++) {
    cleaned = cleaned
      .replace(/\|\s*\|+/g, '|')
      .replace(/[·•]\s*[·•]+/g, '·')
      .replace(/^\s*[|·•-]\s*/gm, '')
      .replace(/\s*[|·•-]\s*$/gm, '');
  }

  return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Returns safe location string (or fallback omission)
 */
export function getSafeLocation(profile: ParsedProfile): string {
  if (!profile.location) return '';
  const clean = sanitizeCopyText(profile.location);
  if (!clean || clean.toLowerCase().includes('location') || clean.includes('[')) return '';
  return clean.split(',')[0].trim();
}

/**
 * Formats clean contact string for profile headers without empty delimiters
 */
export function formatContactLine(profile: ParsedProfile): string {
  const parts: string[] = [];
  
  if (profile.location && !profile.location.includes('[')) {
    const loc = profile.location.split(',')[0].trim();
    if (loc) parts.push(loc);
  }
  
  if (profile.phone && !profile.phone.includes('[')) {
    const cleanPhone = profile.phone.trim();
    if (cleanPhone.length >= 8) parts.push(cleanPhone);
  }
  
  if (profile.email && !profile.email.includes('[') && profile.email.includes('@')) {
    parts.push(profile.email.trim());
  }

  return parts.join(' · ');
}

export interface PlatformProfiles {
  naukri: {
    headline: string;
    headlineCharCount: number;
    primarySkillsCluster: string;
    toolsCluster: string;
    architectureCluster: string;
    summary: string;
    summaryCharCount: number;
  };
  linkedIn: {
    headline: string;
    headlineCharCount: number;
    about: string;
    aboutCharCount: number;
  };
  missingFields: {
    field: string;
    label: string;
    recommendation: string;
  }[];
}

/**
 * Generates tailored, placeholder-free copy blocks for Naukri and LinkedIn
 */
export function generatePlatformProfiles(profile: ParsedProfile): PlatformProfiles {
  const roleConfig = ROLES.find(r => r.id === profile.targetRoleId) || ROLES[0];
  const primarySkills = (profile.skills || []).slice(0, 3).join(' & ') || 'Core Technologies';
  const topCompany = profile.experiences?.[0]?.company;
  const safeLoc = getSafeLocation(profile);

  // Check missing credentials to prompt user cleanly without embedding placeholders
  const missingFields: { field: string; label: string; recommendation: string }[] = [];
  if (!profile.phone || profile.phone.includes('[')) {
    missingFields.push({
      field: 'phone',
      label: 'Phone Number',
      recommendation: 'Add your 10-digit Indian phone number so recruiters on Naukri can reach you directly.'
    });
  }
  if (!profile.email || !profile.email.includes('@') || profile.email.includes('[')) {
    missingFields.push({
      field: 'email',
      label: 'Email Address',
      recommendation: 'Add a verified professional email address for interview scheduling.'
    });
  }
  if (!profile.location || profile.location.includes('[')) {
    missingFields.push({
      field: 'location',
      label: 'Target Metro City',
      recommendation: 'Set your preferred hiring location (e.g. Bengaluru, Pune, Hyderabad) to match metro filters.'
    });
  }

  // Naukri Headline (Optimized for search queries, under 250 chars)
  const naukriHeadlineRaw = safeLoc 
    ? `${profile.targetRole || roleConfig.name} | ${primarySkills} | ${profile.experienceBand} Yrs Exp | ${safeLoc}`
    : `${profile.targetRole || roleConfig.name} | ${primarySkills} | ${profile.experienceBand} Yrs Exp`;
  const naukriHeadline = sanitizeCopyText(naukriHeadlineRaw);

  // 3-Category Skill Clusters for Naukri
  const primarySkillsList = (profile.skills || []).slice(0, 8);
  const toolSkillsList = (profile.skills || []).filter(s =>
    /docker|aws|azure|gcp|git|ci|cd|jenkins|kubernetes|linux|redis|kafka|graphql|mysql|postgres|mongodb|sql/i.test(s)
  );
  const architectureSkillsList = [
    'RESTful APIs',
    'Microservices Architecture',
    'Agile/Scrum',
    'System Design',
    'Performance Optimization'
  ];

  const primarySkillsCluster = primarySkillsList.join(', ') || 'Java, Spring Boot, Microservices, SQL';
  const toolsCluster = (toolSkillsList.length > 0 ? toolSkillsList : ['Docker', 'AWS', 'PostgreSQL', 'Redis', 'Git']).join(', ');
  const architectureCluster = architectureSkillsList.join(', ');

  // Naukri Profile Summary (10-second recruiter pitch, concise)
  const safeProfileSummary = profile.summary && !profile.summary.includes('[')
    ? profile.summary.trim()
    : 'Proven track record of engineering scalable, reliable software systems and collaborating in agile product delivery teams.';

  const naukriSummaryRaw = `${profile.headline || roleConfig.name} with ${profile.experienceBand} years experience.\n\nKey Highlights:\n- Core Technical Focus: ${primarySkillsCluster}\n- Infrastructure & Tools: ${toolsCluster}\n- Architectural Practices: ${architectureCluster}\n\n${safeProfileSummary}`;
  const naukriSummary = sanitizeCopyText(naukriSummaryRaw);

  // LinkedIn Headline (Pipe separated, authority formula, under 220 chars)
  const linkedInHeadlineRaw = topCompany && !topCompany.includes('[')
    ? `${profile.targetRole || roleConfig.name} @ ${topCompany} | ${primarySkills} | Scalable Systems`
    : `${profile.targetRole || roleConfig.name} | ${(profile.skills || []).slice(0, 4).join(' • ') || 'Core Technologies'} | Open to Opportunities`;
  const linkedInHeadline = sanitizeCopyText(linkedInHeadlineRaw);

  // LinkedIn About (Story-driven, clear contact footer without placeholders)
  const contactLines: string[] = [];
  if (profile.email && !profile.email.includes('[') && profile.email.includes('@')) {
    contactLines.push(`Email: ${profile.email.trim()}`);
  }
  if (profile.phone && !profile.phone.includes('[') && profile.phone.trim().length >= 8) {
    contactLines.push(`Phone: ${profile.phone.trim()}`);
  }
  if (safeLoc) {
    contactLines.push(`Location: ${safeLoc}`);
  }

  const contactFooter = contactLines.length > 0 
    ? `\n\n📫 Reach Out:\n${contactLines.join(' · ')}`
    : '';

  const linkedInAboutRaw = `I am a ${profile.targetRole || roleConfig.name} with ${profile.experienceBand} years experience in software engineering.\n\n${safeProfileSummary}\n\n💡 Core Tech Stack:\n${(profile.skills || []).slice(0, 12).join(' • ')}${contactFooter}`;
  const linkedInAbout = sanitizeCopyText(linkedInAboutRaw);

  return {
    naukri: {
      headline: naukriHeadline,
      headlineCharCount: naukriHeadline.length,
      primarySkillsCluster,
      toolsCluster,
      architectureCluster,
      summary: naukriSummary,
      summaryCharCount: naukriSummary.length
    },
    linkedIn: {
      headline: linkedInHeadline,
      headlineCharCount: linkedInHeadline.length,
      about: linkedInAbout,
      aboutCharCount: linkedInAbout.length
    },
    missingFields
  };
}
