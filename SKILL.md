# Skill — Naukri Profile Optimizer

**Purpose:** Define the domain knowledge system — the skills dictionary, role taxonomy, keyword intelligence, verb library, benchmark data, and rewrite templates. This is the substance of the product.

---

## 1. Skill Taxonomy Architecture

```
lib/data/
├── skills-dict.ts          # ~800 skills: canonical name, aliases, category, roles
├── roles.ts                # 10 role configs
├── keywords.ts             # role → keyword table with weights + est. volumes
├── verbs.ts                # power verb library
├── benchmarks.ts           # percentile distributions
├── resume-templates.ts     # ATS-safe resume template
└── captions.ts             # share caption templates
```

---

## 2. Skill Dictionary

### 2.1 Structure
```typescript
interface SkillEntry {
  id: string;                    // 'java'
  name: string;                  // 'Java'
  aliases: string[];             // ['java8', 'java 8', 'core java', 'j2ee']
  category: SkillCategory;       // 'language' | 'framework' | 'database' | ...
  relatedRoles: string[];        // ['backend', 'fullstack', 'data']
  isGeneric?: boolean;           // true for 'communication', 'teamwork' → penalized
  recency?: 'stable' | 'growing' | 'trending';
}

type SkillCategory =
  | 'language' | 'framework' | 'library' | 'database' | 'cloud'
  | 'devops' | 'container' | 'cicd' | 'frontend' | 'mobile'
  | 'data' | 'analytics' | 'testing' | 'design' | 'product'
  | 'project' | 'api' | 'security' | 'ai_ml' | 'domain'
  | 'tool' | 'soft' | 'certification' | 'other';
```

### 2.2 Generic Skill Handling
Generic skills (`MS Office`, `Communication`, `Teamwork`, `Hardworking`, `Fast Learner`, `MS Word`, `Excel`) are flagged `isGeneric: true`:
- ❌ NEVER count toward keyword match score
- ✅ Penalize if listed in the top 5 skills
- ✅ Flag for removal in the Skills Structure component
- ✅ Never recommend adding them

### 2.3 Complete Skill List by Category

#### Programming Languages (72)
Java, JavaScript, TypeScript, Python, C, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala, R, MATLAB, Perl, Dart, Elixir, Haskell, Julia, Objective-C, Visual Basic, Ada, COBOL, Fortran, Lisp, Prolog, Assembly, Solidity, Groovy, Erlang, F#, OCaml, Clojure, Scheme, SQL, HTML, CSS, Sass, SCSS, Less, Shell, Bash, Zsh, PowerShell, Batch, PL/SQL, T-SQL, VBScript, ABAP, Apex, ClojureScript, CoffeeScript, Elm, Nim, Crystal, Zig, V, Racket, Tcl, Awk, Sed, Make, CMake, Nginx config, Dockerfile, HCL, Terraform, Starlark, Jinja, Mako, Handlebars, Pug, EJS, Blade, Razor, Liquid, Twig, Velocity, FreeMarker, Thymeleaf, Marko, Riot

#### Frontend (38)
React, React Native, Vue.js, Nuxt.js, Angular, AngularJS, Svelte, SvelteKit, Next.js, Remix, Astro, Solid.js, Preact, Alpine.js, Ember.js, Backbone.js, jQuery, React Query, Redux, Redux Toolkit, MobX, Zustand, Recoil, Context API, Vuex, Pinia, Apollo Client, GraphQL, Relay, styled-components, Emotion, Sass Modules, Tailwind CSS, Material UI, Chakra UI, Ant Design, Bootstrap, Vite, Webpack, Rollup, Parcel, Storybook

#### Backend & API (26)
Node.js, Express.js, NestJS, Fastify, Koa, Hapi, Django, Flask, FastAPI, Ruby on Rails, Spring Boot, Spring MVC, Spring Cloud, ASP.NET Core, .NET, Laravel, Symfony, CodeIgniter, Sinatra, Phoenix, Gin, Echo, Fiber, Actix, GraphQL, gRPC, REST API, SOAP, OpenAPI, Swagger, Postman, gRPC

