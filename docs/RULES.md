# Engine Rulebook: Naukri Profile Optimizer (RULES.md)

**Document Version:** 1.0.0  
**Status:** Canonical Source of Truth  
**Engine Architecture:** 100% Deterministic, Reproducible, and Explainable  
**Implementation Modules:** `lib/scoring/rules.ts`, `lib/rewriter/rules.ts`, `lib/jobfit/`, `lib/parser/`

---

## 1. Global Invariants

| Invariant ID | Name | Formal Invariant Specification |
|---|---|---|
| **R-GLOBAL-01** | **Mandatory Explainability** | No score, badge, verdict, or recommendation may ever be rendered without an accompanying human-readable explanation object containing `{ score, max, status, issue, fix, example }`. |
| **R-GLOBAL-02** | **Zero Third-Party Write** | The engine NEVER writes to, modifies, or automatically applies updates to any external job board, ATS, or social network (Naukri, LinkedIn, Foundit). Every change requires explicit user approval and manual copy/export. |
| **R-GLOBAL-03** | **Probabilistic Humility** | The engine NEVER guarantees employment outcomes, recruiter shortlists, or interview calls. All predictions are expressed as calibrated probability ranges with visible contributing heuristics. |
| **R-GLOBAL-04** | **Top-3 Factor Attribution** | Every prediction or ranking verdict (e.g., Rejection Risk, Job Fit) MUST disclose the top 3 contributing factors that mathematically produced the outcome. |
| **R-GLOBAL-05** | **AI Scoring Fire-wall** | Generative AI models (Google Gemini or any LLM) MUST NEVER contribute to, modify, or weight any numeric score. AI output is restricted to optional, opt-in phrasing suggestions verified through deterministic fabrication filters. |
| **R-GLOBAL-06** | **Gap Attribution** | Missing profile sections must never be silently omitted. The engine must report each missing section as an explicit gap with its exact potential point impact. |
| **R-GLOBAL-07** | **Tone & Localization** | All user-facing copy must use direct, candid Indian-English or Hinglish. Tone is that of an experienced, supportive senior engineering leader giving private feedback. No scolding, condescension, or empty buzzwords. |
| **R-GLOBAL-08** | **Strict Determinism** | Scoring must be completely idempotent: $\text{Engine}(\text{Resume}, \text{Config})_t \equiv \text{Engine}(\text{Resume}, \text{Config})_{t+n}$. Identical input under the same engine version yields identical numerical and textual outputs. |
| **R-GLOBAL-09** | **Bounded Weight Sum** | No individual component may score above its declared maximum weight, and the sum of maximum weights across all 10 completeness components must strictly equal 100. |
| **R-GLOBAL-10** | **Actionable Quantified ROI** | Every recommendation, fix, and action item MUST declare an estimated effort in minutes and a projected point gain. |

---

## 2. Headline Clarity Rules (Weight: 12)

