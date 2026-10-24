import { NextRequest, NextResponse } from 'next/server';
import { ATS_RESUME_TEMPLATE } from '@/lib/data/resume-templates';
import { ParsedProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const profile: ParsedProfile = await req.json();

    const naukriBlocks = {
      headline: profile.headline,
      skills: profile.skills.slice(0, 15).join(', '),
      summary: profile.summary
    };

    const linkedInBlocks = {
      headline: `${profile.headline} | Open to Opportunities`,
      about: `${profile.summary}\n\nCore Competencies:\n${profile.skills.slice(0, 10).join(' • ')}`
    };

    return NextResponse.json({
      success: true,
      template: ATS_RESUME_TEMPLATE,
      naukriBlocks,
      linkedInBlocks
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message }, { status: 500 });
  }
}
