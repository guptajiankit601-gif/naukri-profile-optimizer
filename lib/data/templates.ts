/**
 * REWRITE TEMPLATES LIBRARY (8 Intents × 3 Levels = 24 Templates)
 * Defined per SKILL.md Section 6
 */

export type Intent = 'built' | 'led' | 'improved' | 'managed' | 'sold' | 'taught' | 'supported' | 'analyzed';
export type RewriteSlot = 'verb' | 'object' | 'context' | 'metric' | 'team' | 'domain' | 'tool';

export interface RewriteTemplate {
  id?: string;
  intent: string;
  level?: 'safe' | 'metric' | 'impact';
  pattern?: string;
  slots?: RewriteSlot[];
  requiresUser?: ('metric' | 'scale' | 'team' | 'duration')[];
  bannedPhrases?: string[];
  maxWords?: number;
  safePattern: (subject: string, action: string, tools: string) => string;
  metricPattern: (subject: string, action: string, metric: string, tools: string) => string;
  impactPattern: (subject: string, businessOutcome: string, tools: string) => string;
}

export const REWRITE_TEMPLATES: Record<string, RewriteTemplate> = {
  // 1. built
  built: {
    intent: 'Creation & Development',
    safePattern: (sub, _act, tools) =>
      `Architected and built ${sub || 'core application services'} using ${tools || 'modern industry standards'}, ensuring clean modularity.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Engineered ${sub || 'production microservices'} using ${tools || 'modern tech stack'}, successfully delivering ${metric || '[X% throughput / 20k TPS]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Designed and deployed scalable ${sub || 'distributed systems'} using ${tools || 'high-availability architecture'}, driving ${outcome || '99.99% system uptime and 40% faster release velocity'}.`
  },

  // 2. led
  led: {
    intent: 'Leadership & Mentorship',
    safePattern: (sub, _act, tools) =>
      `Led cross-functional execution for ${sub || 'high-priority engineering milestones'}, aligning team delivery with strategic roadmaps.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Led squad of ${metric || '[4-8 engineers]'} in delivering ${sub || 'core features'} 2 weeks ahead of scheduled deadline.`,
    impactPattern: (sub, outcome, tools) =>
      `Directed technical strategy across ${sub || 'flagship initiatives'}, empowering engineering squads and achieving ${outcome || 'zero-defect releases and high team velocity'}.`
  },

  // 3. improved
  improved: {
    intent: 'Optimization & Speed',
    safePattern: (sub, _act, tools) =>
      `Refactored and optimized ${sub || 'system architecture'} using ${tools || 'profiling and database indexing'}, eliminating latency bottlenecks.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Optimized ${sub || 'query workflows and API endpoints'}, driving a ${metric || '[35% latency reduction]'} across peak traffic hours.`,
    impactPattern: (sub, outcome, tools) =>
      `Overhauled ${sub || 'critical infrastructure'} with ${tools || 'caching and query optimization'}, resulting in ${outcome || 'substantial cloud cost savings and 99.9% reliability'}.`
  },

  // 4. managed
  managed: {
    intent: 'Operations & Maintenance',
    safePattern: (sub, _act, tools) =>
      `Administered and safeguarded ${sub || 'cloud infrastructure and application servers'} using ${tools || 'automated CI/CD pipelines'}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Maintained ${sub || 'production clusters and services'} maintaining ${metric || '[99.95% uptime SLA]'} across multi-region environments.`,
    impactPattern: (sub, outcome, tools) =>
      `Governed end-to-end reliability for ${sub || 'critical customer-facing workloads'}, mitigating vulnerabilities and ensuring ${outcome || 'strict compliance and zero unscheduled downtime'}.`
  },

  // 5. sold
  sold: {
    intent: 'Revenue & Growth',
    safePattern: (sub, _act, tools) =>
      `Executed strategic outbound prospecting and relationship management for ${sub || 'enterprise customer accounts'}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Generated ${metric || '[₹1.2 Cr in qualified pipeline / 120% quota]'} by pitching ${sub || 'SaaS solutions'} to C-level stakeholders.`,
    impactPattern: (sub, outcome, tools) =>
      `Expanded enterprise client footprint across target verticals, driving ${outcome || 'exponential recurring ARR growth and high account retention'}.`
  },

  // 6. taught
  taught: {
    intent: 'Training & Knowledge Sharing',
    safePattern: (sub, _act, tools) =>
      `Facilitated technical training and comprehensive onboarding documentation for ${sub || 'engineering and product team members'}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Upskilled ${metric || '[cohort of 14 junior developers]'} on ${tools || 'best practices'}, reducing onboarding ramp-up time by 40%.`,
    impactPattern: (sub, outcome, tools) =>
      `Mentored cross-functional team members on ${tools || 'modern standards'}, establishing ${outcome || 'high engineering velocity and institutional best practices'}.`
  },

  // 7. supported
  supported: {
    intent: 'Support & Triage',
    safePattern: (sub, _act, tools) =>
      `Investigated, triaged, and resolved high-severity production defects for ${sub || 'key product integrations'}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Triaged and resolved ${metric || '[200+ complex tickets]'} maintaining a ${metric ? '' : '[98% CSAT rating]'} under rigorous SLAs.`,
    impactPattern: (sub, outcome, tools) =>
      `Automated root-cause remediation workflows for ${sub || 'incident handling'}, minimizing escalation frequency and boosting ${outcome || 'customer satisfaction'}.`
  },

  // 8. analyzed
  analyzed: {
    intent: 'Analytics & Forecasting',
    safePattern: (sub, _act, tools) =>
      `Analyzed and modeled ${sub || 'key performance datasets'} to evaluate core operational and product trends.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Modeled ${sub || 'user funnel drop-offs'} using ${tools || 'analytics telemetry'}, uncovering ${metric || '[₹45L annual recovery opportunity]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Synthesized executive analytics and automated telemetry for ${sub || 'business critical operations'}, driving ${outcome || 'data-backed strategic decisions and 25% efficiency gains'}.`
  }
};

