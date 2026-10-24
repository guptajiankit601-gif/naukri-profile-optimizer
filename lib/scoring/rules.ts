export interface RuleDefinition {
  id: string;
  component: string;
  name: string;
  condition: string;
  maxPoints: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  whyItMatters: string;
  fixTemplate: string;
  exampleSnippet: string;
}

export const SCORING_RULES: Record<string, RuleDefinition> = {
  'R-COMP-01': {
    id: 'R-COMP-01',
    component: 'headlineClarity',
    name: 'Headline Role & Specialization Clarity',
    condition: 'Headline must include primary target role, core specialization, and experience indicator',
    maxPoints: 12,
    severity: 'HIGH',
    whyItMatters: 'Recruiters scan 200+ headlines in search results before opening a profile. Generic titles get passed over.',
    fixTemplate: 'Format as: [Target Role] | [Core Specialization] | [Top Metric / Tech Stack]',
    exampleSnippet: 'Senior Backend Engineer | Java & Spring Boot Microservices | Scaled Systems to 50k TPS'
  },
  'R-COMP-02': {
    id: 'R-COMP-02',
    component: 'summaryQuality',
    name: 'Professional Summary Value Pitch',
    condition: 'Summary must be 25-90 words, contain quantified impact, and avoid objective clichés',
    maxPoints: 10,
    severity: 'MEDIUM',
    whyItMatters: 'Vague summaries like "seeking a challenging position" signal inexperience and waste recruiter attention.',
    fixTemplate: 'Lead with role and years of domain experience, highlight your strongest metric, and summarize core tools.',
    exampleSnippet: 'Backend Engineer with 3+ years experience scaling Java/Spring Boot microservices. Reduced p99 latency by 35% across 5M daily transactions.'
  },
  'R-COMP-03': {
    id: 'R-COMP-03',
    component: 'bulletQuality',
    name: 'Quantified Action-Result Bullets',
    condition: 'Experience bullets must open with power verbs and contain measurable metrics (%, ₹, scale)',
    maxPoints: 20,
    severity: 'CRITICAL',
    whyItMatters: 'Passive bullets ("Responsible for APIs") tell recruiters what you were assigned, not what you achieved.',
    fixTemplate: 'Start with an active verb (Architected, Spearheaded, Optimized), detail the method, and state the quantified result.',
    exampleSnippet: 'Optimized PostgreSQL queries by indexing high-cardinality keys, slashing API response times from 420ms to 95ms.'
  },
  'R-COMP-04': {
    id: 'R-COMP-04',
    component: 'skillStructure',
    name: 'Role-Aligned Skills Architecture',
    condition: 'Profile must contain between 8 and 22 structured skills including all tier-1 must-haves for target role',
    maxPoints: 15,
    severity: 'CRITICAL',
    whyItMatters: 'Naukri search algorithms filter strictly by must-have keywords. Profiles missing key skills never appear.',
    fixTemplate: 'Add missing role must-have skills and remove outdated or irrelevant technologies to maintain keyword density.',
    exampleSnippet: 'Java, Spring Boot, Microservices, Kafka, Redis, PostgreSQL, Docker, AWS, Git'
  },
  'R-COMP-05': {
    id: 'R-COMP-05',
    component: 'educationDetail',
    name: 'Education Credential Completeness',
    condition: 'Degree, institution, and completion year must be explicitly documented',
    maxPoints: 5,
    severity: 'LOW',
    whyItMatters: 'ATS search filters frequently apply degree and graduation year filters to screen candidates.',
    fixTemplate: 'Specify your exact degree title, accredited university or college name, and passing year.',
    exampleSnippet: 'B.Tech in Computer Science | PES University | 2017 - 2021'
  },
  'R-COMP-06': {
    id: 'R-COMP-06',
    component: 'projectsProof',
    name: 'Demonstrated Projects & Proof of Work',
    condition: 'Technical profiles should showcase at least 1-2 verified projects with architecture and links',
    maxPoints: 8,
    severity: 'MEDIUM',
    whyItMatters: 'Proof of work distinguishes top candidates and validates hands-on domain competencies.',
    fixTemplate: 'Add 1-2 featured projects specifying the problem solved, stack used, and live link or GitHub repository.',
    exampleSnippet: 'High-Throughput Checkout Engine: Built Go-based order microservice handling 5,000 requests/sec with Redis queues.'
  },
  'R-COMP-07': {
    id: 'R-COMP-07',
    component: 'certifications',
    name: 'Industry Certifications & Credentials',
    condition: 'Recognized industry or cloud vendor certifications validate specialized expertise',
    maxPoints: 5,
    severity: 'LOW',
    whyItMatters: 'Cloud certifications (AWS, GCP, Azure, CKA) serve as quick trust signals for enterprise recruiters.',
    fixTemplate: 'List valid certifications with credential ID and issuing authority.',
    exampleSnippet: 'AWS Certified Solutions Architect – Associate (Validation ID: AWS-789012)'
  },
  'R-COMP-08': {
    id: 'R-COMP-08',
    component: 'parseability',
    name: 'ATS Parseability & Section Headers',
    condition: 'Resume must use clean standard section headers without complex formatting artifacts',
    maxPoints: 10,
    severity: 'HIGH',
    whyItMatters: 'Multi-column tables and non-standard headings cause ATS parsers to drop entire work histories.',
    fixTemplate: 'Use single-column layout with standard headings: Summary, Experience, Education, Skills, Projects.',
    exampleSnippet: 'WORK EXPERIENCE\nSenior Software Engineer | July 2021 - Present'
  },
  'R-COMP-09': {
    id: 'R-COMP-09',
    component: 'platformConsistency',
    name: 'Cross-Platform Indian Job Board Consistency',
    condition: 'Profile fields must align with standard Naukri / LinkedIn data structures and character budgets',
    maxPoints: 10,
    severity: 'MEDIUM',
    whyItMatters: 'Character overflow or mismatched company names degrade search ranking on job boards.',
    fixTemplate: 'Adhere to platform limits: Naukri headline 250 chars, key skills section up to 25 items.',
    exampleSnippet: 'Targeted role, location preferences, and expected CTC aligned with market benchmarks.'
  },
  'R-COMP-10': {
    id: 'R-COMP-10',
    component: 'contactCredibility',
    name: 'Contact & Verification Credibility',
    condition: 'Professional email address, valid Indian phone number, and LinkedIn profile URL present',
    maxPoints: 5,
    severity: 'HIGH',
    whyItMatters: 'Recruiters reject resumes instantly if contact details are missing, invalid, or unprofessional.',
    fixTemplate: 'Provide a clean professional email, 10-digit Indian phone number, and customized LinkedIn URL.',
    exampleSnippet: 'arjun.sharma@example.com | +91 9876543210 | linkedin.com/in/arjun-sharma'
  }
};
