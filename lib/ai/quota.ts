/**
 * QUOTA & USAGE CONTROL (GEMINI INTEGRATION Section 9)
 * Daily global limits, user limits, token budget counters, and cache TTL.
 */

export const AI_LIMITS = {
  perUserPerDay: 20,
  perIpPerHour: 30,
  globalPerDay: 500,
  dailyInputTokens: 500_000,
  dailyOutputTokens: 500_000,
  cacheTtlSeconds: 60 * 60 * 24 * 30, // 30 days
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// In-memory backing for serverless runtime / local dev
const usageStore = new Map<string, number>();

export async function checkAiQuota(userId?: string): Promise<{ allowed: boolean; reason?: 'GLOBAL' | 'USER' }> {
  const globalKey = `ai-global:${todayKey()}`;
  const globalUsed = usageStore.get(globalKey) ?? 0;

  if (globalUsed >= AI_LIMITS.globalPerDay) {
    return { allowed: false, reason: 'GLOBAL' };
  }

  if (userId) {
    const userKey = `ai-user:${userId}:${todayKey()}`;
    const userUsed = usageStore.get(userKey) ?? 0;
    if (userUsed >= AI_LIMITS.perUserPerDay) {
      return { allowed: false, reason: 'USER' };
    }
  }

  return { allowed: true };
}

export async function incrementAiUsage(userId?: string, tokensIn = 0, tokensOut = 0): Promise<void> {
  const tKey = todayKey();
  const globalKey = `ai-global:${tKey}`;
  usageStore.set(globalKey, (usageStore.get(globalKey) ?? 0) + 1);

  const tokenInKey = `ai-token-in:${tKey}`;
  usageStore.set(tokenInKey, (usageStore.get(tokenInKey) ?? 0) + tokensIn);

  const tokenOutKey = `ai-token-out:${tKey}`;
  usageStore.set(tokenOutKey, (usageStore.get(tokenOutKey) ?? 0) + tokensOut);

  if (userId) {
    const userKey = `ai-user:${userId}:${tKey}`;
    usageStore.set(userKey, (usageStore.get(userKey) ?? 0) + 1);
  }
}

export function resetAiQuotaForTesting(): void {
  usageStore.clear();
}
