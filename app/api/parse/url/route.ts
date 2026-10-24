import { NextRequest, NextResponse } from 'next/server';
import { fetchProfileUrl } from '@/lib/parser/fetch-profile-url';
import { parseRawResumeText } from '@/lib/parser';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`url-parse:${ip}`, 20, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many URL import requests. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const { url }: { url?: string } = await req.json();
    if (!url || !url.trim()) {
      return NextResponse.json(
        { error: { code: 'INVALID_URL', message: 'Profile URL is required.' } },
        { status: 400 }
      );
    }

    const fetchRes = await fetchProfileUrl(url.trim());
    if (!fetchRes.ok || !fetchRes.text) {
      return NextResponse.json(
        { error: { code: 'URL_FETCH_FAILED', message: fetchRes.reason || 'Failed to extract public profile from URL. Please paste your resume text directly.' } },
        { status: 422 }
      );
    }

    const profile = parseRawResumeText(fetchRes.text);

    return NextResponse.json({
      success: true,
      profile,
      extractedChars: fetchRes.text.length,
      engineVersion: '2.0.0'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: (err as Error)?.message || 'Internal parsing error.' } },
      { status: 500 }
    );
  }
}
