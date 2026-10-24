import { NextRequest, NextResponse } from 'next/server';
import { MemoryStore } from '@/lib/memory/store';

/**
 * AUTO-PURGE CRON HANDLER (Section 5.4)
 * Schedule: 0 3 * * * (03:00 IST daily)
 * Purges anonymous profiles older than 24 hours.
 * Logs purged count without any PII.
 */

async function handlePurge(req: NextRequest) {
  // 1. Verify authorization header against CRON_SECRET if configured
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'naukri-optimizer-cron-secret';

  if (authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  // 2. Execute purge across M2 Session Store and M1 Working Cache
  const purgeResult = MemoryStore.purgeExpiredAnonymousProfiles();

  // 3. Return sanitized telemetry with zero PII
  return NextResponse.json({
    success: true,
    message: 'Auto-purge cycle completed successfully.',
    purgedCount: purgeResult.purgedCount,
    retentionPolicy: '24-hour anonymous session TTL enforced (MEMORY.md Tier M2)',
    timestamp: new Date().toISOString()
  });
}

export async function GET(req: NextRequest) {
  return handlePurge(req);
}

export async function POST(req: NextRequest) {
  return handlePurge(req);
}
