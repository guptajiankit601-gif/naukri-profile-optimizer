import { detectIntent } from './detect-intent';
import { detectIssues } from './detect-issues';
import { Intent } from '@/types';

export { detectIntent, detectIssues };
export type { Intent };

export interface BulletDetectionResult {
  intent: Intent;
  issues: string[];
  isPassive: boolean;
  hasMetric: boolean;
  needsRewrite: boolean;
}

export function analyzeBullet(bullet: string): BulletDetectionResult {
  const intent = detectIntent(bullet);
  const issues = detectIssues(bullet);
  const isPassive = issues.some(i => i.toLowerCase().includes('passive'));
  const hasMetric = !issues.some(i => i.toLowerCase().includes('metric'));

  return {
    intent,
    issues,
    isPassive,
    hasMetric,
    needsRewrite: issues.length > 0
  };
}
