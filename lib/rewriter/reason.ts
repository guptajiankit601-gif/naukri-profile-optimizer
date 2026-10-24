export interface RewriteReason {
  code: string;
  variantType: 'SAFE' | 'METRIC' | 'IMPACT';
  headline: string;
  recruiterRationale: string;
  guarantee: string;
}

export const REWRITE_REASONS: Record<'SAFE' | 'METRIC' | 'IMPACT', RewriteReason> = {
  SAFE: {
    code: 'R-REWRITE-01',
    variantType: 'SAFE',
    headline: 'Faithful Action-Verb Upgrade',
    recruiterRationale: 'Replaces passive openings with authoritative ownership verbs without introducing unverified claims.',
    guarantee: '100% faithful to original facts. Zero hallucination.'
  },
  METRIC: {
    code: 'R-REWRITE-02',
    variantType: 'METRIC',
    headline: 'Quantified Evidence & Scope',
    recruiterRationale: 'Adds measurable proof of outcome (%, scale, latency, throughput). Proven to increase recruiter shortlists by 4x.',
    guarantee: 'User-provided or source-verified quantification only.'
  },
  IMPACT: {
    code: 'R-REWRITE-03',
    variantType: 'IMPACT',
    headline: 'Senior Architecture & Business Value',
    recruiterRationale: 'Positions you at a Senior / SDE-2 tier by focusing on business scale, zero-downtime, and cross-functional reliability.',
    guarantee: 'Highlights business context while preserving technical scope.'
  }
};
