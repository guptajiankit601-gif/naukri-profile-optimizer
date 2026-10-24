# Memory — Naukri Profile Optimizer

**Purpose:** Define what the system remembers, for how long, why, and how it is protected. This document is the source of truth for data retention and memory semantics.

---

## 1. Memory Tiers

| Tier | Name | Storage | TTL | Visibility |
|---|---|---|---|---|
| M0 | Ephemeral | Browser memory (React state) | Session | User only |
| M1 | Working | Server memory / Redis | 1h – 24h | User only |
| M2 | Session | Postgres (anonymous profile) | 24h | User only |
| M3 | Account | Postgres (linked to user) | 90d | User only |
| M4 | Aggregate | Postgres (anonymized) | 24mo | Internal, opt-in |
| M5 | Reference | Repo (static data files) | Version-controlled | Public |

---

## 2. Tier Definitions

### M0 — Ephemeral (Browser only)
- Uploaded file object before submission
- Stepper state (current step, partial target role selection)
- Unsaved edits in the Review form
- Open drawer / modal state
- **Never sent to server. Cleared on tab close or navigation.**

### M1 — Working (Server, Redis)
| Key | Contents | TTL |
|---|---|---|
| `analysis:{profileId}:{resumeHash}` | Full analysis JSON (scores, components, gaps) | 1 hour |
| `jobfit:{profileId}:{jdHash}` | Match result + breakdown | 24 hours |
| `keyword-gap:{roleId}` | Role keyword table with weights | 7 days |
| `benchmark:{roleId}:{band}` | Percentile distribution | 7 days |
| `ai-rewrite:{hash}` | Gemini response cache | 30 days |
| `rate:{ip}:{window}` | Rate limit counters | window length |
| `session:{token}` | Auth session | 7 days |

**Invalidation:** any profile mutation → `DEL analysis:{profileId}:*`, `DEL profile:{profileId}`.

### M2 — Session (Anonymous profile)
Stored in Postgres. Auto-purged after 24 hours by cron.

```typescript
interface AnonymousProfile {
  id: string;
  createdAt: Date;
  expiresAt: Date;          // createdAt + 24h
  targetRoleId: string;
  experienceBand: string;
  targetCities: string[];
  parsed: ParsedProfile;    // includes rawText
  score: number;
  components: ComponentResult[];
  keywords: KeywordAnalysis;
  actionPlan: ActionPlan;
  rewrites: Rewrite[];
  jobFits: JobFit[];
  scoreHistory: ScoreHistory[];
}
```

**Why 24 hours:** Enough for a user to complete their fix over a weekend. Short enough that résumé data (highly sensitive) doesn't linger.

### M3 — Account (Linked profile)
Same as M2 plus `userId`, `email`, `name`. TTL 90 days, user-deletable at any time.

**On account creation with an existing anonymous profile:** link the anonymous profile to the new user (migration), preserving score history and rewrites. Offer an explicit choice: keep or discard.

### M4 — Aggregate (Anonymized)
Used only for improving benchmarks and keyword weights.

**Allowed aggregates:**
- Score distribution per role × band × city tier
- Most common gap types per role
- Keyword → score improvement correlation (does adding AWS actually correlate with a higher score? yes/no)
- Rewriter variant acceptance rate per intent (which variant users pick — informs template defaults)
- Job-fit verdict distribution per match band

**Hard rules:**
- ❌ NEVER store raw resume text, name, email, phone, company names, or education institutions.
- ❌ NEVER store individual job descriptions.
- ❌ Require ≥ 20 records in a bucket before publishing a derived benchmark.
- ✅ Apply k-anonymity: suppress any bucket with < 20 contributors.
- ✅ Opt-in consent at signup, revocable, default OFF.
- ✅ Irreversible aggregation (no way to identify a source record).

### M5 — Reference (Static, Version-Controlled)
```
lib/data/skills-dict.ts     ~800 skills + aliases + categories
lib/data/roles.ts           10 role configs + weights + verb sets
lib/data/keywords.ts        role → keyword weights + est. volumes
lib/data/benchmarks.ts      percentile distributions + methodology + version
lib/data/verbs.ts           power verb library
lib/data/resume-templates.ts  1 ATS-safe resume template
lib/data/captions.ts        share caption templates
```
Each file carries a `DATA_VERSION` constant and an `asOf` date. UI shows the as-of date for benchmark data.