```
Max Component Weight: 12 Points
Evaluation Target: Resume Header, Naukri Resume Headline, LinkedIn Headline
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **H-01** | Headline | Headline string is empty, null, or whitespace only | $0 / 12$ (Total) | Critical | "You have no headline. Recruiters see a blank line where your core value proposition should be." | "Add a structured headline combining your role, specialization, and top 3 tech skills." |
| **H-02** | Headline | Contains canonical target role token (e.g., 'Backend Engineer') | $+3$ pts | Pass | "Target role title clearly identified in headline." | "Keep target role title prominent in the first 4 words." |
| **H-03** | Headline | Contains recognized specialization (e.g., 'Fintech', 'Distributed Systems', 'Cloud', 'Growth') | $+3$ pts | Pass | "Specialization domain detected, differentiating you from generic candidates." | "Maintain domain focus to match specialized recruiter searches." |
| **H-04** | Headline | Contains 2 to 4 canonical skills separated by delimiter (`\|`, `•`, `/`, `,`) | $+3$ pts | Pass | "Headline features 2-4 core filter skills in high-visibility position." | "Ensure listed skills match your strongest primary stack." |
| **H-05** | Headline | Contains experience/seniority indicator ('3+ yrs', 'Fresher', '8 YOE') | $+2$ pts | Pass | "Experience bracket clearly signaled for automated recruiter tenure filtering." | "State your total experience clearly (e.g. '3.5 YOE' or 'Fresher')." |
| **H-06** | Headline | Contains scale or proof differentiator ('at scale', '₹X Cr', 'high-throughput', 'ex-') | $+1$ pt | Pass | "High-credibility scale differentiator present." | "Highlight system scale or commercial impact in 2-3 words." |
| **H-07** | Headline | Length exceeds platform character limits (Naukri $>80$, LinkedIn $>120$, Resume $>60$) | $-1$ pt | Warning | "Headline exceeds optimal length for {platform} ({currentLen}/{maxLen} chars)." | "Trim headline to under {maxLen} characters to prevent recruiter mobile truncation." |
| **H-08** | Headline | Headline contains ONLY generic title with zero qualifiers (e.g., exactly 'Software Engineer') | Cap at $4 / 12$ | Warning | "Generic headline matches 50,000+ competitors. Recruiters skip unspecialized titles." | "Expand '{headline}' with your primary language, framework, and domain." |
| **H-09** | Headline | Contains self-deprecating or filler phrase ('looking for', 'seeking', 'passionate', 'aspiring', 'fresher with', 'hardworking') | $-2$ pts | High | "Headline uses passive filler phrase '{phrase}'. Signals low market demand." | "Remove '{phrase}' and replace with your verified technical capabilities and role title." |
| **H-10** | Headline | Opens with a first-person pronoun ('I am a...', 'I'm ...') | $-1$ pt | Warning | "First-person pronoun '{pronoun}' dilutes professional punch." | "Start directly with your role title (e.g., 'Backend Engineer \| Java...')." |
| **H-11** | Headline | Company name placed as the primary first token | $-1$ pt | Warning | "Company name occupies primary slot. Recruiters filter on capability first." | "Move company name to the end of your headline (e.g., 'SDE-2 \| Java... @ {company}')." |
| **H-12** | Headline | Contains duplicate keyword token (keyword stuffing) | $-1$ pt | Warning | "Keyword '{token}' is repeated twice. Keyword stuffing triggers recruiter penalty." | "Deduplicate '{token}' to free up character space for secondary booster skills." |

---

## 3. Summary / About Quality Rules (Weight: 10)

```
Max Component Weight: 10 Points
Evaluation Target: Resume Summary, LinkedIn About, Naukri Profile Summary
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **S-01** | Summary | Summary string is missing or $<10$ characters | $0 / 10$ (Total) | Critical | "Summary section is missing. Recruiters miss your career context and core narrative." | "Add a concise 3-4 sentence summary highlighting experience, stack, and top achievement." |
| **S-02** | Summary | Sentence count $\ge 3$ sentences | $+2$ pts | Pass | "Summary contains structured multi-sentence depth." | "Maintain 3-4 distinct sentences: Identity, Stack, and Peak Achievement." |
| **S-03** | Summary | Contains role-specific claim tied to years of experience | $+2$ pts | Pass | "Experience tenure anchored to specific technical discipline." | "State tenure explicitly (e.g. 'Software Engineer with 3+ years building distributed services')." |
| **S-04** | Summary | Contains at least one verified measurable outcome / metric | $+3$ pts | Pass | "Summary features quantifiable achievement, creating immediate recruiter credibility." | "Lead with your largest metric (e.g., 'driving 99.99% uptime' or 'scaling to 10k TPS')." |
| **S-05** | Summary | Contains 2+ core skills matching target role dictionary | $+1$ pt | Pass | "Target role keywords integrated naturally in summary narrative." | "Weave your top 2-3 technical proficiencies into the summary text." |
| **S-06** | Summary | Contains recognized domain/industry keyword (e.g. 'Fintech', 'SaaS', 'E-commerce') | $+1$ pt | Pass | "Industry domain identified, aiding targeted sector matching." | "Cite your primary domain vertical to attract sector-specific recruiters." |
| **S-07** | Summary | Opens with cliché intro ('I am a passionate', 'Highly motivated', 'With X years I am') | $-2$ pts | High | "Summary begins with generic filler '{phrase}'. Recruiters stop reading." | "Cut '{phrase}'. Begin directly with your professional title and engineering scope." |
| **S-08** | Summary | Contains zero first-person pronouns (`I`, `me`, `my`) | $+1$ pt | Pass | "Executive third-person framing adopted. Preferred by senior talent screeners." | "Eliminate remaining first-person pronouns for clean executive tone." |
| **S-09** | Summary | Total word count $< 40$ words | $-1$ pt | Warning | "Summary is too brief ({wordCount} words). Fails to provide sufficient signal." | "Expand summary to between 40 and 120 words with concrete context." |
| **S-10** | Summary | Total word count $> 250$ words | $-1$ pt | Warning | "Summary is too long ({wordCount} words). Recruiters skip walls of text." | "Condense summary to under 120 words. Move detailed project descriptions to Experience." |
| **S-11** | Summary | Contains desperate availability phrases ('immediately join', 'actively looking', 'any role') | $-1$ pt | Warning | "Phrase '{phrase}' signals weak demand, reducing your salary negotiation leverage." | "Replace '{phrase}' with official notice period status (e.g. '30-day notice period')." |

---

## 4. Experience Bullet Quality Rules (Weight: 20)

