import { BulletRewrite, RewriteVariant } from '../types';
import { extractMetricsFromText } from './parser';
import { PASSIVE_PHRASES } from '../data/verbs';
import { REWRITE_TEMPLATES } from '../data/templates';

// Classify intent
export function detectBulletIntent(text: string): 'built' | 'led' | 'improved' | 'managed' | 'sold' | 'taught' | 'supported' {
  const lower = text.toLowerCase();
  if (lower.match(/\b(lead|led|spearhead|guided|directed|mentored|managed team|coordinated)\b/)) return 'led';
  if (lower.match(/\b(optimiz|improv|accelerat|faster|reduced|enhanced|boosted|streamlin)\b/)) return 'improved';
  if (lower.match(/\b(sales|sold|revenue|pipeline|closed|deal|client|mql|prospecting|bdr|sdr)\b/)) return 'sold';
  if (lower.match(/\b(support|triage|incident|bug|defect|ticket|fix|customer issue)\b/)) return 'supported';
  if (lower.match(/\b(taught|train|onboard|document|knowledge|upskill)\b/)) return 'taught';
  if (lower.match(/\b(maintain|monitor|governed|managed|administer|infrastructure|server|uptime)\b/)) return 'managed';
  return 'built';
}

// Detect issues in a bullet
export function detectBulletIssues(text: string): string[] {
  const issues: string[] = [];
  const lower = text.toLowerCase();

  // Passive voice check
  if (PASSIVE_PHRASES.some(p => lower.includes(p))) {
    issues.push('Passive voice ("Responsible for / worked on") dilutes your ownership');
  }

  // First-person check
  if (/\b(i|my|we|our|me)\b/i.test(text)) {
    issues.push('First-person pronouns ("I", "my") violate standard resume conventions');
  }

  // Metric check
  const metrics = extractMetricsFromText(text);
  if (metrics.length === 0) {
    issues.push('Missing measurable outcome (no %, ₹, scale, or time saved)');
  }

  // Length check
  const words = text.trim().split(/\s+/).length;
  if (words < 8) {
    issues.push('Too brief: fails to explain context and technology used');
  } else if (words > 38) {
    issues.push('Overly verbose: recruiters scan bullets in under 2 seconds');
  }

  return issues;
}

// Generate the 3 variants for a given bullet
export function generateBulletRewrite(originalText: string, customMetric?: string): BulletRewrite {
  const intent = detectBulletIntent(originalText);
  const detectedIssues = detectBulletIssues(originalText);
  const existingMetrics = extractMetricsFromText(originalText);
  const activeMetric = customMetric || (existingMetrics.length > 0 ? existingMetrics[0] : '');

  // Extract key subject words (e.g., "REST APIs using Java", "microservices")
  const cleanSubject = originalText
    .replace(/^[-•*·]\s*/, '')
    .replace(/^(responsible for|worked on|helped with|handled the|tasked with)\s*/i, '')
    .trim();

  const template = REWRITE_TEMPLATES[intent] || REWRITE_TEMPLATES.built;

  const safeText = template.safePattern(cleanSubject, '', '');
  
  const metricText = activeMetric 
    ? template.metricPattern(cleanSubject, '', activeMetric, '') 
    : template.metricPattern(cleanSubject, '', '[Insert your metric, e.g. 35% latency / 20k TPS]', '');

  const impactText = template.impactPattern(cleanSubject, activeMetric ? `achieving ${activeMetric} and zero downtime` : '', '');

  const variants: RewriteVariant[] = [
    {
      type: 'SAFE',
      text: safeText,
      reason: '100% faithful to original facts. Upgrades passive tone to strong active verbs.',
      metricsNeeded: false
    },
    {
      type: 'METRIC',
      text: metricText,
      reason: 'Adds measurable proof of outcome. Proven to increase recruiter shortlists by 4x.',
      metricsNeeded: !activeMetric
    },
    {
      type: 'IMPACT',
      text: impactText,
      reason: 'Positions you at a Senior / SDE-2 level by focusing on business scale and architectural reliability.',
      metricsNeeded: false
    }
  ];

  return {
    id: `rw-${Math.random().toString(36).substring(2, 9)}`,
    originalText,
    intent,
    detectedIssues,
    variants
  };
}
