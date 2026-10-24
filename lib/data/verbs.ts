/**
 * POWER VERB TAXONOMY & LIBRARY (Section 5)
 */

export const POWER_VERBS = {
  built: [
    'architected', 'engineered', 'built', 'developed', 'shipped', 'delivered',
    'implemented', 'deployed', 'launched', 'designed', 'created', 'programmed',
    'constructed', 'authored', 'coded', 'produced', 'established'
  ],
  led: [
    'led', 'directed', 'headed', 'coordinated', 'orchestrated', 'supervised',
    'guided', 'managed', 'spearheaded', 'championed', 'oversaw'
  ],
  improved: [
    'optimized', 'optimised', 'streamlined', 'accelerated', 'refactored',
    'reduced', 'elevated', 'tuned', 'cut', 'boosted', 'improved', 'enhanced',
    'scaled', 'consolidated', 'modernized', 'modernised', 'strengthened'
  ],
  managed: [
    'owned', 'managed', 'administered', 'maintained', 'oversaw', 'ran',
    'operated', 'handled', 'directed', 'supervised', 'governed', 'orchestrated'
  ],
  sold: [
    'grew', 'generated', 'closed', 'negotiated', 'acquired', 'expanded',
    'converted', 'secured', 'signed', 'won', 'scaled', 'booked'
  ],
  taught: [
    'trained', 'mentored', 'coached', 'onboarded', 'educated', 'facilitated',
    'instructed', 'guided', 'prepared', 'upskilled'
  ],
  supported: [
    'supported', 'contributed', 'collaborated', 'partnered', 'assisted',
    'facilitated', 'enabled', 'backed', 'strengthened'
  ],
  analyzed: [
    'analyzed', 'analysed', 'evaluated', 'investigated', 'forecasted',
    'monitored', 'diagnosed', 'modeled', 'modelled', 'measured', 'identified'
  ]
};

export const WEAK_VERBS = new Set([
  'worked on', 'involved in', 'assisted with', 'did', 'helped with',
  'participated in', 'contributed to', 'was part of', 'took part in',
  'handled', 'dealt with', 'responsible for', 'in charge of'
]);

export const VERB_UPGRADES: Record<string, string> = {
  'worked on': 'delivered',
  'involved in': 'contributed to',
  'assisted with': 'supported',
  'did': 'completed',
  'helped with': 'supported',
  'participated in': 'contributed to',
  'was part of': 'contributed to',
  'responsible for': 'owned',
  'in charge of': 'led',
  'handled': 'managed',
  'dealt with': 'resolved'
};

// Backward-compatible structures
export const PASSIVE_PHRASES = Array.from(WEAK_VERBS);

export const VERB_TAXONOMY: Record<string, { intent: string; synonyms: string[]; example: string }> = {
  built: {
    intent: 'Creation, Architecture & Development',
    synonyms: POWER_VERBS.built,
    example: 'Architected high-throughput microservices handling 20,000 req/sec'
  },
  led: {
    intent: 'Leadership, Direction & Mentorship',
    synonyms: POWER_VERBS.led,
    example: 'Spearheaded migration of legacy monolith to Kubernetes cluster'
  },
  improved: {
    intent: 'Optimization, Scaling & Efficiency',
    synonyms: POWER_VERBS.improved,
    example: 'Optimized PostgreSQL queries, reducing P99 latency by 45%'
  },
  managed: {
    intent: 'Coordination, Delivery & Governance',
    synonyms: POWER_VERBS.managed,
    example: 'Administered multi-region AWS cloud infrastructure with 99.95% uptime'
  },
  sold: {
    intent: 'Revenue, Growth & Conversion',
    synonyms: POWER_VERBS.sold,
    example: 'Generated ₹1.8 Cr in new enterprise pipeline within 6 months'
  },
  taught: {
    intent: 'Training, Documentation & Knowledge Sharing',
    synonyms: POWER_VERBS.taught,
    example: 'Upskilled cohort of 14 junior developers in TypeScript and CI/CD best practices'
  },
  supported: {
    intent: 'Operations, Triage & Customer Success',
    synonyms: POWER_VERBS.supported,
    example: 'Triaged and resolved 350+ Tier-3 critical production incidents with 98% CSAT'
  },
  analyzed: {
    intent: 'Analytics, Data & Forecasting',
    synonyms: POWER_VERBS.analyzed,
    example: 'Analyzed 10M+ transaction events to identify conversion drop-off points'
  }
};