// Section 6.3: Metric Noun Mapping by Role
export const METRIC_NOUNS: Record<string, string[]> = {
  backend: ['latency', 'throughput', 'uptime', 'cost', 'requests per second (TPS)'],
  frontend: ['load time', 'bundle size', 'Lighthouse score', 'conversion rate'],
  data: ['report generation time', 'data quality', 'accuracy', 'hours saved per week'],
  marketing: ['ROAS', 'CAC', 'CTR', 'conversion rate', 'organic traffic'],
  sales: ['quota attainment', 'pipeline value', 'revenue', 'deal size'],
  hr: ['time-to-fill', 'offer acceptance rate', 'retention', 'hires closed'],
  finance: ['budget variance', 'forecast accuracy', 'closing time', 'cost savings'],
  design: ['task success rate', 'usability score', 'conversion lift'],
  content: ['organic traffic', 'keyword rankings', 'engagement time'],
  ops: ['on-time delivery', 'budget variance', 'process time']
};

// Section 6.4: Reason Templates
export const REASONS: Record<string, string> = {
  addedVerb: 'Added a strong action verb — recruiters scan verbs before anything else.',
  addedMetric: 'Added a measurable outcome — most hired candidates show numbers.',
  removedPassive: 'Removed passive voice — "responsible for" reads as no ownership.',
  replacedVague: 'Replaced a vague phrase with a specific deliverable.',
  addedContext: 'Added tool/domain context so the recruiter knows where you applied it.',
  addedImpact: 'Reframed to business impact — hiring managers buy outcomes, not tasks.',
  addedScope: 'Added scale (users, team size, volume) — shows you handled real load.',
  trimmedLength: 'Trimmed to fit — long bullets get skipped after the first line.'
};
