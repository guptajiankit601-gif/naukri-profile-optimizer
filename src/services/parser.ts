import { ParsedProfile, ExperienceBand, ExperienceItem, EducationItem, ProjectItem } from '../types';
import { matchSkillsInText } from '../data/skills-dict';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up pdfjs worker using unpkg or dynamic import
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ParseResult {
  profile: ParsedProfile;
  metricsFound: string[];
  issues: string[];
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    return await file.text();
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      if (fullText.trim().length < 50) {
        throw new Error('SCANNED_PDF_DETECTED');
      }

      return fullText;
    } catch (err: unknown) {
      if ((err as Error)?.message === 'SCANNED_PDF_DETECTED') {
        throw new Error('This looks like a scanned/image-only PDF. Please paste your resume text manually for best accuracy.');
      }
      if ((err as { name?: string })?.name === 'PasswordException') {
        throw new Error('The PDF is password protected. Please remove password protection or paste your resume text.');
      }
      throw new Error('Unable to extract text from this PDF. Please copy and paste your resume text directly.');
    }
  }

  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT file.');
}

// Sweep text for numeric proof, %, currency, scale metrics
export function extractMetricsFromText(text: string): string[] {
  const metricRegexes = [
    /\b\d+(\.\d+)?\s*%/g,                             // Percentages: 45%, 99.9%
    /(?:₹|Rs\.?|INR)\s*\d+(\.\d+)?\s*(?:Cr|L|Lakh|K)?/gi, // Indian Currency: ₹18L, ₹2.4 Cr
    /\$\s*\d+(\.\d+)?\s*(?:M|K|B)?/gi,                 // USD: $120k
    /\b\d+(\.\d+)?\s*x\b/gi,                           // Multipliers: 3.8x, 10x
    /\b\d+\+?\s*(?:req\/sec|tps|rps|dau|mau|users|clients|engineers|queries|tickets)\b/gi // Quantities
  ];

  const found: Set<string> = new Set();
  for (const regex of metricRegexes) {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => found.add(m.trim()));
    }
  }
  return Array.from(found);
}