#### Databases (24)
MySQL, PostgreSQL, MongoDB, Redis, SQLite, MariaDB, Oracle Database, SQL Server, Cassandra, DynamoDB, CouchDB, Neo4j, Elasticsearch, OpenSearch, ClickHouse, Snowflake, BigQuery, Redshift, Firebase, Supabase, Firebase Realtime Database, H2, MariaDB Galera, PlanetScale, FaunaDB, Amazon Aurora

#### Cloud & DevOps (30)
AWS, AWS EC2, AWS S3, AWS Lambda, AWS RDS, AWS CloudFront, AWS ECS, AWS EKS, Azure, Azure App Service, Azure Functions, Azure SQL, Azure DevOps, Google Cloud Platform, GCP, Heroku, Vercel, Netlify, Cloudflare, DigitalOcean, Linode, Alibaba Cloud, Tencent Cloud, Oracle Cloud, OpenStack, Kubernetes, Docker, Docker Compose, Helm, Terraform, Pulumi, Ansible, Puppet, Chef, Jenkins, GitHub Actions, GitLab CI, CircleCI, ArgoCD, Flux, Istio, Consul, Vault, Prometheus, Grafana, Datadog, New Relic, Splunk, CloudWatch, Sentry, OpenTelemetry

#### Data & Analytics (28)
Pandas, NumPy, Matplotlib, Seaborn, Plotly, Scikit-learn, TensorFlow, PyTorch, Keras, XGBoost, LightGBM, CatBoost, Hugging Face Transformers, spaCy, NLTK, Tableau, Power BI, Looker, Metabase, Superset, Excel, Google Sheets, A/B Testing, Statistics, Data Visualization, ETL, ELT, Data Modeling, Data Warehousing, Data Cleaning, dbt, Apache Spark, Apache Hadoop, Apache Kafka, Apache Flink, Airflow, Dagster, Prefect, dbt Cloud, BigQuery, Snowflake, Mode Analytics, Amplitude, Mixpanel, Segment, Google Analytics, Adobe Analytics, Heap, Hotjar

#### Mobile (10)
Android, iOS, Flutter, React Native, SwiftUI, Jetpack Compose, Kotlin Multiplatform, Ionic, Cordova, NativeScript

#### Testing & Quality (12)
JUnit, TestNG, PyTest, Jest, Mocha, Chai, Cypress, Playwright, Selenium, Appium, Postman, Newman, k6, JMeter, SonarQube

#### AI/ML (18)
OpenAI API, Gemini API, Claude API, LangChain, LlamaIndex, Hugging Face, scikit-learn, TensorFlow, PyTorch, MXNet, spaCy, NLTK, Gensim, OpenCV, MediaPipe, Whisper, Stable Diffusion, Midjourney

#### Tools & Dev (20)
Git, GitHub, GitLab, Bitbucket, SVN, VS Code, IntelliJ IDEA, Eclipse, Postman, Insomnia, Figma, Jira, Confluence, Notion, Miro, Slack, Docker Desktop, Rancher, Vagrant, Selenium IDE, Charles Proxy, Wireshark, JMeter

#### Design (16)
Figma, Adobe XD, Sketch, Photoshop, Illustrator, InVision, Zeplin, Balsamiq, Lucidchart, Canva, UI Design, UX Design, Interaction Design, Design Systems, Prototyping, Wireframing, User Research, Usability Testing, Information Architecture

#### Marketing & Growth (24)
SEO, SEM, Google Ads, Meta Ads, Facebook Ads, Instagram Ads, LinkedIn Ads, Twitter Ads, Google Analytics 4, Search Console, Google Tag Manager, Content Marketing, Copywriting, Email Marketing, Marketing Automation, HubSpot, Marketo, Salesforce, Mailchimp, Klaviyo, Ahrefs, SEMrush, Moz, Screaming Frog, Hootsuite, Buffer, Canva, Hootsuite, Later, Zoho CRM, Zoho Campaigns, Webflow, WordPress, Wix, Shopify

#### Sales & CRM (14)
Salesforce, HubSpot, Pipedrive, Zoho CRM, Freshsales, Copper, Pipedrive, Outreach, Salesloft, Marketo, Pardot, LinkedIn Sales Navigator, Apollo.io, ZoomInfo, Lead generation, CRM, MEDDIC, Challenger Sale, SPIN Selling, Consultative Selling, Account mapping, Territory management, Channel sales

