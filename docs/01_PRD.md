# Product Requirements Document (PRD) — Naukri Profile Optimizer

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Product Line:** CareerTech / Job Search Intelligence  
**Target Region:** India (Metro & Tier-1/2/3 Hubs)  
**Primary Platforms Covered:** Naukri.com, LinkedIn India, Monster India (Foundit)  
**Distribution Model:** Free Web Application (No-Auth Anonymous First, Optional Account)

---

## 1. Product Summary

### 1.1 Overview
Naukri Profile Optimizer is an India-first, recruiter-perspective evaluation and optimization platform for job seekers. It transforms opaque resume screening into an explainable, deterministic diagnostic. Users submit their resume (PDF/DOCX), paste their profile text, or provide a public profile URL, and receive actionable, 6-second recruiter-simulation diagnostics, keyword density audits, ATS parseability scores, and a prioritized 7-day action plan within 60 seconds.

### 1.2 Core Value Proposition
- **One-Line Hook:** "Upload your resume or profile link, get recruiter-perspective feedback in 60 seconds."
- **Price & Access Barrier:** 100% Free Forever. Zero paywalls, zero subscription gates, zero credit card prompts, zero feature lockouts.
- **Core Engine Integrity:** 100% deterministic rules, taxonomies, and formulas. No opaque black-box AI dependencies for core scoring or rewrites; optional Gemini 2.0 Flash polish tier available strictly on opt-in consent with strict zero-hallucination metric guardrails.

### 1.3 Target Audience
1. **Final-Year Students & Freshers (0-1 YOE):** Campus placement candidates and off-campus applicants struggling with academic-heavy, bullet-poor resumes.
2. **Early-to-Mid Career Professionals (1-8 YOE):** Software engineers, QA, DevOps, and tech talent stuck in service firms (e.g., TCS, Infosys, Wipro, Cognizant) seeking product company switches and salary step-ups.
3. **Non-Technical Professionals (0-8 YOE):** Sales, Performance Marketing, Human Resources, Accounting/Finance, and UI/UX designers seeking structured impact articulation.
4. **Career Switchers & Returners:** Domain switchers (e.g., Banking Operations to Product Analytics) and professionals returning after career breaks facing tenure filter rejection.

### 1.4 Primary Delivery Channels & Outputs
- **Input Channels:** PDF, DOCX, Raw Plain Text, Naukri Public Profile URL, LinkedIn Public URL.
- **Output Channels:** Web Dashboard, ATS-Compliant Single-Column PDF Resume, Copy-Ready Markdown/Text Blocks tailored for Naukri and LinkedIn profile fields, and 1080×1080 Shareable Social Cards.

---

## 2. Problem Statement

### 2.1 The Recruiter Reality vs. Job Seeker Mental Model
Indian job seekers routinely submit 200–500 applications across Naukri, LinkedIn, and corporate ATS portals without receiving an interview call or rejection reason. This multi-month silence leads to learned helplessness and financial exploitation. Candidates frequently pay ₹500–₹5,000 to "resume review consultants" who return generic Word templates that do not improve recruiter search discoverability or keyword indexation.

Recruiters on Naukri Resdex and LinkedIn Recruiter do not read resumes sequentially; they search using boolean filters and scan shortlisted candidate cards for approximately **6 seconds**. Profiles lacking exact-match skills, verified action verbs, and quantifiable impact metrics are discarded immediately.

```
Candidate Uploads Resume → Opaque Boolean Filtering → 6-Second Glance → Discarded (No Feedback)
       ▲                                                                         │
       └────────────── Candidate Repeats 200x Without Iteration ◄────────────────┘
```

### 2.2 Quantified Market Dynamics
- **Addressable Base:** 50M+ active job seekers on Indian portals.
- **Inbound Contact Disparity:** An unoptimized fresher profile averages 3–8 recruiter profile views/inmails per month. A profile calibrated for Naukri keyword density, search filters, and recruiter glance scanning reaches 15–30 contacts per month.
- **The 6-Second Glance Window:** Recruiter decisions are split into:
  - *0–2 seconds:* Current/past role title, employer prestige/stability, total YOE, current location.
  - *2–4 seconds:* First two bullet points under the latest experience entry for ownership verbs and scale.
  - *4–6 seconds:* Key skills block for mandatory technology stacks and immediate match tags.
- **Metric Deficit:** Over 82% of reviewed Indian fresher and early-career resumes contain zero quantifiable business or technical outcomes in their experience bullets.
- **Profile Fragmentation:** Job seekers maintain 3–5 out-of-sync representations across Naukri, LinkedIn, Foundit, and local PDF files, causing recruiter credibility drops during cross-referencing.
- **Application Fatigue:** Over 65% of surveyed candidates submit the same static PDF across 200+ distinct job specifications without keyword customization.

---

## 3. Goals & Non-Goals

### 3.1 Business & Impact Goals (12 Months Post-Launch)
- **Scale:** 100,000 unique profiles analyzed per month by Month 12.
- **Outcome Improvement:** Average Visibility Score improvement of $\ge +22$ points within 14 days of a user's initial baseline analysis.
- **Interview Conversion:** $\ge 30\%$ of surveyed active users report a measurable increase in recruiter inbound calls or interview requests within 30 days of implementing the 7-day action plan.
- **Product Retention:** $\ge 45\%$ Week-4 retention rate for active job seekers returning to analyze new job descriptions or track score iteration.
- **Organic Growth:** $\ge 12,000$ organic platform signups driven via user-shared Score Cards on LinkedIn, Twitter, and WhatsApp groups without paid user acquisition.
- **Sustainability (Optional Supporter Tier):** 6–9% conversion of active users to a voluntary, non-blocking Supporter/Contribution tier (e.g., "Buy a Chai" at ₹99–₹299) that funds hosting costs without locking any product features.

### 3.2 Non-Goals (Strictly Out of Scope for v1)
- **Not a Job Board:** We do not scrape, aggregate, host, or broker job listings.
- **Not an Application Bot:** We never automate job applications, submit forms, or interface with external ATS portals on the candidate's behalf.
- **Not a Resume Template Marketplace:** We do not sell visual graphic templates, Canva designs, or multi-column creative resumes.
- **Not a Human Coaching Network:** We do not broker paid sessions with human recruiters or career counselors.
- **Not an Interview Prep Platform:** Mock interviews, coding challenges, and psychometric assessments are out of scope.
- **Not a Cover Letter Generator in v1:** Cover letter features are deferred to subsequent releases.
- **No Native Mobile App in v1:** The product is delivered as an adaptive, responsive mobile-first Progressive Web App (PWA) running in standard mobile browsers.

---

## 4. User Personas

```
┌─────────────────┬──────────────────┬─────────────────┬──────────────────┬──────────────────┐
│ Ananya (21)     │ Rahul (25)       │ Sneha (28)      │ Vikram (40)      │ Priya (22)       │
│ Fresher CSE     │ SDE-1 Backend    │ Marketing Mgr   │ Career Switcher  │ MBA Finance      │
│ Pune (Tier-2)   │ Bengaluru        │ Gurgaon         │ Mumbai           │ Jaipur → BLR     │
│ Coursework Dump │ TCS Service Bias │ Activity ≠ ROI  │ Overqualified    │ Non-Tech Fresher │
└─────────────────┴──────────────────┴─────────────────┴──────────────────┴──────────────────┘
```

