import { NextRequest, NextResponse } from 'next/server';
import { calculateScore } from '@/lib/scoring';
import { generatePlan } from '@/lib/planner';
import { ParsedProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const profile: ParsedProfile = await req.json();
    if (!profile || !profile.targetRoleId) {
      return NextResponse.json({ error: { code: 'INVALID_PROFILE', message: 'Profile data missing.' } }, { status: 400 });
    }

    const scoreReport = calculateScore(profile);
    const actionPlan = generatePlan(profile, scoreReport);

    return NextResponse.json({
      success: true,
      scoreReport,
      actionPlan
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: { code: 'ANALYSIS_FAILED', message: (err as Error)?.message || 'Failed to analyze profile.' } }, { status: 500 });
  }
}