#### HR & Recruiting (16)
Workday, SuccessFactors, Taleo, Greenhouse, Lever, Ashby, BambooHR, SAP HCM, iCIMS, Recruitee, Breezy HR, Jobvite, Cornerstone OnDemand, SAP SuccessFactors, HRIS, ATS, Sourcing, Boolean search, Sourcing strategy, Talent pipeline, Employer branding, Onboarding, Performance management, Compensation benchmarking, HR analytics, Workforce planning, Six sigma

#### Finance & Accounting (18)
Tally, Tally ERP, QuickBooks, QuickBooks Online, Zoho Books, Xero, SAP FICO, SAP B1, Oracle Financials, NetSuite, Microsoft Dynamics 365, Sage, Busy Accounting, GST filing, Direct tax, Indirect tax, ITR filing, ROC filing, Financial modeling, Budgeting, Forecasting, Cash flow analysis, Reconciliation, Payroll, Advanced Excel, MIS reporting, Business analysis, FP&A

#### Operations & Supply Chain (14)
SAP MM, SAP WM, SAP SD, Oracle SCM, MS Dynamics SCM, Tally, ERP, Six Sigma, Lean, Kanban, BOM, ERP implementation, Inventory management, Logistics, Vendor management, Procurement, Warehouse management, GRN, GST compliance, Supply chain analytics

#### Project Management (12)
Agile, Scrum, Kanban, Waterfall, JIRA, Azure DevOps, MS Project, Primavera, PMI, PRINCE2, Team Leadership, Stakeholder Management, Risk Management, Resource Planning, SDLC, Product Ownership, Scrum Master, SAFe, SAFe, Kaizen

#### Certifications (16)
AWS Certified Solutions Architect, AWS Certified Developer, AWS SAA, AWS SAA-C02, Azure Administrator AZ-104, Azure Developer AZ-204, Google Cloud Professional, PMP, Certified ScrumMaster, CSM, Six Sigma Green Belt, Six Sigma Black Belt, Lean Six Sigma, CFA, CPA, ACCA, FRM, CFA Level 1, NISM, SEBI, IRDA, GATE

#### Soft Skills (10 — generic flagged)
Communication, Teamwork, Leadership, Problem Solving, Time Management, Adaptability, Critical Thinking, Collaboration, Attention to Detail, Presentation, MS Office, MS Word, MS Excel, MS PowerPoint, Email Etiquette, Time Management

### 2.4 Alias Map (Examples)
```typescript
const ALIASES: Record<string, string> = {
  'js': 'javascript', 'jsx': 'javascript', 'es6': 'javascript', 'ecmascript': 'javascript',
  'ts': 'typescript',
  'py': 'python', 'python3': 'python',
  'reactjs': 'react', 'react.js': 'react',
  'node': 'node.js', 'nodejs': 'node.js',
  'postgres': 'postgresql', 'psql': 'postgresql', 'pgsql': 'postgresql',
  'mongo': 'mongodb',
  'k8s': 'kubernetes', 'kube': 'kubernetes',
  'gcp': 'google cloud platform',
  'aws s3': 'aws s3', 's3': 'aws s3',
  'rest': 'rest api', 'restful': 'rest api', 'rest apis': 'rest api',
  'ml': 'machine learning', 'ai': 'artificial intelligence',
  'ci cd': 'cicd', 'ci/cd': 'events', 'continuous integration': 'cicd',
  'tdd': 'test driven development', 'unit testing': 'testing',
  'dsa': 'data structures and algorithms',
  'oops': 'object oriented programming',
  'powerbi': 'power bi', 'power-bi': 'power bi',
  'tableau': 'tableau',
  'seo': 'seo', 'sem': 'sem', 'ppc': 'sem',
  'salesforce crm': 'salesforce', 'sfdc': 'salesforce',
  'workday': 'workday',
  'quickbooks': 'quickbooks',
  'tally erp': 'tally', 'tally.erp': 'tally',
};
```

---

