import { NextRequest, NextResponse } from 'next/server';
import { ROLE_KEYWORDS_DATA } from '@/lib/data/keywords';
import { analyzeKeywordGaps, simulateKeywordAddition } from '@/lib/scoring/keywords';
import { ParsedProfile } from '@/types';
import { rateLimit } from '@/lib/security/rate-limit';

export async function GET(req: NextRequest) {
  const roleId = req.nextUrl.searchParams.get('roleId') || 'backend-engineer';
  const keywords = ROLE_KEYWORDS_DATA[roleId] || ROLE_KEYWORDS_DATA['backend-engineer'];
  return NextResponse.json({ success: true, roleId, keywords, engineVersion: '2.0.0' });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`keywords:${ip}`, 60, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const { profile, simulateAdd }: { profile: ParsedProfile; simulateAdd?: string[] } = await req.json();
    if (!profile || !profile.targetRoleId) {
      return NextResponse.json(
        { error: { code: 'INVALID_PROFILE', message: 'Profile data is required.' } },
        { status: 400 }
      );
    }

    const analysis = analyzeKeywordGaps(profile);

    let simulationResult;
    if (simulateAdd && simulateAdd.length > 0) {
      simulationResult = simulateKeywordAddition(profile, simulateAdd);
    }

    return NextResponse.json({
      success: true,
      analysis,
      simulationResult,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'KEYWORD_ANALYSIS_FAILED', message: (err as Error)?.message || 'Failed to analyze keywords.' } },
      { status: 500 }
    );
  }
}