```
Formula:
BulletScore = min(20, round( (ActionVerbRate * 8) + (MetricRate * 8) + (SkillDensityRate * 4) ))
Where:
- ActionVerbRate   = QualifyingVerbsCount / TotalBulletsCount
- MetricRate       = QualifyingMetricsCount / TotalBulletsCount
- SkillDensityRate = QualifyingTechBulletsCount / TotalBulletsCount
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **B-01** | Bullets | Bullet opens with approved strong action verb from `verbs.ts` | Qualifies for Verb Rate ($8$ pts max) | Pass | "Bullet begins with decisive action verb '{verb}' demonstrating direct ownership." | "Begin all experience bullets with past-tense power verbs." |
| **B-02** | Bullets | Bullet opens with weak/passive verb ('Worked on', 'Helped in', 'Assisted', 'Involved in') | Disqualifies from Verb Rate | High | "Bullet begins with weak verb '{verb}'. Dilutes ownership and perceived seniority." | "Replace '{verb}' with a verified power verb (e.g. 'Architected', 'Engineered', 'Optimized')." |
| **B-03** | Bullets | Bullet contains verifiable numerical quantity (%, ₹, count, time saved, TPS) | Qualifies for Metric Rate ($8$ pts max) | Pass | "Quantifiable metric detected. Increases shortlisting probability by 4x." | "Add a measurable outcome to unquantified bullets using our metric prompts." |
| **B-04** | Bullets | Bullet references canonical technology or tool from target role dictionary | Qualifies for Skill Rate ($4$ pts max) | Pass | "Bullet grounds work in specific production technologies." | "Cite the exact languages, databases, and frameworks used to execute the task." |
| **B-05** | Bullets | Bullet has no object/context ($<5$ words following the action verb) | Flagged as Vague | High | "Bullet '{text}' is too brief. Fails to explain what was built or why." | "Expand bullet to state the action, the technology used, and the commercial deliverable." |
| **B-06** | Bullets | Bullet exceeds 35 words in length | Flagged as Long | Warning | "Bullet is overly long ({wordCount} words). Recruiters truncate sentences $>30$ words." | "Split into two concise bullets or cut filler phrases to keep under 25 words." |
| **B-07** | Bullets | Contains non-quantified vague qualifiers ('etc.', 'various', 'multiple', 'many', 'several') | Disqualifies from Metric Rate | Warning | "Bullet uses vague quantifier '{word}'. Lacks evidence of genuine impact." | "Replace '{word}' with exact counts (e.g. 'across 6 microservices' or 'for 12 enterprise clients')." |
| **B-08** | Bullets | Bullet formatted as passive responsibility ('Responsible for', 'Accountable for') | Flagged as Passive | High | "Bullet phrased as job description responsibility rather than an active achievement." | "Rewrite using the formula: [Power Verb] + [System/Feature] + [Measurable Outcome]." |
| **B-09** | Bullets | Bullet references recognized scale anchor ('10k users', '₹50L budget', 'at unicorn scale') | $+1$ Bonus to Metric Tier (cap 20) | Pass | "Bullet communicates enterprise production scale." | "Highlight traffic volume, financial scale, or user base where applicable." |
| **B-10** | Bullets | Experience entries order strongest metric-bearing bullets first | $+1$ Bonus to Component (cap 20) | Pass | "Lead bullet contains highest impact metric. Maximizes 6-second glance score." | "Move your strongest quantified bullet to the very top of each job experience." |

---

## 5. Skills Structure Rules (Weight: 15)

```
Max Component Weight: 15 Points
Evaluation Target: Skills Section, Key Skills Block, Core Competencies
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **K-01** | Skills | Skills section missing or empty | $0 / 15$ (Total) | Critical | "Skills section is completely absent. Recruiters cannot index your profile in boolean filters." | "Add a dedicated Skills section with 15-25 role-specific technologies." |
| **K-02** | Skills | Total skill count is in optimal recruiter scanning window ($12 \text{ to } 30$ skills) | $+5$ pts | Pass | "Optimal skill volume ({count} skills). Balances discoverability with credibility." | "Maintain between 15 and 25 core skills." |
| **K-03** | Skills | Total skill count $> 30$ skills (Skill List Bloat) | $+2$ pts (Warning) | Warning | "Profile has {count} skills. Excessive skills dilute your core expertise during 6-second scans." | "Prune lower-priority secondary skills to highlight your primary technical stack." |
| **K-04** | Skills | Total skill count $< 8$ skills | $+2$ pts (Warning) | Warning | "Only {count} skills listed. Falls below recruiter baseline expectations for {role}." | "Add missing core filter technologies and booster tools to reach at least 15 skills." |
| **K-05** | Skills | Skills organized into 2+ labeled categories (e.g. Languages, Frameworks, Cloud, Databases) | $+4$ pts | Pass | "Skills structured into clear semantic categories, accelerating recruiter comprehension." | "Group skills under clear headers: Languages, Frameworks, Databases, Tools & Cloud." |
| **K-06** | Skills | Contains $\ge 60\%$ of MUST-HAVE filter skills for target role | $+4$ pts | Pass | "Profile satisfies baseline must-have keyword filters for {role}." | "Add missing mandatory skills from the keyword gap audit table." |
| **K-07** | Skills | Contains $\ge 40\%$ of HIGH-VALUE booster skills for target role | $+2$ pts | Pass | "Profile includes high-value booster technologies, commanding higher salary tier." | "Incorporate differentiating booster skills (e.g. Kafka, Docker, Kubernetes)." |
| **K-08** | Skills | Contains NOISE / generic soft skill entry ('MS Office', 'Communication', 'Teamwork', 'Hardworking') | $-1$ pt per noise (cap $-3$) | High | "Found noise skill '{skill}'. Generic skills signal junior status on technical profiles." | "Delete '{skill}' immediately and replace with hard technical tools." |
| **K-09** | Skills | Skill listed in Skills section but never mentioned in any Experience bullet | Warning | Warning | "Skill '{skill}' is listed in skills block but never referenced in experience bullets." | "Ground '{skill}' by describing a specific feature or project where you used it." |
| **K-10** | Skills | No skill token repeated more than twice across skills block | $+2$ pts | Pass | "Clean skill taxonomy with zero keyword duplication." | "Deduplicate overlapping skill variants (e.g. keep 'Java', remove 'Core Java / J2EE')." |
| **K-11** | Skills | All listed skills are categorically relevant to target role | $+2$ pts | Pass | "High domain coherence across technical skill profile." | "Remove unrelated technologies from previous careers that distract from target role." |

---

## 6. Education Detail Rules (Weight: 5)