---

## 3. Retention Matrix

| Data | Tier | TTL | Deletion trigger | Legal basis |
|---|---|---|---|---|
| Raw resume text | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Parsed profile | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Scores & components | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Keyword analysis | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Action plan | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Rewrites (original + suggested) | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Job descriptions pasted | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Job-fit results | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Score history | M2/M3 | 24h / 90d | Cron / user delete | Consent |
| Gemini cache | M1 | 30d | TTL | Consent (opt-in) |
| Auth session | M1 | 7d | Logout / expiry | Contract |
| Account profile | M3 | 90d | User delete | Contract |
| Aggregate stats | M4 | 24mo | User opt-out | Consent |
| Reference data | M5 | Forever (versioned) | N/A | Public |
| Rate limit counters | M1 | 1h | TTL | Legitimate interest |
| Application logs (redacted) | M1 | 30d | TTL | Legitimate interest |
| Error traces (scrubbed) | M1 | 30d | TTL | Legitimate interest |
| Files in Blob storage | M2/M3 | 24h / 90d | Cron / user delete | Consent |

---

## 4. Memory Semantics

### 4.1 What Counts as "Memory"
A piece of data is memory if:
1. It persists beyond a single request
2. It is retrievable later without re-input
3. It influences future output

### 4.2 Explicitly NOT Memory
- Computed scores without their inputs (cache is memory, but score alone without profile is useless)
- Transient UI state
- Error logs containing PII
- Anything stored in `localStorage` beyond a non-sensitive profile ID and theme preference

### 4.3 Local Storage Policy
```typescript
// ALLOWED
localStorage['npo:profileId']       // opaque UUID only
localStorage['npo:theme']           // 'sunset' | 'ocean' | 'forest' | 'mono'
localStorage['npo:recentRoles']     // array of role IDs (not PII)
localStorage['npo:onboarded']       // boolean

// FORBIDDEN
localStorage['npo:resumeText']
localStorage['npo:parsedProfile']
localStorage['npo:email']
localStorage['npo:phone']
localStorage['npo:name']
```

### 4.4 Idempotency
- Re-uploading the same file (same hash) → returns cached analysis if within TTL, else recomputes.
- Accepting the same rewrite twice → second call is a no-op returning the existing record.
- Job fit with the same JD hash → cached result returned.

### 4.5 Correction Memory
When a user corrects parsed data in the Review step:
- The correction is stored alongside the original in the profile record (both values).
- The original parse is retained for analytics (aggregated, M4) to measure parser accuracy.
- The corrected value is what's used in all scoring.
- **Never silently overwrite** — the parser confidence for that field is reduced.

### 4.6 Consent Memory
| Consent | Default | Scope | Revocable |
|---|---|---|---|
| Essential (processing resume) | ON, required | Core analysis | No (required for service) |
| AI polish (Gemini) | OFF | Bullet rewriting only | Yes |
| Anonymous analytics (M4) | OFF | Aggregate stats | Yes, anytime |
| Marketing email | OFF | Product updates | Yes |

Consent state stored in `user_consents` table, with `grantedAt`, `revokedAt`, `scope`.

---

## 5. Memory Operations

### 5.1 Write Path
```
User action
  → Route handler validates session + consent
  → Ownership check
  → Upsert to Postgres (M2/M3)
  → Invalidate Redis (M1)
  → Append score_history if score changed
  → Write redacted log
```

### 5.2 Read Path
```
Request
  → Check Redis (M1) → hit → return
  → Miss → read Postgres (M2/M3)
  → Warm Redis
  → Return
```

### 5.3 Forget Path (User-Initiated)
```
DELETE /api/profiles/[id]
  → Verify ownership
  → Delete Blob file
  → Delete Postgres rows (cascade)
  → DEL Redis keys (analysis:*, jobfit:*, ai-rewrite:*)
  → Delete consent records if account-level
  → Return { deleted: { rows: n, files: n, cacheKeys: n } }
  → Show visible confirmation listing what was removed
```

