import { z } from 'zod';

/**
 * RESPONSE SCHEMA (GEMINI INTEGRATION Section 5)
 * Strict validation enforcing approved intents, issues, and variant structure.
 */

export const RewriteLevelSchema = z.enum(['safe', 'metric', 'impact']);

export const IntentSchema = z.enum([
  'built', 'led', 'improved', 'managed', 'sold', 'taught', 'supported', 'analyzed',
]);

export const IssueSchema = z.enum([
  'passive', 'no-verb', 'no-metric', 'vague-object', 'first-person',
  'too-short', 'too-long', 'weak-verb', 'cliche',
]);

export const AIVariantSchema = z.object({
  level: RewriteLevelSchema,
  text: z.string().min(5).max(400),
  reason: z.string().min(5).max(300),
  requiresInput: z.enum(['metric', 'scale', 'team']).nullable(),
});

export const AIRewriteResponseSchema = z.object({
  variants: z.array(AIVariantSchema).min(1).max(3),
  detectedIntent: IntentSchema,
  detectedIssues: z.array(IssueSchema).max(9),
});

export type AIRewriteResponse = z.infer<typeof AIRewriteResponseSchema>;
export type AIVariant = z.infer<typeof AIVariantSchema>;
export type RewriteLevel = z.infer<typeof RewriteLevelSchema>;

// Legacy schema compatibility
export const RewriteResponseSchema = z.object({
  safe: z.object({
    text: z.string(),
    reason: z.string()
  }),
  metric: z.object({
    text: z.string(),
    reason: z.string()
  }),
  impact: z.object({
    text: z.string(),
    reason: z.string()
  })
});

export type RewriteResponse = z.infer<typeof RewriteResponseSchema>;
