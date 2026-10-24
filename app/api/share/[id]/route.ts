import { NextRequest, NextResponse } from 'next/server';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { MemoryStore } from '@/lib/memory/store';
import { calculateScore, calculateVisibilityScore, compareProfileToBenchmark } from '@/lib/scoring';
import { SHARE_CAPTIONS } from '@/lib/data/captions';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shareId = params.id;

    // Look in anonymous store, account store, or seeded profiles
    const anon = MemoryStore.getAnonymousProfile(shareId);
    const acc = MemoryStore.getAccountProfile(shareId);
    const seeded = SEEDED_PROFILES[shareId];

    const profile = anon?.parsed || acc?.parsed || seeded;

    if (!profile) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Scorecard not found or expired after 24h.' } },
        { status: 404 }
      );
    }

    const scoreReport = calculateScore(profile);
    const visibility = calculateVisibilityScore(profile);
    const benchmark = compareProfileToBenchmark(profile);

    // Sanitize PII for public scorecard (no email, phone, full address)
    const sanitizedCandidate = {
      name: profile.name.split(' ')[0] + ' ' + (profile.name.split(' ')[1]?.[0] || '') + '.',
      targetRole: profile.targetRole,
      experienceBand: profile.experienceBand,
      score: scoreReport.overallScore,
      verdict: scoreReport.verdict,
      visibilityScore: visibility.score,
      visibilityPercentile: benchmark.visibilityPercentile,
      topStrengths: scoreReport.components.filter(c => c.status === 'good').map(c => c.name),
      topGaps: scoreReport.components.filter(c => c.status === 'bad').map(c => c.name)
    };

    const linkedInCaption = SHARE_CAPTIONS.linkedin(
      scoreReport.overallScore,
      scoreReport.verdict,
      profile.targetRole
    );

    return NextResponse.json({
      success: true,
      card: sanitizedCandidate,
      shareCaption: linkedInCaption,
      generatedAt: new Date().toISOString(),
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'SHARE_CARD_FAILED', message: (err as Error)?.message || 'Failed to retrieve scorecard.' } },
      { status: 500 }
    );
  }
}
