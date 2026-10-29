import { BulletRewrite, RewriteVariant } from '@/types';
import { detectIntent } from './detect-intent';
import { detectIssues } from './detect-issues';
import { extractMetrics } from '@/lib/parser/extract-metrics';
import { REWRITE_TEMPLATES } from '@/lib/data/templates';
import { extractNumbers } from '@/lib/ai/guardrails';

/**
 * Validates that a rewritten variant preserves original facts and doesn't invent metrics
 * or inject foreign domain buzzwords.
 */
export function validateRewriteFactualIntegrity(
  originalText: string,
  variantText: string,
  customMetric?: string
): { isValid: boolean; issue?: string; fallbackText: string } {
  const lowerOrig = originalText.toLowerCase();
  const lowerVariant = variantText.toLowerCase();

  // 1. Metric fabrication check
  // Any metric in the variant must either exist in originalText, exist in customMetric,
  // or be enclosed in explicit placeholder brackets [add verified metric...]
  const variantWithoutPlaceholders = variantText.replace(/\[[^\]]+\]/g, '');
  const variantNumbers = extractNumbers(variantWithoutPlaceholders);
  const allowedNumbers = extractNumbers(`${originalText} ${customMetric || ''}`);

  const fabricatedNumbers = variantNumbers.filter(n => !allowedNumbers.includes(n));
  if (fabricatedNumbers.length > 0) {
    return {
      isValid: false,
      issue: `Contains unverified numbers not present in source: ${fabricatedNumbers.join(', ')}`,
      fallbackText: createFaithfulFallback(originalText)
    };
  }

  // 2. Domain leakage check (e.g. sales terminology injected into technical bullets)
  const isOrigTechnical = Boolean(
    lowerOrig.match(/\b(api|apis|backend|frontend|java|spring|boot|microservice|python|sql|docker|cloud|database|develop|architect|engineer|code)\b/)
  );
  const hasSalesLeakage = Boolean(
    lowerVariant.match(/\b(prospecting|cold outreach|cold call|bdr|sdr|mql|pipeline generation|quota attainment|pitching to enterprise)\b/)
  );
  if (isOrigTechnical && hasSalesLeakage) {
    return {
      isValid: false,
      issue: 'Unrelated sales terminology injected into technical engineering bullet.',
      fallbackText: createFaithfulFallback(originalText)
    };
  }

  return {
    isValid: true,
    fallbackText: variantText
  };
}

/**
 * Faithful grammar & action-verb fallback:
 * Replaces passive openings with strong active past-tense verbs while preserving 100% of original words and facts.
 */
export function createFaithfulFallback(originalText: string): string {
  let cleaned = originalText
    .replace(/^[-•*·]\s*/, '')
    .replace(/^(responsible for|worked on|helped with|handled the|tasked with|involved in|part of team that|duties included)\s*/i, '')
    .trim();

  let verbPrefix = 'Delivered';
  if (/^developing\s+/i.test(cleaned)) {
    verbPrefix = 'Developed';
    cleaned = cleaned.replace(/^developing\s+/i, '');
  } else if (/^building\s+/i.test(cleaned)) {
    verbPrefix = 'Built';
    cleaned = cleaned.replace(/^building\s+/i, '');
  } else if (/^creating\s+/i.test(cleaned)) {
    verbPrefix = 'Created';
    cleaned = cleaned.replace(/^creating\s+/i, '');
  } else if (/^implementing\s+/i.test(cleaned)) {
    verbPrefix = 'Implemented';
    cleaned = cleaned.replace(/^implementing\s+/i, '');
  } else if (/^maintaining\s+/i.test(cleaned)) {
    verbPrefix = 'Maintained';
    cleaned = cleaned.replace(/^maintaining\s+/i, '');
  } else if (/^managing\s+/i.test(cleaned)) {
    verbPrefix = 'Managed';
    cleaned = cleaned.replace(/^managing\s+/i, '');
  } else if (/^optimizing\s+/i.test(cleaned)) {
    verbPrefix = 'Optimized';
    cleaned = cleaned.replace(/^optimizing\s+/i, '');
  }

  const result = `${verbPrefix} ${cleaned}`;
  return result.endsWith('.') ? result : `${result}.`;
}

export function rewriteBullet(originalText: string, customMetric?: string, targetRole?: string): BulletRewrite {
  const intent = detectIntent(originalText, targetRole);
  const detectedIssues = detectIssues(originalText);
  const existingMetrics = extractMetrics(originalText);
  const activeMetric = customMetric || (existingMetrics.length > 0 ? existingMetrics[0].value : '');

  // Strip leading bullet markers and passive phrases
  let cleaned = originalText
    .replace(/^[-•*·]\s*/, '')
    .replace(/^(responsible for|worked on|helped with|handled the|tasked with|involved in|part of team that|duties included)\s*/i, '')
    .trim();

  // Strip leading action gerunds so templates don't double the verb (e.g. "Architected and built developing...")
  cleaned = cleaned.replace(/^(developing|building|creating|architecting|implementing|engineering|designing|coding|programming|authoring|constructing)\s+/i, '');

  // Strip trailing period for template injection
  const cleanSubject = cleaned.replace(/\.+$/, '').trim();

  const template = REWRITE_TEMPLATES[intent] || REWRITE_TEMPLATES.built;

  let safeText = template.safePattern(cleanSubject, '', '');
  let metricText = activeMetric 
    ? template.metricPattern(cleanSubject, '', activeMetric, '') 
    : template.metricPattern(cleanSubject, '', '[add verified metric, e.g. 99.9% uptime or 250ms avg latency]', '');
  let impactText = template.impactPattern(
    cleanSubject,
    activeMetric ? `achieving ${activeMetric} while maintaining system stability` : '',
    ''
  );

  // Apply factual integrity validation
  const safeValidation = validateRewriteFactualIntegrity(originalText, safeText, customMetric);
  if (!safeValidation.isValid) safeText = safeValidation.fallbackText;

  const metricValidation = validateRewriteFactualIntegrity(originalText, metricText, customMetric);
  if (!metricValidation.isValid) metricText = metricValidation.fallbackText;

  const impactValidation = validateRewriteFactualIntegrity(originalText, impactText, customMetric);
  if (!impactValidation.isValid) impactText = impactValidation.fallbackText;

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