```
Max Component Weight: 5 Points
Evaluation Target: Education Section, Academic Qualifications
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **E-01** | Education | Education section missing entirely | $0 / 5$ (Total) | Critical | "Education credentials missing. Triggers immediate recruiter qualification filter rejection." | "Add degree title, institution name, and graduation year." |
| **E-02** | Education | Degree name verified against recognized standards (B.Tech, B.E., B.Sc, BCA, MCA, MBA, M.Tech) | $+2$ pts | Pass | "Degree credential recognized by standard ATS education parsers." | "Use standard degree acronyms (e.g., 'B.Tech in Computer Science')." |
| **E-03** | Education | Institution / University name present and verified | $+1$ pt | Pass | "University/College name identified." | "State full official university or college name." |
| **E-04** | Education | Graduation year or duration present in valid format (YYYY) | $+1$ pt | Pass | "Graduation year verified for recruiter cohort bracket checks." | "Include your graduation completion year (e.g. '2022')." |
| **E-05** | Education | CGPA / Percentage present and $\ge 7.0 \text{ CGPA}$ or $\ge 70\%$ | $+1$ pt | Pass | "Strong academic performance recorded, satisfying campus cut-off filters." | "Keep grade visible if $\ge 70\%$; omit if lower and YOE $\ge 2$ years." |
| **E-06** | Education | Education placed before Experience for candidates with $>2$ YOE | $-1$ pt | Warning | "Education is listed above Work Experience. Experienced engineers must lead with experience." | "Move Work Experience to the top of the resume, placing Education below it." |
| **E-07** | Education | Degree present but institution and year both missing | Warning | Warning | "Degree entry is incomplete (missing university name and year)." | "Provide complete college name and graduation year." |

---

## 7. Projects & Proof Rules (Weight: 8)

```
Max Component Weight: 8 Points
Evaluation Target: Projects Section, Portfolio, Open Source Contributions
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **P-01** | Projects | Projects section missing on fresher / $<2$ YOE profile | $0 / 8$ (Total) | High | "No projects listed. Essential proof of practical coding ability is missing." | "Add at least 2 technical projects featuring GitHub links and stack descriptions." |
| **P-02** | Projects | Project count $\ge 2$ distinct projects | $+3$ pts | Pass | "Multiple independent projects showcase sustained engineering initiative." | "Maintain 2-3 substantial projects rather than many small toy scripts." |
| **P-03** | Projects | At least one project contains a live verified URL (GitHub, deployed link, Play Store) | $+3$ pts | Pass | "Live proof link detected. Recruiter click-through rate increases by 65%." | "Add a working GitHub repository URL or live deployment link." |
| **P-04** | Projects | Project description details complete technology stack used | $+1$ pt | Pass | "Project stack explicitly declared." | "Specify frontend, backend, database, and cloud hosting tools for each project." |
| **P-05** | Projects | Project description cites scale, user count, or measurable performance outcome | $+1$ pt | Pass | "Project includes measurable outcome/scale indicator." | "Add user metrics (e.g. '500+ active users' or 'handles 1,000 requests/min')." |
| **P-06** | Projects | Project description is under 15 words | Warning | Warning | "Project description is too brief to demonstrate technical competence." | "Expand project description to 2-3 bullets covering Problem, Stack, and Outcome." |

---

## 8. Certifications Rules (Weight: 5)

```
Max Component Weight: 5 Points
Evaluation Target: Certifications, Licenses, Professional Accreditations
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **C-01** | Certifications | No certifications listed | $0 / 5$ (Total) | Info | "No professional certifications listed. (5 potential points available)." | "Add role-relevant certifications from recognized cloud or engineering providers." |
| **C-02** | Certifications | At least one certification listed | $+2$ pts | Pass | "Professional certification credential detected." | "Ensure certification name and completion year are accurate." |
| **C-03** | Certifications | Certification issued by recognized authority (AWS, GCP, Azure, Cisco, Oracle, CKA, IIT/IIM) | $+2$ pts | Pass | "Industry-recognized certification from premium credential authority." | "Prioritize tier-1 certifications (e.g. AWS Certified Solutions Architect)." |
| **C-04** | Certifications | Certification is directly relevant to target role | $+1$ pt | Pass | "Certification directly enhances technical credibility for target role." | "Align certifications with target tech stack." |
| **C-05** | Certifications | $>2$ certifications listed but none relevant to target role | Warning | Warning | "Listed certifications are unrelated to {role}. Creates signal dilution." | "Remove legacy or unrelated certifications to keep recruiter focus on target domain." |

---

## 9. ATS / Parseability Rules (Weight: 10)

```
Max Component Weight: 10 Points
Evaluation Target: PDF Layout, Machine Readability, Structural Formatting
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **A-01** | ATS Parse | File is clean text-based PDF/DOCX (not a scanned image) | $+4$ pts | Critical | "Document text is clean and machine-readable across all ATS engines." | "If scanned, re-export as native text PDF from Word or Google Docs." |
| **A-02** | ATS Parse | Single-column linear layout verified (no multi-column sidebars) | $+2$ pts | Pass | "Standard single-column layout verified. Prevents text interleaving errors." | "Avoid multi-column resume templates; use linear top-to-bottom layout." |
| **A-03** | ATS Parse | Standard semantic section headings detected (`Experience`, `Education`, `Skills`) | $+2$ pts | Pass | "Standard section headings recognized by ATS semantic parsers." | "Use canonical headings: 'Work Experience', 'Education', 'Skills', 'Projects'." |
| **A-04** | ATS Parse | Zero complex tables, embedded text frames, or vector graphic text | $+2$ pts | Pass | "Clean document object tree with zero text traps." | "Do not place text inside graphical callout boxes or nested tables." |
| **A-05** | ATS Parse | Professional file name format (e.g. `Firstname_Lastname_Resume.pdf`) | $+1$ pt | Pass | "Professional file naming convention observed." | "Rename file to '{name}_{role}_Resume.pdf' before submitting." |
| **A-06** | ATS Parse | Total extracted text length $\ge 250$ words | $+1$ pt | Pass | "Comprehensive text volume for complete ATS indexation." | "Ensure all resume sections are fully populated." |

---

## 10. Platform Consistency Rules (Weight: 10)

