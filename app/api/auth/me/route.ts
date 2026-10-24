import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    user: { id: 'anonymous-local-user', isAnonymous: true }
  });
}
