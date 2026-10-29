/**
 * CareerUp Analysis Preferences & Settings Store
 * Manages default candidate type, target role preferences, and AI consent.
 * Stored safely in localStorage.
 */

export interface AnalysisPreferences {
  candidateType: 'Fresher' | 'Experienced';
  preferredTargetRole: string;
  defaultCities: string[];
  aiConsent: boolean;
  autoSaveVersions: boolean;
}

const PREFERENCES_STORAGE_KEY = 'careerup:preferences';
const LEGACY_PREFERENCES_STORAGE_KEY = 'careerlens:preferences';

export const DEFAULT_PREFERENCES: AnalysisPreferences = {
  candidateType: 'Experienced',
  preferredTargetRole: 'Full Stack Developer',
  defaultCities: ['Bangalore / Bengaluru', 'Pune'],
  aiConsent: false,
  autoSaveVersions: true
};

export function getStoredPreferences(): AnalysisPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY) || localStorage.getItem(LEGACY_PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: Partial<AnalysisPreferences>): AnalysisPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function resetStoredPreferences(): AnalysisPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    localStorage.removeItem(LEGACY_PREFERENCES_STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_PREFERENCES;
}