### 4.1 Persona 1: Ananya Sharma — The Tier-2 College Fresher
- **Demographics:** Age 21, Pune, Final-Year B.Tech CSE (Tier-2 University).
- **Current Situation:** Zero campus offers; applying to off-campus drives across Bengaluru and Pune.
- **Target Role:** Junior Backend Engineer / Software Engineer Trainee.
- **Primary Pain Point:** Her resume is a coursework dump ("Operating Systems, C++, DBMS") with academic projects lacking deployment URLs, performance figures, or commercial relevance. Recruiters filter her out within 2 seconds.
- **Technical Literacy:** Moderate. Writes code, understands Git, but unfamiliar with recruiter ATS parsing nuances.
- **Success Outcome:** Transforms generic academic project descriptions into 3 verified, metric-grounded bullet points; elevates completeness score from 34 to 78; secures 3 off-campus interview calls within 30 days.

### 4.2 Persona 2: Rahul Verma — The Service-Company Switcher
- **Demographics:** Age 25, Bengaluru, 3.2 YOE at a large Indian IT services company (TCS/Infosys).
- **Current Situation:** Stuck at ₹4.8 LPA CTC; targeting tier-1 product startups and MNC tech hubs paying ₹18–₹24 LPA.
- **Target Role:** Backend Engineer (Java / Spring Boot / Microservices / AWS).
- **Primary Pain Point:** His resume reads as maintenance and bug fixing ("Responsible for defect fixes and production support tickets"). It fails to signal distributed system ownership, latency optimization, or architectural scale.
- **Technical Literacy:** High technical proficiency, low personal marketing ability.
- **Success Outcome:** Replaces passive maintenance language with high-impact system engineering verbs (`architected`, `refactored`, `scaled`); detects missing booster keywords (`Kafka`, `Redis`, `Docker`); lands 4 product company interviews.

### 4.3 Persona 3: Sneha Kulkarni — The Non-Tech Marketing Lead
- **Demographics:** Age 28, Gurgaon, 6 YOE across D2C brands and agency environments.
- **Current Situation:** Seeking a Growth / Performance Marketing Lead role in high-growth startups.
- **Target Role:** Senior Performance Marketing Manager / Growth Specialist.
- **Primary Pain Point:** Lists high volumes of marketing tasks ("Managed Meta Ads campaigns, created social posts") without linking expenditures to CAC, ROAS, pipeline revenue, or conversion rate lift.
- **Technical Literacy:** Low technical engineering skills, high analytics and dashboard literacy.
- **Success Outcome:** Grounded formulas transform vague marketing tasks into ROI-focused statements (`"Scaled monthly Meta ad spend from ₹5L to ₹25L maintaining a 4.2x ROAS"`); visibility score rises to 88.

### 4.4 Persona 4: Vikram Malhotra — The Mid-Career Domain Switcher
- **Demographics:** Age 40, Mumbai, 15 YOE in Commercial Banking Operations.
- **Current Situation:** Completed an executive postgraduate diploma in Data Analytics; applying for analytics leadership roles.
- **Target Role:** Product Analytics Lead / Senior Business Analyst.
- **Primary Pain Point:** Automatically eliminated by boolean filters. Recruiters view him as an expensive, overqualified banking operations professional rather than an agile analytics practitioner.
- **Technical Literacy:** Advanced SQL, Excel, and PowerBI; intermediate Python.
- **Success Outcome:** Restructures profile to foreground data-driven risk modeling and automated underwriting; re-positions seniority from tenure-based to domain-impact; cuts rejection probability on targeted job descriptions by 45%.

### 4.5 Persona 5: Priya Patel — The Non-Metro MBA Graduate
- **Demographics:** Age 22, Jaipur, MBA in Finance from a regional business school.
- **Current Situation:** Seeking entry-level Investment Banking Operations or Financial Analyst roles in Bengaluru, Mumbai, or Hyderabad.
- **Target Role:** Financial Analyst / Equity Research Trainee.
- **Primary Pain Point:** Location bias and generic skill listings ("Financial Modeling, Excel, Communication"). Fails hard search filters on city presence and specific financial tooling (DCF, Bloomberg Terminal, SAP FICO).
- **Technical Literacy:** Non-coder. Power user of MS Office and financial software.
- **Success Outcome:** Restructures skills into category groups (Valuation, Compliance, Modeling); configures multi-city relocation signals; passes recruiter hard filters with an ATS-compliant PDF resume.

---

## 5. Feature Scope (v1 — 14 Free Core Features)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FEATURE MATRIX (v1 SCOPE)                       │
├──────────────────────┬─────────────────────────┬───────────────────────┤
│ INGESTION & AUDIT    │ ANALYSIS & SIMULATION   │ OPTIMIZATION & EXPORT │
├──────────────────────┼─────────────────────────┼───────────────────────┤
│ F1. Multi-Import     │ F4. 6-Sec Recruiter Sim │ F6. Headline Optimizer│
│ F2. Completeness     │ F5. Keyword Gap Checker │ F7. Bullet Rewriter   │
│ F3. Visibility Score │ F8. Job Fit Analyzer    │ F11. Progress Tracker │
│                      │ F9. Rejection Predictor │ F12. 7-Day Action Plan│
│                      │ F10. Peer Benchmark     │ F13. Social Card      │
│                      │                         │ F14. Multi-Export     │
└──────────────────────┴─────────────────────────┴───────────────────────┘
```

### F1: Resume & Profile Import
- **Capabilities:**
  - Client-side or server-side drag-and-drop file ingestion supporting PDF (`application/pdf`) and DOCX (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`) up to 5MB.
  - Public profile URL parsing: Naukri profile text scraper and LinkedIn public resume profile reader with anti-bot fallback instructions.
  - Raw plain-text paste area with instant line-break sanitization.
- **Output:** Normalizes unstructured data into a deterministic `ParsedProfile` domain object containing contact info, headline, summary, structured work experiences with isolated bullets, education credentials, certifications, and tokenized skill arrays.

### F2: Profile Completeness Score (0–100)
- **Capabilities:** Evaluates the profile's informational completeness against the 10 transparent rubrics detailed in Section 7.
- **Output:** An integer score (0–100) paired with an explicit breakdown across all 10 components, highlighting exact missing entities (e.g., missing GitHub/portfolio URL, unformatted education dates).

### F3: Visibility Score (0–100)
- **Capabilities:** Evaluates how easily a recruiter discovers and shortlists the profile across Naukri Resdex and LinkedIn boolean search engines.
- **Output:** An integer score (0–100) assessing keyword matchability, search-filter pass rate, 6-second glance impact, skill differentiation, and profile freshness recency signals.

### F4: Recruiter 6-Second Simulation
- **Capabilities:** Renders an interactive, timed visual scan simulation that mirrors exact recruiter ocular behavior:
  - *Phase 1 (0–2s):* Spotlight on current title, tenure, employer, and location.
  - *Phase 2 (2–4s):* Spotlight on the lead bullet of the most recent job.
  - *Phase 3 (4–6s):* Spotlight on top 6 technical/core skills.
- **Recruiter Personas Supported:**
  1. *Startup Founder:* Prioritizes full-stack versatility, speed of delivery, and GitHub/project links.
  2. *Enterprise TA Specialist:* Prioritizes exact YOE, brand prestige, stability, and strict educational credentials.
  3. *Agency / Consultancy Headhunter:* Prioritizes exact-match billing keywords, client-facing communication, and notice period signals.
  4. *HR Screener:* Prioritizes compliance, salary bracket fit, and absence of employment gaps.
- **Output:** Pass/Skip verdict, estimated recruiter bounce rate (e.g., "74% likelihood of skip in < 6 seconds"), and a visual heat map overlay.

