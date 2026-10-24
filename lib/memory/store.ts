import { ParsedProfile, ComponentResult, KeywordItem, ActionPlanItem, BulletRewrite, JobDescriptionMatch, ScoreHistoryPoint } from '@/types';
import crypto from 'crypto';

/**
 * MEMORY TIERS IMPLEMENTATION
 * M0: Ephemeral (Browser state)
 * M1: Working (Server cache / Redis with exact TTLs)
 * M2: Session (Anonymous profiles, 24h TTL, auto-purged)
 * M3: Account (Linked profiles, 90d TTL, forget path)
 * M4: Aggregate (k-anonymity >= 20, zero PII, 24mo TTL)
 * M5: Reference (Static, versioned data files)
 */

export interface AnonymousProfile {
  id: string;
  createdAt: Date;
  expiresAt: Date; // createdAt + 24h
  targetRoleId: string;
  experienceBand: string;
  targetCities: string[];
  parsed: ParsedProfile;
  score: number;
  components: ComponentResult[];
  keywords: {
    mustHaveGaps: KeywordItem[];
    highValueGaps: KeywordItem[];
    distractors: KeywordItem[];
  };
  actionPlan: ActionPlanItem[];
  rewrites: BulletRewrite[];
  jobFits: JobDescriptionMatch[];
  scoreHistory: ScoreHistoryPoint[];
}

export interface AccountProfile extends AnonymousProfile {
  userId: string;
  email: string;
  name: string;
  consents: {
    essential: boolean;
    aiPolish: boolean;
    analytics: boolean;
    marketing: boolean;
    grantedAt: Date;
    revokedAt?: Date;
  };
}

// In-Memory cache simulating Redis with exact TTL enforcement (M1)
interface CacheEntry<T> {
  value: T;
  expiresAt: number; // timestamp in ms
}

class MemoryTierStore {
  private m1Cache: Map<string, CacheEntry<unknown>> = new Map();
  private m2Profiles: Map<string, AnonymousProfile> = new Map();
  private m3Accounts: Map<string, AccountProfile> = new Map();
  private m4Aggregates: Map<string, { count: number; metrics: Record<string, number> }> = new Map();

  // ==========================================
  // TIER M1: Working Cache (Exact TTL Rules)
  // ==========================================