```
Max Component Weight: 10 Points
Condition: Applicable when 2+ platforms (Naukri, LinkedIn, Resume) are connected.
With only 1 source, component displays: "N/A (10 potential points available upon multi-platform sync)".
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **PC-01**| Consistency | Current job title is identical across all connected profiles | $+3$ pts | Pass | "Current job title is identical across Naukri, LinkedIn, and Resume." | "Synchronize current job title to match across all platforms." |
| **PC-02**| Consistency | Total years of experience matches within $\pm 6$ months across sources | $+2$ pts | Pass | "Career tenure and employment timeline match consistently." | "Align employment start and end dates across profiles." |
| **PC-03**| Consistency | Skill set overlap across platforms is $\ge 60\%$ | $+2$ pts | Pass | "High skill parity across public and private profiles." | "Copy your verified skills list to both Naukri Key Skills and LinkedIn." |
| **PC-04**| Consistency | Candidate name spelling is identical across all profiles | $+1$ pt | Pass | "Identity name spelling is consistent." | "Ensure identical first and last name spelling everywhere." |
| **PC-05**| Consistency | Location / City is consistent across platforms | $+1$ pt | Pass | "Location signals are synchronized." | "Update current city on both Naukri and LinkedIn." |
| **PC-06**| Consistency | Profile photo present and professional on digital platforms | $+1$ pt | Pass | "Professional profile photo detected." | "Upload a clean, high-resolution headshot." |
| **PC-07**| Consistency | Factual contradiction detected between profiles (e.g. different current company) | $-1$ pt per mismatch (cap $-3$) | High | "Contradiction found: '{val1}' on {p1} vs '{val2}' on {p2}. Destroys recruiter trust." | "Resolve contradiction immediately by updating {p1} to match verified facts." |

---

## 11. Contact Credibility Rules (Weight: 5)

```
Max Component Weight: 5 Points
Evaluation Target: Header Contact Information Block
```

| Rule ID | Component | Condition | Score Effect | Severity | Message Template | Fix Template |
|---|---|---|---|---|---|---|
| **CC-01**| Contact | Neither phone number nor email address detected | $0 / 5$ (Total) | Critical | "Zero contact methods found. Recruiters cannot reach you." | "Add your primary mobile number and professional email address." |
| **CC-02**| Contact | Professional email address format (no nicknames, gaming tags, or birth years) | $+2$ pts | Pass | "Professional email address verified." | "Use 'firstname.lastname@email.com' rather than handles like 'coolguy99@'." |
| **CC-03**| Contact | Valid 10-digit Indian mobile number (+91) present | $+1$ pt | Pass | "Valid Indian mobile contact number formatted correctly." | "Include mobile number in '+91 XXXXX XXXXX' format." |
| **CC-04**| Contact | LinkedIn public profile URL present and valid | $+1$ pt | Pass | "LinkedIn profile URL present." | "Include your custom LinkedIn profile link." |
| **CC-05**| Contact | GitHub, portfolio, or personal website link present | $+1$ pt | Pass | "Personal work link / GitHub profile present." | "Add your GitHub or portfolio link." |
| **CC-06**| Contact | Email address uses a corporate company domain for an active job search | Info / Note | Warning | "Using current company email. Some recruiters filter or flag workplace addresses." | "Switch contact address to a personal Gmail or Proton email." |

---

## 12. Visibility Score Engine & Persona Multipliers

```
Visibility Score (0-100) = ∑ (FactorScore_j * BaseWeight_j)
Base Factor Breakdown:
- V-01: Keyword Matchability    (25 Points)
- V-02: Search-Filter Pass Rate (20 Points)
- V-03: First-6-Second Glance   (20 Points)
- V-04: Skill Differentiation   (15 Points)
- V-05: Recency & Activity      (10 Points)
- V-06: Proof Points & Scale    (10 Points)
Total Base Weights: 100 Points
```

### 12.1 Visibility Factor Definitions

| Factor ID | Name | Weight | Evaluation Logic |
|---|---|---|---|
| **V-01** | **Keyword Matchability** | **25 pts** | Percentage of target role's top-20 searched keywords found in searchable fields (Headline + Skills + Bullets): $\frac{\text{Keywords Found}}{20} \times 25$. |
| **V-02** | **Search-Filter Pass Rate** | **20 pts** | Proportion of hard recruiter search filters satisfied (Experience band fit, location presence, notice period declaration, education threshold): $\text{Filters Passed} \times 5$. |
| **V-03** | **First-6-Second Impression**| **20 pts** | Composite glance scan score: Headline clarity ($40\%$), latest job title credibility ($35\%$), first bullet verb strength ($25\%$). |
| **V-04** | **Skill Differentiation** | **15 pts** | Ratio of high-value booster skills (e.g. `Kafka`, `Docker`, `Kubernetes`) to generic noise skills (e.g. `MS Word`, `Communication`). |
| **V-05** | **Recency & Activity** | **10 pts** | Profile freshness: Updated within 7 days ($+10$), within 30 days ($+6$), within 90 days ($+3$), older ($0$). |
| **V-06** | **Proof Points & Scale** | **10 pts** | Presence of external verifiable proof: live URLs, quantified metrics, patent/publication citations, and verified brand scale. |

### 12.2 Recruiter Persona Multiplier Matrix
Each persona supplies a normalized weight multiplier vector $\mathbf{w}_p \in \mathbb{R}^6$ to calculate the candidate's simulated glance score:

$$\text{PersonaScore} = \sum_{j=1}^{6} (V_j \times M_{p,j})$$

| Factor Code | Factor Name | Startup Founder ($P_1$) | Enterprise TA ($P_2$) | Consultancy Headhunter ($P_3$) | HR Screener ($P_4$) |
|---|---|---|---|---|---|
| **V-01** | Keyword Matchability | $0.10 \times 4.0$ ($0.40$) | $0.30 \times 4.0$ ($1.20$) | $0.35 \times 4.0$ ($1.40$) | $0.30 \times 4.0$ ($1.20$) |
| **V-02** | Search-Filter Pass Rate | $0.10 \times 5.0$ ($0.50$) | $0.30 \times 5.0$ ($1.50$) | $0.25 \times 5.0$ ($1.25$) | $0.35 \times 5.0$ ($1.75$) |
| **V-03** | First-6-Second Impression| $0.30 \times 5.0$ ($1.50$) | $0.20 \times 5.0$ ($1.00$) | $0.20 \times 5.0$ ($1.00$) | $0.15 \times 5.0$ ($0.75$) |
| **V-04** | Skill Differentiation | $0.25 \times 6.67$ ($1.67$) | $0.10 \times 6.67$ ($0.67$) | $0.10 \times 6.67$ ($0.67$) | $0.05 \times 6.67$ ($0.33$) |
| **V-05** | Recency & Activity | $0.05 \times 10.0$ ($0.50$) | $0.05 \times 10.0$ ($0.50$) | $0.05 \times 10.0$ ($0.50$) | $0.10 \times 10.0$ ($1.00$) |
| **V-06** | Proof Points & Scale | $0.20 \times 10.0$ ($2.00$) | $0.05 \times 10.0$ ($0.50$) | $0.05 \times 10.0$ ($0.50$) | $0.05 \times 10.0$ ($0.50$) |

---

## 13. Keyword Matching Rules

| Rule ID | Status Classification | Matching Condition | Action Displayed in UI |
|---|---|---|---|
| **KM-01** | **PRESENT** | Exact match on canonical skill or alias within word boundary (`\b`) in Skills or Headline. | Verified (Green Check) |
| **KM-02** | **WEAK** | Token appears only inside an experience bullet, never in the dedicated Skills or Headline block. | Action: "Boost to Skills Section" |
| **KM-03** | **MISSING** | Token does not appear anywhere in the parsed profile. | Action: "Add Keyword" |
| **KM-04** | **NOISE** | Token is an outdated, overly generic, or non-technical entry (e.g. `MS Word`, `Teamwork`). | Action: "Cut This Keyword" |
| **KM-05** | **ALIAS RESOLUTION** | Recognized synonym or abbreviation (e.g. `k8s` $\rightarrow$ `Kubernetes`, `js` $\rightarrow$ `JavaScript`). | Resolves automatically to canonical entity. |
| **KM-06** | **DISAMBIGUATION** | Substring safety guard: prevents false token matches: `Java` $\ne$ `JavaScript`, `R` $\ne$ `React`, `Go` $\ne$ `Google`, `C` $\ne$ `CSS` or `C++`. | Strictly blocked via word boundaries & negative lookahead. |
| **KM-07** | **VOLUME DISCLOSURE** | Search volumes are stored in reference datasets (`lib/data/keywords.ts`). | Mandatory UI Label: *"Indicative monthly recruiter searches on Naukri Resdex"*. |
| **KM-08** | **LIVE RECALCULATION** | When a candidate accepts a suggested keyword in the UI. | System immediately re-evaluates rule **V-01** and updates Visibility Score live. |

---

## 14. Rewriter Rules

```
Variants Emitted per Bullet: Exactly 3 (SAFE, METRIC, IMPACT)
Invariable Constraint: Zero invented numbers, companies, or technologies.
```

| Rule ID | Constraint Name | Algorithmic Rule |
|---|---|---|
| **RW-01** | **Tri-Variant Standard** | Every bullet processed must yield exactly 3 variants: `SAFE`, `METRIC`, and `IMPACT`. |
| **RW-02** | **Factual Faithfulness (SAFE)**| `SAFE` variant restructures sentence syntax and inserts verified power verbs without adding any new factual assertions. |
| **RW-03** | **Interactive Slot Gating** | `METRIC` and `IMPACT` variants require a numerical value. If source text has no number, the engine gates the variant behind an interactive slot input prompt (`[Enter % or metric]`). The engine **never guesses a number**. |
| **RW-04** | **Entity Preservation** | Technologies, company names, job titles, and scope present in the original bullet must be preserved without substitution. |
| **RW-05** | **Syntax Completeness** | Every rewrite variant must conform to the structure: `[Action Verb]` + `[System / Technology]` + `[Deliverable / Business Impact]`. |
| **RW-06** | **Explainable Rationale** | Every variant includes a transparent `reason` string explaining why the revision improves recruiter shortlisting. |
| **RW-07** | **Real-Time Recomputation**| When user enters their actual number into an inline slot, all 3 variants recompute instantly. |
| **RW-08** | **Score Recalculation on Accept**| Accepting a variant updates profile memory and triggers immediate recalculation of Component 4 (`Bullet Quality`) and the total score. |
| **RW-09** | **Rejection Learning** | Rejecting a suggested variant records the rejection code, deprioritizing that template structure for subsequent bullets. |
| **RW-10** | **Scope Ceiling (IMPACT)** | `IMPACT` variant must not invent enterprise scale. If source demonstrates low complexity, `IMPACT` falls back to quantified team delivery rather than hallucinating distributed architecture. |

---

## 15. Job Fit Matching Rules

```
Match Score (0-100%) = 0.35(Skill) + 0.25(Experience) + 0.15(Location) + 0.15(Salary) + 0.10(Education)
```

| Rule ID | Evaluation Factor | Scoring & Penalty Algorithm | UI Guidance & Remedy |
|---|---|---|---|
| **JF-01** | **Weight Distribution** | Skill Match ($35\%$), Experience ($25\%$), Location ($15\%$), Salary ($15\%$), Education ($10\%$). | Full transparent sub-score radar breakdown displayed. |
| **JF-02** | **Must-Have Skills** | Each matched must-have skill awards full proportional points. Each missing must-have applies a penalty scaled by JD frequency. | Displays categorized "Missing Critical Skills" list with 1-click add. |
| **JF-03** | **Nice-to-Have Skills** | Nice-to-have skills contribute at $40\%$ weight relative to must-have skills. | Displays "Bonus Differentiator Skills" to elevate shortlist rank. |
| **JF-04** | **Experience Alignment** | Exact band fit: $100\%$ score. Deficit of $\pm 1$ yr: $-30\%$ penalty. Deficit of $\pm 2$ yrs: $-60\%$. Deficit $\ge 3$ yrs: $-85\%$ (never $0\%$). | Label: *"Experience stretch — addressable by highlighting high-complexity projects."* |
| **JF-05** | **Location Alignment** | Exact city match: $100\%$. Same metro cluster: $80\%$. Remote-eligible: $100\%$. Willing to relocate: $70\%$. Different city: $30\%$. | Label: *"Add 'Open to relocate to {city}' to pass initial recruiter location filters."* |
| **JF-06** | **Salary Expectations** | Expectation inside JD band: $100\%$. Within $10\%$ above: $70\%$. Within $25\%$ above: $35\%$. Beyond $25\%$ above: $10\%$. | Remedy: *"Lower stated expectation to ₹{amount}L to reduce budget drop-off risk from 18% to 4%."* |
| **JF-07** | **Education Credentials** | Exact degree match: $100\%$. Adjacent engineering discipline: $80\%$. Any Bachelor's: $60\%$. Below requirement: $40\%$. | Label: *"Many Indian product employers show flexibility on exact degree if GitHub proof is strong."* |
| **JF-08** | **Verdict Thresholds** | $\ge 70\%$: `APPLY NOW` \| $50\text{--}69\%$: `APPLY WITH TWEAKS` \| $30\text{--}49\%$: `IMPROVE FIRST` \| $< 30\%$: `SKIP`. | Rendered as color-coded status banner with tactical next step. |
| **JF-09** | **Remedy Trajectory** | Every verdict below `APPLY NOW` must calculate the exact points gained if suggested fixes are executed. | Displays: *"Applying these 3 fixes elevates your match score from 58% to 74%."* |
| **JF-10** | **Ranked Rejection Reasons**| Rejection grounds ranked by statistical drop-off frequency drawn from role benchmarks. | Ranked list with specific counter-measures. |
| **JF-11** | **Screen Probability Range** | Probability of clearing first screening call presented as range (e.g. `65% - 78%`), never as certainty. | Mandatory range display with confidence rationale. |
| **JF-12** | **72-Hour Timing Advisory**| Recruiters screen new job postings within 72 hours of publication. | Notice: *"Apply within 48 hours of posting for maximum recruiter review probability."* |

---

## 16. Benchmark Rules

| Rule ID | Rule Name | Algorithmic Specification |
|---|---|---|
| **BM-01** | **Percentile Anchors** | Reference benchmarks store verified $P_{25}, P_{50}, P_{75}, P_{90}$ score thresholds partitioned by `Role × Experience Band × City Tier`. |
| **BM-02** | **Linear Interpolation** | Candidate's percentile rank is calculated via piecewise linear interpolation within their specific role-band distribution bucket. |
| **BM-03** | **Data Recency Disclosure** | All benchmark visualizations must display: `"Benchmark data version: {version} · Grounded as of {asOfDate}"`. |
| **BM-04** | **Dynamic Projection** | Projected percentile must recompute live as the candidate accepts bullet rewrites or adds missing keywords. |
| **BM-05** | **Self-Comparison Invariant**| The candidate's original baseline score is permanently preserved and displayed alongside market percentiles. |

---

## 17. Action Plan Generation Rules

| Rule ID | Rule Name | Algorithmic Specification |
|---|---|---|
| **AP-01** | **Action Item Structure** | Every gap generates an action task with: `Title`, `Description`, `EffortMinutes`, `ExpectedPointsGain`, and `ToolDeepLink`. |
| **AP-02** | **ROI Priority Ranking** | Tasks are sorted by Return on Investment: $\text{Priority} = \frac{\text{ExpectedPointsGain}}{\text{EffortMinutes}} \times \text{SeverityWeight}$. |
| **AP-03** | **Chronological Bucketing** | Tasks are partitioned into 4 buckets: `Today` ($\le 45$ mins total), `Day 2`, `Day 3-4`, `Week 2`. |
| **AP-04** | **Volume Ceiling** | The active action plan must never exceed 12 total tasks to prevent candidate overwhelm. |
| **AP-05** | **Progress Synchronization**| Checking off a task recalculates current score, progress trajectory, and projected recruiter contact volume. |
| **AP-06** | **Ceiling Clamping** | If a task's expected point gain would push total score above 100, displayed gain is clamped to remaining headroom. |

---

## 18. Message and Copy Templates

### 18.1 Score Band Labels & Explanations
- **Critical (0 – 40, `#E55260`):**
  - *Title:* "Profile At Risk of Immediate ATS Discard"
  - *Body:* "Your profile currently fails automated keyword and format filters. Recruiters are skipping past your profile without reading your experience. Follow Day-1 action items to reach the competitive tier."
