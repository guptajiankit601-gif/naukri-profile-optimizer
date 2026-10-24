export type ExperienceBand = 'Fresher' | '1-3' | '3-5' | '5-8' | '8+';
export type CityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  score?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  metrics?: string;
}

export interface ParsedProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  targetRole: string;
  targetRoleId: string;
  experienceBand: ExperienceBand;
  targetCities: string[];
  expectedSalaryLakhs?: number;
  headline: string;
  summary: string;
  skills: string[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  achievements: string[];
  rawText: string;
  sectionConfidence: Record<string, number>;
}
