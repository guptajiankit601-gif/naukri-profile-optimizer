import { AppError } from './error';

/**
 * SSRF & URL FETCH RULES (SECURITY.md Section 3.3)
 */

export const ALLOWED_HOSTS = new Set([
  'naukri.com', 'www.naukri.com', 'm.naukri.com',
  'linkedin.com', 'www.linkedin.com',
  'indeed.com', 'www.indeed.com',
  'monster.com', 'www.monster.com'
]);

export function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.trim();

  // Localhost
  if (clean === 'localhost' || clean === '127.0.0.1' || clean === '::1') return true;

  // IPv4 Private ranges
  // 10.0.0.0 - 10.255.255.255
  if (/^10\./.test(clean)) return true;
  // 172.16.0.0 - 172.31.255.255
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  // 192.168.0.0 - 192.168.255.255
  if (/^192\.168\./.test(clean)) return true;
  // 169.254.0.0 - 169.254.255.255 (Link-local / Cloud metadata)
  if (/^169\.254\./.test(clean)) return true;
  // 0.0.0.0
  if (clean === '0.0.0.0') return true;

  return false;
}

export async function safeFetch(rawUrl: string): Promise<Response> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new AppError('URL_INVALID', 'Malformed URL format', 400);
  }

  // 1. https only
  if (url.protocol !== 'https:') {
    throw new AppError('URL_BLOCKED', 'HTTPS protocol is strictly required', 400);
  }

  // 2. Allowlist host check
  const host = url.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) {
    throw new AppError('URL_BLOCKED', `Host "${host}" is not in the trusted job board allowlist`, 403);
  }

  // 3. Port check (443 only)
  if (url.port && url.port !== '443') {
    throw new AppError('URL_BLOCKED', 'Custom ports are forbidden', 403);
  }

  // 4. Private IP check
  if (isPrivateIp(host)) {
    throw new AppError('URL_BLOCKED', 'Private and reserved addresses are blocked', 403);
  }

  // 5. Safe fetch with timeout, manual redirect, and no external cookie transmission
  return fetch(url.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NaukriProfileOptimizer/1.0; +https://naukri-optimizer.in)'
    },
    signal: AbortSignal.timeout(8000),
    redirect: 'manual' // Never follow redirects to prevent SSRF hopping
  });
}
