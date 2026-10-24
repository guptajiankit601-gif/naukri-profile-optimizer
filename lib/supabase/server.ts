// lib/supabase/server.ts
import 'server-only';

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return {
    isConfigured: Boolean(url && anonKey),
    url,
    async getProfile(id: string) {
      return null;
    },
    async saveProfile(profileData: Record<string, unknown>) {
      return { id: profileData.id, ...profileData };
    },
  };
}