// Smart section segmentation & entity extraction
export function parseRawResumeText(rawText: string, defaultRole: string = 'backend-engineer'): ParsedProfile {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract email, phone
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  const email = emailMatch ? emailMatch[0] : '';
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract name: usually first non-empty line
  const name = lines[0] && lines[0].length < 40 ? lines[0] : 'Candidate';

  // Section regexes
  const sectionHeaders: Record<string, RegExp> = {
    summary: /^(summary|about|objective|professional summary|profile summary|about me)$/i,
    experience: /^(experience|work experience|employment history|professional experience|internship|internships)$/i,
    education: /^(education|academic background|academics|qualifications)$/i,
    skills: /^(skills|technical skills|key skills|core competencies|technologies)$/i,
    projects: /^(projects|personal projects|key projects|academic projects)$/i,
    certifications: /^(certifications|licenses & certifications|courses|certifications & achievements)$/i
  };

  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  let currentSection = 'header';

  for (const line of lines) {
    let matchedSection = false;
    for (const [secKey, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line.replace(/[:\-_]/g, '').trim())) {
        currentSection = secKey;
        matchedSection = true;
        break;
      }
    }

    if (!matchedSection) {
      sections[currentSection].push(line);
    }
  }

  // Extract headline from header or summary
  let headline = '';
  if (sections.header.length > 1) {
    headline = sections.header.slice(1, 3).filter(l => !l.includes('@') && !l.match(/\d{5,}/)).join(' | ');
  }
  if (!headline) {
    headline = lines.find(l => l.length < 90 && (l.toLowerCase().includes('engineer') || l.toLowerCase().includes('developer') || l.toLowerCase().includes('manager'))) || 'Software Professional';
  }

  // Parse skills via dictionary
  const skillExtraction = matchSkillsInText(rawText);
  let skills = skillExtraction.matchedSkills;
  if (skills.length === 0 && sections.skills.length > 0) {
    skills = sections.skills.join(',').split(/[,|•·\n]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
  }

  // Parse Experience
  const experiences: ExperienceItem[] = [];
  const expLines = sections.experience;
  let currentExp: Partial<ExperienceItem> | null = null;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    const isDateLine = /\b(19\d\d|20\d\d|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(line);
    const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.startsWith('·');

    if (!isBullet && (line.includes(' - ') || line.includes(' | ') || isDateLine || currentExp === null)) {
      if (currentExp && currentExp.title) {
        experiences.push({
          id: `exp-${experiences.length + 1}`,
          title: currentExp.title || 'Engineer',
          company: currentExp.company || 'Technology Company',
          startDate: currentExp.startDate || '2022',
          endDate: currentExp.endDate || 'Present',
          bullets: currentExp.bullets || []
        });
      }
      currentExp = {
        title: line.split(/[-–|]/)[0]?.trim() || line,
        company: line.split(/[-–|]/)[1]?.trim() || 'Company',
        startDate: '2022',
        endDate: 'Present',
        bullets: []
      };
    } else if (currentExp) {
      const cleanBullet = line.replace(/^[-•*·]\s*/, '').trim();
      if (cleanBullet.length > 10) {
        currentExp.bullets = currentExp.bullets || [];
        currentExp.bullets.push(cleanBullet);
      }
    }
  }
  if (currentExp && currentExp.title) {
    experiences.push({
      id: `exp-${experiences.length + 1}`,
      title: currentExp.title,
      company: currentExp.company || 'Company',
      startDate: currentExp.startDate || '2022',
      endDate: currentExp.endDate || 'Present',
      bullets: currentExp.bullets || []
    });
  }

  // Parse Education
  const education: EducationItem[] = [];
  const eduLines = sections.education;
  for (const line of eduLines) {
    if (line.match(/(b\.?tech|b\.?e|m\.?tech|mca|bca|b\.?sc|mba|bachelor|master|diploma)/i)) {
      education.push({
        id: `edu-${education.length + 1}`,
        degree: line.split(/[-–|,]/)[0]?.trim() || line,
        institution: line.split(/[-–|,]/)[1]?.trim() || 'University',
        year: line.match(/20\d\d/)?.[0] || '2023',
        score: line.match(/\b\d+(\.\d+)?\s*(?:CGPA|%)\b/i)?.[0] || ''
      });
    }
  }

  // Parse Projects
  const projects: ProjectItem[] = [];
  const projLines = sections.projects;
  let currentProj: Partial<ProjectItem> | null = null;

  for (const line of projLines) {
    if (!line.startsWith('-') && !line.startsWith('•') && line.length < 60) {
      if (currentProj && currentProj.title) {
        projects.push({
          id: `proj-${projects.length + 1}`,
          title: currentProj.title,
          description: currentProj.description || '',
          technologies: currentProj.technologies || []
        });
      }
      currentProj = {
        title: line,
        description: '',
        technologies: []
      };
    } else if (currentProj) {
      const cleanLine = line.replace(/^[-•*·]\s*/, '').trim();
      currentProj.description = (currentProj.description ? currentProj.description + ' ' : '') + cleanLine;
      const techMatch = cleanLine.match(/technologies|tools|stack|using\s*[:\s](.*)/i);
      if (techMatch && techMatch[1]) {
        currentProj.technologies = techMatch[1].split(/[,|]/).map(t => t.trim());
      }
    }
  }
  if (currentProj && currentProj.title) {
    projects.push({
      id: `proj-${projects.length + 1}`,
      title: currentProj.title,
      description: currentProj.description || '',
      technologies: currentProj.technologies || []
    });
  }

  // Infer experience band
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

  // Calculate Section Confidence scores (0 - 100)
  const sectionConfidence: Record<string, number> = {
    headline: headline && headline.length > 15 ? 90 : 55,
    summary: sections.summary.length > 0 ? 85 : 45,
    experience: experiences.length > 0 && experiences[0].bullets.length > 0 ? 85 : 50,
    skills: skills.length > 5 ? (skills.length > 35 ? 65 : 90) : 50,
    education: education.length > 0 ? 95 : 60,
    projects: projects.length > 0 ? 85 : 55
  };

  return {
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
    projects,
    certifications: sections.certifications.filter(c => c.length > 4),
    achievements: [],
    rawText,
    sectionConfidence
  };
}
