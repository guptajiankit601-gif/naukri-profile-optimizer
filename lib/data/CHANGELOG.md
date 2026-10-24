# Data Changelog — Naukri Profile Optimizer

All domain knowledge modifications, dictionary expansions, and benchmark refreshes are recorded here in accordance with SKILL.md Section 10.

---

## [bench-v1.0.0] - 2025-01-15

### Added
- **Skills Dictionary (~800 skills across 20+ categories)**:
  - 72 Programming Languages
  - 38 Frontend Libraries & Frameworks
  - 26 Backend & API Architectures
  - 24 Relational, NoSQL & Analytical Databases
  - 30 Cloud Platforms & DevOps Container Orchestrators
  - 28 Data & Analytics Libraries
  - 10 Mobile Native & Cross-Platform Technologies
  - 12 Testing & QA Frameworks
  - 18 Generative AI, LLM & Machine Learning APIs
  - 20 Developer Tools, IDEs & Collaboration Platforms
  - 16 UI/UX Design & Prototyping Tools
  - 24 Digital Marketing, SEO & Performance Advertising Tools
  - 14 B2B Sales, CRM & Pipeline Management Platforms
  - 16 HRIS, ATS & Talent Acquisition Suites
  - 18 Finance, Accounting & ERP Platforms
  - 14 Operations, Supply Chain & Lean Frameworks
  - 12 Project Management & Agile Methodologies
  - 16 Cloud & Professional Certifications
  - Generic skill penalty rule (`isGeneric: true` for soft skills)
- **Curated Role Taxonomy (10 Curated Indian Market Roles)**:
  - R1: Software Engineer / Backend (`backend-engineer`)
  - R2: Frontend Developer (`frontend-developer`)
  - R3: Data Analyst (`data-analyst`)
  - R4: Digital Marketing Specialist (`digital-marketing`)
  - R5: HR / Talent Acquisition (`hr-talent-acquisition`)
  - R6: Sales / Business Development (`sales-development`)
  - R7: Finance / MBA Analyst (`finance-analyst`)
  - R8: UI/UX Designer (`ui-ux-designer`)
  - R9: Content Writer / SEO Specialist (`content-writer-seo`)
  - R10: Business Operations / Project Manager (`business-ops-pm`)
- **Power Verb Library (8 Intent Categories)**:
  - Power verb definitions for `built`, `led`, `improved`, `managed`, `sold`, `taught`, `supported`, `analyzed`
  - Weak verb upgrade mappings (`worked on` → `delivered`, `responsible for` → `owned`, etc.)
- **24 Deterministic Rewrite Templates**:
  - 8 intents × 3 levels (SAFE, METRIC, IMPACT)
  - Role-specific metric nouns and explainable recruiter reasoning templates
- **Recruiter Screening Benchmark Dataset**:
  - Initial seed data for Backend Engineer (3-5 yrs, Metro, n=1,240)
  - Percentile distributions (p10, p25, p50, p75, p90) for visibility and completeness
