import { NextRequest, NextResponse } from 'next/server';
import { parseRawResumeText, fetchProfileUrl } from '@/lib/parser';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment.' } }, { status: 429 });
  }

  try {
    const body = await req.json();
    let textToParse = body.text || '';

    if (body.url) {
      const urlResult = await fetchProfileUrl(body.url);
      if (!urlResult.ok) {
        return NextResponse.json({ error: { code: 'URL_FETCH_FAILED', message: urlResult.reason } }, { status: 400 });
      }
      textToParse = urlResult.text || '';
    }

    if (!textToParse || textToParse.trim().length < 20) {
      return NextResponse.json({ error: { code: 'EMPTY_INPUT', message: 'Please provide valid resume text.' } }, { status: 400 });
    }

    const parsedProfile = parseRawResumeText(textToParse, body.targetRoleId || 'backend-engineer');
    return NextResponse.json({ success: true, profile: parsedProfile });
  } catch (err: unknown) {
    return NextResponse.json({ error: { code: 'PARSE_FAILED', message: (err as Error)?.message || 'Failed to parse resume.' } }, { status: 500 });
  }
}
