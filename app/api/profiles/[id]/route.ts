import { NextRequest, NextResponse } from 'next/server';
import { SEEDED_PROFILES } from '@/data/seeded-profiles';
import { MemoryStore } from '@/lib/memory/store';

// GET /api/profiles/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const profileId = params.id;

  // 1. Check M2 Anonymous Store
  const anon = MemoryStore.getAnonymousProfile(profileId);
  if (anon) {
    return NextResponse.json({ success: true, profile: anon.parsed });
  }

  // 2. Check M3 Account Store
  const acc = MemoryStore.getAccountProfile(profileId);
  if (acc) {
    return NextResponse.json({ success: true, profile: acc.parsed });
  }

  // 3. Fallback to Seeded Demos
  const seeded = SEEDED_PROFILES[profileId];
  if (seeded) {
    return NextResponse.json({ success: true, profile: seeded });
  }

  return NextResponse.json({ error: 'Profile not found or expired' }, { status: 404 });
}

// DELETE /api/profiles/[id] — FORGET PATH (Section 5.3)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const profileId = params.id;

  // 1. Execute cascade forget in MemoryStore
  const forgetResult = MemoryStore.forgetProfileMemory(profileId);

  // 2. Return confirmation of what was permanently removed
  return NextResponse.json({
    success: true,
    message: 'Profile data permanently erased across all memory tiers in accordance with DPDP and Section 5.3.',
    profileId,
    deleted: forgetResult.deleted,
    timestamp: new Date().toISOString()
  });
}

// PATCH /api/profiles/[id] — UPDATE & INVALIDATION (Section 5.1)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const profileId = params.id;

  try {
    const body = await req.json();

    // 1. Invalidate M1 Redis/Working Cache
    MemoryStore.invalidateProfileMemory(profileId);

    // 2. Check existing and update
    const existingAnon = MemoryStore.getAnonymousProfile(profileId);
    if (existingAnon) {
      existingAnon.parsed = { ...existingAnon.parsed, ...body };
      MemoryStore.saveAnonymousProfile(existingAnon);
      return NextResponse.json({ success: true, profile: existingAnon.parsed });
    }

    const existingAcc = MemoryStore.getAccountProfile(profileId);
    if (existingAcc) {
      existingAcc.parsed = { ...existingAcc.parsed, ...body };
      MemoryStore.saveAccountProfile(existingAcc);
      return NextResponse.json({ success: true, profile: existingAcc.parsed });
    }

    return NextResponse.json({ success: true, message: 'Updated and invalidated cache' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
