import crypto from 'crypto';

/**
 * LOGGING & PII REDACTION (SECURITY.md Section 11)
 * Masks phone numbers, hashes identifiers, and strips raw resume/JD texts.
 */

function hashStr(val: string): string {
  if (!val) return '';
  return crypto.createHash('sha256').update(val).digest('hex').substring(0, 12);
}

function hashEmail(email: string): string {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '[redacted]';
  return `${hashStr(parts[0])}@${parts[1]}`;
}

export function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const out = { ...obj };

  if (out.email) out.email = hashEmail(String(out.email));
  if (out.phone) out.phone = `***${String(out.phone).slice(-4)}`;
  if (out.name) out.name = hashStr(String(out.name));

  // Forbidden fields in logs (Section 11.2)
  if (out.rawText) delete out.rawText;
  if (out.resumeText) delete out.resumeText;
  if (out.parsed) out.parsed = '[redacted]';
  if (out.jdText) delete out.jdText;
  if (out.prompt) delete out.prompt;
  if (out.userId) out.userId = hashStr(String(out.userId));
  if (out.password) delete out.password;
  if (out.secret) delete out.secret;

  return out;
}

export function logRedacted(message: string, meta: Record<string, unknown> = {}): void {
  const sanitizedMeta = redact(meta);
  const logEntry = {
    ts: new Date().toISOString(),
    message,
    ...sanitizedMeta
  };
  console.log(JSON.stringify(logEntry));
}
