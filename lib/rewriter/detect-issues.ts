import { extractMetrics } from '@/lib/parser/extract-metrics';
import { PASSIVE_PHRASES } from '@/lib/data/verbs';

export function detectIssues(text: string): string[] {
  const issues: string[] = [];
  const lower = text.toLowerCase();

  if (PASSIVE_PHRASES.some(p => lower.includes(p))) {
    issues.push('Passive voice ("Responsible for / worked on") dilutes your ownership');
  }

  if (/\b(i|my|we|our|me)\b/i.test(text)) {
    issues.push('First-person pronouns ("I", "my") violate standard resume conventions');
  }

  const metrics = extractMetrics(text);
  if (metrics.length === 0) {
    issues.push('Missing measurable outcome (no %, ₹, scale, or time saved)');
  }

  const words = text.trim().split(/\s+/).length;
  if (words < 8) {
    issues.push('Too brief: fails to explain context and technology used');
  } else if (words > 38) {
    issues.push('Overly verbose: recruiters scan bullets in under 2 seconds');
  }

  return issues;
}
