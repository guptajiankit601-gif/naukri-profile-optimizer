export type ComponentKey =
  | 'headlineClarity'
  | 'summaryQuality'
  | 'skillKeywordRelevance'
  | 'experienceRelevance'
  | 'achievementImpact'
  | 'projectsPortfolio'
  | 'educationCertifications'
  | 'atsReadability'
  | 'targetRoleAlignment'
  | 'completenessConsistency'
  // Backward compatibility keys
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
  headroom?: number;
  status?: 'good' | 'warn' | 'bad';
  issue: string;
  fix: string;
  example: string;
  evidence?: string[];
  isApplicable?: boolean;
}

export type ScoringComponent = ComponentResult;

export interface TopFixItem {
  title: string;
  points: number;
  actionTab: string;
  ruleId?: string;
  componentKey?: string;
  description?: string;
  projectedScore?: number;
}

export interface ScoreReport {
  overallScore: number;
  verdict: 'Weak' | 'Okay' | 'Strong' | 'Needs Work';
  components: ComponentResult[];
  topFixes: TopFixItem[];
  isFresher?: boolean;
  totalMax?: number;
  headroomTotal?: number;
  normalizationNote?: string;
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
  reason?: string;
  criteria?: string;
  headroomPoints?: number;
}

export type RecruiterPersona = 'Startup Founder' | 'Enterprise TA' | 'Consultancy Recruiter' | 'HR Screen';
