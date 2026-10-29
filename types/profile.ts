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

export type ProjectType = 'Academic' | 'Personal' | 'Internship' | 'Hackathon' | 'Open Source';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  repoLink?: string;
  role?: string;
  projectType?: ProjectType;
  timeline?: string;
  metrics?: string;
}

export type SkillOrigin = 'extracted' | 'user_added' | 'suggested';

export interface ProfileSkillItem {
  name: string;
  origin: SkillOrigin;
  category?: string;
  confirmed?: boolean;
}

export interface ProfessionalProfileData {
  headline?: string;
  summary?: string;
  keySkills?: string[];
  employment?: string;
  projects?: string;
  education?: string;
  certifications?: string;
  rawText?: string;
  updatedAt?: number;
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
  targetJobDescription?: string;
  headline: string;
  summary: string;
  skills: string[];
  skillInventory?: ProfileSkillItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  achievements: string[];
  rawText: string;
  sectionConfidence: Record<string, number>;
  professionalProfile?: ProfessionalProfileData;
}

export interface ProfileVersion {
  id: string;
  timestamp: number;
  label: string;
  role: string;
  score: number;
  profile: ParsedProfile;
  changeReason: string;
}

