import crypto from 'crypto';
import { AppError } from './error';

/**
 * AUTHENTICATION & AUTHORIZATION (SECURITY.md Section 2)
 * Guest session HMAC signing & ownership validation.
 */

const GUEST_HMAC_SECRET = process.env.GUEST_SESSION_SECRET || 'npo-guest-secret-key-32-chars-long';

export function createSignedGuestToken(): string {
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', GUEST_HMAC_SECRET).update(randomBytes).digest('hex');
  return `${randomBytes}.${signature}`;
}

export function verifyGuestToken(signedToken: string): boolean {
  if (!signedToken || !signedToken.includes('.')) return false;
  const [token, signature] = signedToken.split('.');
  if (!token || !signature) return false;

  const expectedSignature = crypto.createHmac('sha256', GUEST_HMAC_SECRET).update(token).digest('hex');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

export function hashGuestToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function requireProfileAccess(
  profileUserId: string | null,
  profileGuestTokenHash: string | null,
  currentUserId: string | null,
  currentGuestToken: string | null
): boolean {
  // 1. Authenticated user ownership
  if (currentUserId && profileUserId && currentUserId === profileUserId) {
    return true;
  }

  // 2. Guest token ownership (hashed comparison)
  if (currentGuestToken && profileGuestTokenHash) {
    const rawToken = currentGuestToken.includes('.') ? currentGuestToken.split('.')[0] : currentGuestToken;
    const currentHash = hashGuestToken(rawToken);
    const currBuf = Buffer.from(currentHash);
    const profBuf = Buffer.from(profileGuestTokenHash);
    if (currBuf.length === profBuf.length && crypto.timingSafeEqual(currBuf, profBuf)) {
      return true;
    }
  }

  // 3. Anonymous/demo profile fallback
  if (!profileUserId && !profileGuestTokenHash) {
    return true;
  }

  throw new AppError('FORBIDDEN', 'Access denied: not your profile', 403);
}
