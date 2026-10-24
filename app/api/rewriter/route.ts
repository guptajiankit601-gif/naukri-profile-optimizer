import { NextRequest, NextResponse } from 'next/server';
import { rewriteBullet } from '@/lib/rewriter';

export async function POST(req: NextRequest) {
  try {
    const { bulletText, metric } = await req.json();
    if (!bulletText) {
      return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'Bullet text is required.' } }, { status: 400 });
    }

    const rewriteResult = rewriteBullet(bulletText, metric);
    return NextResponse.json({ success: true, rewrite: rewriteResult });
  } catch (err: unknown) {
    return NextResponse.json({ error: { code: 'REWRITE_FAILED', message: (err as Error)?.message || 'Failed to rewrite bullet.' } }, { status: 500 });
  }
}
