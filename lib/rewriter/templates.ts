import { REWRITE_TEMPLATES } from '@/lib/data/templates';

export { REWRITE_TEMPLATES };

export interface BulletTemplate {
  safePattern: (action: string, tool: string, outcome: string) => string;
  metricPattern: (action: string, tool: string, metric: string, outcome: string) => string;
  impactPattern: (action: string, scale: string, businessValue: string) => string;
}