### F5: Keyword Gap Analyzer
- **Capabilities:** Cross-references the candidate's extracted skills against curated role dictionaries (10 primary roles in v1, expanding to 100).
- **Classification Engine:**
  - *Filter Keywords (Must-Haves):* Mandatory table-stakes skills (e.g., `Java`, `Spring Boot` for Backend).
  - *Booster Keywords:* Differentiating tools that shift candidate ranking into top percentiles (e.g., `Kafka`, `Redis`, `Kubernetes`).
  - *Distractor Keywords:* Junior or outdated keywords that erode professional standing (e.g., `MS Office`, `Eclipse IDE`, `C Basics` on a 3-year engineer resume).
  - *Skill-List Bloat Detection:* Flags profiles listing $> 30$ unsorted skills, penalizing visual credibility.
- **Output:** Search volume disclosures (e.g., "142,000 monthly recruiter searches on Naukri") and 1-click addition recommendations.

### F6: Headline Optimizer
- **Capabilities:** Evaluates the candidate's existing headline against character limits, search indexing weights, and value articulation across platforms.
- **Output:** 5 ranked, platform-specific variants:
  - *Naukri Resume Headline:* 250-character limit, dense keyword weighting.
  - *LinkedIn Headline:* 220-character limit, balancing keyword discoverability with social authority.
  - *ATS Resume Header:* 100-character crisp role definition.
  - Each variant includes character count, keyword coverage score, and an explainable "Why This Works" rationale.

### F7: Bullet Rewriter (Intent-Classified & Metric-Grounded)
- **Capabilities:** Ingests vague or passive bullets and produces 3 deterministic, publication-grade variations:
  - *Variant A (Safe / Clean):* Grammatically tightened, passive voice stripped, strong action verb inserted.
  - *Variant B (Metric / Quantified):* Embeds quantifiable outcomes with explicit slot prompts.
  - *Variant C (Executive / Impact):* Formats the bullet for senior shortlisting, linking engineering to business scale.
- **Zero-Hallucination Invariant:** The rewriter **never invents numbers**. If the original source has no metric, Variant B surfaces an inline interactive slot (`[Enter latency reduction % / throughput]`), prompting the user to supply their real figure.
- **Output:** Full interactive comparison with 1-click accept, inline edit, and direct profile state update.

### F8: Job Fit Analyzer
- **Capabilities:** Accepts any pasted Job Description (JD), extracts hard technical requirements, preferred tools, experience bands, and role criteria using BM25 and keyword extraction.
- **Output:**
  - Overall match percentage (0–100%).
  - 5 sub-scores: Skill Match (40%), Experience Band Match (25%), Location Fit (15%), Salary Expectations Fit (10%), Education Fit (10%).
  - Categorized skill breakdown: *Matched Skills*, *Missing Critical Skills*, *Partial / Equivalent Skills*.
  - Strategic Re-positioning Guidance: Specific recommendations on which projects or bullet points to elevate before applying.

### F9: Rejection Predictor
- **Capabilities:** Simulates automated ATS filters and recruiter screening rules to predict the primary grounds for application rejection before submission.
- **Output:** Ranked list of failure modes, estimated ATS filter drop-off percentage (e.g., "68% of candidates for this role are rejected on this filter"), and exact steps to neutralize the vulnerability.

### F10: Peer Benchmark
- **Capabilities:** Compares candidate visibility, completeness, skill density, and salary band against anonymized benchmark pools across Indian metros (Bengaluru, NCR, Mumbai, Hyderabad, Pune, Chennai).
- **Output:** Percentile rankings ($P_{25}, P_{50}, P_{75}, P_{90}$), competitive strength tags ("Top 10% in Microservices adoption"), and vulnerability gap alerts ("Bottom 25% in metric quantification for 3-5 YOE band").

### F11: Score Progress Tracker
- **Capabilities:** Real-time state machine that dynamically recalculates Completeness, Visibility, and 6-Second Glance scores after every accepted rewrite, keyword addition, or headline tweak.
- **Output:** Interactive visual progression graph illustrating score trajectory from baseline import to current state.

### F12: 7-Day Action Plan
- **Capabilities:** Converts identified profile deficiencies into an execution checklist organized chronologically:
  - *Day 1 (Immediate Wins):* High-ROI keyword insertions, headline replacement (Est. Time: 20 mins, $+12$ Visibility points).
  - *Day 2 (Bullet Restructuring):* Rewriting top 4 experience bullets with real metrics (Est. Time: 35 mins, $+8$ points).
  - *Day 3–4 (Platform Synchronization):* Updating Naukri Key Skills, LinkedIn About section, and ATS PDF (Est. Time: 40 mins, $+6$ points).
  - *Week 2 (Targeted Applying):* Job Fit calibration and custom tailoring (Est. Time: 60 mins).
- **Output:** Chronological checklist with estimated completion times, projected point gains, and expected inbound recruiter contact ranges (e.g., "Projected inbound lift: 3x within 14 days").

### F13: Shareable Score Card
- **Capabilities:** Client-side HTML5 canvas generator rendering an exportable 1080×1080 image summarizing the candidate's verified profile score, key strengths, and optimization status.
- **Design Specifications:**
  - 4 Curated Themes: *Sunset* (Brand signature: Navy/Rose/Coral), *Ocean* (Deep Teal/Cyan), *Forest* (Emerald/Slate), *Mono* (Minimalist Dark).
  - 3 Aspect Ratios: Square (1:1 for LinkedIn/Instagram feed), Portrait (4:5 for mobile feeds), Story (9:16 for WhatsApp status/Stories).
  - Anti-Fraud Watermark, verification badge, and embedded referral slug.

### F14: Multi-Platform Profile Export
- **Capabilities:** Export module generating platform-tailored assets:
  - *ATS-Compliant Resume PDF:* Single-column layout, standard semantic headings (`Work Experience`, `Skills`, `Education`), zero multi-column tables, zero graphics, fully selectable text passing `pdf.js` and `mammoth` parsing.
  - *Naukri Copy Blocks:* Pre-formatted, character-counted text blocks for Naukri Key Skills, Resume Headline, and Summary.
  - *LinkedIn Copy Blocks:* Pre-formatted blocks for LinkedIn Headline, About section, and Experience entries with optimized unicode formatting.

---

## 6. Score Bands & Color Token Mapping

Both the Completeness Score and Visibility Score evaluate candidates across four standardized performance tiers:

```
┌───────────────┬─────────────────┬──────────────────┬─────────────────┐
│ 0 - 40        │ 41 - 70         │ 71 - 85          │ 86 - 100        │
│ Critical      │ Needs Work      │ Competitive      │ Excellent       │
│ #E55260       │ #725A7A         │ #C56C86          │ #3FBF8F         │
│ Coral-600     │ Plum-500        │ Rose-500         │ Success Emerald │
└───────────────┴─────────────────┴──────────────────┴─────────────────┘
```

### 6.1 Score Band Definitions
| Score Range | Tier Label | Hex Code | Tailwind Token | Recruiter Behavior & Market Meaning |
|---|---|---|---|---|
| **0 – 40** | **Critical** | `#E55260` | `var(--coral-600)` | **Profile Discarded:** Fails standard boolean keyword searches and ATS filters. Candidate receives zero inbound traffic and $> 95\%$ auto-rejection on applications. |
| **41 – 70** | **Needs Work** | `#725A7A` | `var(--plum-500)` | **Filtered Out in Shortlist:** Appears in broad recruiter searches but dropped during the 6-second glance scan due to vague bullets, weak verbs, or missing proof points. |
| **71 – 85** | **Competitive** | `#C56C86` | `var(--rose-500)` | **Shortlisted for Review:** Passes ATS screening and recruiter glance scan. Qualifies for initial HR screen calls; minor keyword gaps prevent top-decile ranking. |
| **86 – 100** | **Excellent** | `#3FBF8F` | `var(--success)` | **Top 5% Priority Shortlist:** High discoverability on Naukri Resdex. Direct outbound contact from senior tech recruiters and hiring managers. |