## 3. Role Taxonomy (10 Roles)

### 3.1 Role Structure
```typescript
interface RoleConfig {
  id: string;
  title: string;
  function: 'it' | 'data' | 'design' | 'sales' | 'marketing' | 'hr' | 'finance' | 'ops' | 'general';
  aliases: string[];
  level: 'fresher' | 'junior' | 'mid' | 'senior' | 'lead';
  coreSkills: string[];        // must-have
  boosterSkills: string[];      // nice-to-have that boosts score
  noiseSkills: string[];        // to cut
  headlineTemplates: string[];
  verbSets: string[];           // allowed power verbs for this role
  metricExamples: string[];     // what kinds of metrics matter
  benchmarkKey: string;
}
```

### 3.2 The 10 Roles

**R1. Software Engineer / Backend**
```
core:    java, python, javascript, sql, rest api, git, spring boot, node.js, spring cloud
booster: aws, docker, kubernetes, microservices, kafka, redis, graphql, terraform, ci/cd, mongodb
noise:   ms office, communication, teamwork, html, css (if only frontend)
verbs:   architected, engineered, built, shipped, deployed, developed, implemented, optimized, scaled
metrics: % latency reduction, requests/sec, uptime %, cost savings, team size, users served
headlines:
  "Backend Engineer | Java, Spring Boot, AWS | {n}+ yrs {domain}"
  "Software Engineer — {specialization} | {skill1}, {skill2}"
  "{domain} Backend Engineer | Building {system type} at scale"
```

**R2. Frontend Developer**
```
core:    javascript, typescript, react, html, css, redux, rest api, git, next.js
booster: tailwind, vite, webpack, testing, jest, storybook, figma, accessibility, next.js
noise:   java, c++, algorithms (unless role asks), ms office
verbs:   built, engineered, shipped, optimized, implemented, designed, architected
metrics: Lighthouse score, bundle size reduction, % faster load, components built, users
headlines:
  "Frontend Developer | React, TypeScript, Next.js | {n}+ yrs"
  "UI Engineer | {skill1}, {skill2} | Performance-focused"
```

**R3. Data Analyst**
```
core:    sql, excel, python, tableau, power bi, statistics, data visualization, pandas
booster: etl, dbt, bigquery, snowflake, looker, machine learning, airflow, a/b testing
noise:   java, c++, hardware, ms office (as a skill, not Excel)
verbs:   analyzed, evaluated, forecasted, monitored, diagnosed, modeled, visualized
metrics: dashboards built, reports automated, decision impact, hours saved, % improvement
headlines:
  "Data Analyst | SQL, Python, Power BI | {n}+ yrs | {domain}"
  "Analytics Specialist | {skill1}, {skill2} | {industry} insights"
```

**R4. Digital Marketing Specialist**
```
core:    seo, google ads, meta ads, google analytics, content marketing, email marketing, social media
booster: hubspot, mailchimp, marketing automation, semrush, ahrefs, zoho campaigns, cms
noise:   java, sql (unless analytics), hardware, ms office
verbs:   grew, optimized, launched, scaled, converted, strategized, executed, managed
metrics: ROAS, CAC, CTR, conversion %, traffic growth, MQL, pipeline, engagement rate
headlines:
  "Digital Marketing Specialist | SEO, Paid Social, GA4 | {n}+ yrs"
  "Performance Marketer | {skill1}, {skill2} | ₹{budget} budgets managed"
```

**R5. HR / Talent Acquisition**
```
core:    sourcing, boolean search, recruitment, hr analytics, ats, interview, onboarding, employer branding
booster: workday, greenhouse, lever, talent pipeline, six sigma, hr analytics, dsc
noise:   java, python, excel (unless advanced), hardware
verbs:   hired, sourced, managed, onboarded, built, reduced, streamlined, coordinated
metrics: hires closed, time-to-fill, offer acceptance %, retention, diversity, reqs filled
headlines:
  "Talent Acquisition Specialist | {n}+ yrs | {hires} hires | {skill1}, {skill2}"
  "HR Business Partner | Recruiting, HRIS, Employee Engagement"
```

