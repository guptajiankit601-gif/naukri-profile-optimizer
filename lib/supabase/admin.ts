// lib/supabase/admin.ts
import 'server-only';

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return {
    isConfigured: Boolean(url && serviceKey),
    url,
    async purgeExpiredAnonymousProfiles() {
      // Calls purge function or executes SQL
      return { purgedCount: 0 };
    },
  };
}