### 5.4 Auto-Purge (Time-Based)
```
Vercel Cron: 0 3 * * *  (03:00 IST daily)
  → SELECT ids FROM profiles WHERE is_anonymous = true AND created_at < now() - interval '24 hours'
  → For each: delete blob, delete rows, delete cache
  → DELETE FROM profiles WHERE is_anonymous = true AND created_at < now() - interval '24 hours'
  → Log count purged (no PII)
```

### 5.5 Age-Out
Account profiles older than 90 days without activity → soft-delete → purge after 30 more days. User gets an email 14 days before.

---

## 6. Memory Context for AI (Gemini)

### 6.1 What Gets Sent
```
ALLOWED (with explicit AI consent):
  - The single bullet being rewritten
  - Target role title
  - Rewrite level (safe | metric | impact)
  - Any user-supplied slot values for that bullet

NEVER SENT:
  - Full resume text
  - Name, email, phone, address
  - Education institutions
  - Other bullets
  - Job descriptions
  - Company names of previous employers
  - Any profile ID or user ID
```

### 6.2 Why So Narrow
Gemini sees only what's needed to rewrite one sentence. This minimizes exposure, keeps the prompt short (cost), and makes the output verifiable against a small input.

### 6.3 Gemini Cache
```
key: ai-rewrite:{sha256(bullet + role + level + userSlots)}
value: { variants, model, createdAt }
ttl: 30 days
```
Cached results are reused without a new API call. This is a cost optimization and also reduces repeated transmission of the same content.

### 6.4 Prompt Injection Defense
User content is inserted into the prompt inside explicit delimiters and labelled as data:
```
<RESUME_BULLET>
{user text}
</RESUME_BULLET>
```
The system instruction states that content inside the delimiters is data to be rewritten, never instructions to follow. The response is schema-validated and fabrication-filtered regardless.

---

## 7. Benchmark Memory (M5)

### Structure
```typescript
interface BenchmarkDataset {
  version: string;           // 'bench-v1.0.0'
  asOf: string;              // '2025-01-15'
  methodology: string;       // plain-language description
  sampleNote: string;        // 'Based on N aggregated analyses'
  roles: Record<string, {
    bands: Record<string, {
      cityTier: 'metro' | 'tier1' | 'tier2' | 'all';
      n: number;             // contributor count
      distribution: {
        p10: number; p25: number; p50: number; p75: number; p90: number;
      };
      dimensions: Record<string, { median: number; p75: number; p90: number }>;
    }>;
  }>;
}
```

### Update Policy
- Bump version on any change to methodology or data.
- Update `asOf` on every refresh.
- Never overwrite a released version — keep history in `lib/data/benchmarks/`.
- UI always displays the as-of date.
- If the user-facing percentile is computed from a bucket with n < 20, show "limited data" instead of a precise percentile.

---

## 8. Failure & Edge Memory

| Scenario | Behavior |
|---|---|
| User refreshes mid-analysis | Analysis is server-side and idempotent → same result |
| User opens two tabs | Both read the same profile; mutations use last-write-wins with a version column check |
| Network drops during accept | Client retries with an idempotency key; server returns the existing record |
| Analysis fails midway | Partial state discarded; user sees an error with a retry option; no partial score shown |
| Redis down | Fall through to Postgres; if both down → 503 with retry |
| Gemini timeout | Deterministic engine returns immediately; UI shows "Template-based suggestions" |
| Cron purge fails | Alert logged; next run retries with a wider window (24h → 48h → 72h) |

---

## 9. Memory Governance

### Reviews
| Review | Frequency | Owner |
|---|---|---|
| Retention policy audit | Quarterly | Product + Engineering |
| Consent UI copy review | Quarterly | Product + Legal |
| Benchmark methodology review | Per release | Data owner |
| PII scan of logs | Monthly | Engineering |
| Deletion-request audit | Monthly | Support |

### Change Control
Any change to TTLs, scopes, or purge windows requires:
1. Written justification
2. Update to this document
3. Update to the implementation
4. Test verifying the new behavior
5. (If user-facing) Update to the privacy notice in the UI

### User Rights (must be visible in the UI)
- See what data is stored
- Download a copy of it
- Delete it permanently
- Withdraw AI consent
- Withdraw analytics consent
- Understand what is deleted when they delete