**R6. Sales / Business Development**
```
core:    crm, lead generation, negotiation, prospecting, salesforce, hubspot, account management
booster: linkedin sales navigator, outreach, salesloft, MEDDIC, territory management, channel sales
noise:   java, c++, algorithms, data structures
verbs:   grew, generated, closed, negotiated, acquired, expanded, converted, exceeded
metrics: quota attainment %, revenue generated, pipeline value, new logos, deal size
headlines:
  "Sales Executive | {n}+ yrs | {pct}% quota achievement | {industry}"
  "Business Development Manager | {skill1}, {skill2} | {revenue} closed"
```

**R7. Finance / MBA Analyst**
```
core:    financial modeling, budgeting, forecasting, excel, mis reporting, business analysis, fp&a, reconciliation
booster: power bi, sql, sap fico, python, tableau, quickbooks, xero, dbt
noise:   java (unless tech finance), hardware, design
verbs:   forecast, analyzed, modeled, reduced, optimized, reconciled, automated, supported
metrics: cost savings, forecast accuracy, budget variance, closing time reduced, reports automated
headlines:
  "Financial Analyst | Financial Modeling, FP&A | {n}+ yrs"
  "MBA | Finance & Analytics | {skill1}, {skill2}"
```

**R8. UI/UX Designer**
```
core:    figma, ux design, ui design, wireframing, prototyping, user research, design systems
booster: usability testing, adobe xd, sketch, zeplin, information architecture, interaction design, framer
noise:   java, c++, sql, salesforce
verbs:   designed, prototyped, researched, validated, improved, streamlined, built, led
metrics: task success %, usability score, design system components, conversion lift, users
headlines:
  "UI/UX Designer | Figma, Design Systems | {n}+ yrs | {domain} products"
  "Product Designer | Research to Prototype | {skill1}, {skill2}"
```

**R9. Content Writer / SEO Specialist**
```
core:    content writing, seo, copywriting, keyword research, content strategy, grammar, editing, blogging
booster: ahrefs, semrush, word count optimization, cms, google analytics, hubspot, mailchimp
noise:   java, python, c++, hardware
verbs:   wrote, ranked, optimized, edited, published, grew, strategized, repurposed
metrics: organic traffic %, keyword rankings, word count, conversion %, engagement time
headlines:
  "SEO Content Writer | {n}+ yrs | {traffic}% organic growth | {skill1}"
  "Content Strategist | SEO, Copywriting | {n}+ yrs"
```

**R10. Business Operations / Project Manager**
```
core:    project management, agile, scrum, stakeholder management, jira, resource planning, risk management, six sigma
booster: prince2, pmp, asana, ms project, confluence, change management, process improvement
noise:   java (unless tech PM), c++, hardware
verbs:   delivered, led, coordinated, optimized, reduced, streamlined, owned, launched
metrics: on-time delivery %, budget variance, process time reduced, team size, scope
headlines:
  "Project Manager | Agile, Scrum | {n}+ yrs | {industry} | {scale} projects"
  "Business Operations Lead | {skill1}, {skill2} | {impact}"
```

---

## 4. Keyword Intelligence

### 4.1 Keyword Entry Structure
```typescript
interface KeywordEntry {
  term: string;              // canonical
  display: string;           // 'AWS'
  weight: number;            // 0-1, relative importance
  estSearchesMonthly: number;// internal estimate
  filter: boolean;           // hard filter in recruiter search
  requiredPct: number;       // % of similar postings requiring it
  rationale: string;         // why recruiters search this
}
```

