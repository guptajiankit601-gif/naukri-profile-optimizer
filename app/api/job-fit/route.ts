import { NextRequest, NextResponse } from 'next/server';
import { matchJobDescription, predictRejection } from '@/lib/jobfit';
import { ParsedProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { profile, jdText, company, title }: { profile: ParsedProfile; jdText: string; company?: string; title?: string } = await req.json();

    if (!jdText) {
      return NextResponse.json({ error: { code: 'EMPTY_JD', message: 'Job description text is required.' } }, { status: 400 });
    }

    const match = matchJobDescription(profile, jdText, company || 'Target Company', title || 'Target Role');
    const rejectionReasons = predictRejection(profile, profile.expectedSalaryLakhs || 16);

    return NextResponse.json({
      success: true,
      match,
      rejectionReasons
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: { code: 'JOBFIT_FAILED', message: (err as Error)?.message || 'Failed to match job description.' } }, { status: 500 });
  }
}
