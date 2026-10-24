export type ComponentKey =
  | 'headlineClarity'
  | 'summaryQuality'
  | 'bulletQuality'
  | 'skillStructure'
  | 'educationDetail'
  | 'projectsProof'
  | 'certifications'
  | 'parseability'
  | 'platformConsistency'
  | 'contactCredibility';

export interface ComponentResult {
  key?: ComponentKey;
  name: string;
  weight: number;
  score: number;
  max: number;
  status?: 'good' | 'warn' | 'bad';
  issue: string;
  fix: string;
  example: string;
  evidence?: string[];
}

export type ScoringComponent = ComponentResult;

export interface ScoreReport {
  overallScore: number;
  verdict: 'Weak' | 'Okay' | 'Strong' | 'Needs Work';
  components: ComponentResult[];
  topFixes: { title: string; points: number; actionTab: string }[];
}

export interface ScoreHistoryPoint {
  date: string;
  timestamp: number;
  score: number;
  changeReason: string;
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

export type RecruiterPersona = 'Startup Founder' | 'Enterprise TA' | 'Consultancy Recruiter' | 'HR Screen';
