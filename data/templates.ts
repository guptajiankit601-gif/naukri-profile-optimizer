/**
 * Fact-preserving rewrite templates across all 8 intents
 * Strictly avoids unverified percentages, currency amounts, or scale metrics.
 * Uses explicit placeholders [add verified metric] where genuine numbers are needed.
 */

export interface RewriteTemplate {
  intent: string;
  safePattern: (subject: string, action: string, tools: string) => string;
  metricPattern: (subject: string, action: string, metric: string, tools: string) => string;
  impactPattern: (subject: string, businessOutcome: string, tools: string) => string;
}

export const REWRITE_TEMPLATES: Record<string, RewriteTemplate> = {
  built: {
    intent: 'Creation & Development',
    safePattern: (sub, _act, tools) =>
      `Architected and built ${sub || 'core application components'}${tools ? ` using ${tools}` : ''}, ensuring modularity and clean code standards.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Engineered ${sub || 'distributed services'}${tools ? ` using ${tools}` : ''}, delivering ${metric || '[add verified metric, e.g. 99.9% uptime or 250ms avg latency]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Designed and deployed ${sub || 'core application services'}${tools ? ` using ${tools}` : ''}, ${outcome || 'streamlining service delivery and enhancing system reliability'}.`
  },
  improved: {
    intent: 'Optimization & Speed',
    safePattern: (sub, _act, tools) =>
      `Refactored and optimized ${sub || 'system architecture'}${tools ? ` using ${tools}` : ''}, eliminating bottlenecks and enhancing code maintainability.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Optimized ${sub || 'query workflows and API endpoints'}${tools ? ` using ${tools}` : ''}, achieving ${metric || '[add verified metric, e.g. X% latency drop or Y% query speedup]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Overhauled ${sub || 'critical workflows'}${tools ? ` using ${tools}` : ''}, ${outcome || 'improving overall architectural resilience and operational efficiency'}.`
  },
  led: {
    intent: 'Leadership & Mentorship',
    safePattern: (sub, _act, tools) =>
      `Led cross-functional execution for ${sub || 'key project deliverables'}${tools ? ` using ${tools}` : ''}, aligning technical delivery with milestone roadmaps.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Led team of ${metric || '[add verified team size, e.g. 4-8 engineers]'} in delivering ${sub || 'core milestones'}${tools ? ` using ${tools}` : ''} on schedule.`,
    impactPattern: (sub, outcome, tools) =>
      `Directed technical strategy for ${sub || 'engineering initiatives'}, ${outcome || 'empowering team contributors and maintaining high delivery standards'}.`
  },
  managed: {
    intent: 'Operations & Maintenance',
    safePattern: (sub, _act, tools) =>
      `Administered and maintained ${sub || 'infrastructure and application environments'}${tools ? ` using ${tools}` : ''}, ensuring operational stability.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Maintained ${sub || 'production environments'}${tools ? ` using ${tools}` : ''}, upholding ${metric || '[add verified metric, e.g. X% SLA or Y resolution time]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Governed end-to-end reliability for ${sub || 'production workloads'}, ${outcome || 'mitigating failure risks and upholding high service quality'}.`
  },
  sold: {
    intent: 'Revenue & Growth',
    safePattern: (sub, _act, tools) =>
      `Managed relationship and pipeline execution for ${sub || 'commercial customer accounts'}${tools ? ` using ${tools}` : ''}, maintaining stakeholder alignment.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Delivered ${metric || '[add verified metric, e.g. ₹X in pipeline or Y% quota]'} by presenting ${sub || 'solutions'} to enterprise decision-makers.`,
    impactPattern: (sub, outcome, tools) =>
      `Expanded client engagement across target accounts, ${outcome || 'deepening customer relationships and supporting pipeline expansion'}.`
  },
  taught: {
    intent: 'Training & Knowledge Sharing',
    safePattern: (sub, _act, tools) =>
      `Facilitated technical training and comprehensive documentation for ${sub || 'team members'}${tools ? ` using ${tools}` : ''}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Trained ${metric || '[add verified cohort count, e.g. 8 team members]'} on ${tools || 'core technologies'}, accelerating onboarding ramp-up.`,
    impactPattern: (sub, outcome, tools) =>
      `Established technical documentation and knowledge-sharing sessions for ${sub || 'engineering workflows'}, ${outcome || 'fostering team autonomy and institutional best practices'}.`
  },
  supported: {
    intent: 'Support & Triage',
    safePattern: (sub, _act, tools) =>
      `Investigated, triaged, and resolved technical defects for ${sub || 'key product modules'}${tools ? ` using ${tools}` : ''}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Triaged and resolved ${metric || '[add verified ticket count, e.g. 50+ issues]'} with ${metric ? '' : '[add verified CSAT or turnaround time]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Automated root-cause remediation workflows for ${sub || 'incident handling'}, ${outcome || 'minimizing escalation frequency and boosting customer satisfaction'}.`
  },
  analyzed: {
    intent: 'Analysis & Research',
    safePattern: (sub, _act, tools) =>
      `Conducted in-depth analysis and reporting on ${sub || 'key performance indicators'}${tools ? ` using ${tools}` : ''}.`,
    metricPattern: (sub, _act, metric, tools) =>
      `Analyzed ${sub || 'operational datasets'}, identifying ${metric || '[add verified metric, e.g. X key trends or Y optimization opportunities]'}.`,
    impactPattern: (sub, outcome, tools) =>
      `Delivered data-driven strategic insights on ${sub || 'system metrics'}, ${outcome || 'informing architectural roadmap and executive planning'}.`
  }
};
