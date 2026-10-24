import { z } from 'zod';

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