### 6.2 Per-Component Status Rubric
Every individual scoring component yields a granular status indicator:
- **Good (Green / `#3FBF8F`):** Component satisfies all optimization criteria. No immediate action required.
- **Warn (Yellow / `#F5A524`):** Sub-optimal configuration (e.g., skills present but unsorted; headline missing value proposition). Triggers medium-priority 7-day action item.
- **Bad (Red / `#E55260`):** Critical deficiency (e.g., zero metrics in experience section; missing core role filter keywords). Triggers high-priority Day-1 action item.

---

## 7. Scoring Model Specification

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SCORING ENGINE EQUATIONS                        │
├────────────────────────────────────────────────────────────────────────┤
│ Completeness (0-100) = ∑ (Component_Score_i)  [10 Explicit Components] │
│ Visibility   (0-100) = ∑ (SubScore_j × Weight_j) [Discoverability Engine]│
│ Job Fit Match (0-100)= 0.40(Skill) + 0.25(Exp) + 0.15(Loc) + ...       │
│ Rejection Probability= clamp(1.0 - (MatchScore × (1 - RiskPenalties))) │
└────────────────────────────────────────────────────────────────────────┘
```

### 7.1 Mathematical Invariant of Explainability
**No score may be emitted without an accompanying human-readable explanation object.**  
Every component calculation must return:
```typescript
interface ComponentEvaluation {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warn' | 'bad';
  issue: string | null;
  fix: string | null;
  example: string | null;
}
```

### 7.2 Completeness Score Formula (10 Components, Sum = 100)
$$\text{Score}_{\text{Completeness}} = \sum_{i=1}^{10} C_i$$

1. **Headline Clarity ($C_1$, Max: 12 pts):**
   - Role keyword present: $+5$
   - Specialization / secondary skill identified: $+4$
   - Seniority or experience anchor included: $+3$
2. **Summary Quality ($C_2$, Max: 10 pts):**
   - Word count in optimal window (40–120 words): $+4$
   - First-person pronouns avoided (`I`, `me`, `my`): $+3$
   - At least one technical domain and one quantifiable achievement cited: $+3$
3. **Bullet Quality ($C_3$, Max: 20 pts):**
   - Evaluated as:
     $$C_3 = 20 \times \left(0.40 \times \frac{N_{\text{strong verb}}}{N_{\text{total}}} + 0.40 \times \frac{N_{\text{metric}}}{N_{\text{total}}} + 0.20 \times \frac{N_{\text{tech/deliverable}}}{N_{\text{total}}}\right)$$
4. **Skill Structure ($C_4$, Max: 15 pts):**
   - Total skill count in optimal band (15–30 skills): $+6$ (Deducts $2$ pts if $<10$ or $>40$)
   - Category grouping present (e.g., Languages, Frameworks, Cloud, Databases): $+4$
   - Required core role coverage $\ge 70\%$: $+5$
5. **Education Detail ($C_5$, Max: 5 pts):**
   - Degree, major, institution, and graduation year verified: $+5$ (Deducts $2$ pts if graduation year missing).
6. **Projects & Proof Links ($C_6$, Max: 8 pts):**
   - At least 2 projects with verifiable links (GitHub, live demo, production URL, portfolio): $+8$ (Only 1 project or text-only descriptions: $+4$).
7. **Certifications & Continuous Learning ($C_7$, Max: 5 pts):**
   - Verifiable role-relevant certification (e.g., AWS Certified Developer, CKAD, CFA Level 1): $+5$ (None: $0$).
8. **ATS Parseability ($C_8$, Max: 10 pts):**
   - Single-column layout verified: $+3$
   - Standard semantic section headers: $+3$
   - Zero embedded raster images or text rendered inside graphical shapes: $+2$
   - Clean UTF-8 text extraction with zero corrupt character artifacts: $+2$
9. **Platform Consistency ($C_9$, Max: 10 pts):**
   - Title alignment between resume and public profile: $+4$
   - Experience date alignment within 30 days: $+3$
   - Primary skill set parity: $+3$
10. **Contact Credibility ($C_{10}$, Max: 5 pts):**
    - Professional email address (no aliases/nicknames): $+2$
    - Valid Indian mobile number (+91): $+1$
    - LinkedIn public profile URL provided: $+1$
    - City and state identified: $+1$

### 7.3 Visibility Score Formula (Max: 100 pts)
$$\text{Score}_{\text{Visibility}} = \sum_{j=1}^{6} (V_j \times W_j)$$

| Component ($V_j$) | Weight ($W_j$) | Calculation Logic |
|---|---|---|
| **Keyword Matchability** | **0.25** | Percentage of top-20 searched role keywords present in searchable fields (Headline, Summary, Skills, Bullets): $\frac{\text{Keywords Found}}{20} \times 100$ |
| **Search-Filter Pass Rate** | **0.20** | Percentage of standard portal hard filters satisfied (YOE bracket, exact location match, notice period declaration, education threshold). |
| **First-6-Second Impression** | **0.20** | Weighted glance rubric: Headline clarity ($40\%$), latest job title credibility ($30\%$), first bullet verb strength ($30\%$). |
| **Skill Differentiation** | **0.15** | Ratio of booster skills (e.g., `Kafka`, `Docker`, `System Design`) to common generic noise skills (e.g., `Communication`, `MS Word`, `Teamwork`). |
| **Recency Signals** | **0.10** | Employment end date is current/active or within 90 days ($100$), within 180 days ($70$), $> 180$ days ($30$). |
| **Proof Points** | **0.10** | Ratio of bullet points containing verified external evidence (URLs, metrics, dollar/rupee amounts, patents, published papers). |

### 7.4 Job Fit Match & Rejection Probability Formulas
- **Job Fit Match Score (0–100%):**
  $$\text{MatchScore} = 0.40(\text{Skill}) + 0.25(\text{Experience}) + 0.15(\text{Location}) + 0.10(\text{Salary}) + 0.10(\text{Education})$$
- **Rejection Probability:**
  $$\text{RejectionRisk} = \text{clamp}\left(1.0 - \left(\frac{\text{MatchScore}}{100} \times (1.0 - \sum \text{RiskFlags})\right), 0.05, 0.95\right)$$
  - *Risk Flags:*
    - Missing Hard Filter Skill: $-0.25$
    - Experience deficit $> 2$ years: $-0.30$
    - Notice period mismatch ($> 60$ days when immediate required): $-0.20$
    - Unexplained employment gap $> 12$ months: $-0.15$

---

## 8. Rewrite Engine Rules (Deterministic & Explainable)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REWRITE ENGINE PIPELINE                         │
├───────────────┬────────────────┬───────────────┬───────────────────────┤
│ 1. Intent     │ 2. Issue       │ 3. Template   │ 4. Slot Injection &   │
│ Classification│ Detection      │ Selection     │ Guardrail Check       │
├───────────────┼────────────────┼───────────────┼───────────────────────┤
│ 8 Curated     │ 9 Friction     │ 24 Structural │ Extract numbers; lock │
│ Action Classes│ Heuristics     │ Archetypes    │ fabricated metrics    │
└───────────────┴────────────────┴───────────────┴───────────────────────┘
```

