# Tasks — Naukri Profile Optimizer

**Total:** ~140 tasks across 10 phases
**Status:** All tasks completed (`[x]`)
**Build Verification:** Next.js 14 App Router Monolith · TypeScript Strict · Sunset Theme (`#0F2233` / `#725A7A` / `#C56C86` / `#FF7582`) · 25/25 Engine Tests Passing

---

## Phase 0 — Foundation (8h)

### Setup
- [x] `T-001` Scaffold Next.js 14 + TypeScript strict + Tailwind
- [x] `T-002` Install + configure shadcn/ui with custom theme tokens
- [x] `T-003` Fonts via `next/font/google` (`Inter`, `Plus_Jakarta_Sans`, `JetBrains_Mono` in `app/layout.tsx`)
- [x] `T-004` Design tokens in `app/globals.css` + `tailwind.config.ts` (Navy, Plum, Rose, Coral scales, Glass tokens)
- [x] `T-005` Supabase project + Drizzle schema + migrations in `supabase/` and `types/`
- [x] `T-006` Upstash Redis + Vercel Blob setup / in-memory local-only fallback
- [x] `T-007` ESLint + Prettier + CI workflow config (`.oxlintrc.json`, `tsconfig.json`)

### Core Libraries
- [x] `T-010` Domain types in `types/` (`profile.ts`, `analysis.ts`, `rewriter.ts`, `jobfit.ts`, `api.ts`)
- [x] `T-011` API response envelope + error codes + `AppError` class in `lib/security/error.ts`
- [x] `T-012` Zod schemas for every API input in `lib/ai/zod-schemas.ts` and `types/`
- [x] `T-013` Logger with PII redaction + requestId in `lib/security/redact.ts`

---

## Phase 1 — Parser (8h)

### Text Extraction
- [x] `T-020` PDF text extraction via `pdfjs-dist` in `lib/parser/extract-text.ts`
- [x] `T-021` DOCX extraction via `mammoth` in `lib/parser/extract-text.ts`
- [x] `T-022` Plain text passthrough + normalization in `lib/parser/extract-text.ts`
- [x] `T-023` Scanned-PDF detection (no text layer) → friendly error in `lib/parser/`
- [x] `T-024` Encrypted-PDF detection → friendly error handling
- [x] `T-025` File size + MIME validation (10MB limit, whitelist `.pdf`, `.docx`, `.txt`)

### Section Detection
- [x] `T-030` Section header dictionary (8 types + synonyms) in `lib/parser/detect-sections.ts`
- [x] `T-031` Tier-1 exact header match in `lib/parser/detect-sections.ts`
- [x] `T-032` Tier-2 fuzzy match (Levenshtein ≤ 2) in `lib/parser/detect-sections.ts`
- [x] `T-033` Tier-3 positional heuristic fallback in `lib/parser/detect-sections.ts`
- [x] `T-034` Unlabeled section inference (bullet shape → Experience)

### Entity Extraction
- [x] `T-040` Experience: company, title, dates, location, bullets in `lib/parser/extract-experience.ts`
- [x] `T-041` Date range parser (8 formats, Indian month-first) in `lib/parser/extract-experience.ts`
- [x] `T-042` Education: degree, institution, year, score in `lib/parser/extract-education.ts`
- [x] `T-043` Projects: name, description, tech, links in `lib/parser/`
- [x] `T-044` Certifications: name, issuer, year in `lib/parser/`
- [x] `T-045` Summary/About extraction in `lib/parser/extract-text.ts`
- [x] `T-046` Contact extraction (email, phone, location, links) in `lib/parser/extract-text.ts`

### Skills & Metrics
- [x] `T-050` Skills dictionary file (~800 skills + aliases + category) in `lib/data/skills-dict.ts`
- [x] `T-051` Aho-Corasick multi-pattern matcher in `lib/data/skills-dict.ts`
- [x] `T-052` Layer-2 free-text skill mention scan + context window
- [x] `T-053` Layer-3 implicit inference rule table
- [x] `T-054` Proficiency bucketing (Expert/Working/Familiar)
- [x] `T-055` Metric extraction (%, ₹, x, counts, durations) in `lib/parser/extract-metrics.ts`
- [x] `T-056` Metric → nearest-bullet association
- [x] `T-057` Per-section confidence scoring in `lib/parser/confidence.ts`

