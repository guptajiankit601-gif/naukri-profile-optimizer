import { NextRequest, NextResponse } from 'next/server';
import { generateActionPlan } from '@/lib/plan/generate';
import { ParsedProfile } from '@/types';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`action-plan:${ip}`, 60, 3600);
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

    const planSummary = generateActionPlan(profile);

    return NextResponse.json({
      success: true,
      actionPlan: planSummary.items,
      summary: planSummary,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'ACTION_PLAN_FAILED', message: (err as Error)?.message || 'Failed to generate action plan.' } },
      { status: 500 }
    );
  }
}
