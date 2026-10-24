import { NextRequest, NextResponse } from 'next/server';
import { calculateScore } from '@/lib/scoring';
import { ParsedProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { profile, expIndex, bulletIndex, acceptedText }: { profile: ParsedProfile; expIndex: number; bulletIndex: number; acceptedText: string } = await req.json();

    const updatedExperiences = [...profile.experiences];
    if (updatedExperiences[expIndex] && updatedExperiences[expIndex].bullets) {
      updatedExperiences[expIndex].bullets[bulletIndex] = acceptedText;
    }

    const updatedProfile: ParsedProfile = {
      ...profile,
      experiences: updatedExperiences
    };

    const newScoreReport = calculateScore(updatedProfile);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      scoreReport: newScoreReport
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: { code: 'ACCEPT_FAILED', message: (err as Error)?.message || 'Failed to update bullet.' } }, { status: 500 });
  }
}
