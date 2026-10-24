import { GoogleGenerativeAI } from '@google/generative-ai';
import { BULLET_REWRITE_SYSTEM_PROMPT, buildRewritePrompt } from './prompts';
import { RewriteResponseSchema, RewriteResponse } from './schema';
import { rewriteBullet } from '@/lib/rewriter/engine';
import { BulletRewrite } from '@/types';
import { MemoryStore, sha256 } from '@/lib/memory/store';

export async function generateAiRewrite(
  originalBullet: string,
  targetRole: string = 'Backend Engineer',
  userMetric?: string
): Promise<BulletRewrite> {
  // Section 6.3: Compute 30-day cache key
  const cacheKey = sha256(`${originalBullet}:${targetRole}:all:${userMetric || ''}`);
  const cached = MemoryStore.getAiRewrite(cacheKey) as BulletRewrite | null;
  if (cached) {
    return cached;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fall back seamlessly to deterministic engine
    const deterministic = rewriteBullet(originalBullet, userMetric);
    MemoryStore.cacheAiRewrite(cacheKey, deterministic);
    return deterministic;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4
      },
      systemInstruction: BULLET_REWRITE_SYSTEM_PROMPT
    });

    // Section 6.1: ONLY single bullet, role, and slot value sent
    const prompt = buildRewritePrompt(originalBullet, targetRole, userMetric);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    const validated: RewriteResponse = RewriteResponseSchema.parse(parsed);

    const rewriteResult: BulletRewrite = {
      id: `ai-${Date.now()}`,
      originalText: originalBullet,
      intent: 'built',
      detectedIssues: ['AI Polished phrasing and power verbs applied'],
      variants: [
        {
          type: 'SAFE',
          text: validated.safe.text,
          reason: validated.safe.reason,
          metricsNeeded: false
        },
        {
          type: 'METRIC',
          text: validated.metric.text,
          reason: validated.metric.reason,
          metricsNeeded: false
        },
        {
          type: 'IMPACT',
          text: validated.impact.text,
          reason: validated.impact.reason,
          metricsNeeded: false
        }
      ]
    };

    // Cache in M1 for 30 days
    MemoryStore.cacheAiRewrite(cacheKey, rewriteResult);
    return rewriteResult;
  } catch (_err) {
    // Graceful fallback to deterministic engine on network, quota, or schema error
    const fallback = rewriteBullet(originalBullet, userMetric);
    MemoryStore.cacheAiRewrite(cacheKey, fallback);
    return fallback;
  }
}
