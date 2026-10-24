import mammoth from 'mammoth';
import { detectSections } from './detect-sections';
import { extractExperience } from './extract-experience';
import { extractEducation } from './extract-education';
import { extractSkills } from './extract-skills';
import { scoreConfidence } from './confidence';
import { ParsedProfile, ExperienceBand } from '@/types';

export async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

export function parseRawResumeText(rawText: string, defaultRole: string = 'backend-engineer'): ParsedProfile {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const sections = detectSections(rawText);

  // Email and phone
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  const email = emailMatch ? emailMatch[0] : '';
  const phone = phoneMatch ? phoneMatch[0] : '';
  const name = lines[0] && lines[0].length < 40 ? lines[0] : 'Candidate';

  // Headline
  let headline = '';
  if (sections.header.length > 1) {
    headline = sections.header.slice(1, 3).filter(l => !l.includes('@') && !l.match(/\d{5,}/)).join(' | ');
  }
  if (!headline) {
    headline = lines.find(l => l.length < 90 && (l.toLowerCase().includes('engineer') || l.toLowerCase().includes('developer') || l.toLowerCase().includes('manager'))) || 'Software Professional';
  }

  // Skills
  const skills = extractSkills(rawText, sections.skills);

  // Experiences
  const experiences = extractExperience(sections.experience);

  // Education
  const education = extractEducation(sections.education);

  // Experience band
  let expBand: ExperienceBand = 'Fresher';
  const yearsMatch = rawText.match(/(\d+)\+?\s*years?(?:\s*of)?\s*experience/i);
  if (yearsMatch) {
    const yrs = parseInt(yearsMatch[1], 10);
    if (yrs >= 8) expBand = '8+';
    else if (yrs >= 5) expBand = '5-8';
    else if (yrs >= 3) expBand = '3-5';
    else if (yrs >= 1) expBand = '1-3';
  } else if (experiences.length >= 2) {
    expBand = '3-5';
  } else if (experiences.length === 1 && !experiences[0].title.toLowerCase().includes('intern')) {
    expBand = '1-3';
  }

  const confidence = scoreConfidence(sections, skills.length);

  return {
    id: `prof-${Date.now()}`,
    name,
    email,
    phone,
    location: 'Bengaluru, India',
    targetRole: defaultRole,
    targetRoleId: defaultRole,
    experienceBand: expBand,
    targetCities: ['Bangalore / Bengaluru', 'Hyderabad', 'Pune'],
    expectedSalaryLakhs: expBand === 'Fresher' ? 6 : expBand === '1-3' ? 10 : expBand === '3-5' ? 18 : 25,
    headline,
    summary: sections.summary.join(' ') || lines.slice(1, 4).join(' '),
    skills,
    experiences,
    education,
    projects: [],
    certifications: sections.certifications.filter(c => c.length > 4),
    achievements: [],
    rawText,
    sectionConfidence: confidence
  };
}
