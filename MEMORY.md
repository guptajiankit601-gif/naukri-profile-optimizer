# Memory — Naukri Profile Optimizer

**Purpose:** Persistent operating memory for "Naukri Profile Optimizer" — the canonical context, foundational decisions, architectural conventions, data retention tiers, and living system state that must survive across every session, agent handoff, and context reset. Written for any AI engineer or teammate picking up the codebase cold.

---

## 1. Product Identity Card

| Field | Canonical Value |
|---|---|
| **Product Name** | **Naukri Profile Optimizer** |
| **Tagline** | *"Your profile is invisible. We show you exactly why."* |
| **Primary CTA** | `"Upload Resume — It's Free"` |
| **Commercial Model** | 100% Free forever for job seekers. No subscriptions, no tiers, no credit cards, no paywalls, zero billing code anywhere in the repository. |
| **Target Market** | India — final-year campus students, freshers, working professionals (0–8 YOE), career pivoters across tech and non-tech tracks. |
| **Primary Target Platforms** | Naukri.com (India primary), LinkedIn (secondary), Monster/Foundit. Also outputs ATS-compliant single-column PDF. |
| **Tone & Vibe** | The honest, objective review of an experienced Indian technical recruiter or TA lead. Precise, calm, data-backed, empathetic, never flattering. |

---

## 2. The One-Line Mission

> *"Give a job seeker, in under 60 seconds, the diagnosis they have never been able to get anywhere else: exactly why a recruiter skips their profile in six seconds, and exactly what to change to stop it."*

---

## 3. Core Product Beliefs

Every line of code and user-facing interface in this repository must obey these nine non-negotiable principles:

- **B1 — Explanation Is the Product:** A score without a reason is worthless anxiety. Every number, rating, badge, and percentage the user sees must trace directly to a named deterministic rule. The rule IDs (e.g. `H-01`, `B-03`, `K-08` from [`RULES.md`](file:///c:/Users/ankit/Downloads/Naukri_Resume/RULES.md)) are surfaced in the UI via tooltips and issue drawers.
- **B2 — The Engine Is Deterministic:** Profile scoring, keyword gap classification, bullet rewriting, and job-fit matching are pure functions over a versioned ruleset. No AI model may ever alter or influence a numerical score. Google Gemini is strictly an optional text-polishing assist tier, operates server-only, and the entire product remains 100% operational when Gemini is disabled or unreachable.
- **B3 — We Never Invent Facts:** The bullet rewriter restructures what the candidate actually wrote. If a metric or scale number is missing, the system prompts the user via an inline input (`MetricInput`) — it **never** hallucinates *"improved performance by 35%"*. Any AI variant inventing unverified numbers is rejected by the strict fabrication filter.
- **B4 — Nothing Is Applied Externally:** Every suggested change requires explicit user approval and a manual action (copying or downloading). The product never connects write-APIs, never auto-applies to jobs, never auto-posts to LinkedIn, and never modifies external profiles.
- **B5 — Specificity Beats Volume:** One role analyzed with exhaustive domain intelligence beats 50 roles evaluated with generic platitudes. Ten curated Indian roles with deep keyword tables, volume data, and benchmark percentiles constitute the core product moat.
- **B6 — The User Is Stressed and Short on Time:** Every recommendation carries an explicit time-to-complete estimate (`minutes`). The `Today` group of the 7-day action plan must always fit in under 45 minutes of total effort.
- **B7 — India Is Not a Localisation, It Is the Product:** Tier-1/2/3 city hiring hubs, fresher vs experienced terminology, notice period filtering (immediate joiners vs 90 days), Indian currency notations (`₹ Lakhs`, `₹ Cr`), and Naukri-first search behavior are the fundamental substance of the system.
- **B8 — Free Is a Feature, Not a Missing Revenue Plan:** The product surface carries no upgrade buttons, no monetization mechanics, and no premium gates. Institutional licensing (B2B college placement cells and CSR partnerships) is handled entirely out-of-band.
- **B9 — The Demo Must Work:** A hackathon demo where an external dependency breaks is disastrous. Ship fewer features that are bulletproof, offline-capable, and completely reliable over fragile integrations.

---

## 4. What Makes This Different from Competitors

| Solution Category | Competitors | Their Approach & Limitation | Our Differentiator |
|---|---|---|---|
| **ATS Checkers** | Teal, Jobscan | Test whether an ATS parser can extract plain text fields. Ignores human search and recruiter ocular scanning habits. | We simulate a human recruiter's 6-second ocular scan, model Naukri boolean search ranking algorithms, and calculate visibility drop rates. |
| **Resume Builders** | Kickresume, Zety, Canva | Focus primarily on visual formatting, multi-column layouts, and graphical bars that often choke ATS systems. | We optimize for recruiter discoverability, search keyword density, active voice impact, and ATS single-column compliance. |
| **Career Coaches** | Hiration, Topmate mentors | Cost ₹2,000 – ₹5,000 per consultation; turnaround takes 3–5 days; quality varies wildly depending on individual bias. | Instant (60 seconds), 100% free forever, completely deterministic, explainable, and accessible to any student. |
| **Job Board Meters** | Naukri Profile Meter | Provides generic checklists designed to maximize total application volume (their business incentive), not candidate interview conversion. | Unbiased, brutal truth: reveals why recruiters drop candidates at 2 seconds and provides actionable fixes. |
| **LinkedIn Optimizers** | Careerflow, Resume Worded | Optimize exclusively for LinkedIn. | Tri-platform alignment: evaluates Naukri + LinkedIn + ATS Resume simultaneously with cross-platform consistency verification. |

**The Compounding Moat:**
1. Real Indian recruiter search keyword database with estimated monthly query volumes.
2. 4-way Recruiter Persona Simulator (`Startup Founder`, `Enterprise TA`, `Consultancy Recruiter`, `HR Screener`).
3. Transparent deterministic rejection predictor with targeted remedies.
4. Compounding dataset of anonymized profile-benchmark distributions across Indian hiring tiers.

---

## 5. The Ten Curated Roles

Every role dictionary in [`lib/data/roles.ts`](file:///c:/Users/ankit/Downloads/Naukri_Resume/lib/data/roles.ts) and [`lib/data/keywords.ts`](file:///c:/Users/ankit/Downloads/Naukri_Resume/lib/data/keywords.ts) includes: must-have skills, high-value booster skills, noise terms to cut, recruiter search queries with estimated volumes, power verbs, headline templates, bullet templates, and percentile benchmark curves across 5 experience bands:

1. **Software Engineer — Backend / Full-stack:** Java, Spring Boot, Microservices, Node.js, Python, PostgreSQL, Redis, Kafka, AWS, Docker, Kubernetes, System Design.
2. **Frontend Developer / UI Engineer:** React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML5/CSS3, Redux, Webpack, Performance Optimization.
3. **Data Analyst / Data Scientist (Entry–Mid):** Python, SQL, Pandas, NumPy, Power BI, Tableau, Machine Learning, Scikit-learn, Statistics, ETL.
4. **Digital Marketing Executive / Growth:** SEO, SEM, Google Ads, Meta Ads, Google Analytics (GA4), Content Strategy, Performance Marketing, CAC/ROAS.
5. **HR / Talent Acquisition Specialist:** Technical Recruiting, Sourcing, Screening, Naukri Resdex, LinkedIn Recruiter, Stakeholder Management, Onboarding.
6. **Sales / Business Development Executive:** B2B Sales, Lead Generation, Pipeline Management, CRM (Salesforce/HubSpot), Cold Calling, Enterprise Sales, Negotiation.
7. **MBA / Finance / Accounts Executive:** Financial Modeling, Tally ERP, Excel (Advanced), Accounting Standards, GST, TDS, Budgeting, Valuation, Auditing.
8. **B.Tech Fresher / Campus Candidate:** Core Engineering Fundamentals, DSA, C++, Java, DBMS, OOPs, Final Year Project, Internships, Academic Projects.
9. **UI/UX Designer / Product Designer:** Figma, Wireframing, Prototyping, User Research, Design Systems, Usability Testing, Information Architecture.
10. **Content Writer / SEO Executive:** SEO Writing, Keyword Research, Copywriting, WordPress, On-Page SEO, Content Planning, Proofreading, Storytelling.

---

## 6. Engine Conventions

- **Pure Functions Only:** All domain parsing, scoring, rewriter, and matching algorithms reside in `lib/`. Zero Next.js or React framework dependencies, zero DOM access, and zero network I/O inside the core logic.
- **Centralized Rules as Data:** Scoring weights, penalties, caps, and issue templates live as declarative data in `lib/scoring/rules.ts`, never as ad-hoc if/else conditionals scattered across UI components.
- **Stable Rule Identifiers:** Every rule has a unique, permanent code (`H-01` to `H-12` for Headlines, `B-01` to `B-10` for Bullets, `K-01` to `K-11` for Skills, `V-01` to `V-06` for Visibility, etc.).
- **Reproducibility Guarantee:** Given identical resume text and identical ruleset version, `calculateScore()` returns bit-for-bit identical scores, percentiles, and recommendations.
- **Metadata Tagging:** Every analysis object records `engineVersion`, `keywordVersion`, `benchmarkVersion`, and `evaluatedAt`.
- **Zero-Dependency Unit Testing:** The entire engine is fully testable using lightweight Node/TSX runners without starting a database, Redis, or an external API server.

---

## 7. Design Conventions

- **"Sunset" Theme:** Deep Navy base surfaces (`#0F2233`, `#1A3145`, `#24405A`), Vibrant Coral accent (`#FF7582`, `#E55260`), Dusty Plum secondary (`#725A7A`), and Muted Rose tertiary (`#C56C86`).
- **One Gradient Rule:** The signature Sunset gradient (`linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%)`) is strictly restricted to:
  1. The primary CTA button.
  2. The ScoreGauge radial arc.
  3. The ScoreCardCanvas viral PNG.
  4. The master brand glyph.
- **Liquid Glass Utility:** Translucent glass (`rgba(26, 49, 69, 0.55)` with 20px blur, top border highlight, and soft shadow) is used exclusively on the top navigation bar, the left navigation rail, and the mobile bottom tab bar. Content cards use solid `#1A3145` for maximum legibility.
- **Dual Signaling:** Color is never the sole indicator of status. Every score, badge, and table status always combines a semantic icon, explicit text label, and color.
- **Typography:** `Plus Jakarta Sans` for headers and ScoreGauge numerals (always `tabular-nums`); `Inter` for UI and body text; `JetBrains Mono` for keywords, metrics, and rule IDs.
- **Accessible Motion:** Transitions strictly communicate state changes (900ms gauge sweep, 1200ms count-up, 60ms staggered bar fill). All positional transforms are disabled when `prefers-reduced-motion` is active.

---

## 8. Copy and Tone Conventions

- **Language:** Clear Indian-English and natural professional phrasing. Avoid stilted American corporate jargon or overly formal legalese.
- **No Exclamation Marks in Errors:** Error messages are calm, objective statements: *"File size exceeds 5MB. Please upload a compressed PDF or DOCX file."* (Never: *"Oops! File too big!"*).
- **Zero Flattery or Adjectives:** Never use praise terms like *"Amazing job!"*, *"Awesome resume!"*, or *"Perfect score!"*. State facts: *"Your profile ranks in the top 14% of Indian Backend Engineers."*
- **Quantify Everything:** Always provide exact numbers: *"Add 4 high-volume keywords (+8 pts)"* rather than *"Improve your keywords"*.
- **Pair Problems with Actions:** Never present an identified weakness without an immediate 1-click remedy button or deep-link adjacent to it.
- **Forbidden Buzzwords:** Never use terms like *"AI-generated"*, *"ChatGPT"*, *"Magic"*, or *"Autonomous"* in candidate-facing UI. State what the system does: *"Calculated using deterministic recruiter rules"*.
- **Direct Empathy:** Respect the candidate's effort. Be direct about recruiter skip patterns without being condescending.

---

## 9. Data Retention & Privacy Conventions (The Memory Tiers)

The product complies with the India Digital Personal Data Protection (DPDP) Act 2023. Data lifecycle is strictly partitioned into six distinct tiers:

| Tier | Name | Storage Mechanism | Retention TTL | Access Visibility |
|---|---|---|---|---|
| **M0** | **Ephemeral** | Browser React State | In-Memory (Session) | User only (cleared on tab close) |
| **M1** | **Working** | Server Memory / Redis Cache | 1 Hour – 24 Hours | User only (hash-keyed) |
| **M2** | **Session** | Database (Anonymous Profile) | 24 Hours (Cron Purge) | Guest User only via secure session token |
| **M3** | **Account** | Database (Linked User Profile)| 90 Days (User Deletable) | Authenticated User only |
| **M4** | **Aggregate** | Anonymized Analytical Store | 24 Months | Internal benchmark calibration only |
| **M5** | **Reference** | Static Versioned Code Files | Permanent / Git Tracked | Public / Client readable |

### Privacy Invariants
1. **Anonymous-First:** No sign-up or phone number required to obtain a full score report.
2. **24-Hour Auto-Purge:** Anonymous resume text and parsed profiles are automatically deleted after 24 hours.
3. **Data Erasure & Export:** Authenticated users have one-click `"Download My Data (JSON)"` and `"Permanently Delete Account"` options in Settings.
4. **Server-Only AI:** The Gemini API key is guarded by `import 'server-only'` and is never exposed to client bundles. Consent for AI bullet polish is explicit, opt-in only, and defaults to **OFF**.
5. **Safe URL Fetching:** Scraper enforces host allowlists, respects `robots.txt`, and never automates logins or bypasses security checks.

---

## 10. Current Living Status Board

- **Project Phase:** **Phase 6 — Hardened, Verified & Demo-Ready**
- **Tasks Completed:** **37 / 37** (All Critical Path 🔥 and Full Build deliverables complete)
- **Engine Version:** `v2.4.0-deterministic`
- **Keyword Version:** `kw-v2.1.0-ind`
- **Benchmark Version & Data As-Of:** `bench-v1.0.0` (as of January 15, 2025; calibrated for 2026 hiring market)
- **Active Local Production Server:** Running on `http://localhost:3000` (Ready, serving HTTP 200)
- **Verification Test Status:** **267 / 267 tests passed, 0 failed** across 5 test suites (`tests/engine-verification.ts`, `tests/memory-verification.ts`, `tests/skill-verification.ts`, `tests/security-verification.ts`, `tests/ai-verification.ts`).
- **Seeded Demo Personas:**
  1. `arjun`: 3-Year Java Backend Engineer (Bengaluru, Score 68 $\rightarrow$ Projected 88)
  2. `priya`: Final-Year B.Tech CSE Fresher (Hyderabad, Score 42 $\rightarrow$ Projected 74)
  3. `sneha`: 6-Year Performance Marketing Manager (Mumbai, Score 61 $\rightarrow$ Projected 85)
- **Last Updated:** Current Session (2026-10-24)

---

## 11. Decision Log

| ID | Date | Decision | Rationale | Alternatives Rejected | Affected Files |
|---|---|---|---|---|---|
| **D1** | 2026-10-20 | 100% Free forever, zero subscriptions | Maximizes hackathon adoption and removes all user friction; monetization is B2B placement-cell licensing handled out-of-band. | Freemium model, Stripe credit paywall, credit-based usage tiers. | `docs/01_PRD.md`, `app/(marketing)/` |
| **D2** | 2026-10-21 | Deterministic core engine, Gemini optional assist | Guarantees zero marginal cost, full explainability, privacy, offline execution, and zero AI hallucinations in scoring. | Pure LLM scoring, OpenAI GPT-4 prompt wrapper. | `lib/scoring/`, `lib/ai/`, `RULES.md` |
| **D3** | 2026-10-21 | Recruiter 6-Second Glance Simulation is signature feature | Demonstrates the brutal reality of recruiter screening in a visual, undeniable way that competitors fail to provide. | Standard bullet list of errors, generic ATS percentage meter. | `components/recruiter/`, `app/(app)/simulation/` |
| **D4** | 2026-10-22 | Multi-platform optimization (Naukri + LinkedIn + Resume) | Matches actual Indian hiring workflows where recruiters search on Naukri Resdex and cross-check LinkedIn profiles. | LinkedIn-only Chrome extension, standalone PDF builder. | `lib/export/`, `components/headline/` |
| **D5** | 2026-10-22 | "Sunset" dark palette (`#0F2233` + Coral) | Creates an authoritative, calm analytical console feel rather than an amateur consumer toy. | Generic light mode, purple SaaS gradient, pure black OLED theme. | `DESIGN.md`, `tailwind.config.ts`, `app/globals.css` |
| **D6** | 2026-10-22 | Liquid Glass restricted to navigation | Preserves high text contrast and legibility on content cards while providing modern aesthetic polish on menus. | Full-page glassmorphism, transparent content panels. | `components/layout/`, `app/globals.css` |
| **D7** | 2026-10-23 | 1080×1080 ScoreCardCanvas as growth loop | Empowering users to share verified score cards on LinkedIn and WhatsApp turns every user into an organic distribution channel. | Referral discount links, forced social login gates. | `components/score/ScoreCardCanvas.tsx` |
| **D8** | 2026-10-23 | Zero login required before seeing score | Minimizes drop-off. Candidates upload, see their diagnostic in 60 seconds, and only sign up if they want to save progress. | Mandatory registration wall on landing page. | `app/(app)/onboarding/`, `app/api/analyze/` |
| **D9** | 2026-10-23 | Realistic Indian seed profiles | Real Indian candidate resumes (Arjun, Priya, Sneha) establish instant credibility during hackathon evaluations. | Synthetic "John Doe" Silicon Valley resumes with generic skills. | `lib/data/seeded-profiles.ts`, `public/samples/` |
| **D10**| 2026-10-24 | 10 Roles deep rather than 50 shallow | Deep technical accuracy in top hiring sectors creates an unassailable data moat. | Superficial broad keyword lists across 100 job titles. | `lib/data/roles.ts`, `lib/data/skills-dict.ts` |

---

## 12. Open Questions & Future Horizons

| ID | Question | Why It Matters | Owner | Target Horizon | Status |
|---|---|---|---|---|---|
| **Q1** | Which 5 additional roles to introduce next? | Expansion into DevOps/SRE, Product Management, Quality Assurance, and Operations. | Product Lead | Post-Hackathon v2.5 | 📋 Backlogged |
| **Q2** | Should recruiter search volumes be calibrated via live search partner APIs? | Strengthens accuracy of monthly search volume indicators. | Data Lead | Q1 2027 | 🔍 Evaluating |
| **Q3** | Whether to release an institutional API for campus placement cells? | Enables engineering colleges to benchmark entire graduating batches in bulk. | Engineering Lead | Q2 2027 | 📋 Backlogged |
| **Q4** | Whether to support legacy binary `.doc` format? | Some tier-3 candidates still hold older Microsoft Word `.doc` files. | Core Parser Team | Post-Hackathon | 🔍 Researching |
| **Q5** | How to automate benchmark recalibration as user volume exceeds 100,000 scans? | Dynamic k-anonymity aggregation pipelines in PostgreSQL. | Infra Team | Q2 2027 | 📋 Backlogged |
| **Q6** | Is a Hindi/Hinglish localized landing page valuable for campus freshers? | Could significantly improve campus adoption across tier-2 and tier-3 colleges. | Growth Lead | Q1 2027 | 🔍 Testing |

---

## 13. Handoff Checklist for New Contributors

Before modifying any code in this repository, follow this operational checklist:

1. **Read Order:** Read [`docs/01_PRD.md`](file:///c:/Users/ankit/Downloads/Naukri_Resume/docs/01_PRD.md) $\rightarrow$ [`docs/02_ARCHITECTURE.md`](file:///c:/Users/ankit/Downloads/Naukri_Resume/docs/02_ARCHITECTURE.md) $\rightarrow$ [`RULES.md`](file:///c:/Users/ankit/Downloads/Naukri_Resume/RULES.md) $\rightarrow$ [`DESIGN.md`](file:///c:/Users/ankit/Downloads/Naukri_Resume/DESIGN.md).
2. **Scoring Invariant:** Never modify scoring weights or logic in ad-hoc components. Any rule change must be updated in `lib/scoring/rules.ts`, accompanied by a version bump in `ENGINE_VERSION`, and verified with unit tests.
3. **Environment Security:** Never commit `.env` or `.env.local`. Ensure `npm run build` succeeds with zero secret leaks.
4. **Mandatory Test Verification:** Always run `npm test` (`npm.cmd test` on Windows) before pushing changes. All 267 test cases must pass.
5. **Preserve Seed Personas:** Never alter the three core seeded resumes (`arjun`, `priya`, `sneha`) in `lib/data/seeded-profiles.ts` — they are the presentation foundation for live product demos.
6. **Feature Flag Half-Built Modules:** If a new feature cannot be completely stabilized, guard it behind an environment feature flag rather than deploying broken functionality.

---

## 14. Technical Glossary

- **Visibility Score:** Numerical score (0–100) reflecting how easily an Indian recruiter finds the profile in search results (keywords, title clarity, notice period, location).
- **Completeness Score:** Numerical score (0–100) evaluating profile thoroughness across the 10 diagnostic components.
- **Recruiter Persona:** Simulated hiring perspective (`Startup Founder`, `Enterprise TA`, `Consultancy Recruiter`, `HR Screener`) with specific priority weightings.
- **Keyword Tier:** Four-level keyword status: `PRESENT` (found in experience), `WEAK` (found only in summary/skills), `MISSING` (absent), `NOISE` (generic filler).
- **Noise Term:** Vague resume filler words (e.g. *"hardworking"*, *"team player"*, *"MS Office"*) that waste ocular space and trigger recruiter skepticism.
- **Metric Rate:** Percentage of experience bullet points that contain verifiable numerical outcomes (percentages, amounts, counts, time saved).
- **Bullet Variant (SAFE):** Grammatically corrected revision using strong active verbs without modifying source claims or inventing metrics.
- **Bullet Variant (METRIC):** Revision emphasizing quantified outcomes, prompting the user for missing data via live `MetricInput`.
- **Bullet Variant (IMPACT):** Strategic revision connecting candidate execution to bottom-line business ROI and stakeholder impact.
- **Verdict Tier:** Job-fit classification: `Strong Match` (80–100%), `Moderate Match` (60–79%), `Weak Match` (<60%).
- **Rejection Predictor:** Deterministic assessment identifying the primary reason an applicant would be filtered out by ATS or TA screeners.
- **Percentile:** Candidate ranking against benchmark profiles in the same target role and experience bracket (e.g. *"Top 14%"*).
- **Points-per-Minute (PPM):** Priority metric for the Action Plan: $\text{PPM} = \frac{\text{Potential Point Gain}}{\text{Estimated Minutes to Complete}}$.
- **Engine Version:** Semantic version of the deterministic scoring algorithms (current: `v2.4.0-deterministic`).
- **Benchmark Band:** Experience tier used for peer comparisons: `0-1 yrs`, `1-3 yrs`, `3-5 yrs`, `5-8 yrs`, `8+ yrs`.
- **Skill Density:** Ratio of validated technical/hard skills relative to total resume word count.
- **Points-on-Headroom:** Scoring clamp ensuring task gains cannot exceed the mathematical headroom between current score and 100.
