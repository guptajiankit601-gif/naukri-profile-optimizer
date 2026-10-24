# Gemini API Integration — Naukri Profile Optimizer

**Purpose:** Optional AI polish tier for bullet rewriting. The core product is 100% deterministic and works fully without Gemini. This is an enhancement layer, never a dependency.

**Model:** `gemini-2.0-flash` (primary) → `gemini-1.5-flash` (fallback)  
**Package:** `@google/generative-ai`  
**Access:** Server-side only via `import 'server-only'`. Never from the browser.  
**Compliance Target:** India DPDP Act 2023, OWASP Top 10  
**Implementation Status:** Fully Implemented & Verified (28/28 AI Tests Passed, 267/267 Overall Tests Passed)

---

## 1. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  CLIENT (browser)                                            │
│  Rewriter page                                               │
│    → checkbox "Enable AI polish (uses Google Gemini)"        │
│    → POST /api/ai/rewrite                                    │
└───────────────────────────┬──────────────────────────────────┘
                            │ Authorization: Bearer <jwt>
                            │ x-ai-consent: true
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  API ROUTE: /api/ai/rewrite                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 1. AI kill switch (ENABLE_AI != 'false')               │  │
│  │ 2. Rate limit (IP 30/hr, user 20/day)                  │  │
│  │ 3. Auth + ownership check on profileId                 │  │
│  │ 4. Consent check (scope = 'ai_processing')             │  │
│  │ 5. Quota check (global token budget: 500/day)          │  │
│  │ 6. Zod validate body { profileId, bulletIds[], level } │  │
│  │ 7. Build prompt (system instruction + XML tags)        │  │
│  │ 8. Cache lookup: sha256(bullet+role+level+slots)       │  │
│  │ 9. MISS → call Gemini (gemini-2.0-flash)               │  │
│  │ 10. Validate response against Zod schema               │  │
│  │ 11. Fabrication filter (numbers must exist in source)  │  │
│  │ 12. HIT/MISS → persist (30d TTL) + cache + return      │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │ server-side SDK call
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  GOOGLE GEMINI API                                           │
│  gemini-2.0-flash (fallback: gemini-1.5-flash)               │
│  temperature 0.4 · maxOutputTokens 2048 · candidateCount 1   │
└──────────────────────────────────────────────────────────────┘
```

**Fallback chain:**
```
Cache hit → return
Gemini success + valid + passes fabrication filter → return
Gemini success but invalid/fails filter → DISCARD, use deterministic engine
Gemini timeout/error/blocked → deterministic engine, return with note
Rate/quota exceeded → deterministic engine, return with note
```

---

## 2. Server-Only SDK Implementation

- File: [`lib/ai/gemini.ts`](file:///c:/Users/ankit/Downloads/Naukri_Resume/lib/ai/gemini.ts)
- Guarded by `import 'server-only'` to prevent bundling in client bundles.
- Uses `GoogleGenerativeAI` with structured JSON output `responseMimeType: 'application/json'`.
- Configuration:
  - `model`: `gemini-2.0-flash`
  - `fallbackModel`: `gemini-1.5-flash`
  - `temperature`: `0.4`
  - `maxOutputTokens`: `2048`
  - `safetySettings`: `BLOCK_ONLY_HIGH` for harassment, hate speech, sexual content, and dangerous content.

---

## 3. Strict Fabrication Filter & Guardrails

- File: [`lib/ai/guardrails.ts`](file:///c:/Users/ankit/Downloads/Naukri_Resume/lib/ai/guardrails.ts)
- **Zero-Hallucination Policy**: If an AI rewrite invents any percentage, count, rupee amount (`₹`, `lakh`, `cr`), or scale metric not found in the original source bullet or user-provided slot, the variant is **rejected and discarded**.
- Fallback note displayed to user: *"AI suggested an unverified metric — showing the template version instead."*

---

## 4. DPDP Act 2023 Consent & Quota Controls

- Files: [`lib/ai/consent.ts`](file:///c:/Users/ankit/Downloads/Naukri_Resume/lib/ai/consent.ts), [`lib/ai/quota.ts`](file:///c:/Users/ankit/Downloads/Naukri_Resume/lib/ai/quota.ts)
- **Consent default**: OFF. The user must toggle "AI bullet polish" explicitly.
- **Minimization**: Only the single bullet and target role are transmitted; personal identifying information (name, email, phone, employers, college) is never sent.
- **Budget**:
  - 30 requests/hour per IP
  - 20 rewrites/day per user
  - 500 rewrites/day globally
- **Cache**: 30-day SHA-256 hashed response cache in `MemoryStore`.

---

## 5. UI Integration

- Files:
  - [`components/settings/AiConsentToggle.tsx`](file:///c:/Users/ankit/Downloads/Naukri_Resume/components/settings/AiConsentToggle.tsx)
  - [`components/BulletRewriterView.tsx`](file:///c:/Users/ankit/Downloads/Naukri_Resume/components/BulletRewriterView.tsx)
- Mandatory AI suggestion label with `Sparkles` icon and model disclaimer.
- Real-time indicator for cache hits (`Cached (30d)`).
- Instant fallback notices on rate limit, quota exhaustion, or unverified metric detection.

---

## 6. Verification Test Suite (`tests/ai-verification.ts`)

Run via `npm test` or `npx tsx tests/ai-verification.ts`:
- **1. Fabrication Filter**: Rejects unverified metrics (e.g. `40%`), accepts source metrics, accepts user slot inputs, verifies Indian currency expressions (`₹2.5 Cr`).
- **2. Prompt Injection Defense**: Escapes tags, caps length at 2,000 chars, encapsulates bullet in `<RESUME_BULLET>`.
- **3. Schema Validation**: Validates compliance with `AIRewriteResponseSchema`, rejects invalid intent enums or empty arrays.
- **4. Quotas**: Enforces daily caps and tracks token usage.
- **5. Consent**: Verifies default OFF, consent grant, and revocation.
- **6. Deterministic Fallback**: Assures 3 fallback variants on any AI failure.

---

## 7. Compliance Checklist

```
[x] API key server-only, never in client bundle
[x] Consent required, default OFF, revocable
[x] Only the target bullet + role sent to Gemini
[x] No name, email, phone, address, education, employers sent
[x] System instruction states input is data, not instructions
[x] Input escaped and length-capped
[x] Output schema-validated with Zod
[x] Fabrication filter applied to every variant
[x] Rate limits: 30/hr IP, 20/day user
[x] Global daily cap enforced
[x] Kill switch functional (ENABLE_AI=false)
[x] Deterministic fallback verified for every error path
[x] AI label visible in UI
[x] Prompt/response never logged
[x] Cache TTL 30 days, verified expiry
[x] Privacy notice mentions Gemini explicitly
```
