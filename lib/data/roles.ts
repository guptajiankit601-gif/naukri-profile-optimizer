/**
 * ROLE TAXONOMY & CONFIGURATION (10 Curated Roles)
 * Defined per SKILL.md Section 3
 */

export interface RoleConfig {
  id: string;
  title: string;
  function: 'it' | 'data' | 'design' | 'sales' | 'marketing' | 'hr' | 'finance' | 'ops' | 'general';
  aliases: string[];
  level: 'fresher' | 'junior' | 'mid' | 'senior' | 'lead';
  coreSkills: string[];        // must-have
  boosterSkills: string[];      // nice-to-have that boosts score
  noiseSkills: string[];        // to cut
  headlineTemplates: {
    naukri: string[];
    linkedin: string[];
    resume: string[];
  };
  verbSets: string[];           // allowed power verbs for this role
  metricExamples: string[];     // what kinds of metrics matter
  benchmarkKey: string;
}

export interface RoleDefinition extends RoleConfig {
  name: string;
  category: 'Engineering' | 'Data & AI' | 'Product & Design' | 'Marketing & Sales' | 'Finance & HR' | 'Operations';
  description: string;
  typicalSalaryLakhs: { min: number; median: number; top: number };
  keyActionVerbs: string[];
  topSearchKeywords: string[];
  mustHaveSkills: string[];
  distractorSkills: string[];
}