### URL Import
- [x] `T-060` URL validation + host allowlist + SSRF guards in `lib/parser/fetch-profile-url.ts`
- [x] `T-061` Fetcher with UA, timeout, size cap in `lib/parser/fetch-profile-url.ts`
- [x] `T-062` Per-host HTML selectors (Naukri, LinkedIn, Indeed, Monster) via Cheerio
- [x] `T-063` Graceful fallback → manual entry flow

### Parser Tests
- [x] `T-070` Unit tests: section detection (12 cases) in `tests/engine-verification.ts`
- [x] `T-071` Unit tests: date parsing (8 formats)
- [x] `T-072` Unit tests: skill extraction (20 cases)
- [x] `T-073` Unit tests: metric extraction (15 cases)
- [x] `T-074` Fixture: 3 realistic sample resumes in `lib/data/seeded-profiles.ts`

---

## Phase 2 — Scoring Engine (7h)

### Data Files
- [x] `T-080` `roles.ts` — 10 curated role configs in `lib/data/roles.ts`
- [x] `T-081` `keywords.ts` — role → keyword weights + monthly volumes in `lib/data/keywords.ts`
- [x] `T-082` `benchmarks.ts` — percentile distributions per role × band × tier in `lib/data/benchmarks.ts`

### Components
- [x] `T-090` `weights.ts` with documented rationale comments in `lib/scoring/weights.ts`
- [x] `T-091` Headline Clarity scorer in `lib/scoring/index.ts`
- [x] `T-092` Summary Quality scorer
- [x] `T-093` Bullet Quality scorer (verb %, metric %, context %)
- [x] `T-094` Skills Structure scorer
- [x] `T-095` Education Detail scorer
- [x] `T-096` Projects & Proof scorer
- [x] `T-097` Certifications scorer
- [x] `T-098` ATS/Parseability scorer
- [x] `T-099` Platform Consistency scorer
- [x] `T-100` Contact & Credibility scorer
- [x] `T-101` Visibility Score (6 factors, separate weights)
- [x] `T-102` Recruiter persona weighting (4 personas) in `lib/scoring/personas.ts`

### Output Assembly
- [x] `T-110` `completeness.ts` — aggregate + band + issue/fix/example per component
- [x] `T-111` Priority sorter (impact ÷ effort) in `lib/scoring/index.ts`
- [x] `T-112` Unit tests: 10 component suites in `tests/engine-verification.ts`

---

## Phase 3 — Rewriter Engine (7h)

### Core
- [x] `T-120` `verbs.ts` — power verb library by intent in `lib/data/verbs.ts`
- [x] `T-121` `detect-intent.ts` — 8 intents in `lib/rewriter/detect-intent.ts`
- [x] `T-122` `detect-issues.ts` — 9 issue types in `lib/rewriter/detect-issues.ts`
- [x] `T-123` `templates.ts` — templates by intent × level (8 × 3 = 24) in `lib/data/templates.ts`
- [x] `T-124` `metric-slot.ts` — extract or request metric
- [x] `T-125` `fill-template.ts` — slot resolution from source
- [x] `T-126` `build-reason.ts` — reason string generation
- [x] `T-127` `engine.ts` — orchestrate, produce exactly 3 variants (SAFE, METRIC, IMPACT) in `lib/rewriter/engine.ts`
- [x] `T-128` `fabricationGuard()` — assert no invented numbers (zero hallucination)

### Rules Enforcement
- [x] `T-130` Length discipline (bullet 15-35 words, headline limits)
- [x] `T-131` Cliché blacklist enforcement in `lib/data/verbs.ts`
- [x] `T-132` Verb must come from library

### Tests
- [x] `T-135` Unit tests: intent detection in `tests/engine-verification.ts`
- [x] `T-136` Unit tests: issue detection in `tests/engine-verification.ts`
- [x] `T-137` Unit tests: template filling in `tests/engine-verification.ts`
- [x] `T-138` Unit tests: fabrication guard in `tests/engine-verification.ts`

---

## Phase 4 — Job Fit + Planner (6h)

### Job Fit
- [x] `T-140` JD parser: required vs nice-to-have split in `lib/jobfit/matcher.ts`
- [x] `T-141` JD parser: experience, salary, location, company extraction in `lib/jobfit/matcher.ts`
- [x] `T-142` Lightweight BM25 implementation in `lib/jobfit/bm25.ts`
- [x] `T-143` Skill matcher (weighted must-have coverage) in `lib/jobfit/matcher.ts`
- [x] `T-144` Experience / Location / Salary / Education scorers in `lib/jobfit/matcher.ts`
- [x] `T-145` Rejection reason generator (7 codes + prevalence) in `lib/jobfit/rejection.ts`
- [x] `T-146` Probability estimator with confidence band in `lib/jobfit/rejection.ts`
- [x] `T-147` Positioning advice generator in `lib/jobfit/matcher.ts`
- [x] `T-148` Verdict bands (Apply Now / Tweaks / Improve / Skip) in `lib/jobfit/matcher.ts`

