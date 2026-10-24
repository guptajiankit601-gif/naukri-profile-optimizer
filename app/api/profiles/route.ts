import { NextRequest, NextResponse } from 'next/server';
import { SEEDED_PROFILES } from '@/data/seeded-profiles';

export async function GET() {
  return NextResponse.json({
    success: true,
    profiles: Object.values(SEEDED_PROFILES).map(p => ({
      id: p.targetRoleId,
      name: p.name,
      role: p.targetRole,
      label: p.label
    }))
  });
}

export async function POST(req: NextRequest) {
  try {
    const profile = await req.json();
    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        id: `prof-${Date.now()}`
      }
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message || 'Failed to save profile' }, { status: 500 });
  }
}
