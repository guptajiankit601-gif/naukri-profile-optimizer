import { NextRequest, NextResponse } from 'next/server';
import { parseRawResumeText } from '@/lib/parser';
import { ParsedProfile } from '@/types';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`manual-parse:${ip}`, 30, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const body = await req.json();

    // If already structured profile, validate and return
    if (body.targetRoleId && body.skills && body.experiences) {
      const profile = body as ParsedProfile;
      return NextResponse.json({
        success: true,
        profile,
        engineVersion: '2.0.0'
      });
    }

    // If raw text submitted
    const rawText = body.text || body.rawText || '';
    if (!rawText.trim()) {
      return NextResponse.json(
        { error: { code: 'EMPTY_TEXT', message: 'Resume text is required.' } },
        { status: 400 }
      );
    }

    const defaultRole = body.targetRole || body.targetRoleId || 'backend-engineer';
    const profile = parseRawResumeText(rawText, defaultRole);

    return NextResponse.json({
      success: true,
      profile,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: (err as Error)?.message || 'Failed to process profile data.' } },
      { status: 500 }
    );
  }
}
