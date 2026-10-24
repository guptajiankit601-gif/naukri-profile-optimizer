import { matchSkillsInText } from '@/lib/data/skills-dict';

export interface ParsedJobDescription {
  title: string;
  company: string;
  minYearsExperience: number;
  maxYearsExperience?: number;
  mustHaveSkills: string[];
  preferredSkills: string[];
  locations: string[];
  minSalaryLakhs?: number;
  maxSalaryLakhs?: number;
  educationRequirements: string[];
  isRemote: boolean;
  rawText: string;
}

export function parseJobDescription(jdText: string, fallbackCompany: string = 'Target Company', fallbackTitle: string = 'Software Engineer'): ParsedJobDescription {
  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);

  // Title extraction
  const titleLine = lines.find(l => /^(role|position|job title|title)\s*[:\-]/i.test(l)) || lines[0] || fallbackTitle;
  const title = titleLine.replace(/^(role|position|job title|title)\s*[:\-]\s*/i, '').trim();

  // Company extraction
  const companyLine = lines.find(l => /^(company|organization|employer)\s*[:\-]/i.test(l));
  const company = companyLine ? companyLine.replace(/^(company|organization|employer)\s*[:\-]\s*/i, '').trim() : fallbackCompany;

  // Experience extraction: e.g. "3-5 years", "3+ years"
  let minExp = 2;
  let maxExp: number | undefined = undefined;
  const expMatch = jdText.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:yrs|years)/i) || jdText.match(/(\d+)\+?\s*(?:yrs|years)/i);
  if (expMatch) {
    minExp = parseInt(expMatch[1], 10);
    if (expMatch[2]) {
      maxExp = parseInt(expMatch[2], 10);
    }
  }

  // Skills
  const extractedSkills = matchSkillsInText(jdText).matchedSkills;
  const mustHaveSkills = extractedSkills.slice(0, 6);
  const preferredSkills = extractedSkills.slice(6);

  // Locations
  const locations: string[] = [];
  const indianCities = ['Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Gurugram', 'Gurgaon', 'Noida', 'Chennai'];
  for (const city of indianCities) {
    if (new RegExp(`\\b${city}\\b`, 'i').test(jdText)) {
      locations.push(city);
    }
  }
  const isRemote = /\bremote|work from home|wfh\b/i.test(jdText);
  if (isRemote && !locations.includes('Remote')) {
    locations.push('Remote');
  }

  // Salary
  let minSalary: number | undefined;
  let maxSalary: number | undefined;
  const salaryMatch = jdText.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:lpa|lakh|lac)/i);
  if (salaryMatch) {
    minSalary = parseInt(salaryMatch[1], 10);
    maxSalary = parseInt(salaryMatch[2], 10);
  }

  // Education
  const eduReqs: string[] = [];
  if (/\b(b\.?tech|b\.?e\.?|bca|mca|b\.?s\.?|m\.?s\.?)\b/i.test(jdText)) {
    eduReqs.push('B.Tech / B.E. / MCA / Computer Science or related degree');
  }

  return {
    title: title.length > 50 ? fallbackTitle : title,
    company,
    minYearsExperience: minExp,
    maxYearsExperience: maxExp,
    mustHaveSkills,
    preferredSkills,
    locations: locations.length > 0 ? locations : ['Bengaluru / Pan India'],
    minSalaryLakhs: minSalary,
    maxSalaryLakhs: maxSalary,
    educationRequirements: eduReqs,
    isRemote,
    rawText: jdText
  };
}
