// lib/supabase/client.ts
// Client-side Supabase client interface

export interface SupabaseClientConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return {
    isConfigured: Boolean(url && anonKey),
    url,
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async getUser() {
        return { data: { user: null }, error: null };
      },
      async signOut() {
        return { error: null };
      },
    },
  };
}