- **Needs Work (41 – 70, `#725A7A`):**
  - *Title:* "Shortlisted Occasionally, Skipped in 6-Second Glance"
  - *Body:* "You have solid foundational credentials, but vague bullets and missing booster keywords hold you back. Adding quantifiable metrics will significantly improve your interview callback rate."
- **Competitive (71 – 85, `#C56C86`):**
  - *Title:* "Strong Profile Passing Recruiter Screens"
  - *Body:* "Your profile passes ATS filters and communicates clear value within 6 seconds. Fine-tuning your headline and adding 2 high-value booster skills will position you in the top 10% of applicants."
- **Excellent (86 – 100, `#3FBF8F`):**
  - *Title:* "Top-Decile Recruiter Magnet"
  - *Body:* "Outstanding profile structure. Dense with high-demand keywords, quantifiable metrics, and verified engineering scale. High likelihood of outbound recruiter contact on Naukri Resdex."

### 18.2 Copy deck: Score Card Social Share Captions
- **English Template:**
  > *"Scanned my resume with the Naukri Profile Optimizer. Discovered my Visibility Score was {initialScore}/100 because my bullets had 0 quantifiable metrics and I was missing {missingCount} critical filter keywords for {targetRole} roles.*
  > 
  > *Fixed the top 3 action items and improved my score to {currentScore}/100. Check how recruiters actually see your profile (100% free, no sign-up required): [https://naukri-optimizer.in]*"

- **Hinglish Template:**
  > *"Resume upload karne ke baad 2-3 mahine tak koi call nahi aa raha tha. Naukri Profile Optimizer par scan kiya to pata chala ki bullets mein metrics missing the aur key search keywords add nahi the.*
  > 
  > *3 fixes ke baad score {initialScore} se badh kar {currentScore}/100 ho gaya. Aap bhi apna recruiter glance score check karo bilkul free: [https://naukri-optimizer.in]*"

### 18.3 Tone & Copy Invariants
1. **No Exclamation Marks in Errors:** Error messages must never end in exclamation marks (`!` $\rightarrow$ strictly forbidden). Use neutral, informative full stops.
2. **No Superficial Praise:** Never use words like *"amazing"*, *"awesome"*, or *"perfect"*. Use objective descriptors like *"competitive"*, *"verified"*, *"ATS-compliant"*.
3. **Always Quantify:** Replace *"many skills"* with *"18 skills"*; replace *"good length"* with *"72 words (optimal)"*.
4. **Always Next Action:** Every alert, warning, or feedback modal must conclude with the immediate next step.
5. **No AI Mystification:** Never use the words *"AI-generated"*, *"ChatGPT"*, or *"magic"*. Reference *"Template Engine"*, *"Syntax Model"*, or *"Verified Patterns"*.

---

## 19. Rules Engine Implementation Notes

1. **Declarative Architecture:** All rules are declared as pure typed data objects in `lib/scoring/rules.ts` and `lib/rewriter/rules.ts`. No scattered `if/else` logic in UI components.
2. **Transparent Tooltips:** Each rule has a stable `Rule ID` (e.g. `H-03`, `B-03`). The UI renders a subtle `?` icon next to every feedback item, allowing users to inspect the exact rule condition and point weight that fired.
3. **Semantic Versioning:** The rulebook is versioned (`bench-v1.0.0`). Any change to a rule weight requires bumping the engine minor version and updating verification test baselines.

---

## 20. Verification Testing Checklist (Positive & Negative Test Cases)

| Rule ID | Positive Case (Must Pass) | Negative Case (Must Trigger Rule) |
|---|---|---|
| **H-01** | `"Backend Engineer \| Java \| Spring Boot"` | `""` (Empty string triggers H-01) |
| **H-02** | `"Senior Backend Engineer"` | `"Team Member at Tech Startup"` (Missing role token) |
| **H-08** | `"Software Engineer \| Java \| AWS"` | `"Software Engineer"` (Generic title capped at 4/12) |
| **H-09** | `"Frontend Developer \| React"` | `"Aspiring Frontend Developer seeking roles"` (Fires H-09 penalty) |
| **S-01** | `"Backend engineer with 4 years building microservices..."` | `""` (Empty summary triggers S-01) |
| **S-07** | `"Engineered high-throughput payment pipelines..."` | `"I am a passionate engineer with a dream..."` (Fires S-07 penalty) |
| **S-08** | `"Developed distributed microservices delivering 99.99% uptime."` | `"I built my company's API and I deployed it."` (Missing S-08 bonus) |
| **B-01** | `"Architected fault-tolerant Kafka consumer pipelines."` | `"Was working on Kafka pipelines."` (Fails B-01) |
| **B-02** | `"Deployed Kubernetes clusters across 3 AWS regions."` | `"Responsible for deploying Kubernetes clusters."` (Fires B-02 weak verb) |
| **B-03** | `"Optimized Postgres queries, reducing latency by 45%."` | `"Optimized Postgres queries for the team."` (Fails B-03 metric check) |
| **B-06** | 22-word bullet detailing action, stack, and result | 42-word run-on bullet (Fires B-06 truncation warning) |
| **B-07** | `"Refactored 6 microservices to use gRPC."` | `"Refactored various microservices etc."` (Fires B-07 vague warning) |
| **K-02** | 18 skills listed in categorized blocks | 44 skills listed in raw block (Fires K-03 bloat penalty) |
| **K-08** | `["Java", "Spring Boot", "Kafka", "Docker"]` | `["Java", "MS Office", "Communication"]` (Fires K-08 noise penalty) |
| **E-02** | `"B.Tech in Computer Science and Engineering"` | `"Completed high school studies"` (Fails E-02 degree verification) |
| **P-03** | `"https://github.com/candidate/microservices-demo"` | Project with zero links or repository references (Fails P-03) |
| **C-03** | `"AWS Certified Solutions Architect - Associate (2023)"`| `"Completed 1-hour intro video on YouTube"` (Fails C-03 tier-1 check) |
| **A-01** | Native selectable PDF document | Scanned raster image PDF without text layer (Fails A-01, triggers OCR) |
| **A-02** | Standard single-column linear layout | Two-column graphic template with sidebar (Fails A-02) |
| **PC-01**| `"Backend Engineer"` on both Naukri and LinkedIn | `"Backend Developer"` on Naukri vs `"Team Lead"` on LinkedIn (Fails PC-01) |
| **CC-02**| `"arjun.sharma.tech@gmail.com"` | `"crazy_coder_boy_2003@yahoo.com"` (Fails CC-02 professional check) |
| **KM-06**| `"Java 17 Developer"` matches Java, does not match JavaScript | Input `"JavaScript"` asserting match for `"Java"` (Blocked by KM-06) |
| **RW-02**| SAFE variant rewrites `"Worked on APIs"` $\rightarrow$ `"Architected APIs"` | Rewriter inventing a 40% speedup out of thin air (Strictly blocked by RW-02) |
| **JF-08**| Candidate matching 82% of JD criteria awarded `APPLY NOW` | Candidate matching 28% of JD criteria awarded `SKIP` |