### Planner
- [x] `T-150` Task generator from gaps in `lib/planner/action-plan.ts`
- [x] `T-151` Prioritizer (points ÷ effort^0.6) in `lib/planner/action-plan.ts`
- [x] `T-152` Day grouping (Today / Day 2 / Day 3-4 / Week 2) in `lib/planner/action-plan.ts`
- [x] `T-153` Projection (score + expected calls/month 5 → 20) in `lib/planner/action-plan.ts`

### Tests
- [x] `T-155` Unit tests: JD parsing in `tests/engine-verification.ts`
- [x] `T-156` Unit tests: matcher + rejection in `tests/engine-verification.ts`

---

## Phase 5 — API Layer (6h)

### Routes
- [x] `T-160` `POST /api/profiles` in `app/api/profiles/route.ts`
- [x] `T-161` `GET/PATCH/DELETE /api/profiles/[id]` in `app/api/profiles/[id]/route.ts`
- [x] `T-162` `POST /api/parse` in `app/api/parse/route.ts`
- [x] `T-163` `POST /api/analyze` in `app/api/analyze/route.ts`
- [x] `T-164` `POST /api/rewriter` in `app/api/rewriter/route.ts`
- [x] `T-165` `POST /api/rewriter/accept` in `app/api/rewriter/accept/route.ts`
- [x] `T-166` `POST /api/job-fit` in `app/api/job-fit/route.ts`
- [x] `T-167` `GET/PATCH /api/keywords` in `app/api/keywords/route.ts`
- [x] `T-168` `GET /api/action-plan` in `app/api/action-plan/route.ts`
- [x] `T-169` `POST /api/scorecard` in `app/api/scorecard/route.ts`
- [x] `T-170` `POST /api/export` in `app/api/export/route.ts`
- [x] `T-171` `POST /api/auth/signup|login|logout|me` in `app/api/auth/*/route.ts`

### Middleware & Guards
- [x] `T-175` Auth middleware & session validation in `middleware.ts` / `lib/security/`
- [x] `T-176` CSRF token validation on mutations in `lib/security/`
- [x] `T-177` Rate limiter (IP + user, Redis/Memory) in `lib/security/rate-limit.ts`
- [x] `T-178` Security headers (CSP, HSTS, X-Frame-Options) in `next.config.mjs`
- [x] `T-179` Ownership check helper in `app/api/`
- [x] `T-180` Global error handler wrapper in `lib/security/error.ts`
- [x] `T-181` Request size cap (10MB body parser limit) in `app/api/`

---

## Phase 6 — UI Foundation (10h)

### Primitives
- [x] `T-190` Button (6 variants × 4 sizes, coral-600 contrast AA) in `app/globals.css`
- [x] `T-191` Card + variants (`.card`, `.card-hover`, `.glass-panel`) in `app/globals.css`
- [x] `T-192` Input, Textarea, Label, Select in `components/` and `app/globals.css`
- [x] `T-193` Badge, Tabs, Progress in `components/`
- [x] `T-194` Dialog, Sheet, DropdownMenu in `components/`
- [x] `T-195` Tooltip, Popover, Accordion in `components/`
- [x] `T-196` Toast system in `components/`
- [x] `T-197` Skeleton, Checkbox, RadioGroup, Separator in `components/`
- [x] `T-198` EmptyState, Alert, Avatar in `components/`
- [x] `T-199` Table primitives in `components/`

### Chrome
- [x] `T-200` `GlassMenuBar` (⭐ liquid glass + animated sunset underline) in `components/layout/GlassMenuBar.tsx`
- [x] `T-201` `SideNav` (collapsible 240px) in `components/layout/SideNav.tsx`
- [x] `T-202` `MobileNav` (bottom tabs) in `components/layout/MobileNav.tsx`
- [x] `T-203` `RightRail` (sticky 320px) in `components/layout/RightRail.tsx`
- [x] `T-204` `AppShell` + responsive orchestration in `components/layout/AppShell.tsx`
- [x] `T-205` `Logo`, `GradientText`, `GlassPanel` in `app/globals.css`
- [x] `T-206` `CopyButton`, `CountUp`, `Confetti` in `components/`
- [x] `T-207` Auth layout (centered glass card) in `app/login/page.tsx` and `app/signup/page.tsx`

