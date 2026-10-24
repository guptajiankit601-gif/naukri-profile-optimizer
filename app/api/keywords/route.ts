import { NextRequest, NextResponse } from 'next/server';
import { ROLE_KEYWORDS_DATA } from '@/data/keywords';

export async function GET(req: NextRequest) {
  const roleId = req.nextUrl.searchParams.get('roleId') || 'backend-engineer';
  const keywords = ROLE_KEYWORDS_DATA[roleId] || ROLE_KEYWORDS_DATA['backend-engineer'];
  return NextResponse.json({ success: true, keywords });
}