export const ROLES: RoleDefinition[] = [
  // R1. Software Engineer / Backend
  {
    id: 'backend-engineer',
    title: 'Software Engineer / Backend',
    name: 'Backend Engineer',
    function: 'it',
    aliases: ['backend developer', 'server engineer', 'java developer', 'sde 2', 'senior backend engineer'],
    level: 'mid',
    category: 'Engineering',
    description: 'High-throughput APIs, distributed systems, relational & NoSQL databases, microservices',
    typicalSalaryLakhs: { min: 8, median: 18, top: 38 },
    coreSkills: ['java', 'python', 'javascript', 'sql', 'rest api', 'git', 'spring boot', 'node.js', 'spring cloud'],
    boosterSkills: ['aws', 'docker', 'kubernetes', 'microservices', 'kafka', 'redis', 'graphql', 'terraform', 'ci/cd', 'mongodb'],
    noiseSkills: ['ms office', 'communication', 'teamwork', 'html', 'css'],
    verbSets: ['architected', 'engineered', 'built', 'shipped', 'deployed', 'developed', 'implemented', 'optimized', 'scaled'],
    metricExamples: ['% latency reduction', 'requests/sec (TPS)', 'uptime %', 'cost savings', 'team size', 'users served'],
    benchmarkKey: 'backend-engineer',
    headlineTemplates: {
      naukri: [
        'Backend Engineer | Java, Spring Boot, AWS | 3+ yrs Distributed Systems | 20k TPS',
        'Senior Backend Developer | Node.js & Go | Kafka & Redis | AWS Cloud',
        'Software Engineer — Backend | Python & FastAPI | PostgreSQL & Docker'
      ],
      linkedin: [
        'Backend Engineer @ TCS | Java, Spring Boot, Microservices | Scaled Systems to 5M DAU',
        'Senior Software Engineer (Backend) | Golang, Kubernetes, Kafka | Ex-Startup, Scaler',
        'Backend Developer | Node.js, TypeScript, PostgreSQL | Cloud Native Architect'
      ],
      resume: [
        'Backend Software Engineer specializing in distributed architectures and high-scale systems',
        'Full Lifecycle Backend Developer with deep expertise in Java, Spring Boot and AWS ecosystem'
      ]
    },
    keyActionVerbs: ['Architected', 'Engineered', 'Optimized', 'Refactored', 'Deployed', 'Scaled'],
    topSearchKeywords: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Redis', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs', 'System Design'],
    mustHaveSkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Microservices'],
    distractorSkills: ['MS Word', 'Typing', 'HTML/CSS Basics', 'Basic C', 'Eclipse IDE', 'Windows 10', 'Manual Testing']
  },

  // R2. Frontend Developer
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    name: 'Frontend Developer',
    function: 'it',
    aliases: ['ui developer', 'react developer', 'web developer', 'ui engineer', 'frontend software engineer'],
    level: 'mid',
    category: 'Engineering',
    description: 'Modern UI/UX engineering, Core Web Vitals, state architecture with React/Next.js and TypeScript',
    typicalSalaryLakhs: { min: 6, median: 15, top: 30 },
    coreSkills: ['javascript', 'typescript', 'react', 'html', 'css', 'redux', 'rest api', 'git', 'next.js'],
    boosterSkills: ['tailwind', 'vite', 'webpack', 'testing', 'jest', 'storybook', 'figma', 'accessibility', 'next.js'],
    noiseSkills: ['java', 'c++', 'algorithms', 'ms office'],
    verbSets: ['built', 'engineered', 'shipped', 'optimized', 'implemented', 'designed', 'architected'],
    metricExamples: ['Lighthouse score', 'bundle size reduction', '% faster load', 'components built', 'users reached'],
    benchmarkKey: 'frontend-developer',
    headlineTemplates: {
      naukri: [
        'Frontend Developer | React, Next.js & TypeScript | Core Web Vitals & Micro-frontends',
        'Senior UI Engineer | React.js, Redux Toolkit, Tailwind CSS | Performance Optimization',
        'Frontend Software Engineer | Vue.js, TypeScript, Vite | 3+ Yrs Exp'
      ],
      linkedin: [
        'Frontend Engineer | React, Next.js, TypeScript | Improved Mobile Web Vitals by 40%',
        'Senior Frontend Developer | Design Systems, Accessibility (a11y), State Architecture',
        'UI/Frontend Engineer | React, Microfrontends, Performance Champion'
      ],
      resume: [
        'Frontend Engineer with expertise in React, TypeScript, and high-performance web applications',
        'User Interface Developer specializing in design system implementation and bundle optimization'
      ]
    },
    keyActionVerbs: ['Engineered', 'Revamped', 'Optimized', 'Modularized', 'Standardized', 'Designed'],
    topSearchKeywords: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'Redux / Zustand', 'Web Performance Optimization', 'REST APIs'],
    mustHaveSkills: ['React', 'JavaScript', 'TypeScript', 'HTML5 & CSS3', 'CSS'],
    distractorSkills: ['Macromedia Flash', 'Dreamweaver', 'AngularJS 1.x', 'Bootstrap 3', 'MS Office']
  },

  // R3. Data Analyst
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    name: 'Data Analyst',
    function: 'data',
    aliases: ['business intelligence analyst', 'bi analyst', 'analytics specialist', 'data consultant'],
    level: 'mid',
    category: 'Data & AI',
    description: 'SQL queries, dashboarding, KPI telemetry, automated reports, business intelligence',
    typicalSalaryLakhs: { min: 6, median: 13, top: 28 },
    coreSkills: ['sql', 'excel', 'python', 'tableau', 'power bi', 'statistics', 'data visualization', 'pandas'],
    boosterSkills: ['etl', 'dbt', 'bigquery', 'snowflake', 'looker', 'machine learning', 'airflow', 'a/b testing'],
    noiseSkills: ['java', 'c++', 'hardware', 'ms office'],
    verbSets: ['analyzed', 'evaluated', 'forecasted', 'monitored', 'diagnosed', 'modeled', 'visualized'],
    metricExamples: ['dashboards built', 'reports automated', 'decision impact', 'hours saved/week', '% forecast accuracy'],
    benchmarkKey: 'data-analyst',
    headlineTemplates: {
      naukri: [
        'Data Analyst | SQL, Python, Power BI | 3+ yrs E-Commerce Analytics | 40+ Dashboards',
        'Senior BI Analyst | Tableau, Snowflake & dbt | Automated 120+ Monthly Reports',
        'Data Analytics Specialist | Advanced SQL, Statistical Modeling & Pandas'
      ],
      linkedin: [
        'Data Analyst @ Fintech | SQL, Power BI, Python | Transformed 10M+ transaction logs into actionable KPIs',
        'Analytics Specialist | Tableau, Snowflake, Data Warehousing | Ex-Consultant',
        'BI & Data Analyst | Automated daily revenue reconciliation saving 15 hrs/wk'
      ],
      resume: [
        'Business Intelligence & Data Analyst specializing in SQL modeling and executive dashboarding',
        'Data Analytics Professional with 3+ years experience turning complex datasets into strategic decisions'
      ]
    },
    keyActionVerbs: ['Analyzed', 'Evaluated', 'Automated', 'Modeled', 'Visualized', 'Uncovered'],
    topSearchKeywords: ['SQL', 'Power BI', 'Tableau', 'Python', 'Excel', 'Data Visualization', 'Pandas', 'ETL', 'Statistics'],
    mustHaveSkills: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Python'],
    distractorSkills: ['Typing speed', 'Data entry clerical', 'Filling paper forms', 'Basic photocopy']
  },

  // R4. Digital Marketing Specialist
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Specialist',
    name: 'Digital Marketing Specialist',
    function: 'marketing',
    aliases: ['performance marketer', 'growth marketer', 'seo specialist', 'paid media specialist'],
    level: 'mid',
    category: 'Marketing & Sales',
    description: 'Performance marketing, Meta/Google Ads, ROAS scaling, SEO/SEM, GA4 funnel analytics',
    typicalSalaryLakhs: { min: 5, median: 12, top: 26 },
    coreSkills: ['seo', 'google ads', 'meta ads', 'google analytics', 'content marketing', 'email marketing', 'social media'],
    boosterSkills: ['hubspot', 'mailchimp', 'marketing automation', 'semrush', 'ahrefs', 'zoho campaigns', 'cms'],
    noiseSkills: ['java', 'sql', 'hardware', 'ms office'],
    verbSets: ['grew', 'optimized', 'launched', 'scaled', 'converted', 'strategized', 'executed', 'managed'],
    metricExamples: ['ROAS', 'CAC reduction', 'CTR %', 'conversion %', 'traffic growth', 'MQL pipeline', '₹ budget managed'],
    benchmarkKey: 'digital-marketing',
    headlineTemplates: {
      naukri: [
        'Digital Marketing Specialist | Google & Meta Ads | ROAS 3.8x | SEO & Conversion Rate (CRO)',
        'Performance Marketing Manager | ₹50L+ Monthly Ad Spend | B2B Lead Gen & GA4 Analytics',
        'Growth & SEO Specialist | Technical SEO, Organic Traffic +180% | Content Strategy'
      ],
      linkedin: [
        'Performance Marketer | Scaled D2C brands from ₹10L to ₹1Cr/mo via Meta & Google Ads',
        'Growth Marketer & SEO Lead | Inbound Organic Growth & Paid Acquisition Specialist',
        'Digital Marketing Manager | Omnichannel Acquisition, Email Automations & Retention'
      ],
      resume: [
        'Results-driven Performance Marketing Specialist with ₹2Cr+ managed ad budgets and 4x average ROAS',
        'Digital Growth Strategist specializing in SEO, paid customer acquisition, and retention funnels'
      ]
    },
    keyActionVerbs: ['Generated', 'Scaled', 'Acquired', 'Optimized', 'Decreased', 'Executed'],
    topSearchKeywords: ['Search Engine Optimization (SEO)', 'Google Ads (SEM)', 'Meta Ads', 'Conversion Rate Optimization (CRO)', 'Email Marketing & Automation', 'Google Analytics 4 (GA4)', 'ROAS'],
    mustHaveSkills: ['Search Engine Optimization (SEO)', 'Google Ads (SEM)', 'Meta Ads', 'Google Analytics 4 (GA4)'],
    distractorSkills: ['Sharing WhatsApp messages', 'Posting random memes', 'Copy pasting Facebook posts']
  },

  // R5. HR / Talent Acquisition
  {
    id: 'hr-talent-acquisition',
    title: 'HR / Talent Acquisition',
    name: 'HR / Talent Acquisition',
    function: 'hr',
    aliases: ['recruiter', 'technical recruiter', 'talent acquisition specialist', 'hr generalist'],
    level: 'mid',
    category: 'Finance & HR',
    description: 'End-to-end recruitment, tech sourcing, ATS pipelines, onboarding, compensation benchmarking',
    typicalSalaryLakhs: { min: 5, median: 11, top: 22 },
    coreSkills: ['sourcing', 'boolean search', 'recruitment', 'hr analytics', 'ats', 'interview', 'onboarding', 'employer branding'],
    boosterSkills: ['workday', 'greenhouse', 'lever', 'talent pipeline', 'six sigma', 'compensation benchmarking'],
    noiseSkills: ['java', 'python', 'hardware'],
    verbSets: ['hired', 'sourced', 'managed', 'onboarded', 'built', 'reduced', 'streamlined', 'coordinated'],
    metricExamples: ['hires closed', 'time-to-fill days', 'offer acceptance %', 'retention rate', 'reqs filled'],
    benchmarkKey: 'hr-talent-acquisition',
    headlineTemplates: {
      naukri: [
        'Talent Acquisition Specialist | Tech Hiring | 85+ Hires Closed/yr | Workday & Greenhouse',
        'Senior Technical Recruiter | Sourcing Specialist | 92% Offer Acceptance | IT Metro',
        'HR Business Partner | Recruiting, HRIS, Employee Engagement & Retention'
      ],
      linkedin: [
        'Senior Tech Recruiter @ Unicorn | Closed 70+ SDE-2/3 & Engineering Leads | Time-to-fill 24 days',
        'Talent Acquisition Partner | Full-lifecycle tech recruitment & employer branding',
        'People Operations & HR Lead | Scaling engineering teams from 20 to 150+'
      ],
      resume: [
        'Technical Talent Acquisition Specialist with demonstrated track record of closing high-bar engineering roles',
        'HR Recruitment Professional specializing in strategic sourcing, pipeline development, and candidate experience'
      ]
    },
    keyActionVerbs: ['Sourced', 'Hired', 'Negotiated', 'Streamlined', 'Onboarded', 'Partnered'],
    topSearchKeywords: ['Technical Sourcing', 'Boolean Search', 'ATS (Greenhouse/Workday)', 'Talent Pipeline', 'Offer Acceptance Rate', 'HR Analytics'],
    mustHaveSkills: ['Sourcing', 'Boolean Search', 'Recruitment', 'ATS'],
    distractorSkills: ['Handwriting resume notes', 'Greeting visitors at lobby', 'Typing speed test pass']
  },

  // R6. Sales / Business Development
  {
    id: 'sales-development',
    title: 'Sales / Business Development',
    name: 'Business / Sales Development',
    function: 'sales',
    aliases: ['bdr', 'sdr', 'business development manager', 'account executive', 'inside sales'],
    level: 'mid',
    category: 'Marketing & Sales',
    description: 'Outbound sales, enterprise pipeline, cold cadences, B2B deal qualification, CRM mastery',
    typicalSalaryLakhs: { min: 5, median: 11, top: 24 },
    coreSkills: ['crm', 'lead generation', 'negotiation', 'prospecting', 'salesforce', 'hubspot', 'account management'],
    boosterSkills: ['linkedin sales navigator', 'outreach', 'salesloft', 'meddic', 'territory management', 'channel sales'],
    noiseSkills: ['java', 'c++', 'algorithms', 'data structures'],
    verbSets: ['grew', 'generated', 'closed', 'negotiated', 'acquired', 'expanded', 'converted', 'exceeded'],
    metricExamples: ['quota attainment %', 'revenue generated (₹ Cr)', 'pipeline value', 'new logos signed', 'deal size'],
    benchmarkKey: 'sales-development',
    headlineTemplates: {
      naukri: [
        'BDR / SDR Lead | B2B SaaS Enterprise Sales | Generated ₹2.4 Cr Pipeline | Apollo & Salesforce',
        'Senior Inside Sales Specialist | US/UK Outbound Cadences | 120% Quota Attainment',
        'Business Development Executive | Lead Qualification, Cold Outreach & Product Demos'
      ],
      linkedin: [
        'Enterprise SDR @ SaaS | ₹3 Cr Qualified Pipeline Generated in FY25 | Outbound Champion',
        'Senior BDR | B2B SaaS Prospecting & Enterprise Deal Discovery | Top Performer Q1-Q4',
        'Inside Sales Representative | High-Velocity Outbound Prospecting & Account-Based Selling'
      ],
      resume: [
        'High-achieving Business Development Representative with consecutive quarterly quota exceedance',
        'B2B Sales Professional specializing in multi-touch outbound prospecting and pipeline acceleration'
      ]
    },
    keyActionVerbs: ['Generated', 'Negotiated', 'Closed', 'Secured', 'Exceeded', 'Prospected'],
    topSearchKeywords: ['B2B Sales', 'Pipeline Management', 'Cold Outreach & Cadences', 'Salesforce / HubSpot CRM', 'Client Demos & Pitching', 'Account-Based Marketing'],
    mustHaveSkills: ['B2B Sales', 'Cold Outreach & Cadences', 'Pipeline Management', 'Salesforce / HubSpot CRM'],
    distractorSkills: ['Counter cashier', 'Store attendance', 'Collecting coupons', 'Telecalling loan recovery']
  },

  // R7. Finance / MBA Analyst
  {
    id: 'finance-analyst',
    title: 'Finance / MBA Analyst',
    name: 'Finance / MBA Analyst',
    function: 'finance',
    aliases: ['financial analyst', 'fp&a analyst', 'finance associate', 'investment analyst'],
    level: 'mid',
    category: 'Finance & HR',
    description: 'Financial modeling, budgeting, forecasting, variance analysis, MIS reporting, FP&A',
    typicalSalaryLakhs: { min: 7, median: 15, top: 32 },
    coreSkills: ['financial modeling', 'budgeting', 'forecasting', 'excel', 'mis reporting', 'business analysis', 'fp&a', 'reconciliation'],
    boosterSkills: ['power bi', 'sql', 'sap fico', 'python', 'tableau', 'quickbooks', 'xero', 'dbt'],
    noiseSkills: ['java', 'hardware', 'design'],
    verbSets: ['forecast', 'analyzed', 'modeled', 'reduced', 'optimized', 'reconciled', 'automated', 'supported'],
    metricExamples: ['cost savings (₹)', 'forecast accuracy %', 'budget variance %', 'closing time reduction', 'reports automated'],
    benchmarkKey: 'finance-analyst',
    headlineTemplates: {
      naukri: [
        'Financial Analyst | Financial Modeling & FP&A | ₹50 Cr+ Budgeting | Advanced Excel & Power BI',
        'Senior Finance Associate | Corporate Valuation, DCF & M&A Due Diligence | MBA Finance',
        'FP&A Specialist | Budget Variance, Cash Flow Forecasting & SAP FICO'
      ],
      linkedin: [
        'Financial Analyst | FP&A & Corporate Finance | Reduced month-end book close from 7 to 3 days',
        'MBA Finance | Financial Modeling, Valuation, Scenario Analysis | Ex-Big 4',
        'Senior Financial Analyst | Capital budgeting, OPEX/CAPEX variance tracking'
      ],
      resume: [
        'Financial Analyst specializing in dynamic three-statement financial modeling and forecasting',
        'FP&A Professional with proven experience managing multi-crore operating budgets and variance reporting'
      ]
    },
    keyActionVerbs: ['Forecasted', 'Modeled', 'Reconciled', 'Automated', 'Analyzed', 'Optimized'],
    topSearchKeywords: ['Financial Modeling', 'Budgeting & Forecasting', 'FP&A', 'Advanced Excel', 'MIS Reporting', 'Power BI / SQL'],
    mustHaveSkills: ['Financial Modeling', 'Budgeting', 'Excel', 'FP&A'],
    distractorSkills: ['Counting cash bills', 'Writing manual deposit receipts', 'Opening bank passbook']
  },

  // R8. UI/UX Designer
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    name: 'UI/UX Designer',
    function: 'design',
    aliases: ['product designer', 'ux designer', 'visual designer', 'interaction designer'],
    level: 'mid',
    category: 'Product & Design',
    description: 'Design systems, Figma components, interaction design, usability research, responsive prototypes',
    typicalSalaryLakhs: { min: 6, median: 14, top: 28 },
    coreSkills: ['figma', 'ux design', 'ui design', 'wireframing', 'prototyping', 'user research', 'design systems'],
    boosterSkills: ['usability testing', 'adobe xd', 'sketch', 'zeplin', 'information architecture', 'interaction design', 'framer'],
    noiseSkills: ['java', 'c++', 'sql', 'salesforce'],
    verbSets: ['designed', 'prototyped', 'researched', 'validated', 'improved', 'streamlined', 'built', 'led'],
    metricExamples: ['task success %', 'usability score', 'design system components', 'conversion lift', 'users tested'],
    benchmarkKey: 'ui-ux-designer',
    headlineTemplates: {
      naukri: [
        'UI/UX Designer | Figma Design Systems & Prototyping | User Research & Mobile Apps',
        'Senior Product Designer | SaaS Dashboards & Mobile UX | Micro-interactions & WCAG',
        'Visual & UX Designer | Wireframing, User Journey Mapping, Usability Testing | 3+ Yrs'
      ],
      linkedin: [
        'Product Designer @ SaaS | Figma Specialist | Redesigned checkout funnel boosting conversion 24%',
        'Senior UI/UX Designer | Design Systems Architect | Human-Centered Design',
        'Lead Product Designer | B2B SaaS & Consumer Apps | Portfolio: yourportfolio.com'
      ],
      resume: [
        'End-to-End Product Designer specializing in complex B2B workflow simplification and design systems',
        'UI/UX Designer with proven capability in user research, wireframing, and interactive prototyping'
      ]
    },
    keyActionVerbs: ['Designed', 'Prototyped', 'Standardized', 'Conducted', 'Iterated', 'Unified'],
    topSearchKeywords: ['Figma', 'Design Systems', 'Wireframing & Prototyping', 'User Research', 'Information Architecture', 'Accessibility (WCAG)', 'User Flows'],
    mustHaveSkills: ['Figma', 'Design Systems', 'Wireframing & Prototyping', 'User Research'],
    distractorSkills: ['Print Banner Flex Printing', 'CorelDraw 9', 'Brochure folding', 'Logo painting']
  },

  // R9. Content Writer / SEO Specialist
  {
    id: 'content-writer-seo',
    title: 'Content Writer / SEO Specialist',
    name: 'Content Writer / SEO Specialist',
    function: 'marketing',
    aliases: ['seo copywriter', 'content marketer', 'technical writer', 'blog strategist'],
    level: 'mid',
    category: 'Marketing & Sales',
    description: 'Technical SEO, keyword research, long-form content, brand voice, organic traffic growth',
    typicalSalaryLakhs: { min: 4, median: 9, top: 18 },
    coreSkills: ['content writing', 'seo', 'copywriting', 'keyword research', 'content strategy', 'grammar', 'editing', 'blogging'],
    boosterSkills: ['ahrefs', 'semrush', 'word count optimization', 'cms', 'google analytics', 'hubspot', 'mailchimp'],
    noiseSkills: ['java', 'python', 'c++', 'hardware'],
    verbSets: ['wrote', 'ranked', 'optimized', 'edited', 'published', 'grew', 'strategized', 'repurposed'],
    metricExamples: ['organic traffic % growth', 'keyword rankings (#1-3)', 'word count produced', 'conversion %', 'engagement time'],
    benchmarkKey: 'content-writer-seo',
    headlineTemplates: {
      naukri: [
        'SEO Content Writer | 3+ yrs | Ranked 85+ High-Intent Keywords #1 on Google | Ahrefs & GA4',
        'Senior Content Strategist | B2B SaaS Blogs & Whitepapers | Drove 250k Monthly Organic Visits',
        'Technical Copywriter | Keyword Research, On-Page SEO, Long-Form Content & Case Studies'
      ],
      linkedin: [
        'SEO Content Strategist | Grew organic blog traffic 240% YoY via high-authority cluster strategy',
        'Senior B2B Copywriter | Conversion-focused landing pages & SaaS product narratives',
        'Content Marketing Lead | Editorial calendars, SEO keyword research & organic pipeline'
      ],
      resume: [
        'Results-oriented SEO Content Strategist with proven capability in top-tier Google ranking and content funnels',
        'B2B SaaS Copywriter specializing in converting organic readers into qualified sales demo requests'
      ]
    },
    keyActionVerbs: ['Authored', 'Ranked', 'Optimized', 'Published', 'Grew', 'Researched'],
    topSearchKeywords: ['SEO Writing', 'Keyword Research (Ahrefs/SEMrush)', 'On-Page SEO', 'Copywriting', 'Content Strategy', 'Google Analytics'],
    mustHaveSkills: ['Content Writing', 'SEO', 'Copywriting', 'Keyword Research'],
    distractorSkills: ['Handwriting greeting cards', 'Filling crosswords', 'Transcribing audio cassettes']
  },

  // R10. Business Operations / Project Manager
  {
    id: 'business-ops-pm',
    title: 'Business Operations / Project Manager',
    name: 'Business Operations / Project Manager',
    function: 'ops',
    aliases: ['project manager', 'agile scrum master', 'operations manager', 'program manager'],
    level: 'mid',
    category: 'Operations',
    description: 'Sprint planning, cross-functional delivery, resource management, process optimization, Six Sigma',
    typicalSalaryLakhs: { min: 8, median: 17, top: 35 },
    coreSkills: ['project management', 'agile', 'scrum', 'stakeholder management', 'jira', 'resource planning', 'risk management', 'six sigma'],
    boosterSkills: ['prince2', 'pmp', 'asana', 'ms project', 'confluence', 'change management', 'process improvement'],
    noiseSkills: ['java', 'c++', 'hardware'],
    verbSets: ['delivered', 'led', 'coordinated', 'optimized', 'reduced', 'streamlined', 'owned', 'launched'],
    metricExamples: ['on-time delivery %', 'budget variance %', 'process time reduction', 'team size managed', 'project scope ($)'],
    benchmarkKey: 'business-ops-pm',
    headlineTemplates: {
      naukri: [
        'Project Manager | PMP & Certified ScrumMaster (CSM) | Delivered $4M Projects | Jira & Agile',
        'Business Operations Lead | Process Streamlining & Cost Reduction | 98% On-Time Sprint Velocity',
        'Technical Project Manager | Cross-Functional Engineering Delivery & Risk Mitigation'
      ],
      linkedin: [
        'Senior Project Manager | Agile & Scrum Leader | Orchestrated 14 sprints across 3 engineering squads',
        'Business Operations Manager | Automated manual reconciliation workflows cutting cycle time 40%',
        'Program Manager | Enterprise digital transformation & stakeholder alignment'
      ],
      resume: [
        'Certified Project Manager (PMP/CSM) with 4+ years leading complex software and business deployments',
        'Business Operations Professional specializing in Agile execution, velocity optimization, and risk control'
      ]
    },
    keyActionVerbs: ['Delivered', 'Orchestrated', 'Optimized', 'Streamlined', 'Mitigated', 'Managed'],
    topSearchKeywords: ['Project Management', 'Agile & Scrum', 'Jira / Confluence', 'PMP / CSM', 'Stakeholder Management', 'Risk Management'],
    mustHaveSkills: ['Project Management', 'Agile & Scrum', 'Jira', 'Stakeholder Management'],
    distractorSkills: ['Arranging office chairs', 'Ordering tea and snacks', 'Stocking printer papers']
  }
];

export const CITIES_LIST = [
  { name: 'Bangalore / Bengaluru', tier: 'Tier 1' },
  { name: 'Hyderabad', tier: 'Tier 1' },
  { name: 'Pune', tier: 'Tier 1' },
  { name: 'Delhi NCR (Gurgaon / Noida)', tier: 'Tier 1' },
  { name: 'Mumbai / Navi Mumbai', tier: 'Tier 1' },
  { name: 'Chennai', tier: 'Tier 1' },
  { name: 'Ahmedabad', tier: 'Tier 2' },
  { name: 'Kolkata', tier: 'Tier 2' },
  { name: 'Kochi / Trivandrum', tier: 'Tier 2' },
  { name: 'Indore', tier: 'Tier 2' },
  { name: 'Chandigarh / Mohali', tier: 'Tier 2' },
  { name: 'Jaipur', tier: 'Tier 2' },
  { name: 'Remote (Pan India)', tier: 'Tier 1' }
];