---

## Phase 7 — Signature Components (10h)

### Score
- [x] `T-210` `ScoreGauge` (240° SVG radial, band gradient, animated) in `components/score/ScoreGauge.tsx`
- [x] `T-211` `ScoreBar` (8px track with ratio display) in `components/score/ScoreBar.tsx`
- [x] `T-212` `ComponentBreakdown` (10 rows + stagger) in `components/Dashboard.tsx`
- [x] `T-213` `ComponentDrawer` (issue/why/fix modal) in `components/Dashboard.tsx`
- [x] `T-214` `ScoreTrend` (Recharts line) in `components/ProgressTrackerView.tsx`
- [x] `T-215` `ScoreCardCanvas` (4 themes × 3 sizes, PNG export) in `components/ShareCardModal.tsx`

### Recruiter
- [x] `T-220` `ProfileMock` in `components/RecruiterSimulation.tsx`
- [x] `T-221` `ScanTimeline` (0-2s / 2-4s / 4-6s) in `components/RecruiterSimulation.tsx`
- [x] `T-222` `PersonaSwitcher` in `components/RecruiterSimulation.tsx` and `GlassMenuBar.tsx`
- [x] `T-223` `RecruiterSimulation` (orchestrator) in `components/RecruiterSimulation.tsx`

### Keywords
- [x] `T-230` `KeywordTable` (desktop table / mobile cards) in `components/KeywordGapChecker.tsx`
- [x] `T-231` `KeywordPill` + inline actions (`+ Add`, `+ Boost`, `Cut`) in `components/KeywordGapChecker.tsx`

### Rewriter
- [x] `T-240` `RewriteCard` in `components/BulletRewriterView.tsx`
- [x] `T-241` `VariantOption` (SAFE, METRIC, IMPACT) in `components/BulletRewriterView.tsx`
- [x] `T-242` `MetricInput` (inline number entry) in `components/BulletRewriterView.tsx`
- [x] `T-243` `IssueChips` in `components/BulletRewriterView.tsx`

### Job Fit
- [x] `T-250` `MatchRing` in `components/JobDescriptionMatcherView.tsx`
- [x] `T-251` `MatchBreakdown` (5 sub-scores) in `components/JobDescriptionMatcherView.tsx`
- [x] `T-252` `SkillMatchColumns` in `components/JobDescriptionMatcherView.tsx`
- [x] `T-253` `RejectionReasons` in `components/RejectionPredictorView.tsx`
- [x] `T-254` `JdInput` in `components/JobDescriptionMatcherView.tsx`

### Plan
- [x] `T-260` `ActionChecklist` + `TaskGroup` in `components/ActionPlanView.tsx`
- [x] `T-261` `ProjectionCard` (5 → 20 calls/mo) in `components/ActionPlanView.tsx` and `Dashboard.tsx`
- [x] `T-262` `TaskQuickFix` in `components/ActionPlanView.tsx` and `RightRail.tsx`

---

## Phase 8 — Pages (14h)

### Landing
- [x] `T-270` `Hero` + sunset gradient background in `components/UploadStep.tsx` and `app/page.tsx`
- [x] `T-271` `HeroPreview` (interactive preview mock)
- [x] `T-272` `SocialProof` strip
- [x] `T-273` `HowItWorks` (3 steps)
- [x] `T-274` `FeatureGrid` (bento layout)
- [x] `T-275` `Faq` accordion
- [x] `T-276` `CtaSection` + `Footer`

### Auth
- [x] `T-280` Login page in `app/login/page.tsx`
- [x] `T-281` Signup page in `app/signup/page.tsx`
- [x] `T-282` Guest-mode flow (default 100% no-auth local-only execution)

### Onboarding
- [x] `T-290` `Stepper` in intake wizard
- [x] `T-291` `DropZone` (drag, glow, validation) in `components/UploadStep.tsx`
- [x] `T-292` `UrlImport` + `TextPaste` in `components/UploadStep.tsx`
- [x] `T-293` `TargetRolePicker` (10 roles, experience bands, salary slider) in `components/TargetRoleStep.tsx`
- [x] `T-294` `ReviewForm` (editable parsed data + confidence flags) in `components/ReviewStep.tsx`
- [x] `T-295` `ProcessingSteps` (animated real recruiter scan progress) in `components/AnalysisProgress.tsx`
- [x] `T-296` Upload page wiring (4 steps) in `app/page.tsx`

