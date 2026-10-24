export interface ParsedSections {
  header: string[];
  summary: string[];
  experience: string[];
  education: string[];
  skills: string[];
  projects: string[];
  certifications: string[];
}

export function detectSections(rawText: string): ParsedSections {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const sectionHeaders: Record<string, RegExp> = {
    summary: /^(summary|about|objective|professional summary|profile summary|about me)$/i,
    experience: /^(experience|work experience|employment history|professional experience|internship|internships)$/i,
    education: /^(education|academic background|academics|qualifications)$/i,
    skills: /^(skills|technical skills|key skills|core competencies|technologies)$/i,
    projects: /^(projects|personal projects|key projects|academic projects)$/i,
    certifications: /^(certifications|licenses & certifications|courses|certifications & achievements)$/i
  };

  const sections: ParsedSections = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  let currentKey: keyof ParsedSections = 'header';

  for (const line of lines) {
    let matched = false;
    for (const [secKey, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line.replace(/[:\-_]/g, '').trim())) {
        currentKey = secKey as keyof ParsedSections;
        matched = true;
        break;
      }
    }
    if (!matched) {
      sections[currentKey].push(line);
    }
  }

  return sections;
}
