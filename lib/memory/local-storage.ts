/**
 * CLIENT LOCAL STORAGE POLICY ENFORCER (Section 4.3)
 *
 * ALLOWED:
 * - npo:profileId: opaque UUID only
 * - npo:theme: 'sunset' | 'ocean' | 'forest' | 'mono'
 * - npo:recentRoles: array of role IDs (not PII)
 * - npo:onboarded: boolean
 *
 * FORBIDDEN (Strictly Rejected):
 * - npo:resumeText
 * - npo:parsedProfile
 * - npo:email
 * - npo:phone
 * - npo:name
 */

export const ALLOWED_STORAGE_KEYS = new Set([
  'npo:profileId',
  'npo:theme',
  'npo:recentRoles',
  'npo:onboarded'
]);

export const FORBIDDEN_STORAGE_KEYS = new Set([
  'npo:resumeText',
  'npo:parsedProfile',
  'npo:email',
  'npo:phone',
  'npo:name'
]);

export class LocalStoragePolicy {
  static setItem(key: string, value: string): void {
    if (FORBIDDEN_STORAGE_KEYS.has(key)) {
      throw new Error(`[Security Violation] Storage of sensitive PII key "${key}" is strictly forbidden by Naukri Profile Optimizer Data Retention Policy (MEMORY.md Section 4.3).`);
    }

    if (typeof window === 'undefined') return;

    if (!ALLOWED_STORAGE_KEYS.has(key)) {
      console.warn(`[Storage Warning] Key "${key}" is not in the explicit allowed memory whitelist.`);
    }

    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }

  static getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }

  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  }

  static clearUserData(): void {
    if (typeof window === 'undefined') return;
    for (const key of ALLOWED_STORAGE_KEYS) {
      window.localStorage.removeItem(key);
    }
  }
}
