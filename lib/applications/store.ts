export interface TrackedApplication {
  id: string;
  userId?: string;
  profileId: string;
  company: string;
  roleTitle: string;
  jobUrl?: string;
  status: 'draft' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  matchScore: number;
  jobDescription?: string;
  tailoredBullets?: string[];
  coverLetter?: string;
  outreachEmail?: string;
  recruiterMessage?: string;
  interviewQuestions?: string[];
  followUpDate?: string;
  notes?: string;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'roleready:tracked_applications';

// In-memory fallback
let memoryApplications: TrackedApplication[] = [];

export function getClientApplications(): TrackedApplication[] {
  if (typeof window === 'undefined') return memoryApplications;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return memoryApplications;
}

export function saveClientApplication(app: TrackedApplication): TrackedApplication[] {
  const list = getClientApplications();
  const idx = list.findIndex(a => a.id === app.id);
  let updated: TrackedApplication[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = { ...app, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...app, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...list];
  }
  memoryApplications = updated;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  return updated;
}

export function deleteClientApplication(id: string): TrackedApplication[] {
  const list = getClientApplications().filter(a => a.id !== id);
  memoryApplications = list;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
  return list;
}

// Server-side guest map
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
