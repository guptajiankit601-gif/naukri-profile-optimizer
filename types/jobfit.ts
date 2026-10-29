export interface MatchedSkillEvidence {
  skill: string;
  evidence: string;
  foundIn: string;
}

export interface MissingResumeSkill {
  skill: string;
  context: string;
  recommendation: string;
}

export interface LearningGapSkill {
  skill: string;
  reason: string;
  difficulty: 'Quick Add' | 'Moderate' | 'Core Prerequisite';
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
  matchedEvidence?: MatchedSkillEvidence[];
  missingFromResume?: MissingResumeSkill[];
  learningGaps?: LearningGapSkill[];
  positioningAdvice: string;
  screeningWindowNotice: string;
}

export interface RejectionReason {
  id: string;
  category: string;
  reason: string;
  probabilityPercent: number;
  fix: string;
  severity: 'high' | 'medium' | 'low';
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
