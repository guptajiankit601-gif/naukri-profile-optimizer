export interface RoleDefinition {
  id: string;
  name: string;
  category: 'Engineering' | 'Data & AI' | 'Product & Design' | 'Marketing & Sales';
  description: string;
  typicalSalaryLakhs: { min: number; median: number; top: number };
  headlineTemplates: {
    naukri: string[];
    linkedin: string[];
    resume: string[];
  };
  keyActionVerbs: string[];
  topSearchKeywords: string[];
  mustHaveSkills: string[];
  distractorSkills: string[]; // skills that look junior or irrelevant
}

export const ROLES: RoleDefinition[] = [
  {
    id: 'backend-engineer',
    name: 'Backend Engineer',
    category: 'Engineering',
    description: 'High-throughput APIs, distributed systems, relational & NoSQL databases, microservices',
    typicalSalaryLakhs: { min: 8, median: 18, top: 38 },
    headlineTemplates: {
      naukri: [
        'Backend Engineer | Java & Spring Boot | Microservices & Kafka | 20k+ TPS',
        'Senior Backend Developer | Node.js & Go | Distributed Systems | AWS Cloud',
        'Software Engineer - Backend | Python & FastAPI | PostgreSQL & Redis | 3+ Yrs Exp'
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
    keyActionVerbs: ['Architected', 'Engineered', 'Optimized', 'Refactored', 'Deployed', 'Triaged'],
    topSearchKeywords: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Redis', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs', 'System Design'],
    mustHaveSkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Microservices'],
    distractorSkills: ['MS Word', 'Typing', 'HTML/CSS Basics', 'Basic C', 'Eclipse IDE', 'Windows 10', 'Manual Testing']
  },
  {
    id: 'fullstack-developer',
    name: 'Full Stack Developer',
    category: 'Engineering',
    description: 'End-to-end web applications combining React/Next.js frontend with Node/Python/Java backends',
    typicalSalaryLakhs: { min: 7, median: 16, top: 34 },
    headlineTemplates: {
      naukri: [
        'Full Stack Developer | React, Node.js & TypeScript | AWS & PostgreSQL',
        'Senior Full Stack Engineer | Next.js, Spring Boot & Docker | Scaled E-Commerce',
        'MERN Stack Developer | React.js, Express, MongoDB, Redux | 3+ Yrs Exp'
      ],
      linkedin: [
        'Full Stack Engineer | React, Next.js, Node.js, AWS | Building high-conversion SaaS web apps',
        'Senior Full Stack Developer | TypeScript, GraphQL, PostgreSQL | Open Source Contributor',
        'Full Stack Software Engineer | Microfrontends & Distributed Services'
      ],
      resume: [
        'Versatile Full Stack Engineer with 3+ years experience delivering scalable web applications',
        'Full Stack Software Developer focused on frontend performance and resilient backend services'
      ]
    },
    keyActionVerbs: ['Built', 'Developed', 'Integrated', 'Automated', 'Scaled', 'Engineered'],
    topSearchKeywords: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Next.js', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Docker', 'Tailwind CSS'],
    mustHaveSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'SQL'],
    distractorSkills: ['Data Entry', 'Adobe Photoshop', 'Wordpress plugins', 'jQuery', 'Visual Studio 2010']
  },
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    category: 'Engineering',
    description: 'Modern UI/UX engineering, Core Web Vitals, state architecture with React/Next.js and TypeScript',
    typicalSalaryLakhs: { min: 6, median: 15, top: 30 },
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
  {
    id: 'devops-engineer',
    name: 'DevOps / Cloud Engineer',
    category: 'Engineering',
    description: 'Kubernetes orchestration, CI/CD pipelines, Terraform IaC, AWS/Azure, observability',
    typicalSalaryLakhs: { min: 9, median: 20, top: 42 },
    headlineTemplates: {
      naukri: [
        'DevOps Engineer | AWS & Kubernetes | Terraform & Docker | CI/CD Automation',
        'Senior Cloud & DevOps Architect | Multi-Cloud (AWS/Azure) | Helm & Prometheus',
        'Site Reliability Engineer (SRE) | Linux, Python, Terraform, Kubernetes | 99.99% Uptime'
      ],
      linkedin: [
        'DevOps / SRE Engineer | Kubernetes, Terraform, AWS | Automated 50+ Deployments/day',
        'Lead Cloud Engineer | Multi-region AWS Infrastructure | Cost Optimization Champion ($120k/yr saved)',
        'DevOps Engineer | GitOps, ArgoCD, Prometheus, Docker | Infrastructure as Code'
      ],
      resume: [
        'Cloud & DevOps Engineer with proven track record of architecting fault-tolerant infrastructure',
        'Site Reliability & DevOps Specialist with 4+ years in zero-downtime CI/CD deployments'
      ]
    },
    keyActionVerbs: ['Automated', 'Provisioned', 'Orchestrated', 'Hardened', 'Migrated', 'Monitored'],
    topSearchKeywords: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'Linux / Bash', 'Prometheus & Grafana', 'Python', 'Azure', 'GitOps'],
    mustHaveSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD Pipelines', 'Linux / Bash'],
    distractorSkills: ['Desktop Support', 'Hardware Assembling', 'Printer Config', 'Windows XP', 'LAN Cable Crimping']
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer / Scientist',
    category: 'Data & AI',
    description: 'Big data pipelines, PySpark, Snowflake/BigQuery, ETL/ELT workflows with Airflow & dbt',
    typicalSalaryLakhs: { min: 8, median: 19, top: 40 },
    headlineTemplates: {
      naukri: [
        'Data Engineer | Apache Spark & Python | Snowflake, dbt & Airflow | Terabyte Pipelines',
        'Senior Data Platform Engineer | PySpark, Kafka, AWS Redshift | Real-time Streaming',
        'Data Scientist / ML Engineer | Python, LLMs, PyTorch, SQL | Production ML'
      ],
      linkedin: [
        'Data Engineer | PySpark, Airflow, Snowflake, AWS | Architected 10TB+ daily lakehouse',
        'Senior Data Engineer | Streaming pipelines with Kafka & Flink | Ex-Fintech',
        'Machine Learning & Data Engineer | RAG, LLMs, Vector DBs, Python'
      ],
      resume: [
        'Data Platform Engineer specializing in large-scale batch and real-time streaming architectures',
        'Quantitative Data Scientist & Engineer with deep expertise in PySpark, SQL, and predictive models'
      ]
    },
    keyActionVerbs: ['Constructed', 'Pipelines', 'Optimized', 'Transformed', 'Aggregated', 'Modeled'],
    topSearchKeywords: ['Python', 'SQL', 'Apache Spark', 'Snowflake', 'Airflow', 'dbt', 'Kafka', 'AWS', 'Pandas & NumPy', 'Machine Learning'],
    mustHaveSkills: ['Python', 'SQL', 'Apache Spark', 'Airflow', 'Data Modeling'],
    distractorSkills: ['Excel Macros Only', 'SPSS 11', 'Data Typing', 'Basic Statistics Paperwork']
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Product & Design',
    description: 'Product roadmap, discovery, PRDs, sprint execution, experimentation, user retention metrics',
    typicalSalaryLakhs: { min: 10, median: 22, top: 48 },
    headlineTemplates: {
      naukri: [
        'Product Manager | B2B SaaS & Growth | PRD, Roadmapping & Agile | Scaled ARR to $2M',
        'Senior Product Manager | Fintech & Payments | User Retention & 0-to-1 Launch',
        'Associate Product Manager | Product Analytics, Mixpanel, SQL | Ex-Startup'
      ],
      linkedin: [
        'Product Manager @ FinTech | Driving onboarding funnel conversion (+32%) | Ex-Unicorn',
        'Senior PM | Core Platform & Monetization | Data-Driven Product Discovery',
        'Product Manager | 0 to 1 Builder | Scaled 2 Mobile Apps to 1M+ Downloads'
      ],
      resume: [
        'Outcome-oriented Product Manager with 3+ years experience leading cross-functional squads',
        'Growth Product Manager focused on customer discovery, conversion funnels, and monetization'
      ]
    },
    keyActionVerbs: ['Spearheaded', 'Launched', 'Conceptualized', 'Increased', 'Prioritized', 'Conducted'],
    topSearchKeywords: ['Product Roadmapping', 'PRD & Feature Specs', 'Agile & Scrum', 'A/B Testing', 'User Research', 'Mixpanel / Amplitude', 'SQL', 'Go-To-Market'],
    mustHaveSkills: ['Product Roadmapping', 'PRD & Feature Specs', 'Agile & Scrum', 'User Research'],
    distractorSkills: ['Typing speed 50 wpm', 'Greeting clients', 'Filling spreadsheets', 'Photocopying']
  },
  {
    id: 'qa-engineer',
    name: 'QA / Automation Engineer',
    category: 'Engineering',
    description: 'Test automation frameworks, Selenium/Playwright, API testing, CI/CD test integration, JMeter',
    typicalSalaryLakhs: { min: 5, median: 12, top: 25 },
    headlineTemplates: {
      naukri: [
        'QA Automation Engineer | Selenium, Java & TestNG | API Testing with Postman & RestAssured',
        'Senior SDET | Playwright, TypeScript, CI/CD Integration | Shift-Left Quality',
        'Automation Test Lead | Cypress, Cucumber BDD, Performance Testing JMeter | 4+ Yrs'
      ],
      linkedin: [
        'SDET / QA Automation Engineer | Selenium, Java, RestAssured | 85% Automation Coverage',
        'Senior Quality Engineer | Playwright, CI/CD Pipelines, Performance Testing',
        'Software Development Engineer in Test | Cypress, Jest, Automated Regression'
      ],
      resume: [
        'Software Test Automation Engineer specializing in building scalable frameworks in Java & Playwright',
        'SDET with extensive experience in automated regression suites, API validation, and CI/CD pipelines'
      ]
    },
    keyActionVerbs: ['Automated', 'Executed', 'Discovered', 'Stabilized', 'Formulated', 'Validated'],
    topSearchKeywords: ['Selenium', 'Playwright', 'Cypress', 'Java', 'Python', 'Postman / Newman', 'JUnit / TestNG', 'JMeter', 'Cucumber / BDD', 'CI/CD Pipelines'],
    mustHaveSkills: ['Selenium', 'Java', 'Test Automation', 'API Testing', 'SQL'],
    distractorSkills: ['Checking boxes manually', 'User Acceptance Signoff Only', 'Bug Logging in Notepad']
  },
  {
    id: 'uiux-designer',
    name: 'UI/UX Designer',
    category: 'Product & Design',
    description: 'Design systems, Figma components, interaction design, usability research, responsive prototypes',
    typicalSalaryLakhs: { min: 6, median: 14, top: 28 },
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
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Specialist',
    category: 'Marketing & Sales',
    description: 'Performance marketing, Meta/Google Ads, ROAS scaling, SEO/SEM, GA4 funnel analytics',
    typicalSalaryLakhs: { min: 5, median: 12, top: 26 },
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
  {
    id: 'sales-development',
    name: 'Business / Sales Development',
    category: 'Marketing & Sales',
    description: 'Outbound sales, enterprise pipeline, cold cadences, B2B deal qualification, CRM mastery',
    typicalSalaryLakhs: { min: 5, median: 11, top: 24 },
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
