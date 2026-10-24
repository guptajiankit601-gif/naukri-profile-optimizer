import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { tryAi } from '@/lib/ai/gemini';
import { hasConsent } from '@/lib/ai/consent';
import { checkAiQuota, incrementAiUsage } from '@/lib/ai/quota';
import { rateLimit } from '@/lib/security/rate-limit';
import { isAiEnabled } from '@/lib/security/kill-switches';
import { toPublicError } from '@/lib/security/error';
import { rewriteBullet } from '@/lib/rewriter/engine';
import { MemoryStore } from '@/lib/memory/store';

export const runtime = 'nodejs';
export const maxDuration = 30;

const NOTES = {
  AI_DISABLED: 'Showing template-based suggestions',
  AI_TIMEOUT: 'AI took too long — showing template-based suggestions',
  AI_INVALID_OUTPUT: "AI output couldn't be verified — showing template-based suggestions",
  AI_FABRICATED: 'AI suggested an unverified metric — showing the template version instead',
  QUOTA_EXCEEDED: 'Daily AI limit reached — showing template-based suggestions',
};

const BodySchema = z.object({
  profileId: z.string().optional(),
  bulletIds: z.array(z.string()).optional(),
  bulletText: z.string().optional(),
  bullets: z.array(z.object({
    id: z.string().optional(),
    original: z.string(),
    slots: z.record(z.string(), z.unknown()).optional()
  })).optional(),
  role: z.string().optional(),
  userMetric: z.string().optional(),
  level: z.enum(['safe', 'metric', 'impact']).optional(),
  consented: z.boolean().optional(),
  userId: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    // 1. AI Kill switch (Section 1.1 & Section 9.3)
    if (!isAiEnabled() || process.env.ENABLE_AI === 'false') {
      return NextResponse.json({
        ok: false,
        error: { code: 'AI_DISABLED', message: 'AI polishing is currently unavailable.' }
      }, { status: 503 });
    }

    // 2. Rate limit (30 per IP per hour)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rl = await rateLimit(`ai:${ip}`, 30, 3600);
    if (!rl.allowed) {
      return NextResponse.json({
        ok: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Try again in ${rl.retryAfter}s.`
        }
      }, { status: 429 });
    }

    const jsonBody = await req.json();
    const body = BodySchema.parse(jsonBody);

    const userId = body.userId || req.headers.get('x-user-id') || undefined;

    // 3. Consent check (Section 8)
    const hasExplicitConsent =
      (userId ? await hasConsent(userId, 'ai_processing') : false) ||
      body.consented === true ||
      req.headers.get('x-ai-consent') === 'true';

    if (!hasExplicitConsent) {
      return NextResponse.json({
        ok: false,
        error: {
          code: 'CONSENT_REQUIRED',
          message: 'Enable AI polishing in Settings to use this.'
        }
      }, { status: 403 });
    }

    // 4. Quota check (Section 9)
    const quota = await checkAiQuota(userId);
    if (!quota.allowed) {
      return NextResponse.json({
        ok: false,
        error: {
          code: 'QUOTA_EXCEEDED',
          message: 'Daily AI limit reached. Template suggestions are available.'
        }
      }, { status: 429 });
    }

    // 5. Gather bullets to process
    interface BulletToProcess {
      id: string;
      original: string;
      slots?: Record<string, unknown>;
    }

    const bullets: BulletToProcess[] = [];
    const targetRole = body.role || 'Backend Engineer';

    if (body.bulletText) {
      bullets.push({
        id: 'bullet-0',
        original: body.bulletText,
        slots: body.userMetric ? { metric: body.userMetric } : undefined
      });
    } else if (body.bullets && body.bullets.length > 0) {
      body.bullets.forEach((b, idx) => {
        bullets.push({
          id: b.id || `bullet-${idx}`,
          original: b.original,
          slots: b.slots
        });
      });
    } else if (body.profileId) {
      // Look up cached profile in session memory
      const profileData = MemoryStore.getAnonymousProfile(body.profileId);
      if (profileData && profileData.parsed && profileData.parsed.experiences) {
        let count = 0;
        for (const exp of profileData.parsed.experiences) {
          if (Array.isArray(exp.bullets)) {
            for (const b of exp.bullets) {
              if (typeof b === 'string' && b.trim()) {
                const bId = `exp-${count}`;
                if (!body.bulletIds || body.bulletIds.includes(bId)) {
                  bullets.push({ id: bId, original: b });
                  count++;
                }
              }
            }
          }
        }
      }
    }

    if (bullets.length === 0) {
      return NextResponse.json({
        ok: false,
        error: { code: 'INVALID_INPUT', message: 'No resume bullets provided for rewriting.' }
      }, { status: 400 });
    }

    // 6. Process bullets with Fallback chain
    let aiUsedCount = 0;
    const results = [];

    for (const b of bullets) {
      const deterministic = rewriteBullet(b.original, b.slots?.metric as string | undefined);
      const profileInput = { id: body.profileId || 'anon', targetRole };

      // Attempt AI polish tier
      const aiResult = await tryAi(b, profileInput, body.level);

      if (aiResult) {
        aiUsedCount++;
        results.push({
          bulletId: b.id,
          original: b.original,
          variants: aiResult.variants,
          detectedIntent: aiResult.detectedIntent,
          detectedIssues: aiResult.detectedIssues,
          source: aiResult.source,
          modelUsed: aiResult.modelUsed
        });
      } else {
        // Fallback to deterministic engine
        results.push({
          bulletId: b.id,
          original: b.original,
          variants: deterministic.variants.map(v => ({
            level: v.type.toLowerCase() as 'safe' | 'metric' | 'impact',
            text: v.text,
            reason: v.reason,
            requiresInput: v.metricsNeeded ? ('metric' as const) : null
          })),
          detectedIntent: deterministic.intent,
          detectedIssues: deterministic.detectedIssues,
          source: 'template' as const,
          note: NOTES.AI_DISABLED
        });
      }
    }

    if (aiUsedCount > 0) {
      await incrementAiUsage(userId, 400 * aiUsedCount, 500 * aiUsedCount);
    }

    // Backward compatibility for single rewrite caller
    const firstResult = results[0];
    const backwardCompatRewrite = firstResult ? {
      id: firstResult.bulletId,
      originalText: firstResult.original,
      intent: firstResult.detectedIntent,
      detectedIssues: firstResult.detectedIssues,
      variants: firstResult.variants.map(v => ({
        type: v.level.toUpperCase() as 'SAFE' | 'METRIC' | 'IMPACT',
        text: v.text,
        reason: v.reason,
        metricsNeeded: v.requiresInput !== null
      }))
    } : null;

    return NextResponse.json({
      ok: true,
      success: true,
      data: {
        results,
        source: aiUsedCount > 0 ? (results.some(r => r.source === 'ai-cache') ? 'ai-cache' : 'ai') : 'template',
        note: aiUsedCount === 0 ? NOTES.AI_DISABLED : undefined
      },
      rewrite: backwardCompatRewrite
    });
  } catch (err: unknown) {
    console.error('[AI Rewrite Route Error]:', err);
    const pubErr = toPublicError(err);
    return NextResponse.json({
      ok: false,
      error: { code: pubErr.code, message: pubErr.message }
    }, { status: pubErr.status });
  }
}
