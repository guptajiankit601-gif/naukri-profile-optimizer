import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { AppError } from './error';

/**
 * CSRF & ORIGIN PROTECTION (SECURITY.md Section 6 & 14)
 * Validates double-submit cookie or Authorization header.
 * Verifies Origin header on mutating routes.
 */

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyCsrf(req: NextRequest): void {
  // 1. Authorization: Bearer bypasses CSRF cookie
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return;
  }

  // 2. Check Origin on mutating methods (POST, PATCH, DELETE)
  const method = req.method.toUpperCase();
  if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host && !originUrl.host.includes('localhost')) {
          throw new AppError('CORS_FORBIDDEN', 'Cross-origin request rejected', 403);
        }
      } catch (e) {
        if (e instanceof AppError) throw e;
        throw new AppError('INVALID_ORIGIN', 'Origin header invalid', 400);
      }
    }
  }

  // 3. Double-submit token check
  const cookieToken = req.cookies.get('npo_csrf')?.value;
  const headerToken = req.headers.get('x-csrf-token');

  // If cookie exists, header must match
  if (cookieToken && (!headerToken || !timingSafeEqualStr(cookieToken, headerToken))) {
    throw new AppError('FORBIDDEN', 'Invalid or missing CSRF token', 403);
  }
}
