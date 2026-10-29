export type AuditCategory = 
  | 'completeness' 
  | 'content_quality' 
  | 'skills_keywords' 
  | 'professional_profile' 
  | 'job_alignment' 
  | 'readability';

export type AuditStatus = 
  | 'verified'
  | 'resolved'
  | 'needs_attention' 
  | 'recommended' 
  | 'not_found' 
  | 'needs_confirmation' 
  | 'not_assessed';

export type AuditPriority = 'high' | 'medium' | 'low';

export interface AuditFinding {
  id: string;
  category: AuditCategory;
  title: string;
  status: AuditStatus;
  priority: AuditPriority;
  whatWeFound: string;
  evidence: string;
  whyItMatters: string;
  suggestedImprovement: string;
  actionLabel: string;
  actionHref: string;
  actionTab?: string;
  isResolved?: boolean;
  howAssessed?: string;
}

export interface CompleteProfileAuditReport {
  overallScore: number;
  jobMatchScore: number | null;
  candidateName: string;
  targetRole: string;
  experienceBand: string;
  isFresher: boolean;
  hasJobDescription: boolean;
  hasProfessionalProfile: boolean;
  findings: AuditFinding[];
  summary: {
    total: number;
    verified: number;
    resolved: number;
    needsAttention: number;
    recommended: number;
    notFound: number;
    needsConfirmation: number;
    notAssessed: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  };
  plainEnglishSummary: string;
}
