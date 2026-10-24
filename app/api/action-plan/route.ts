import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/planner';
import { calculateScore } from '@/lib/scoring';
import { ParsedProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const profile: ParsedProfile = await req.json();
    const scoreReport = calculateScore(profile);
    const actionPlan = generatePlan(profile, scoreReport);
    return NextResponse.json({ success: true, actionPlan });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message }, { status: 500 });
  }
}
