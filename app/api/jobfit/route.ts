import { NextRequest, NextResponse } from 'next/server';
import { matchJobDescription, predictRejection, parseJobDescription, generateApplicationRecommendations } from '@/lib/jobfit';
import { ParsedProfile } from '@/types';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`jobfit:${ip}`, 60, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const { profile, jdText, company, title }: { profile: ParsedProfile; jdText: string; company?: string; title?: string } = await req.json();

    if (!jdText || !jdText.trim()) {
      return NextResponse.json(
        { error: { code: 'EMPTY_JD', message: 'Job description text is required.' } },
        { status: 400 }
      );
    }

    const parsedJd = parseJobDescription(jdText, company || 'Target Company', title || 'Software Engineer');
    const match = matchJobDescription(profile, jdText, parsedJd.company, parsedJd.title);
    const rejectionReasons = predictRejection(profile, profile.expectedSalaryLakhs || 16);
    const recommendations = generateApplicationRecommendations(match, parsedJd);

    return NextResponse.json({
      success: true,
      match,
      parsedJd,
      rejectionReasons,
      recommendations,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'JOBFIT_FAILED', message: (err as Error)?.message || 'Failed to match job description.' } },
      { status: 500 }
    );
  }
}
