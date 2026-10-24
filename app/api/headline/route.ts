import { NextRequest, NextResponse } from 'next/server';
import { optimizeHeadline } from '@/lib/scoring/headline';
import { ParsedProfile } from '@/types';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`headline:${ip}`, 60, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const { profile }: { profile: ParsedProfile } = await req.json();
    if (!profile || !profile.headline) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Profile with headline is required.' } },
        { status: 400 }
      );
    }

    const analysis = optimizeHeadline(profile);

    return NextResponse.json({
      success: true,
      analysis,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'HEADLINE_OPTIMIZATION_FAILED', message: (err as Error)?.message || 'Failed to optimize headline.' } },
      { status: 500 }
    );
  }
}
