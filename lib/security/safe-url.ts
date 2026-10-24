/**
 * SAFE URL VALIDATOR (SECURITY.md Section 4)
 * Allows only http: and https: protocols.
 * Blocks dangerous schemes: javascript:, data:, vbscript:, file:
 */

export function safeUrl(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  try {
    const trimmed = input.trim();
    const u = new URL(trimmed);
    if (!['http:', 'https:'].includes(u.protocol)) {
      return null;
    }
    return u.toString();
  } catch {
    return null;
  }
}
