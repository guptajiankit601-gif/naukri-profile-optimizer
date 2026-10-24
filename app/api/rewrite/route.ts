import { NextRequest, NextResponse } from 'next/server';
import { rewriteBullet, analyzeBullet } from '@/lib/rewriter';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`rewrite:${ip}`, 60, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const { bulletText, metric, bullet } = await req.json();
    const textToRewrite = bulletText || bullet;

    if (!textToRewrite || !textToRewrite.trim()) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Bullet text is required.' } },
        { status: 400 }
      );
    }

    const analysis = analyzeBullet(textToRewrite);
    const rewrite = rewriteBullet(textToRewrite, metric);

    return NextResponse.json({
      success: true,
      analysis,
      rewrite,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'REWRITE_FAILED', message: (err as Error)?.message || 'Failed to rewrite bullet.' } },
      { status: 500 }
    );
  }
}
