/**
 * FABRICATION FILTER & GUARDRAILS (GEMINI INTEGRATION Section 6)
 * Strictly verifies that no numerical metric, currency amount, or percentage
 * appears in AI output that was not present in the original source or user slots.
 */

export function extractNumbers(text: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  const re = /(\d+(?:\.\d+)?)\s*(%|₹|rs\.?|inr|x|k|lakh|lakhs|cr|crore)?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push(`${m[1]}${(m[2] ?? '').toLowerCase()}`);
    // also push the bare number for looser matching
    out.push(m[1]);
  }
  return out;
}

export function fabricationCheck(
  aiText: string,
  sourceText: string,
  userSlots: Record<string, unknown> = {}
): { ok: boolean; offending: string[] } {
  const allowed = extractNumbers(`${sourceText} ${JSON.stringify(userSlots)}`);
  const found = extractNumbers(aiText);
  const offending = found.filter((n) => !allowed.includes(n));
  return { ok: offending.length === 0, offending };
}