### 8.1 Pipeline Architecture
The rewrite engine is strictly deterministic and template-grounded. It operates across four sequential stages:
1. **Intent Classification:** Maps original bullet text to one of 8 primary action intents: `built`, `led`, `improved`, `managed`, `sold`, `taught`, `supported`, `analyzed`.
2. **Friction Issue Detection:** Flags active recruiter barriers: `passive`, `no-verb`, `no-metric`, `vague-object`, `first-person`, `too-short`, `too-long`, `weak-verb`, `cliche`.
3. **Template Selection:** Selects verified syntax structures matching the classified intent across 3 distinct levels: `SAFE`, `METRIC`, and `IMPACT`.
4. **Slot Filling & Fabrication Filtering:** Fills template slots with extracted technologies, deliverables, and metrics.

### 8.2 Power Verb Library per Intent
- **built:** `Architected`, `Engineered`, `Developed`, `Shipped`, `Delivered`, `Implemented`, `Deployed`, `Launched`, `Designed`, `Constructed`.
- **led:** `Orchestrated`, `Spearheaded`, `Directed`, `Headed`, `Supervised`, `Mobilized`, `Guided`, `Steered`.
- **improved:** `Optimized`, `Streamlined`, `Accelerated`, `Refactored`, `Scaled`, `Elevated`, `Revamped`, `Decentralized`.
- **managed:** `Administered`, `Maintained`, `Governed`, `Oversaw`, `Operated`, `Controlled`, `Standardized`.
- **sold:** `Generated`, `Negotiated`, `Acquired`, `Closed`, `Expanded`, `Secured`, `Maximized`.
- **taught:** `Mentored`, `Onboarded`, `Trained`, `Coached`, `Instructed`, `Upskilled`, `Facilitated`.
- **supported:** `Collaborated`, `Partnered`, `Contributed`, `Assisted`, `Enabled`, `Sustained`.
- **analyzed:** `Evaluated`, `Investigated`, `Benchmarked`, `Audited`, `Modeled`, `Diagnosed`, `Identified`.

### 8.3 Metric Slot Extraction & Guardrail Constraints
- **Supported Metric Patterns:** Percentage (`%`), Time (`ms`, `days`, `hours`), Money (`₹`, `INR`, `Lakh`, `Cr`, `$`), Scale (`req/sec`, `TPS`, `DAU`, `MAU`, `records`), Team size (`engineers`, `reps`, `members`).
- **The Zero-Hallucination Invariant:**
  - If the original input contains an existing metric, it is preserved and highlighted.
  - If the original bullet has **no metric**, the engine **never fabricates or guesses a number**.
  - Instead, the variant is generated with an explicit, interactive slot prompt:
    `"Engineered [technology] microservices, reducing API response time by [Insert your metric, e.g., 35%]."`
  - The UI presents an inline number input box. Until the user inputs their real verified number, the slot remains visually highlighted as a placeholder.

### 8.4 Deterministic Reason Strings
Every generated rewrite variant returns a deterministic rationale explaining the exact recruiter psychology behind the change:
- *SAFE Variant:* `"100% faithful to your original facts. Replaces passive language with active engineering verbs to establish clear individual ownership."`
- *METRIC Variant:* `"Surfaces measurable proof of impact. Proven to increase recruiter shortlists by 4x across Indian technical screens."`
- *IMPACT Variant:* `"Positions you at a Senior / SDE-2 tier by framing work around business reliability, system availability, and architectural scale."`

---

## 9. Data Model & Schema Architecture

```
┌─────────────────┐       1:N       ┌─────────────────────┐
│     users       ├─────────────────┤      profiles       │
│  (Supabase Auth)│                 │   (Parsed Data)     │
└────────┬────────┘                 └──────────┬──────────┘
         │ 1:N                                 │ 1:N
┌────────┴────────┐                 ┌──────────┴──────────┐
│  user_consents  │                 │      analyses       │
│ (DPDP Audit Log)│                 │  (10 Component JSON)│
└─────────────────┘                 └──────────┬──────────┘
                                               │ 1:N
                                    ┌──────────┴──────────┐
                                    │      rewrites       │
                                    │ (Variants + Audits) │
                                    └─────────────────────┘
```

The data architecture operates on a PostgreSQL relational engine managed via Drizzle ORM and Supabase.

### 9.1 Core Database Tables

```sql
-- 1. USERS: Optional authenticated identity tier
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES: Master profile record
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_token_hash TEXT,             -- Hashed session token for anonymous M2 users
  target_role_id TEXT NOT NULL,      -- Foreign key to static role dictionary
  experience_band TEXT NOT NULL,     -- '0-1', '1-3', '3-5', '5-8', '8+'
  city_tier TEXT DEFAULT 'metro',    -- 'metro' | 'tier1' | 'tier2' | 'tier3'
  parsed_data JSONB NOT NULL,        -- Structured ParsedProfile object
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,   -- M2: NOW() + 24h; M3: NOW() + 90d
  deleted_at TIMESTAMPTZ             -- Soft delete flag
);

-- 3. ANALYSES: Complete audit run outputs
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completeness_score INTEGER NOT NULL,
  visibility_score INTEGER NOT NULL,
  glance_verdict TEXT NOT NULL,       -- 'pass' | 'skip'
  components_breakdown JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REWRITES: Bullet optimization records
CREATE TABLE rewrites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  original_bullet TEXT NOT NULL,
  detected_intent TEXT NOT NULL,
  detected_issues TEXT[] NOT NULL,
  variants JSONB NOT NULL,           -- Array of {level, text, reason, requiresInput}
  user_slots JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',     -- 'pending' | 'accepted' | 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. JOB_FITS: Job description match sessions
CREATE TABLE job_fits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  jd_text_hash TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  breakdown JSONB NOT NULL,
  rejection_probability NUMERIC(4,3) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SCORE_HISTORY: Progressive iteration telemetry
CREATE TABLE score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completeness_score INTEGER NOT NULL,
  visibility_score INTEGER NOT NULL,
  action_trigger TEXT NOT NULL,       -- 'initial' | 'rewrite_accepted' | 'keyword_added'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER_CONSENTS: Legal audit log (DPDP Act 2023)
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_token_hash TEXT,
  scope TEXT NOT NULL,               -- 'ai_processing' | 'analytics' | 'retention'
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  version TEXT NOT NULL              -- Consent agreement text version (e.g. 'v1.0')
);

-- 8. AUDIT_LOG: Immutable security log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_hash TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9.2 Data Retention & Tier Definitions
- **M0 (Client Ephemeral):** Browser React state, unsubmitted files, modal states. Never leaves client memory.
- **M1 (Working Cache):** In-memory Redis store with strict TTLs (1h for analysis JSON, 24h for job fit calculations, 30 days for SHA-256 AI rewrite caches).
- **M2 (Anonymous Guest Profiles):** Bound to an opaque guest token with a hard **24-hour auto-purge TTL** executed via automated database cron.
- **M3 (Registered Accounts):** Account records retained for **90 days** of user inactivity, with 1-click permanent cascade deletion.
- **M4 (Aggregated Benchmarks):** Anonymized, $k$-anonymous records ($k \ge 20$) stripped of personal identifiers, retained for market benchmark calculations.
- **M5 (Static Reference Dictionaries):** Version-controlled code artifacts (`lib/data/`) representing skill sets and role taxonomies.

---

## 10. Privacy, Security & DPDP Compliance

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DPDP ACT 2023 COMPLIANCE                        │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┤
│ Consent First   │ Data Minimization│ Automated Purge │ User Forget     │
│ Default OFF for │ Single bullet only│ 24h Anonymous  │ 1-Click Cascade │
│ AI processing   │ sent to LLMs     │ Cron Execution  │ Erasure         │
└─────────────────┴──────────────────┴─────────────────┴─────────────────┘
```

