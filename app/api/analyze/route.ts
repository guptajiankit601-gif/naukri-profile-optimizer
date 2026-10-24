import { NextRequest, NextResponse } from 'next/server';
import { calculateScore, calculateVisibilityScore, evaluateAllPersonas, compareProfileToBenchmark, analyzeKeywordGaps } from '@/lib/scoring';
import { generateActionPlan } from '@/lib/plan/generate';
import { ParsedProfile } from '@/types';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`analyze:${ip}`, 30, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const profile: ParsedProfile = await req.json();
    if (!profile || !profile.targetRoleId) {
      return NextResponse.json(
        { error: { code: 'INVALID_PROFILE', message: 'Profile data is required.' } },
        { status: 400 }
      );
    }

    const scoreReport = calculateScore(profile);
    const visibilityReport = calculateVisibilityScore(profile);
    const personas = evaluateAllPersonas(profile);
    const benchmark = compareProfileToBenchmark(profile);
    const keywords = analyzeKeywordGaps(profile);
    const actionPlanSummary = generateActionPlan(profile);

    return NextResponse.json({
      success: true,
      scoreReport,
      visibilityReport,
      personas,
      benchmark,
      keywords,
      actionPlan: actionPlanSummary.items,
      actionPlanSummary,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'ANALYSIS_FAILED', message: (err as Error)?.message || 'Failed to analyze profile.' } },
      { status: 500 }
    );
  }
}
