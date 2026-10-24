import { NextRequest, NextResponse } from 'next/server';
import { getApplicationsForSession, saveApplicationForSession, TrackedApplication } from '@/lib/applications/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const sessionId = req.cookies.get('npo_guest_session')?.value || ip;
  const list = getApplicationsForSession(sessionId);
  const found = list.find(a => a.id === params.id);

  if (!found) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Tracked application not found.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, application: found });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const sessionId = req.cookies.get('npo_guest_session')?.value || ip;
  const list = getApplicationsForSession(sessionId);
  const found = list.find(a => a.id === params.id);

  if (!found) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Tracked application not found.' } },
      { status: 404 }
    );
  }

  const updates = await req.json();
  const updated: TrackedApplication = {
    ...found,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveApplicationForSession(sessionId, updated);

  return NextResponse.json({ success: true, application: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const sessionId = req.cookies.get('npo_guest_session')?.value || ip;
  const list = getApplicationsForSession(sessionId);
  const idx = list.findIndex(a => a.id === params.id);

  if (idx >= 0) {
    list.splice(idx, 1);
  }

  return NextResponse.json({ success: true, message: 'Application deleted.' });
}
