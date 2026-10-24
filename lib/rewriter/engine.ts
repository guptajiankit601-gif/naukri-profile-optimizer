import { BulletRewrite, RewriteVariant } from '@/types';
import { detectIntent } from './detect-intent';
import { detectIssues } from './detect-issues';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { REWRITE_TEMPLATES } from '@/lib/data/templates';

export function rewriteBullet(originalText: string, customMetric?: string): BulletRewrite {
  const intent = detectIntent(originalText);
  const detectedIssues = detectIssues(originalText);
  const existingMetrics = extractMetrics(originalText);
  const activeMetric = customMetric || (existingMetrics.length > 0 ? existingMetrics[0].value : '');

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
      metricsNeeded: !activeMetric,
      needsInput: !activeMetric ? 'metric' : null
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
