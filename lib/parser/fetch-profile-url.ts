import * as cheerio from 'cheerio';

export interface UrlFetchResult {
  ok: boolean;
  text?: string;
  reason?: string;
}

export async function fetchProfileUrl(targetUrl: string): Promise<UrlFetchResult> {
  try {
    const parsed = new URL(targetUrl);
    const host = parsed.hostname.toLowerCase();

    // Check allowlist
    const isAllowed = ['naukri.com', 'linkedin.com', 'indeed.com', 'monster.com', 'foundit.in'].some(
      h => host === h || host.endsWith('.' + h)
    );

    if (!isAllowed) {
      return {
        ok: false,
        reason: 'URL host not supported. Supported platforms: Naukri, LinkedIn, Indeed, Foundit.'
      };
    }

    // SSR fetch simulation
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        ok: false,
        reason: `Target platform returned HTTP ${res.status}. Most public profiles require direct login. Please copy-paste your resume text.`
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header').remove();
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim();

    if (cleanText.length < 60) {
      return {
        ok: false,
        reason: 'Profile page returned insufficient text (likely auth wall). Please paste your resume text directly.'
      };
    }

    return { ok: true, text: cleanText };
  } catch (err: unknown) {
    return {
      ok: false,
      reason: (err as Error)?.message || 'Failed to fetch public profile URL.'
    };
  }
}