  setM1<T>(key: string, value: T, ttlSeconds: number): void {
    this.m1Cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  getM1<T>(key: string): T | null {
    const entry = this.m1Cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.m1Cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  deleteM1Pattern(pattern: string): number {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    let count = 0;
    for (const key of this.m1Cache.keys()) {
      if (regex.test(key)) {
        this.m1Cache.delete(key);
        count++;
      }
    }
    return count;
  }

  // Pre-configured M1 operations from Section 1.2
  cacheAnalysis(profileId: string, resumeHash: string, data: unknown): void {
    this.setM1(`analysis:${profileId}:${resumeHash}`, data, 3600); // 1 hour
  }

  getAnalysis(profileId: string, resumeHash: string): unknown | null {
    return this.getM1(`analysis:${profileId}:${resumeHash}`);
  }

  cacheJobFit(profileId: string, jdHash: string, data: unknown): void {
    this.setM1(`jobfit:${profileId}:${jdHash}`, data, 86400); // 24 hours
  }

  getJobFit(profileId: string, jdHash: string): unknown | null {
    return this.getM1(`jobfit:${profileId}:${jdHash}`);
  }

  cacheAiRewrite(hash: string, data: unknown): void {
    this.setM1(`ai-rewrite:${hash}`, data, 30 * 86400); // 30 days
  }

  getAiRewrite(hash: string): unknown | null {
    return this.getM1(`ai-rewrite:${hash}`);
  }

  // ==========================================
  // TIER M2: Session Anonymous Profiles (24h)
  // ==========================================

  saveAnonymousProfile(profile: AnonymousProfile): void {
    const now = new Date();
    profile.createdAt = profile.createdAt || now;
    profile.expiresAt = new Date(profile.createdAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    this.m2Profiles.set(profile.id, profile);
  }

  getAnonymousProfile(id: string): AnonymousProfile | null {
    const p = this.m2Profiles.get(id);
    if (!p) return null;
    if (new Date() > p.expiresAt) {
      this.m2Profiles.delete(id);
      this.invalidateProfileMemory(id);
      return null;
    }
    return p;
  }

  // Auto-Purge (Section 5.4)
  purgeExpiredAnonymousProfiles(): { purgedCount: number; purgedIds: string[] } {
    const now = new Date();
    const purgedIds: string[] = [];

    for (const [id, profile] of this.m2Profiles.entries()) {
      if (now > profile.expiresAt) {
        this.m2Profiles.delete(id);
        this.invalidateProfileMemory(id);
        purgedIds.push(id);
      }
    }

    return { purgedCount: purgedIds.length, purgedIds };
  }

  // ==========================================
  // TIER M3: Linked Account Profiles (90d)
  // ==========================================

  saveAccountProfile(profile: AccountProfile): void {
    const now = new Date();
    profile.createdAt = profile.createdAt || now;
    profile.expiresAt = new Date(profile.createdAt.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
    this.m3Accounts.set(profile.id, profile);
  }

  getAccountProfile(id: string): AccountProfile | null {
    const p = this.m3Accounts.get(id);
    if (!p) return null;
    if (new Date() > p.expiresAt) {
      this.m3Accounts.delete(id);
      this.invalidateProfileMemory(id);
      return null;
    }
    return p;
  }

  // Migration from Anonymous (M2) to Account (M3)
  linkAnonymousToAccount(anonymousId: string, user: { userId: string; email: string; name: string }, keepHistory: boolean): AccountProfile | null {
    const anon = this.getAnonymousProfile(anonymousId);
    if (!anon) return null;

    if (!keepHistory) {
      this.forgetProfileMemory(anonymousId);
      return null;
    }

    const accountProf: AccountProfile = {
      ...anon,
      userId: user.userId,
      email: user.email,
      name: user.name,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      consents: {
        essential: true,
        aiPolish: false,
        analytics: false,
        marketing: false,
        grantedAt: new Date()
      }
    };

    this.m3Accounts.set(anon.id, accountProf);
    this.m2Profiles.delete(anonymousId);
    return accountProf;
  }

  // ==========================================
  // FORGET PATH: User-Initiated Delete (Section 5.3)
  // ==========================================

  forgetProfileMemory(profileId: string): { deleted: { rows: number; files: number; cacheKeys: number } } {
    let rowsDeleted = 0;

    if (this.m2Profiles.has(profileId)) {
      this.m2Profiles.delete(profileId);
      rowsDeleted++;
    }

    if (this.m3Accounts.has(profileId)) {
      this.m3Accounts.delete(profileId);
      rowsDeleted++;
    }

    // Invalidate M1 keys: analysis:{profileId}:*, jobfit:{profileId}:*, profile:{profileId}
    const cacheKeysDeleted = this.invalidateProfileMemory(profileId);

    return {
      deleted: {
        rows: rowsDeleted,
        files: 0, // Blob files if connected, 0 for local-only
        cacheKeys: cacheKeysDeleted
      }
    };
  }

  invalidateProfileMemory(profileId: string): number {
    const count1 = this.deleteM1Pattern(`analysis:${profileId}:*`);
    const count2 = this.deleteM1Pattern(`jobfit:${profileId}:*`);
    const count3 = this.deleteM1Pattern(`profile:${profileId}`);
    return count1 + count2 + count3;
  }

  // ==========================================
  // TIER M4: Anonymized Aggregate Engine
  // ==========================================

  recordAggregateMetric(roleId: string, band: string, metricKey: string, value: number, userConsent: boolean): boolean {
    // Hard Rule: Consent required
    if (!userConsent) return false;

    const bucketKey = `${roleId}:${band}:${metricKey}`;
    const existing = this.m4Aggregates.get(bucketKey) || { count: 0, metrics: {} };
    existing.count++;
    existing.metrics[bucketKey] = (existing.metrics[bucketKey] || 0) + value;
    this.m4Aggregates.set(bucketKey, existing);
    return true;
  }

  // k-Anonymity rule: Suppress any bucket with < 20 contributors
  getPublishedBenchmark(roleId: string, band: string, metricKey: string): { average: number; sampleSize: number } | { limitedData: true } {
    const bucketKey = `${roleId}:${band}:${metricKey}`;
    const bucket = this.m4Aggregates.get(bucketKey);

    if (!bucket || bucket.count < 20) {
      return { limitedData: true };
    }

    return {
      average: Math.round(bucket.metrics[bucketKey] / bucket.count),
      sampleSize: bucket.count
    };
  }
}

// Global Singleton Memory Store
export const MemoryStore = new MemoryTierStore();

// Idempotency Hash Utility
export function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}
