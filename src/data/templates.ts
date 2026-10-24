export interface RewriteTemplate {
  intent: string;
  safePattern: (subject: string, action: string, tools: string) => string;
  metricPattern: (subject: string, action: string, metric: string, tools: string) => string;
  impactPattern: (subject: string, businessOutcome: string, tools: string) => string;
}

export const REWRITE_TEMPLATES: Record<string, RewriteTemplate> = {
  built: {
    intent: 'Creation & Development',
    safePattern: (sub, act, tools) => `Architected and developed ${sub || 'core features'} utilizing ${tools || 'modern industry standards'}, ensuring clean modularity.`,
    metricPattern: (sub, _act, metric, tools) => `Engineered ${sub || 'distributed services'} using ${tools || 'modern tech stack'}, successfully delivering ${metric || '[X% efficiency / throughput]'}.`,
    impactPattern: (sub, outcome, tools) => `Designed and deployed scalable ${sub || 'production systems'} with ${tools || 'high-availability architecture'}, driving ${outcome || 'significant operational stability and faster release velocity'}.`
  },
  improved: {
    intent: 'Optimization & Speed',
    safePattern: (sub, act, tools) => `Refactored and optimized ${sub || 'system architecture'} using ${tools || 'profiling and database indexing'}, eliminating bottlenecks.`,
    metricPattern: (sub, _act, metric, tools) => `Optimized ${sub || 'query workflows and API endpoints'}, driving a ${metric || '[35% latency reduction]'} across peak traffic hours.`,
    impactPattern: (sub, outcome, tools) => `Overhauled ${sub || 'critical infrastructure'} with ${tools || 'caching and query optimization'}, resulting in ${outcome || 'substantial cloud cost savings and 99.9% reliability'}.`
  },
  led: {
    intent: 'Leadership & Mentorship',
    safePattern: (sub, act, tools) => `Spearheaded cross-functional execution for ${sub || 'high-priority project deliverables'}, aligning engineering and product goals.`,
    metricPattern: (sub, _act, metric, tools) => `Led squad of ${metric || '[4-8 engineers]'} in delivering ${sub || 'core milestone'} 2 weeks ahead of scheduled timeline.`,
    impactPattern: (sub, outcome, tools) => `Directed technical strategy for ${sub || 'flagship initiatives'}, empowering engineering squads and achieving ${outcome || 'zero-defect releases'}.`
  },
  managed: {
    intent: 'Operations & Maintenance',
    safePattern: (sub, act, tools) => `Administered and safeguarded ${sub || 'cloud infrastructure and application servers'} using ${tools || 'automated CI/CD pipelines'}.`,
    metricPattern: (sub, _act, metric, tools) => `Maintained ${sub || 'production clusters and services'} maintaining ${metric || '[99.95% uptime SLA]'} across multi-region environments.`,
    impactPattern: (sub, outcome, tools) => `Governed end-to-end reliability for ${sub || 'critical customer-facing workloads'}, mitigating vulnerabilities and ensuring ${outcome || 'strict compliance and zero unscheduled downtime'}.`
  },
  sold: {
    intent: 'Revenue & Growth',
    safePattern: (sub, act, tools) => `Executed strategic outbound prospecting and relationship management for ${sub || 'enterprise customer accounts'}.`,
    metricPattern: (sub, _act, metric, tools) => `Generated ${metric || '[₹1.2 Cr in qualified pipeline / 120% quota]'} by pitching ${sub || 'SaaS solutions'} to C-level stakeholders.`,
    impactPattern: (sub, outcome, tools) => `Expanded enterprise client footprint across target verticals, driving ${outcome || 'exponential recurring ARR growth and high account retention'}.`
  },
  supported: {
    intent: 'Support & Triage',
    safePattern: (sub, act, tools) => `Investigated, triaged, and resolved high-severity production defects for ${sub || 'key product integrations'}.`,
    metricPattern: (sub, _act, metric, tools) => `Triaged and resolved ${metric || '[200+ complex tickets]'} maintaining a ${metric ? '' : '[98% CSAT rating]'} under rigorous SLAs.`,
    impactPattern: (sub, outcome, tools) => `Automated root-cause remediation workflows for ${sub || 'incident handling'}, minimizing escalation frequency and boosting ${outcome || 'customer satisfaction'}.`
  }
};
