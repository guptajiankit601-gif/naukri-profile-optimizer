/**
 * SECRETS & ENVIRONMENT VALIDATION (SECURITY.md Section 8)
 * Throws a clear error listing only the variable NAME (never the value).
 * Never logs env values.
 */

export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  // Required core variables
  const required = ['NEXT_PUBLIC_APP_URL'];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Warn if secrets contain illegal prefixes
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_') && (key.includes('SECRET') || key.includes('KEY') && !key.includes('APP_URL'))) {
      if (key !== 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
        console.error(`[CRITICAL SECURITY WARNING] Secret variable "${key}" has NEXT_PUBLIC_ prefix and will leak to the client bundle.`);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing
  };
}
