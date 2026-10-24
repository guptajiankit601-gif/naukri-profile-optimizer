export type ExperienceBand = 'Fresher' | '1-3' | '3-5' | '5-8' | '8+';

export type CityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export type RecruiterPersona = 'Startup Founder' | 'Enterprise TA' | 'Consultancy Recruiter' | 'HR Screen';

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
  sectionConfidence: Record<string, number>; // e.g. { summary: 85, experience: 90, skills: 60 }
}

export interface ScoringComponent {
  name: string;
  weight: number;
  score: number; // 0 to weight
  max: number;
  issue: string;
  fix: string;
  example: string;
}

export interface ScoreReport {
  overallScore: number; // 0 - 100
  verdict: 'Weak' | 'Okay' | 'Strong';
  components: ScoringComponent[];
  topFixes: { title: string; points: number; actionTab: string }[];
}

export interface KeywordItem {
  name: string;
  category: 'must-have' | 'high-value' | 'booster' | 'distractor' | 'location';
  monthlySearches: number;
  countInProfile: number;
  status: 'present' | 'weak' | 'missing' | 'noise';
  importance: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface RewriteVariant {
  type: 'SAFE' | 'METRIC' | 'IMPACT';
  text: string;
  reason: string;
  metricsNeeded?: boolean;
}

export interface BulletRewrite {
  id: string;
  originalText: string;
  intent: string;
  detectedIssues: string[];
  variants: RewriteVariant[];
}

export interface JobDescriptionMatch {
  id: string;
  company: string;
  title: string;
  matchScore: number;
  verdict: 'Apply Now' | 'Apply With Tweaks' | 'Improve First' | 'Skip';
  subScores: {
    skills: number;
    experience: number;
    location: number;
    salary: number;
    education: number;
  };
  matchedSkills: string[];
  missingMustHaves: { skill: string; frequencyPercent: number }[];
  positioningAdvice: string;
  screeningWindowNotice: string;
}

export interface ActionPlanItem {
  id: string;
  dayGroup: 'Today' | 'Day 2' | 'Day 3-4' | 'Week 2';
  title: string;
  description: string;
  estimatedMinutes: number;
  expectedPoints: number;
  targetTab: string;
  completed: boolean;
}

export interface ScoreHistoryPoint {
  date: string;
  timestamp: number;
  score: number;
  changeReason: string;
}