### 4.2 Example — Backend Engineer Keyword Table
```
FILTER (must-have, recruiters hard-filter):
  java              weight 1.0   est 42,000   required 68%  "Primary language filter"
  spring boot       weight 0.95  est 18,000   required 54%  "Java ecosystem entry point"
  sql               weight 0.85  est 26,000   required 61%  "Universal backend requirement"
  rest api          weight 0.8   est 14,000   required 47%  "Core integration skill"
  microservices     weight 0.75  est 22,000   required 38%  "Architecture expectation at 3+ yrs"

BOOSTER (raises score, not filtered):
  aws               weight 0.7   est 31,000   required 31%  "Cloud expectation, 2024+"
  docker            weight 0.65  est 12,000   required 29%  "Containerization baseline"
  kubernetes        weight 0.55  est 9,500    required 18%  "Orchestration, senior roles"
  kafka             weight 0.5   est 11,000   required 16%  "Event-driven systems"
  redis             weight 0.45  est 8,500    required 14%  "Caching layer"
  terraform         weight 0.4   est 7,200    required 11%  "IaC, cloud roles"
  ci/cd             weight 0.4   est 9,800    required 19%  "Delivery pipeline expectation"
  graphql           weight 0.35  est 6,500    required 9%   "API modernization signal"
  mongodb           weight 0.35  est 13,000   required 22%  "NoSQL alternative to SQL"
  git               weight 0.35  est 28,000   required 58%  "Basic hygiene, often filtered"

DISTRACTOR (listed but adds no value for this role):
  ms office, communication, teamwork, hardware, networking fundamentals, fast learner
```

### 4.3 Keyword Scoring
```typescript
function keywordScore(profileSkills, roleKeywords) {
  let earned = 0;
  let possible = 0;

  for (const kw of roleKeywords.filter(k => k.weight >= 0.7)) {
    possible += kw.weight;
    if (profileHas(profileSkills, kw.term)) earned += kw.weight;
  }

  const filterPass = roleKeywords
    .filter(k => k.filter)
    .filter(k => profileHas(profileSkills, k.term)).length /
    roleKeywords.filter(k => k.filter).length;

  return { ratio: possible ? earned / possible : 0, filterPass };
}
```

### 4.4 Volume Estimate Disclosure
All volume figures are internal estimates from role-skill co-occurrence models. The UI must render them as:
`~31,000 searches/mo (estimated)` — never as hard Naukri data.

---

## 5. Power Verb Library

```typescript
const POWER_VERBS = {
  built: [
    'architected', 'engineered', 'built', 'developed', 'shipped', 'delivered',
    'implemented', 'deployed', 'launched', 'designed', 'created', 'programmed',
    'constructed', 'authored', 'coded', 'produced', 'built', 'established',
  ],
  led: [
    'led', 'directed', 'headed', 'coordinated', 'orchestrated', 'supervised',
    'guided', 'managed', 'spearheaded', 'championed', 'led', 'oversaw',
  ],
  improved: [
    'optimized', 'optimised', 'streamlined', 'accelerated', 'refactored',
    'reduced', 'elevated', 'tuned', 'cut', 'boosted', 'improved', 'enhanced',
    'scaled', 'consolidated', 'modernized', 'modernised', 'strengthened',
  ],
  managed: [
    'owned', 'managed', 'administered', 'maintained', 'oversaw', 'ran',
    'operated', 'handled', 'directed', 'supervised', 'governed', 'orchestrated',
  ],
  sold: [
    'grew', 'generated', 'closed', 'negotiated', 'acquired', 'expanded',
    'converted', 'secured', 'signed', 'won', 'scaled', 'booked',
  ],
  taught: [
    'trained', 'mentored', 'coached', 'onboarded', 'educated', 'facilitated',
    'instructed', 'guided', 'prepared', 'upskilled',
  ],
  supported: [
    'supported', 'contributed', 'collaborated', 'partnered', 'assisted',
    'facilitated', 'enabled', 'backed', 'strengthened',
  ],
  analyzed: [
    'analyzed', 'analysed', 'evaluated', 'investigated', 'forecasted',
    'monitored', 'diagnosed', 'modeled', 'modelled', 'measured', 'identified',
  ],
};

const WEAK_VERBS = new Set([
  'worked on', 'involved in', 'assisted with', 'did', 'helped with',
  'participated in', 'contributed to', 'was part of', 'took part in',
  'handled', 'dealt with', 'responsible for', 'in charge of',
]);
```

### Weak Verb → Strong Verb Mapping (for suggestions)
```typescript
const VERB_UPGRADES = {
  'worked on': 'delivered',
  'involved in': 'contributed to',
  'assisted with': 'supported',
  'did': 'completed',
  'helped with': 'supported',
  'participated in': 'contributed to',
  'was part of': 'contributed to',
  'responsible for': 'owned',
  'in charge of': 'led',
  'handled': 'managed',
  'dealt with': 'resolved',
};
```

