import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limit';

export interface TrackedApplication {
  id: string;
  userId?: string;
  profileId: string;
  company: string;
  roleTitle: string;
  jobUrl?: string;
  status: 'draft' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  matchScore: number;
  notes?: string;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory guest storage for applications
const guestApplicationsMap = new Map<string, TrackedApplication[]>();

export function getApplicationsForSession(sessionId: string): TrackedApplication[] {
  return guestApplicationsMap.get(sessionId) || [];
}

export function saveApplicationForSession(sessionId: string, app: TrackedApplication) {
  const list = guestApplicationsMap.get(sessionId) || [];
  const idx = list.findIndex(a => a.id === app.id);
  if (idx >= 0) {
    list[idx] = app;
  } else {
    list.unshift(app);
  }
  guestApplicationsMap.set(sessionId, list);
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const sessionId = req.cookies.get('npo_guest_session')?.value || ip;

  const applications = getApplicationsForSession(sessionId);

  return NextResponse.json({
    success: true,
    applications,
    total: applications.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const limitResult = rateLimit(`apps:${ip}`, 50, 3600);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Rate limit exceeded. Please try again later.' } },
        { status: 429, headers: { 'Retry-After': String(limitResult.retryAfter || 60) } }
      );
    }

    const sessionId = req.cookies.get('npo_guest_session')?.value || ip;
    const body = await req.json();

    if (!body.company || !body.roleTitle) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Company and Role Title are required.' } },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newApp: TrackedApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      profileId: body.profileId || 'default',
      company: body.company,
      roleTitle: body.roleTitle,
      jobUrl: body.jobUrl || '',
      status: body.status || 'applied',
      matchScore: body.matchScore || 75,
      notes: body.notes || '',
      appliedAt: body.appliedAt || now,
      createdAt: now,
      updatedAt: now
    };

    saveApplicationForSession(sessionId, newApp);

    return NextResponse.json({
      success: true,
      application: newApp
    }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: { code: 'SAVE_FAILED', message: (err as Error)?.message || 'Failed to save application.' } },
      { status: 500 }
    );
  }
}
