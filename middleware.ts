import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers compliant with OWASP Top 10
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Verify or issue guest session identifier if none exists
  const guestToken = request.cookies.get('npo_guest_session');
  if (!guestToken) {
    const newGuestId = 'guest_' + Math.random().toString(36).slice(2, 11);
    response.cookies.set('npo_guest_session', newGuestId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours (DPDP Act compliance)
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
