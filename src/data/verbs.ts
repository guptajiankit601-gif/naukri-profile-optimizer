export interface PowerVerb {
  verb: string;
  intent: 'built' | 'led' | 'improved' | 'managed' | 'sold' | 'taught' | 'supported';
  impactLevel: 'high' | 'medium';
  synonyms: string[];
}

export const VERB_TAXONOMY: Record<string, { intent: string; synonyms: string[]; example: string }> = {
  built: {
    intent: 'Creation, Architecture & Development',
    synonyms: ['Architected', 'Engineered', 'Developed', 'Deployed', 'Constructed', 'Formulated', 'Designed', 'Authored'],
    example: 'Architected high-throughput microservices handling 20,000 req/sec'
  },
  led: {
    intent: 'Leadership, Direction & Mentorship',
    synonyms: ['Spearheaded', 'Orchestrated', 'Chaired', 'Directed', 'Mobilized', 'Championed', 'Steered'],
    example: 'Spearheaded migration of legacy monolith to Kubernetes cluster'
  },
  improved: {
    intent: 'Optimization, Scaling & Efficiency',
    synonyms: ['Optimized', 'Accelerated', 'Streamlined', 'Enhanced', 'Refactored', 'Automated', 'Revamped'],
    example: 'Optimized PostgreSQL queries, reducing P99 latency by 45%'
  },
  managed: {
    intent: 'Coordination, Delivery & Governance',
    synonyms: ['Administered', 'Governed', 'Coordinated', 'Monitored', 'Maintained', 'Standardized'],
    example: 'Administered multi-region AWS cloud infrastructure with 99.95% uptime'
  },
  sold: {
    intent: 'Revenue, Growth & Conversion',
    synonyms: ['Negotiated', 'Closed', 'Generated', 'Acquired', 'Expanded', 'Boosted', 'Captured'],
    example: 'Generated ₹1.8 Cr in new enterprise pipeline within 6 months'
  },
  taught: {
    intent: 'Training, Documentation & Knowledge Sharing',
    synonyms: ['Upskilled', 'Mentored', 'Educated', 'Documented', 'Onboarded', 'Trained'],
    example: 'Upskilled cohort of 14 junior developers in TypeScript and CI/CD best practices'
  },
  supported: {
    intent: 'Operations, Triage & Customer Success',
    synonyms: ['Resolved', 'Troubleshot', 'Remediated', 'Triaged', 'Mitigated', 'Supported'],
    example: 'Triaged and resolved 350+ Tier-3 critical production incidents with 98% CSAT'
  }
};

export const PASSIVE_PHRASES = [
  'responsible for',
  'worked on',
  'helped with',
  'handled the',
  'tasked with',
  'duties included',
  'assisted in',
  'involved in',
  'part of team that',
  'looked after',
  'took care of'
];
