/**
 * USER CONSENT MANAGEMENT (GEMINI INTEGRATION Section 8 & DPDP Act 2023)
 * Granular consent tracking for 'ai_processing', 'analytics', 'marketing'.
 * Default OFF, revocable anytime.
 */

interface ConsentRecord {
  userId: string;
  scope: string;
  granted: boolean;
  grantedAt?: string;
  revokedAt?: string | null;
  version: string;
}

const consentStore = new Map<string, ConsentRecord>();

function getConsentKey(userId: string, scope: string): string {
  return `${userId}:${scope}`;
}

export async function hasConsent(userId: string | undefined, scope: string): Promise<boolean> {
  if (!userId) return false;
  const key = getConsentKey(userId, scope);
  const record = consentStore.get(key);
  if (!record) return false;
  return record.granted && !record.revokedAt;
}

export async function setUserConsent(
  userId: string,
  scope: string,
  granted: boolean,
  version: string = 'v1.0'
): Promise<ConsentRecord> {
  const key = getConsentKey(userId, scope);
  const now = new Date().toISOString();

  const record: ConsentRecord = {
    userId,
    scope,
    granted,
    grantedAt: granted ? now : consentStore.get(key)?.grantedAt,
    revokedAt: granted ? null : now,
    version
  };

  consentStore.set(key, record);
  return record;
}

export function resetConsentForTesting(): void {
  consentStore.clear();
}
