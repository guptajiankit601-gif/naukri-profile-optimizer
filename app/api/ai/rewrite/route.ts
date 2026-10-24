import { NextRequest, NextResponse } from 'next/server';
import { generateAiRewrite } from '@/lib/ai/gemini';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { allowed } = checkRateLimit(ip, 30, 3600000); // 30 AI calls/hr limit per IP
  if (!allowed) {
    return NextResponse.json({
      error: { code: 'AI_RATE_LIMITED', message: 'Hourly AI rewrite limit reached. Falling back to template suggestions.' }
    }, { status: 429 });
  }

  try {
    const { bulletText, role, userMetric } = await req.json();
    if (!bulletText) {
      return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'Bullet text is required.' } }, { status: 400 });
    }

    const rewriteResult = await generateAiRewrite(bulletText, role, userMetric);
    return NextResponse.json({
      success: true,
      rewrite: rewriteResult
    });
  } catch (err: unknown) {
    return NextResponse.json({
      error: { code: 'AI_ERROR', message: (err as Error)?.message || 'AI rewrite failed.' }
    }, { status: 500 });
  }
}
