import { KeywordItem } from '../types';

export const ROLE_KEYWORDS_DATA: Record<string, Omit<KeywordItem, 'countInProfile' | 'status'>[]> = {
  'backend-engineer': [
    { name: 'Java', category: 'must-have', monthlySearches: 185000, importance: 'critical', recommendation: 'Include in headline & 3+ experience bullets' },
    { name: 'Spring Boot', category: 'must-have', monthlySearches: 142000, importance: 'critical', recommendation: 'Essential filter keyword on Naukri recruiter search' },
    { name: 'Microservices', category: 'must-have', monthlySearches: 128000, importance: 'critical', recommendation: 'Shows architectural maturity over monolithic code' },
    { name: 'REST APIs', category: 'must-have', monthlySearches: 96000, importance: 'high', recommendation: 'Standard API protocol expected in every technical screen' },
    { name: 'PostgreSQL', category: 'high-value', monthlySearches: 88000, importance: 'high', recommendation: 'Specific RDBMS favored over generic SQL keywords' },
    { name: 'Kafka', category: 'booster', monthlySearches: 74000, importance: 'high', recommendation: 'Boosts salary tier from ₹12L to ₹20L+ when paired with Java' },
    { name: 'Redis', category: 'booster', monthlySearches: 62000, importance: 'medium', recommendation: 'Signals hands-on caching and high-throughput performance experience' },
    { name: 'Docker', category: 'high-value', monthlySearches: 91000, importance: 'high', recommendation: 'Containerization is table-stakes for product companies' },
    { name: 'AWS', category: 'high-value', monthlySearches: 110000, importance: 'high', recommendation: 'Recruiters specifically filter for AWS or Azure on Naukri' },
    { name: 'System Design', category: 'booster', monthlySearches: 45000, importance: 'medium', recommendation: 'Key indicator for SDE-2 and Senior Engineer shortlisting' },
    { name: 'MS Office', category: 'distractor', monthlySearches: 500, importance: 'low', recommendation: 'Cut immediately. Makes experienced engineers look junior' },
    { name: 'Eclipse IDE', category: 'distractor', monthlySearches: 200, importance: 'low', recommendation: 'Outdated noise keyword. Cut to save visual scan space' },
    { name: 'Core Java', category: 'distractor', monthlySearches: 35000, importance: 'medium', recommendation: 'Replace "Core Java" with "Java 17 / Spring Boot Microservices"' }
  ],
  'fullstack-developer': [
    { name: 'React', category: 'must-have', monthlySearches: 198000, importance: 'critical', recommendation: 'Top frontend library filter on Indian job boards' },
    { name: 'Node.js', category: 'must-have', monthlySearches: 154000, importance: 'critical', recommendation: 'Core backend requirement for full-stack profiles' },
    { name: 'TypeScript', category: 'high-value', monthlySearches: 112000, importance: 'high', recommendation: 'Differentiates modern full-stack engineers from legacy JS devs' },
    { name: 'Next.js', category: 'booster', monthlySearches: 82000, importance: 'high', recommendation: 'High-demand SSR/Fullstack framework multiplier' },
    { name: 'MongoDB', category: 'high-value', monthlySearches: 94000, importance: 'high', recommendation: 'MERN stack core filter query' },
    { name: 'PostgreSQL', category: 'high-value', monthlySearches: 85000, importance: 'high', recommendation: 'Relational data modeling capability' },
    { name: 'REST APIs', category: 'must-have', monthlySearches: 92000, importance: 'high', recommendation: 'Full-stack integration proof' },
    { name: 'Tailwind CSS', category: 'booster', monthlySearches: 68000, importance: 'medium', recommendation: 'Modern UI styling standard in product startups' },
    { name: 'Docker', category: 'booster', monthlySearches: 76000, importance: 'medium', recommendation: 'DevOps & local container orchestration' },
    { name: 'AWS', category: 'booster', monthlySearches: 98000, importance: 'high', recommendation: 'Deployment & serverless architecture signal' },
    { name: 'HTML/CSS Basics', category: 'distractor', monthlySearches: 300, importance: 'low', recommendation: 'Cut basic entry. Subsumed by React and Tailwind' },
    { name: 'jQuery', category: 'distractor', monthlySearches: 1500, importance: 'low', recommendation: 'Remove legacy library unless applying to legacy maintenance' }
  ],
  'frontend-developer': [
    { name: 'React', category: 'must-have', monthlySearches: 198000, importance: 'critical', recommendation: 'Primary search query for frontend recruiters' },
    { name: 'TypeScript', category: 'must-have', monthlySearches: 115000, importance: 'critical', recommendation: 'Mandatory filter for top product tier roles' },
    { name: 'Next.js', category: 'high-value', monthlySearches: 84000, importance: 'high', recommendation: 'SSR, SEO, and fullstack react framework' },
    { name: 'Redux / Zustand', category: 'high-value', monthlySearches: 79000, importance: 'high', recommendation: 'State management for large-scale enterprise frontends' },
    { name: 'Tailwind CSS', category: 'high-value', monthlySearches: 71000, importance: 'medium', recommendation: 'Rapid utility-first styling capability' },
    { name: 'Web Performance Optimization', category: 'booster', monthlySearches: 42000, importance: 'high', recommendation: 'Core Web Vitals & bundle optimization distinguishes senior engineers' },
    { name: 'HTML5 & CSS3', category: 'must-have', monthlySearches: 90000, importance: 'medium', recommendation: 'Semantic HTML and responsive design basics' },
    { name: 'Design Systems', category: 'booster', monthlySearches: 36000, importance: 'medium', recommendation: 'Component libraries, Storybook, UI consistency' },
    { name: 'Dreamweaver', category: 'distractor', monthlySearches: 50, importance: 'low', recommendation: 'Cut immediately' },
    { name: 'Bootstrap 3', category: 'distractor', monthlySearches: 800, importance: 'low', recommendation: 'Cut legacy mentions' }
  ],
  'devops-engineer': [
    { name: 'Kubernetes', category: 'must-have', monthlySearches: 135000, importance: 'critical', recommendation: 'The #1 infrastructure container orchestration filter' },
    { name: 'AWS', category: 'must-have', monthlySearches: 145000, importance: 'critical', recommendation: 'Top public cloud platform query in India' },
    { name: 'Docker', category: 'must-have', monthlySearches: 120000, importance: 'critical', recommendation: 'Container runtime baseline' },
    { name: 'Terraform', category: 'must-have', monthlySearches: 95000, importance: 'critical', recommendation: 'Infrastructure as Code (IaC) requirement' },
    { name: 'CI/CD Pipelines', category: 'must-have', monthlySearches: 110000, importance: 'critical', recommendation: 'Automated release lifecycle (Jenkins/GitHub Actions)' },
    { name: 'Linux / Bash', category: 'high-value', monthlySearches: 85000, importance: 'high', recommendation: 'Core OS administration & scripting' },
    { name: 'Prometheus & Grafana', category: 'booster', monthlySearches: 68000, importance: 'high', recommendation: 'Observability & alerting stack' },
    { name: 'Python', category: 'booster', monthlySearches: 80000, importance: 'medium', recommendation: 'DevOps automation & script tooling' },
    { name: 'Hardware Repair', category: 'distractor', monthlySearches: 200, importance: 'low', recommendation: 'Cut immediately. Cloud engineers do not do hardware' }
  ],
  'data-engineer': [
    { name: 'Python', category: 'must-have', monthlySearches: 165000, importance: 'critical', recommendation: 'Primary language for data manipulation & PySpark' },
    { name: 'SQL', category: 'must-have', monthlySearches: 155000, importance: 'critical', recommendation: 'Complex analytical queries, window functions, CTEs' },
    { name: 'Apache Spark', category: 'must-have', monthlySearches: 102000, importance: 'critical', recommendation: 'Distributed big data computing standard' },
    { name: 'Snowflake', category: 'high-value', monthlySearches: 78000, importance: 'high', recommendation: 'Cloud data warehousing market leader' },
    { name: 'Airflow', category: 'high-value', monthlySearches: 69000, importance: 'high', recommendation: 'Data pipeline orchestration DAGs' },
    { name: 'dbt', category: 'booster', monthlySearches: 48000, importance: 'high', recommendation: 'Modern analytics engineering transformation standard' },
    { name: 'Kafka', category: 'booster', monthlySearches: 62000, importance: 'medium', recommendation: 'Real-time event data streaming' },
    { name: 'Typing Speed', category: 'distractor', monthlySearches: 100, importance: 'low', recommendation: 'Cut noise keyword' }
  ],
  'product-manager': [
    { name: 'Product Roadmapping', category: 'must-have', monthlySearches: 85000, importance: 'critical', recommendation: 'Strategic prioritization and timeline governance' },
    { name: 'PRD & Feature Specs', category: 'must-have', monthlySearches: 72000, importance: 'critical', recommendation: 'Requirement documentation and user stories' },
    { name: 'Agile & Scrum', category: 'must-have', monthlySearches: 95000, importance: 'high', recommendation: 'Sprint ceremonies and squad execution' },
    { name: 'A/B Testing', category: 'high-value', monthlySearches: 54000, importance: 'high', recommendation: 'Hypothesis validation and growth metrics' },
    { name: 'User Research', category: 'high-value', monthlySearches: 61000, importance: 'high', recommendation: 'Customer interviews, JTBD framework' },
    { name: 'Mixpanel / Amplitude', category: 'booster', monthlySearches: 44000, importance: 'high', recommendation: 'Funnel drop-off and retention cohort analysis' },
    { name: 'Go-To-Market', category: 'booster', monthlySearches: 38000, importance: 'medium', recommendation: 'Launch readiness and commercial rollout' },
    { name: 'MS Paint', category: 'distractor', monthlySearches: 50, importance: 'low', recommendation: 'Cut immediately' }
  ],
  'qa-engineer': [
    { name: 'Selenium', category: 'must-have', monthlySearches: 130000, importance: 'critical', recommendation: 'Core automated browser test framework' },
    { name: 'Java', category: 'must-have', monthlySearches: 110000, importance: 'critical', recommendation: 'Most requested language for SDET roles in India' },
    { name: 'Postman / Newman', category: 'must-have', monthlySearches: 85000, importance: 'high', recommendation: 'API validation and automated contract tests' },
    { name: 'Test Automation', category: 'must-have', monthlySearches: 95000, importance: 'critical', recommendation: 'Key distinction from manual test profiles' },
    { name: 'Playwright', category: 'booster', monthlySearches: 58000, importance: 'high', recommendation: 'Fastest-growing modern test automation framework' },
    { name: 'Cypress', category: 'high-value', monthlySearches: 62000, importance: 'high', recommendation: 'Frontend end-to-end framework' },
    { name: 'CI/CD Pipelines', category: 'booster', monthlySearches: 50000, importance: 'medium', recommendation: 'Shift-left automated test execution in Jenkins' },
    { name: 'Paper Documentation', category: 'distractor', monthlySearches: 50, importance: 'low', recommendation: 'Cut noise' }
  ],
  'uiux-designer': [
    { name: 'Figma', category: 'must-have', monthlySearches: 125000, importance: 'critical', recommendation: 'Industry-standard UI/UX vector design & prototyping tool' },
    { name: 'Design Systems', category: 'must-have', monthlySearches: 78000, importance: 'critical', recommendation: 'Reusable components, tokens, typography systems' },
    { name: 'Wireframing & Prototyping', category: 'must-have', monthlySearches: 82000, importance: 'high', recommendation: 'Low to high fidelity interactive user flows' },
    { name: 'User Research', category: 'high-value', monthlySearches: 65000, importance: 'high', recommendation: 'Usability testing, customer persona formulation' },
    { name: 'Accessibility (WCAG)', category: 'booster', monthlySearches: 32000, importance: 'high', recommendation: 'Inclusive design compliance standard' },
    { name: 'Information Architecture', category: 'booster', monthlySearches: 41000, importance: 'medium', recommendation: 'Navigation taxonomy and sitemaps' },
    { name: 'CorelDraw', category: 'distractor', monthlySearches: 500, importance: 'low', recommendation: 'Cut print shop tool for digital product design' }
  ],
  'digital-marketing': [
    { name: 'Google Ads (SEM)', category: 'must-have', monthlySearches: 98000, importance: 'critical', recommendation: 'Core paid search and intent capture channel' },
    { name: 'Meta Ads', category: 'must-have', monthlySearches: 89000, importance: 'critical', recommendation: 'Paid social acquisition & creative testing' },
    { name: 'Search Engine Optimization (SEO)', category: 'must-have', monthlySearches: 110000, importance: 'critical', recommendation: 'Organic inbound traffic engine' },
    { name: 'Google Analytics 4 (GA4)', category: 'must-have', monthlySearches: 76000, importance: 'high', recommendation: 'Mandatory measurement and attribution platform' },
    { name: 'ROAS Optimization', category: 'booster', monthlySearches: 46000, importance: 'high', recommendation: 'Return on ad spend proof for performance marketers' },
    { name: 'Conversion Rate Optimization (CRO)', category: 'booster', monthlySearches: 39000, importance: 'high', recommendation: 'Landing page experimentation & funnel yield' },
    { name: 'Pamphlet Distribution', category: 'distractor', monthlySearches: 50, importance: 'low', recommendation: 'Cut physical marketing noise' }
  ],
  'sales-development': [
    { name: 'B2B Sales', category: 'must-have', monthlySearches: 94000, importance: 'critical', recommendation: 'Enterprise business to business qualification' },
    { name: 'Pipeline Management', category: 'must-have', monthlySearches: 78000, importance: 'critical', recommendation: 'Funnel stages, SQLs, quota pacing' },
    { name: 'Cold Outreach & Cadences', category: 'must-have', monthlySearches: 66000, importance: 'high', recommendation: 'Outbound sequences via email & phone' },
    { name: 'Salesforce / HubSpot CRM', category: 'must-have', monthlySearches: 82000, importance: 'high', recommendation: 'CRM hygiene, lead enrichment, activity tracking' },
    { name: 'Client Demos & Pitching', category: 'high-value', monthlySearches: 58000, importance: 'high', recommendation: 'Solution value presentation & objection handling' },
    { name: 'Contract Negotiation', category: 'booster', monthlySearches: 41000, importance: 'medium', recommendation: 'Commercial terms and closing momentum' },
    { name: 'Bill Collection', category: 'distractor', monthlySearches: 100, importance: 'low', recommendation: 'Cut recovery noise' }
  ]
};