### 10.1 India DPDP Act 2023 Legal Alignment
1. **Explicit Notice & Purpose Limitation:** Before uploading any resume or pasting text, the user must view an unbundled privacy modal explaining the precise scope of processing. Personal data is utilized exclusively for diagnostic scoring and resume improvement.
2. **Data Minimization:** No personal data is requested beyond what is contained on the resume. For optional AI polishing, **only the single bullet point and the target role title are transmitted**. Names, phone numbers, email addresses, employers, and college names are strictly omitted.
3. **No Training on User Data:** User resumes, bullet points, and profile data are **contractually prohibited** from being used to train internal or third-party AI/LLM models. This is enforced through zero-data-retention API agreements with upstream providers.
4. **Automated 24-Hour Purge for Guests:** Guest sessions auto-delete 24 hours post-creation via automated server cron (`/api/cron/purge`).
5. **The Forget Path (Right to Erasure):** A user can click "Delete My Data" in Settings or trigger `DELETE /api/profiles/[id]`. The system executes a permanent cascade delete across the database and invalidates all associated M1 Redis cache keys within 1,000 milliseconds.

### 10.2 Technical Security Standards
- **Zero Raw Text in Logs:** Application logs pass through a PII scrubber (`lib/security/redact.ts`) that strips `rawText`, `resumeText`, `jdText`, `prompt`, and masks email addresses (`h***@domain.com`) and phone numbers (`***3210`).
- **SSRF Defense:** URL import employs `safeFetch` with a domain allowlist (`naukri.com`, `linkedin.com`), blocks private IP ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `169.254.169.254`), enforces port 443, and disables automatic redirects.
- **Rate Limiting:** Sliding-window rate limiters enforce 30 requests/hour per IP for analysis and AI endpoints.
- **Strict Content Security Policy (CSP):** Prohibits inline script execution from unauthorized origins, blocks framing (`X-Frame-Options: DENY`), and enforces HTTPS transport (`Strict-Transport-Security: max-age=63072000`).

---

## 11. Success Metrics & Analytics Event Taxonomy

### 11.1 North Star Metric
$$\text{North Star Metric} = \text{Monthly Profiles Optimized to Competitive Tier } (\text{Score } \ge 71)$$
*Measures actual user outcome achievement rather than shallow page visits.*

### 11.2 Supporting Metrics Hierarchy
1. **Import Conversion:** $\ge 68\%$ of landing page visitors who click "Analyze Resume" complete an import.
2. **Analysis Completion:** $\ge 95\%$ of imported resumes successfully parse and generate scores in $< 60$ seconds.
3. **Glance Simulation Engagement:** $\ge 72\%$ of users play the full 6-second recruiter simulation.
4. **Action Plan Initiation:** $\ge 55\%$ of users check off at least one Day-1 action task within 24 hours.
5. **Rewrite Adoption:** $\ge 40\%$ of users accept at least one rewritten bullet into their active profile.
6. **Score Lift Velocity:** Average profile score increases by $\ge 15$ points within the first session.
7. **Export Rate:** $\ge 35\%$ of analyzed users download the ATS-friendly PDF or copy-paste optimized platform blocks.
8. **Viral Card Shares:** $\ge 8\%$ of users with scores $\ge 71$ generate and download a Shareable Score Card.
9. **Supporter Conversion:** $6\text{--}9\%$ of active users voluntarily contribute via the Supporter tier.
10. **Day-30 Contact Lift:** $\ge 30\%$ of surveyed returning users report increased recruiter outreach.

### 11.3 Analytics Event Schema
All telemetry events are structured and PII-redacted before ingestion:

| Event Name | Trigger Condition | Key Event Properties |
|---|---|---|
| `resume_uploaded` | User drops or selects a file | `file_type: 'pdf'\|'docx'`, `file_size_kb: number`, `source: 'upload'` |
| `profile_url_submitted`| User submits external URL | `platform: 'naukri'\|'linkedin'`, `url_domain: string` |
| `analysis_completed` | Engine finishes scoring | `completeness_score: number`, `visibility_score: number`, `duration_ms: number`, `role: string` |
| `recruiter_view_opened`| Recruiter simulation opened | `persona: 'founder'\|'ta'\|'agency'\|'screener'`, `skip_verdict: boolean` |
| `keyword_added` | User clicks to add keyword | `keyword_name: string`, `category: 'must-have'\|'booster'`, `role: string` |
| `rewrite_accepted` | User accepts bullet rewrite | `intent: string`, `level: 'safe'\|'metric'\|'impact'`, `had_custom_metric: boolean` |
| `rewrite_rejected` | User discards suggested bullet| `intent: string`, `reason_code: string` |
| `job_fit_analyzed` | User runs JD comparison | `match_score: number`, `missing_skills_count: number`, `rejection_prob: number` |
| `action_task_completed`| User ticks action checklist | `day_bucket: 'day1'\|'day2'\|'day3-4'\|'week2'`, `point_gain: number` |
| `score_card_downloaded`| User exports social image | `theme: 'sunset'\|'ocean'\|'forest'\|'mono'`, `aspect_ratio: '1:1'\|'4:5'\|'9:16'` |
| `profile_exported` | User downloads ATS resume | `format: 'pdf'\|'naukri_blocks'\|'linkedin_blocks'`, `final_score: number` |

---

