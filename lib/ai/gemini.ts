import 'server-only';

import { GoogleGenerativeAI, GenerationConfig, SafetySetting } from '@google/generative-ai';
import { SYSTEM_INSTRUCTION, buildUserPrompt, buildRewritePrompt, AIPromptInput } from './prompts';
import { AIRewriteResponseSchema, AIRewriteResponse, RewriteResponseSchema, RewriteResponse } from './schema';
import { fabricationCheck } from './guardrails';
import { rewriteBullet } from '@/lib/rewriter/engine';
import { BulletRewrite } from '@/types';
import { MemoryStore, sha256 } from '@/lib/memory/store';

const MODEL_PRIMARY = 'gemini-2.0-flash';
const MODEL_FALLBACK = 'gemini-1.5-flash';

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
}

export const GEMINI_CONFIG = {
  model: MODEL_PRIMARY,
  fallbackModel: MODEL_FALLBACK,

  generationConfig: {
    temperature: 0.4, // low = faithful rewriting
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
    candidateCount: 1,
    responseMimeType: 'application/json', // structured output
  } satisfies GenerationConfig,

  safetySettings: [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' as any },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' as any },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' as any },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' as any },
  ] as SafetySetting[],
};

/**
 * Call Gemini API with automatic fallback from gemini-2.0-flash to gemini-1.5-flash
 */
export async function callGemini(
  prompt: string,
  systemInstructionText: string = SYSTEM_INSTRUCTION
): Promise<{ text: string; modelUsed: string } | null> {
  const aiClient = getGeminiClient();
  if (!aiClient) return null;

  // 1. Try Primary model
  try {
    const model = aiClient.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: GEMINI_CONFIG.generationConfig,
      safetySettings: GEMINI_CONFIG.safetySettings,
      systemInstruction: { role: 'system', parts: [{ text: systemInstructionText }] }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (text) {
      return { text, modelUsed: GEMINI_CONFIG.model };
    }
  } catch (primaryErr) {
    console.warn(`[Gemini] Primary model ${GEMINI_CONFIG.model} failed, attempting fallback to ${GEMINI_CONFIG.fallbackModel}:`, (primaryErr as Error).message);
  }

  // 2. Try Fallback model
  try {
    const fallbackModel = aiClient.getGenerativeModel({
      model: GEMINI_CONFIG.fallbackModel,
      generationConfig: GEMINI_CONFIG.generationConfig,
      safetySettings: GEMINI_CONFIG.safetySettings,
      systemInstruction: { role: 'system', parts: [{ text: systemInstructionText }] }
    });

    const result = await fallbackModel.generateContent(prompt);
    const text = result.response.text();
    if (text) {
      return { text, modelUsed: GEMINI_CONFIG.fallbackModel };
    }
  } catch (fallbackErr) {
    console.warn(`[Gemini] Fallback model ${GEMINI_CONFIG.fallbackModel} also failed:`, (fallbackErr as Error).message);
  }

  return null;
}

export interface TryAiBulletInput {
  id?: string;
  original: string;
  slots?: Record<string, unknown>;
}

export interface TryAiProfileInput {
  id: string;
  targetRole: string;
}

/**
 * Try AI polish with 30-day cache, Zod validation, and fabrication filter.
 * Returns null if cache miss AND Gemini fails or fails fabrication check.
 */
export async function tryAi(
  bullet: TryAiBulletInput,
  profile: TryAiProfileInput,
  level?: 'safe' | 'metric' | 'impact'
): Promise<(AIRewriteResponse & { source: 'ai' | 'ai-cache'; modelUsed?: string; note?: string }) | null> {
  const cacheKey = `ai-rewrite:${sha256(
    bullet.original + '|' + profile.targetRole + '|' + (level ?? 'all') + '|' + JSON.stringify(bullet.slots ?? {})
  )}`;

  // 1. Cache lookup (30-day TTL)
  const cached = MemoryStore.getAiRewrite(cacheKey) as AIRewriteResponse | null;
  if (cached) {
    return { ...cached, source: 'ai-cache' };
  }

  const client = getGeminiClient();
  if (!client) return null;

  try {
    const promptInput: AIPromptInput = {
      bullet: bullet.original,
      roleTitle: profile.targetRole,
      level: level || 'metric',
      userSlots: bullet.slots
    };

    const userPrompt = buildUserPrompt(promptInput);
    const geminiRes = await callGemini(userPrompt, SYSTEM_INSTRUCTION);
    if (!geminiRes || !geminiRes.text) return null;

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(geminiRes.text);
    } catch {
      return null; // Invalid JSON → discard
    }

    const validated = AIRewriteResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      return null; // Schema mismatch → discard
    }

    // Fabrication filter: all variants must strictly contain only numbers in source or user slots
    for (const v of validated.data.variants) {
      const check = fabricationCheck(v.text, bullet.original, bullet.slots);
      if (!check.ok) {
        // Discard entire AI response when fabrication is detected
        return null;
      }
    }

    // Persist in 30-day cache
    MemoryStore.cacheAiRewrite(cacheKey, validated.data);

    return {
      ...validated.data,
      source: 'ai',
      modelUsed: geminiRes.modelUsed
    };
  } catch (err) {
    console.warn({ event: 'gemini_failed', model: GEMINI_CONFIG.model, error: (err as Error).message });
    return null;
  }
}

/**
 * Backward-compatible helper for legacy callers
 */
export async function generateAiRewrite(
  originalBullet: string,
  targetRole: string = 'Backend Engineer',
  userMetric?: string
): Promise<BulletRewrite> {
  const cacheKey = sha256(`${originalBullet}:${targetRole}:all:${userMetric || ''}`);
  const cached = MemoryStore.getAiRewrite(cacheKey) as BulletRewrite | null;
  if (cached) {
    return cached;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const deterministic = rewriteBullet(originalBullet, userMetric);
    MemoryStore.cacheAiRewrite(cacheKey, deterministic);
    return deterministic;
  }

  try {
    const prompt = buildRewritePrompt(originalBullet, targetRole, userMetric);
    const geminiRes = await callGemini(prompt, SYSTEM_INSTRUCTION);

    if (!geminiRes) {
      const fallback = rewriteBullet(originalBullet, userMetric);
      MemoryStore.cacheAiRewrite(cacheKey, fallback);
      return fallback;
    }

    const parsed = JSON.parse(geminiRes.text);
    const validated: RewriteResponse = RewriteResponseSchema.parse(parsed);

    // Apply fabrication filter
    const check1 = fabricationCheck(validated.safe.text, originalBullet, userMetric ? { metric: userMetric } : {});
    const check2 = fabricationCheck(validated.metric.text, originalBullet, userMetric ? { metric: userMetric } : {});
    const check3 = fabricationCheck(validated.impact.text, originalBullet, userMetric ? { metric: userMetric } : {});

    if (!check1.ok || !check2.ok || !check3.ok) {
      const fallback = rewriteBullet(originalBullet, userMetric);
      MemoryStore.cacheAiRewrite(cacheKey, fallback);
      return fallback;
    }

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

    MemoryStore.cacheAiRewrite(cacheKey, rewriteResult);
    return rewriteResult;
  } catch {
    const fallback = rewriteBullet(originalBullet, userMetric);
    MemoryStore.cacheAiRewrite(cacheKey, fallback);
    return fallback;
  }
}
