import { BulletRewrite } from '@/types';
import { detectIntent } from '@/lib/rewriter/detect-intent';
import { detectIssues } from '@/lib/rewriter/detect-issues';
import { rewriteBullet } from '@/lib/rewriter/engine';

export function detectBulletIntent(text: string, targetRole?: string): 'built' | 'led' | 'improved' | 'managed' | 'sold' | 'taught' | 'supported' | 'analyzed' {
  return detectIntent(text, targetRole);
}

export function detectBulletIssues(text: string): string[] {
  return detectIssues(text);
}

export function generateBulletRewrite(originalText: string, customMetric?: string): BulletRewrite {
  return rewriteBullet(originalText, customMetric);
}