---

## 6. Rewrite Templates

### 6.1 Template Structure
```typescript
interface RewriteTemplate {
  id: string;
  intent: Intent;
  level: 'safe' | 'metric' | 'impact';
  pattern: string;
  slots: RewriteSlot[];
  requiresUser: ('metric' | 'scale' | 'team' | 'duration')[];
  bannedPhrases?: string[];
  maxWords?: number;
}

type RewriteSlot = 'verb' | 'object' | 'context' | 'metric' | 'team' | 'domain' | 'tool';
```

### 6.2 Template Library (8 intents × 3 levels = 24)

#### built
```typescript
safe:   '{verb} {object} using {tool}'
metric: '{verb} {object} using {tool}, {metric} {metricNoun}'
impact: '{verb} {object} using {tool}, {metric} {metricNoun} — {businessOutcome}'
```

#### led
```typescript
safe:   '{verb} a team of {team} {object}'
metric: '{verb} a team of {team} {object}, {metric} {metricNoun}'
impact: '{verb} {team} across {domain}, delivering {metric} {metricNoun}'
```

#### improved
```typescript
safe:   '{verb} {object} for better {attribute}'
metric: '{verb} {object}, {metric} {metricNoun}'
impact: '{verb} {object} — {metric} {metricNoun}, {businessOutcome}'
```

#### managed
```typescript
safe:   '{verb} {object} for {team}'
metric: '{verb} {object} for {team}, {metric} {metricNoun}'
impact: '{verb} {object} for {team} — {metric} {metricNoun}, {businessOutcome}'
```

#### sold
```typescript
safe:   '{verb} {object} to {clientType}'
metric: '{verb} {object} — {metric} {metricNoun}'
impact: '{verb} {object} — {metric} {metricNoun}, {businessOutcome}'
```

#### taught
```typescript
safe:   '{verb} {team} on {tool}'
metric: '{verb} {team} on {tool}, {metric} {metricNoun}'
impact: '{verb} {team} on {tool} — {metric} {metricNoun}'
```

#### supported
```typescript
safe:   '{verb} {object} for {team}'
metric: '{verb} {object} for {team}, {metric} {metricNoun}'
impact: '{verb} {object} for {team} — {metric} {metricNoun}'
```

#### analyzed
```typescript
safe:   '{verb} {object} to {purpose}'
metric: '{verb} {object} — {metric} {metricNoun}'
impact: '{verb} {object} — {metric} {metricNoun}, driving {businessOutcome}'
```

### 6.3 Metric Noun Mapping by Role
```typescript
const METRIC_NOUNS = {
  backend: ['latency', 'throughput', 'uptime', 'cost', 'requests per second'],
  frontend: ['load time', 'bundle size', 'Lighthouse score', 'conversion rate'],
  data: ['report generation time', 'data quality', 'accuracy', 'hours saved per week'],
  marketing: ['ROAS', 'CAC', 'CTR', 'conversion rate', 'organic traffic'],
  sales: ['quota attainment', 'pipeline value', 'revenue', 'deal size'],
  hr: ['time-to-fill', 'offer acceptance rate', 'retention', 'hires closed'],
  finance: ['budget variance', 'forecast accuracy', 'closing time', 'cost savings'],
  design: ['task success rate', 'usability score', 'conversion lift'],
  content: ['organic traffic', 'keyword rankings', 'engagement time'],
  ops: ['on-time delivery', 'budget variance', 'process time'],
};
```

### 6.4 Reason Templates
```typescript
const REASONS = {
  addedVerb:        'Added a strong action verb — recruiters scan verbs before anything else.',
  addedMetric:      'Added a measurable outcome — most hired candidates show numbers.',
  removedPassive:   'Removed passive voice — "responsible for" reads as no ownership.',
  replacedVague:    'Replaced a vague phrase with a specific deliverable.',
  addedContext:     'Added tool/domain context so the recruiter knows where you applied it.',
  addedImpact:      'Reframed to business impact — hiring managers buy outcomes, not tasks.',
  addedScope:       'Added scale (users, team size, volume) — shows you handled real load.',
  trimmedLength:    'Trimmed to fit — long bullets get skipped after the first line.',
};
```