## 12. Competitive Landscape

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPETITIVE MATRIX                              │
├─────────────────────┬───────────┬───────────┬───────────┬──────────────┤
│ Solution            │ ATS Check │ 6-Sec Sim │ India Tax │ Free Access  │
├─────────────────────┼───────────┼───────────┼───────────┼──────────────┤
│ Naukri Profile Opt. │ Yes (Free)│ Yes (Free)│ Yes (100%)│ 100% Free    │
│ Resume Worded       │ Partial   │ No        │ No        │ ₹1,500/mo    │
│ Jobscan             │ Yes       │ No        │ No        │ ₹1,800/mo    │
│ Naukri Profile Meter│ Basic     │ No        │ Platform  │ Locked to Web│
│ Kickresume / Zety   │ Basic     │ No        │ No        │ Paywalled    │
└─────────────────────┴───────────┴───────────┴───────────┴──────────────┘
```

| Competitor | Primary Focus | ATS Check | Recruiter Sim | Keyword Intel | Multi-Platform | India-Specific Taxonomy | Action Plan | Free Tier | Pricing Model |
|---|---|---|---|---|---|---|---|---|---|
| **Naukri Profile Optimizer** | **India Recruiter Sim & ATS** | **Yes** | **Yes (4 Personas)** | **Yes (Naukri Volumes)** | **Yes (Naukri+LI)** | **Yes (Lakhs, Hubs, Service-to-Product)** | **Yes (7-Day)** | **100% Free** | **Free Forever** |
| **Resume Worded** | US Executive Resumes | Yes | No | Generic US | No | No | Basic | Severely Limited | $49/mo (₹4,100) |
| **Jobscan** | ATS Keyword Matcher | Yes | No | Hardcoded | No | No | Task list | 5 scans only | $49.95/mo (₹4,200) |
| **Kickresume** | Visual Template Builder | Basic | No | Basic | No | No | No | 1 template | $19/mo (₹1,600) |
| **Zety** | Template Builder | Basic | No | Basic | No | No | No | Paywalled at download | ₹199 to ₹2,499 |
| **Rezi** | AI ATS Resume Writer | Yes | No | Basic | No | No | No | 1 resume free | $29/mo (₹2,400) |
| **Teal** | Job Tracker & Builder | Basic | No | Keyword lists | LinkedIn only | No | No | Limited | $29/mo (₹2,400) |
| **Huntr** | Application Tracker | Basic | No | Generic | No | No | No | Limited | $40/mo (₹3,300) |
| **Enhancv** | Visual Resume Design | Low | No | Basic | No | No | No | Paywalled | $24.99/mo (₹2,100) |
| **Hiration** | AI Resume Builder | Yes | No | General US | LinkedIn only | Minimal | Basic | Limited | ₹1,499/quarter |
| **Naukri FastForward**| Human Reviewer Agency | No | No | Manual | Naukri only | Yes | None | Paid only | ₹1,200 to ₹5,500 |

### 12.1 Strategic Differentiation Summary
1. **Built for Indian Recruiter Dynamics:** Understands service-to-product transitions (TCS/Infosys $\rightarrow$ Swiggy/Flipkart), Indian compensation structures (LPA, Fixed vs. Variable, ₹ Cr ARR), and multi-city relocation realities.
2. **True 6-Second Glance Simulation:** We do not simply count keywords; we visually show candidates how recruiters scan their resumes and why they get skipped.
3. **Deterministic Zero-Hallucination Integrity:** Free of fabricated metrics; every rewrite is explainable and verified.
4. **Zero Financial Friction:** 100% free with no credit card requirement, leveling the playing field for tier-2/3 college freshers.

---

## 13. Phased Release Plan

### 13.1 Phase 0: Validation & Core Calibration (Weeks 1–2)
- **Scope:** 10 core role dictionaries (Backend, Fullstack, Frontend, Data Engineer, DevOps, QA Automation, Data Analyst, Product Manager, Performance Marketing, Sales/BD).
- **Target Audience:** 12 curated beta testers from `r/developersIndia` and regional college placement WhatsApp groups.
- **Verification Gates:** 100% deterministic test coverage, parser accuracy $> 90\%$ on diverse PDF formats, zero fabrication in bullet generation.

### 13.2 Phase 1: Public MVP Launch (Weeks 3–8)
- **Scope:** 25 curated roles, public URL import for Naukri and LinkedIn, interactive 7-Day Action Plan, Shareable Social Cards, production deployment on Vercel Edge with Supabase backend.
- **Acquisition Target:** 15,000 unique analyzed profiles; zero paid marketing spend.

### 13.3 Phase 2: Community & Campus Expansion (Weeks 9–16)
- **Scope:** 100 role dictionaries, peer benchmark seeding across 6 metro zones, college placement cell pilots (3 institutional partnerships in Pune and Jaipur), creator outreach on LinkedIn India.
- **Target:** 50,000 monthly analyzed profiles; Week-4 retention $\ge 40\%$.

### 13.4 Phase 3: Ecosystem Maturity (Months 5–12)
- **Scope:** Regional UI localization (Hindi, Tamil, Telugu), non-tech role expansion (Supply Chain, Retail Operations, Legal, Banking Ops), read-only B2B Placement Cell analytics dashboard for universities.
- **Target:** 100,000 monthly active profile analyses; positive net operating income via optional community supporter contributions.

---

## 14. Risks & Mitigations

| Risk Factor | Severity | Probability | Mitigation Strategy |
|---|---|---|---|
| **Public Profile Scraping Blocks** | High | High | Implement graceful client-side text-paste fallback; provide transparent copy-paste guide for users when anti-bot barriers block automated URL scraping. |
| **Generic Template Advice** | High | Low | Hardcode strict role-specific syntax dictionaries, domain metric nouns, and mandatory slot requirements rather than relying on ungrounded generative LLMs. |
| **Prediction Overclaiming** | High | Medium | Explicitly label Rejection Predictor outputs as probabilistic risk simulations rather than certified hiring decisions; display confidence intervals. |
| **Thin Early Benchmark Data** | Medium | High | Seed baseline reference datasets ($N \ge 1,200$ per band) derived from verified public Indian compensation reports and open hiring datasets; enforce $k$-anonymity ($k \ge 20$). |
| **User Expectation of Auto-Apply** | Medium | High | Display explicit system boundary disclosures on landing and export screens: *"We are an optimization engine, not an automated application bot."* |
| **DPDP Compliance Scrutiny** | High | Low | Implement automated 24-hour purge cron for anonymous sessions, explicit consent gating, complete user forget path, and zero LLM training clauses. |
| **Competitor Copying** | Medium | Medium | Maintain defensibility through the depth of proprietary Indian role keyword dictionaries, local search volume disclosures, and community viral loops via social scorecards. |

---

## 15. Open Product Questions

| # | Open Product Question | Owner | Resolution Deadline |
|---|---|---|---|
| **OPQ-1** | Should we allow users to compare their resume against multiple job descriptions simultaneously in v1? | Product Lead | Week 3 |
| **OPQ-2** | What is the optimal character threshold for the raw text paste area to prevent browser thread locking on mobile devices? | Frontend Lead | Week 2 |
| **OPQ-3** | Should voluntary supporter contributions offer minor cosmetic perks (e.g., custom card themes) without violating our core 100% free promise? | Design / Growth | Week 4 |
| **OPQ-4** | What fallback heuristic should be applied if pdf.js encounters a scanned image PDF with zero extractable text? | Parser Engineer | Week 2 |
| **OPQ-5** | How frequently should the static search volume estimates for Naukri keywords be refreshed? | Data Curator | Week 6 |
| **OPQ-6** | Should we support direct Word (.doc older binary format) or restrict strictly to modern .docx and .pdf? | Core Engineer | Week 1 |
| **OPQ-7** | What is the legal threshold under DPDP Act 2023 for retaining aggregated peer benchmarks derived from user profiles? | Legal Counsel | Week 3 |
| **OPQ-8** | Should we allow users to manually customize the recruiter scan duration (e.g., 3s, 6s, 10s) in the simulation? | UX Designer | Week 4 |
| **OPQ-9** | Which regional payment gateway (Razorpay / Cashfree / UPI QR) provides the lowest transaction fee for voluntary micro-contributions? | Finance / Ops | Week 5 |
| **OPQ-10**| Should college placement cell pilots be provided with batch CSV export capabilities for cohort tracking? | Partnership Lead | Week 8 |

---

## 16. Appendices

### Appendix A: Component Rubrics Table

| Component | Target Metric | High Performance Rubric (Good) | Failing Rubric (Bad) |
|---|---|---|---|
| **Headline** | Relevance & Clarity | Contains target role, primary technology/skill, and YOE anchor | Generic statement (e.g., *"Looking for challenging opportunities"* or *"Software Engineer"*) |
| **Summary** | Professional Context | 40–120 words, 0 first-person pronouns, highlights technical scale | Missing entirely, $> 150$ words, or filled with personal adjectives (*"hardworking, passionate"*) |
| **Experience Bullets**| Action & Metric Density | Starts with strong power verb, includes numerical outcome, names tool/system | Passive voice (*"Responsible for"*), zero numbers, vague scope |
| **Skills Section** | Discoverability & Structure | 15–30 skills organized into clear semantic categories (Languages, Tools, DBs) | Unsorted list with $> 40$ skills or $< 8$ skills; mixes basic software with core engineering |
| **ATS Parseability** | Mechanical Machine Read | Valid single-column layout, standard headers, fully extractable UTF-8 text | Multi-column tables, text embedded in canvas/shapes, non-standard custom section names |

---

### Appendix B: 10 Curated Role Taxonomies (v1 Seed)

1. **Backend Engineer:**
   - *Core Filter Skills:* Java, Python, Go, Node.js, Spring Boot, Microservices, REST APIs, SQL.
   - *Booster Skills:* Kafka, Redis, Docker, Kubernetes, AWS, System Design, gRPC.
   - *Distractors:* MS Office, Eclipse, HTML Basics, C++ Turbo.
2. **Frontend Engineer:**
   - *Core Filter Skills:* JavaScript, TypeScript, React, Next.js, HTML5, CSS3, Redux/Zustand.
   - *Booster Skills:* Webpack, Vite, Tailwind CSS, Web Vitals, GraphQL, Jest, Cypress.
   - *Distractors:* Photoshop, CorelDraw, PHP 4, Notepad++.
3. **Full Stack Developer:**
   - *Core Filter Skills:* React/Angular, Node.js/Java/Python, REST APIs, PostgreSQL/MongoDB, Git.
   - *Booster Skills:* Docker, CI/CD, Next.js, AWS/GCP, Microfrontends, Redis.
   - *Distractors:* Dreamweaver, Data Entry, Turbo C.
4. **Data Engineer:**
   - *Core Filter Skills:* Python, SQL, Apache Spark, Airflow, ETL Pipelines, Data Warehousing.
   - *Booster Skills:* Snowflake, Databricks, Kafka, dbt, BigQuery, AWS Glue, PySpark.
   - *Distractors:* Basic Excel, Data Entry, Access DB.
5. **DevOps / Cloud Engineer:**
   - *Core Filter Skills:* Linux, Docker, Kubernetes, AWS/Azure, CI/CD (GitHub Actions/Jenkins), Terraform.
   - *Booster Skills:* Helm, Prometheus, Grafana, Ansible, ArgoCD, Site Reliability Engineering (SRE).
   - *Distractors:* Desktop Support, Hardware Maintenance, LAN Troubleshooting.
6. **QA Automation Engineer:**
   - *Core Filter Skills:* Selenium, Cypress, Playwright, Java/Python/JavaScript, TestNG, API Testing.
   - *Booster Skills:* RestAssured, Performance Testing (JMeter), CI/CD Integration, Docker.
   - *Distractors:* Manual Testing Only, Excel Test Cases Only.
7. **Data Analyst:**
   - *Core Filter Skills:* SQL, Advanced Excel, PowerBI / Tableau, Python (Pandas/NumPy), Data Cleaning.
   - *Booster Skills:* Statistical Modeling, A/B Testing, dbt, Looker, Business Case Formulation.
   - *Distractors:* Word Processing, Typing Speed, Tally.
8. **Product Manager:**
   - *Core Filter Skills:* Product Roadmap, PRD Authoring, Agile/Scrum, User Stories, Product Analytics (Mixpanel/Amplitude).
   - *Booster Skills:* SQL, Growth Strategy, A/B Testing, System Architecture Understanding, Wireframing.
   - *Distractors:* Project Management Only, Attendance Tracking, JIRA Admin Only.
9. **Performance Marketing Specialist:**
   - *Core Filter Skills:* Meta Ads Manager, Google Ads, CAC/ROAS Optimization, Google Analytics (GA4), Search Engine Optimization.
   - *Booster Skills:* SQL, CRO (Conversion Rate Optimization), Retention Marketing, AppsFlyer, Attribution Modeling.
   - *Distractors:* Social Media Posting, Poster Design, Canva.
10. **Sales / Business Development Representative:**
    - *Core Filter Skills:* Lead Generation, Cold Calling, Pipeline Management, B2B Sales, CRM (Salesforce/HubSpot).
    - *Booster Skills:* Enterprise Deal Closing, Contract Negotiation, Account-Based Marketing (ABM), Inbound Qualification.
    - *Distractors:* Retail Cash Handling, Brochure Distribution.

---

### Appendix C: Resume Parsing Edge Cases & Handling

1. **Two-Column PDF Layouts:**
   - *Symptom:* Text extracted horizontally across columns, interleaving job titles with education history.
   - *Resolution:* Spatial bounding box clustering groups text into vertical columns based on horizontal coordinates before line assembly.
2. **Date Extraction Ambiguity:**
   - *Symptom:* Indian date variations (`06/2021`, `June 2021`, `2021-Present`, `21-current`).
   - *Resolution:* Normalized via regex matching month-year tokens into standardized ISO timestamps (`2021-06-01`).
3. **Indian Currency Representations:**
   - *Symptom:* Metrics expressed as `₹5L`, `Rs. 50 Lakhs`, `2.5 Cr`, `25,00,000 INR`.
   - *Resolution:* Currency normalization converts expressions into standardized Lakh/Crore and numeric representations for comparison.
4. **Scanned Images inside PDF:**
   - *Symptom:* File uploaded contains zero raw text characters.
   - *Resolution:* Triggers OCR fallback alert notifying the candidate that their resume is unparseable by enterprise ATS software and providing 1-click single-column text generation.

---

### Appendix D: Social Share Card Copy Deck

- **LinkedIn Post Copy Variant:**
  > *"I just scanned my resume through the Naukri Profile Optimizer. Discovered my Visibility Score was 48/100 because my bullets had 0 quantifiable metrics and I was missing 4 critical filter keywords for Backend roles.*
  > 
  > *Fixed the top 3 action items and improved my visibility score to 82/100. Check how recruiters actually see your profile (100% free, no sign-up needed): [https://naukri-optimizer.in]*"

- **Twitter / X Copy Variant:**
  > *"Most recruiters skip your resume in 6 seconds because of missing keywords and vague bullets. Scanned mine on Naukri Profile Optimizer and got a full breakdown in 60s. Completely free: [https://naukri-optimizer.in]"*

- **WhatsApp Share Snippet:**
  > *"Hey, check this out before applying for jobs: [https://naukri-optimizer.in] — gives you a free 6-second recruiter glance test and tells you exactly which keywords are missing from your resume."*

---

### Appendix E: Glossary

- **ATS (Applicant Tracking System):** Enterprise software (e.g., Taleo, Workday, Greenhouse) used by employers to parse, filter, and score candidate resumes before human recruiter review.
- **Boolean Search:** Precise query syntax utilizing `AND`, `OR`, `NOT`, and quotation marks used by recruiters on Naukri Resdex and LinkedIn Recruiter to isolate candidate pools.
- **Completeness Score:** Diagnostic measuring how thoroughly a profile supplies all professional information categories required for screening.
- **DPDP Act 2023:** India's Digital Personal Data Protection Act, establishing statutory standards for digital personal data processing, consent, and user erasure rights.
- **Fabrication Filter:** Algorithmic verification ensuring that no AI-suggested rewrite invents or hallucinates figures, metrics, or technologies not present in the candidate's original text.
- **Glance Scan (6-Second Scan):** The preliminary, rapid ocular inspection performed by a recruiter to decide whether to shortlist or discard a candidate profile.
- **k-Anonymity:** Privacy constraint guaranteeing that any published benchmark data represents a minimum of $k \ge 20$ individual contributor profiles to prevent de-anonymization.
- **Naukri Resdex:** The recruiter-facing candidate search and resume database portal of Naukri.com, representing India's largest corporate resume search engine.
- **Visibility Score:** Predictive metric evaluating a candidate's likelihood of surfacing in top search result percentiles and passing recruiter glance filters.
