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
    : template.metricPattern(cleanSubject, '', '[add verified metric, e.g. X% throughput gain or Y TPS]', '');
  const impactText = template.impactPattern(
    cleanSubject,
    activeMetric ? `achieving ${activeMetric} while maintaining system stability` : '',
    ''
  );

  const variants: RewriteVariant[] = [
    {
      type: 'SAFE',
      text: safeText,
      reason: '100% fact-preserving. Upgrades passive openings to active ownership without adding unverified claims.',
      metricsNeeded: false
    },
    {
      type: 'METRIC',
      text: metricText,
      reason: activeMetric 
        ? 'Integrates your verified metric into an impact-focused structure.' 
        : 'Includes an explicit placeholder [add verified metric] for your genuine performance numbers.',
      metricsNeeded: !activeMetric,
      needsInput: !activeMetric ? 'metric' : null
    },
    {
      type: 'IMPACT',
      text: impactText,
      reason: 'Highlights technical delivery and architectural rigor without fabricating statistics.',
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