---

## 7. Benchmark Data Structure

```typescript
interface RoleBenchmark {
  roleId: string;
  bands: {
    fresher: BandBenchmark;
    junior:  BandBenchmark;
    mid:     BandBenchmark;
    senior:  BandBenchmark;
    lead:    BandBenchmark;
  };
}

interface BandBenchmark {
  n: number;                              // contributors
  visibility: PercentileSet;              // p10..p90
  completeness: PercentileSet;
  dimensions: Record<string, PercentileSet>; // per-component
  keywords: { term: string; medianInclusionPct: number }[];
}

interface PercentileSet {
  p10: number; p25: number; p50: number; p75: number; p90: number;
}
```

### Seed Values — Backend Engineer, 3-5 yrs, Metro (n=1,240)
```
visibility:      p10=32  p25=44  p50=58  p75=71  p90=84
completeness:    p10=41  p25=53  p50=66  p75=78  p90=88
headline:        p10=6   p25=9   p50=11  p75=12  p90=12
summary:         p10=3   p25=6   p50=8   p75=10  p90=10
bullets:         p10=5   p25=10  p50=15  p75=20  p90=20
skills:          p10=6   p25=9   p50=12  p75=14  p90=15
projects:        p10=1   p25=3   p50=6   p75=8   p90=8
certs:           p10=0   p25=1   p50=2   p75=4   p90=5
parseability:    p10=6   p25=8   p50=10  p75=10  p90=10
consistency:     p10=0   p25=4   p50=7   p75=10  p90=10
```

---

## 8. Skill Extraction Rules

### 8.1 Detection Priority
```
1. Explicit skills section tokens → highest confidence
2. Section header + 2+ occurrences in body → high confidence
3. 1 occurrence in body → medium confidence (status: 'weak')
4. Inference rule fired → low confidence (status: 'weak', labeled "inferred")
5. Not found → 'missing'
```

### 8.2 Proficiency
```
Expert:   3+ mentions AND appears in a project/experience context
Working:  1-2 mentions, OR skills section only
Familiar: inferred only, confidence < 0.6 → shown with an "inferred" chip
```

### 8.3 Noise Removal
- Generic skills (`isGeneric: true`) excluded from keyword scoring
- Listed in top 5 of skills section → flagged in Skills Structure component
- Appearing 3+ times → duplicate/noise warning
- Not in target role's core or booster lists AND generic → recommend cut

### 8.4 Skill Count Guidance
```
Target range: 20–28 skills (visible + relevant)
Above 35: hard warning, recommend cutting
Below 12: coverage gap warning
```

---

## 9. Skill Gap Resolution (Actionable Output)

For every gap, output a `SkillRecommendation`:
```typescript
interface SkillRecommendation {
  term: string;
  display: string;
  status: 'missing' | 'weak' | 'noise' | 'duplicate';
  severity: 'critical' | 'high' | 'medium' | 'low';
  estimatedSearches: number;
  pointsGain: number;
  action: 'add' | 'boost' | 'cut' | 'dedupe';
  rationale: string;
  whereToAdd?: 'skills' | 'headline' | 'bullet' | 'certification';
  effortMinutes: number;
}
```

Severity rules:
```
critical → filter keyword missing, requiredPct ≥ 50%
high     → high-weight keyword missing (weight ≥ 0.8), or all bullets lack metrics
medium   → booster keyword missing, or skill count out of range
low      → noise/duplicate cleanup, optional boosters
```

---

## 10. Data Update Policy

| Dataset | Update cadence | Owner |
|---|---|---|
| `skills-dict.ts` | Monthly | Engineering |
| `roles.ts` | Quarterly | Product + Engineering |
| `keywords.ts` | Quarterly | Product (with Engineering) |
| `benchmarks.ts` | Monthly (if M4 opted in) | Data owner |
| `verbs.ts` | Rarely | Engineering |
| `templates.ts` | As needed | Product + Engineering |

Every change bumps `DATA_VERSION` and updates `asOf`. Changelog entries in `lib/data/CHANGELOG.md`.
