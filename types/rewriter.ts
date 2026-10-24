export type Intent = 'built' | 'led' | 'improved' | 'managed' | 'sold' | 'taught' | 'supported' | 'analyzed';

export type Issue = 'passive' | 'no-verb' | 'no-metric' | 'vague-object' | 'first-person' | 'too-short' | 'too-long' | 'weak-verb' | 'cliche';

export interface RewriteVariant {
  type: 'SAFE' | 'METRIC' | 'IMPACT';
  text: string;
  reason: string;
  metricsNeeded?: boolean;
  needsInput?: 'metric' | 'scale' | 'team' | null;
}

export interface BulletRewrite {
  id: string;
  originalText: string;
  intent: string;
  detectedIssues: string[];
  variants: RewriteVariant[];
}
