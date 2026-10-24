import { NextRequest, NextResponse } from 'next/server';
import { SHARE_CAPTIONS } from '@/lib/data/captions';

export async function POST(req: NextRequest) {
  try {
    const { score, verdict, role } = await req.json();
    const caption = SHARE_CAPTIONS.linkedin(score, verdict, role);
    return NextResponse.json({ success: true, caption });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message }, { status: 500 });
  }
}
