/**
 * REWRITE TEMPLATES LIBRARY (8 Intents × 3 Levels = 24 Templates)
 * FACT-PRESERVING SPECIFICATION:
 * Never invent performance metrics, percentages, revenue, user counts, throughput,
 * certifications, or skills. Where data is missing, offer a credible qualitative rewrite
 * and optionally a metric-ready template containing an explicit placeholder such as
 * [add verified metric].
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
      `Architected and built ${sub || 'application components'}${tools ? ` using ${tools}` : ''}, ensuring modularity and clean code standards.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Engineered ${sub || 'application modules'}${tools ? ` using ${tools}` : ''}, delivering ${metric || '[add verified metric, e.g. X% throughput gain or Y req/sec]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Designed and deployed ${sub || 'core application services'}${tools ? ` using ${tools}` : ''}, ${outcome || 'streamlining service delivery and enhancing system maintainability'}.`
  },

  // 2. led
  led: {
    intent: 'Leadership & Mentorship',
    safePattern: (sub, _act, tools) =>
      `Led cross-functional execution for ${sub || 'project milestones'}${tools ? ` using ${tools}` : ''}, aligning technical delivery with project roadmap.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Led team of ${metric || '[add verified team size, e.g. 4 engineers]'} delivering ${sub || 'core milestones'}${tools ? ` using ${tools}` : ''} on schedule.`,
    impactPattern: (sub, outcome, tools) =>
      `Directed technical execution for ${sub || 'key engineering initiatives'}, ${outcome || 'empowering team contributors and maintaining high delivery standards'}.`
  },

  // 3. improved
  improved: {
    intent: 'Optimization & Speed',
    safePattern: (sub, _act, tools) =>
      `Refactored and optimized ${sub || 'system workflows'}${tools ? ` using ${tools}` : ''}, eliminating bottlenecks and enhancing maintainability.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Optimized ${sub || 'system performance'}${tools ? ` using ${tools}` : ''}, achieving ${metric || '[add verified metric, e.g. X% latency drop or Y% query speedup]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Overhauled ${sub || 'critical workflows'}${tools ? ` using ${tools}` : ''}, ${outcome || 'improving overall architectural resilience and operational efficiency'}.`
  },

  // 4. managed
  managed: {
    intent: 'Operations & Maintenance',
    safePattern: (sub, _act, tools) =>
      `Administered and maintained ${sub || 'infrastructure and application environments'}${tools ? ` using ${tools}` : ''}, ensuring operational stability.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Maintained ${sub || 'production environments'}${tools ? ` using ${tools}` : ''}, maintaining ${metric || '[add verified metric, e.g. X% SLA or Y resolution time]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Governed end-to-end reliability for ${sub || 'production workloads'}, ${outcome || 'mitigating failure risks and upholding high service quality'}.`
  },

  // 5. sold
  sold: {
    intent: 'Revenue & Growth',
    safePattern: (sub, _act, tools) =>
      `Executed strategic prospecting and stakeholder management for ${sub || 'client accounts'}${tools ? ` using ${tools}` : ''}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Generated ${metric || '[add verified metric, e.g. ₹X in pipeline or Y% quota]'} by pitching ${sub || 'solutions'} to enterprise decision-makers.`,
    impactPattern: (sub, outcome, tools) =>
      `Expanded client engagement across target accounts, ${outcome || 'deepening customer relationships and supporting pipeline expansion'}.`
  },

  // 6. taught
  taught: {
    intent: 'Training & Knowledge Sharing',
    safePattern: (sub, _act, tools) =>
      `Facilitated technical training and comprehensive documentation for ${sub || 'team members'}${tools ? ` using ${tools}` : ''}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Trained ${metric || '[add verified cohort count, e.g. 8 team members]'} on ${tools || 'core technologies'}, accelerating team onboarding ramp-up.`,
    impactPattern: (sub, outcome, tools) =>
      `Established technical documentation and knowledge-sharing sessions for ${sub || 'engineering workflows'}, ${outcome || 'fostering team autonomy and institutional best practices'}.`
  },

  // 7. supported
  supported: {
    intent: 'Support & Triage',
    safePattern: (sub, _act, tools) =>
      `Investigated, triaged, and resolved technical defects for ${sub || 'key product modules'}${tools ? ` using ${tools}` : ''}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Triaged and resolved ${metric || '[add verified ticket count, e.g. 50+ issues]'} with ${metric ? '' : '[add verified CSAT or turnaround time]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Structured incident resolution workflows for ${sub || 'customer issues'}, ${outcome || 'accelerating turnaround time and elevating user satisfaction'}.`
  },

  // 8. analyzed
  analyzed: {
    intent: 'Analytics & Forecasting',
    safePattern: (sub, _act, tools) =>
      `Analyzed and modeled ${sub || 'operational datasets'}${tools ? ` using ${tools}` : ''} to evaluate key performance trends.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Modeled ${sub || 'data telemetry'}${tools ? ` using ${tools}` : ''}, uncovering ${metric || '[add verified metric, e.g. X% discrepancy or ₹Y efficiency opportunity]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Synthesized analytics dashboards and data models for ${sub || 'stakeholders'}, ${outcome || 'enabling data-informed strategic decisions and clear visibility'}.`
  }
};

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

export const REASONS: Record<string, string> = {
  addedVerb: 'Upgraded opening to a strong action verb (Architected, Engineered, Led, Optimized) — recruiters look for active ownership.',
  addedMetric: 'Prepared for quantifiable proof — genuine metrics demonstrate verifiable impact.',
  removedPassive: 'Replaced passive phrasing ("responsible for", "assisted with") with active voice.',
  replacedVague: 'Replaced vague descriptors with specific deliverables and tools.',
  addedContext: 'Retained specific technical context and tools without fabricating new ones.',
  addedImpact: 'Reframed focus toward business and engineering outcomes without inventing statistics.',
  addedScope: 'Emphasized technical scope and architecture based on your actual source text.',
  trimmedLength: 'Concise phrasing fits recruiter scannability thresholds.'
};
