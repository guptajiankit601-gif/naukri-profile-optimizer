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
