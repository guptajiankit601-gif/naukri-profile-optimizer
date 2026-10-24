import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    success: true,
    user: { id: 'anonymous-local-user', email: 'guest@naukri-optimizer.local', isAnonymous: true }
  });
}
