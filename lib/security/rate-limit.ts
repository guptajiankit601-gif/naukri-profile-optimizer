/**
 * RATE LIMITING ENGINE (SECURITY.md Section 5)
 * Sliding window per IP and per User.
 */

interface RateRecord {
  timestamps: number[];
}

const memoryRateMap = new Map<string, RateRecord>();

export const ROUTE_LIMITS: Record<string, { ipPerHour: number; userPerDay?: number }> = {
  '/api/parse': { ipPerHour: 20, userPerDay: 100 },
  '/api/analyze': { ipPerHour: 30, userPerDay: 200 },
  '/api/rewriter': { ipPerHour: 60, userPerDay: 500 },
  '/api/job-fit': { ipPerHour: 60, userPerDay: 300 },
  '/api/ai/rewrite': { ipPerHour: 30, userPerDay: 20 },
  '/api/export': { ipPerHour: 20, userPerDay: 100 },
  '/api/auth/signup': { ipPerHour: 5 },
  '/api/auth/login': { ipPerHour: 10 }
};

export function rateLimit(key: string, limit: number, windowSec: number): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const cutoff = now - windowMs;

  const record = memoryRateMap.get(key) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter(ts => ts > cutoff);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, retryAfter)
    };
  }

  record.timestamps.push(now);
  memoryRateMap.set(key, record);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length
  };
}

export function checkRouteRateLimit(route: string, ip: string, userId?: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const config = ROUTE_LIMITS[route] || { ipPerHour: 60 };

  // 1. IP check (1 hour window)
  const ipKey = `rate:ip:${route}:${ip}`;
  const ipResult = rateLimit(ipKey, config.ipPerHour, 3600);
  if (!ipResult.allowed) {
    return ipResult;
  }

  // 2. User check (24 hour window) if userId provided
  if (userId && config.userPerDay) {
    const userKey = `rate:user:${route}:${userId}`;
    const userResult = rateLimit(userKey, config.userPerDay, 86400);
    if (!userResult.allowed) {
      return userResult;
    }
  }

  return ipResult;
}

// Backward-compatible alias
export function checkRateLimit(ip: string, maxRequests: number = 60, windowMs: number = 60000) {
  return rateLimit(`rate:${ip}`, maxRequests, Math.ceil(windowMs / 1000));
}