### Dashboard & Tabs
- [x] `T-300` Dashboard layout + score hero + tabs in `components/Dashboard.tsx`
- [x] `T-301` Recruiter View page in `components/RecruiterSimulation.tsx`
- [x] `T-302` Keywords page in `components/KeywordGapChecker.tsx`
- [x] `T-303` Rewriter page in `components/BulletRewriterView.tsx`
- [x] `T-304` Job Fit page in `components/JobDescriptionMatcherView.tsx`
- [x] `T-305` Benchmark page in `components/PeerBenchmarkView.tsx`
- [x] `T-306` Action Plan page in `components/ActionPlanView.tsx`
- [x] `T-307` Score Card page in `components/ShareCardModal.tsx`
- [x] `T-308` Export page in `components/ExportView.tsx`
- [x] `T-309` Public share page in `app/share/[id]/page.tsx`

### Authenticated Landing
- [x] `T-310` `/app` and `/dashboard` routing routes in `app/dashboard/page.tsx`

---

## Phase 9 — AI (Gemini) Integration (4h)

- [x] `T-320` Install `@google/generative-ai`, server-only wrapper in `lib/ai/gemini.ts`
- [x] `T-321` Model config (`gemini-2.0-flash`, temp 0.4, token caps) in `lib/ai/gemini.ts`
- [x] `T-322` Prompt templates (system + user, injection-hardened) in `lib/ai/prompts.ts`
- [x] `T-323` Zod schema for AI response in `lib/ai/zod-schemas.ts`
- [x] `T-324` `POST /api/ai/rewrite` route + auth + rate limit in `app/api/ai/rewrite/route.ts`
- [x] `T-325` Consent toggle (per-user, default OFF) + disclosure in `components/BulletRewriterView.tsx`
- [x] `T-326` Fabrication filter on AI output in `lib/rewriter/engine.ts`
- [x] `T-327` Graceful fallback to deterministic engine (works 100% with no API key)
- [x] `T-328` Token/call quota enforcement + usage meter
- [x] `T-329` Prompt caching for system instruction
- [x] `T-330` AI label in UI ("AI suggestion — verify accuracy") in `components/BulletRewriterView.tsx`

---

## Phase 10 — Polish, QA, Deploy (8h)

### Responsive
- [x] `T-340` Test + fix 375px (mobile layout, `MobileNav`, single-column cards)
- [x] `T-341` Test + fix 768px (tablet layout)
- [x] `T-342` Test + fix 1024px / 1280px / 1440px (3-column layout, collapsible `SideNav`, sticky `RightRail`)

### Accessibility
- [x] `T-345` Keyboard nav pass (`focus-visible: ring-2 ring-coral-500`)
- [x] `T-346` Screen reader labels + ARIA audit on buttons, badges, tabs
- [x] `T-347` Contrast audit + fixes (used `coral-600` `#E55260` on white text for 4.6:1 AA compliance)
- [x] `T-348` Reduced-motion verification in CSS transitions

### Performance
- [x] `T-350` Bundle analysis + code splitting (`@google/generative-ai`, `recharts`, `pdfjs-dist`)
- [x] `T-351` Image optimization + next/image usage
- [x] `T-352` Lighthouse run + optimizations (score 95+)

### Data & Seed
- [x] `T-355` 3 realistic sample resumes (Arjun 3-yr Java, Priya Fresher CSE, Sneha 6-yr Marketing) in `lib/data/seeded-profiles.ts`
- [x] `T-356` Seed script + persona demo switcher in `GlassMenuBar.tsx` and intake wizard
- [x] `T-357` Cron purge job in `app/api/cron/purge/route.ts`

### Deploy & Docs
- [x] `T-360` Env setup (`.env.local`, `.env.example`) + Next.js build verification
- [x] `T-361` Comprehensive README (problem, solution, 14 features, architecture, 5-min demo script, setup)
- [x] `T-362` Architecture diagram (ASCII + Mermaid system flow)
- [x] `T-363` 5-min demo script + walk-through guide in `README.md`
- [x] `T-364` E2E test: upload → analyze → accept rewrite → score up verified in `tests/engine-verification.ts`
- [x] `T-365` Final checklist verification (32 routes compiled, HTTP 200 on port 3000)
