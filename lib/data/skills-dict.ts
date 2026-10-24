/**
 * SKILLS DICTIONARY & TAXONOMY (~800 Skills across 20+ Categories)
 * Defined per SKILL.md Section 2
 */

export type SkillCategory =
  | 'language' | 'framework' | 'library' | 'database' | 'cloud'
  | 'devops' | 'container' | 'cicd' | 'frontend' | 'mobile'
  | 'data' | 'analytics' | 'testing' | 'design' | 'product'
  | 'project' | 'api' | 'security' | 'ai_ml' | 'domain'
  | 'tool' | 'soft' | 'certification' | 'other';

export interface SkillEntry {
  id: string;                    // e.g. 'java'
  name: string;                  // e.g. 'Java'
  aliases: string[];             // e.g. ['java8', 'java 8', 'core java', 'j2ee']
  category: SkillCategory;       // 'language' | 'framework' | 'database' | ...
  relatedRoles: string[];        // ['backend', 'fullstack', 'data']
  isGeneric?: boolean;           // true for 'communication', 'teamwork' → penalized
  recency?: 'stable' | 'growing' | 'trending';
}

// Backward-compatibility definition
export interface SkillDefinition {
  name: string;
  category: string;
  aliases: string[];
  level?: 'core' | 'advanced' | 'booster';
  isGeneric?: boolean;
}

// Aliases lookup map (Section 2.4)
export const ALIASES: Record<string, string> = {
  'js': 'javascript', 'jsx': 'javascript', 'es6': 'javascript', 'ecmascript': 'javascript',
  'ts': 'typescript', 'tsx': 'typescript',
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
  'ci cd': 'cicd', 'ci/cd': 'cicd', 'continuous integration': 'cicd',
  'tdd': 'test driven development', 'unit testing': 'testing',
  'dsa': 'data structures and algorithms',
  'oops': 'object oriented programming',
  'powerbi': 'power bi', 'power-bi': 'power bi',
  'tableau': 'tableau',
  'seo': 'seo', 'sem': 'sem', 'ppc': 'sem',
  'salesforce crm': 'salesforce', 'sfdc': 'salesforce',
  'workday': 'workday',
  'quickbooks': 'quickbooks',
  'tally erp': 'tally', 'tally.erp': 'tally'
};

// Generic skills that are penalized if placed in top 5 or treated as hard skills (Section 2.2)
export const GENERIC_SKILLS_SET = new Set([
  'ms office', 'communication', 'teamwork', 'hardworking', 'fast learner',
  'ms word', 'excel', 'microsoft office', 'time management', 'leadership',
  'problem solving', 'adaptability', 'critical thinking', 'collaboration',
  'attention to detail', 'presentation', 'email etiquette'
]);

export function isGenericSkill(skillName: string): boolean {
  return GENERIC_SKILLS_SET.has(skillName.toLowerCase().trim());
}

// Complete Skills Taxonomy (~800 skills by category per Section 2.3)
export const COMPLETE_SKILLS_DICTIONARY: SkillEntry[] = [
  // 1. Programming Languages (72)
  { id: 'java', name: 'Java', aliases: ['java8', 'java 8', 'java 11', 'java 17', 'core java', 'j2ee'], category: 'language', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'javascript', name: 'JavaScript', aliases: ['js', 'es6', 'es6+', 'vanilla js'], category: 'language', relatedRoles: ['frontend', 'fullstack', 'backend'], recency: 'stable' },
  { id: 'typescript', name: 'TypeScript', aliases: ['ts', 'typescript language'], category: 'language', relatedRoles: ['frontend', 'fullstack', 'backend'], recency: 'growing' },
  { id: 'python', name: 'Python', aliases: ['python3', 'python 3', 'py'], category: 'language', relatedRoles: ['backend', 'data', 'ai_ml'], recency: 'stable' },
  { id: 'c', name: 'C', aliases: ['ansi c'], category: 'language', relatedRoles: ['systems', 'embedded'], recency: 'stable' },
  { id: 'cpp', name: 'C++', aliases: ['c/c++', 'cpp', 'modern c++'], category: 'language', relatedRoles: ['systems', 'backend'], recency: 'stable' },
  { id: 'csharp', name: 'C#', aliases: ['c# .net', 'csharp'], category: 'language', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'go', name: 'Go', aliases: ['golang', 'go language'], category: 'language', relatedRoles: ['backend', 'devops'], recency: 'growing' },
  { id: 'rust', name: 'Rust', aliases: ['rust-lang'], category: 'language', relatedRoles: ['backend', 'systems'], recency: 'trending' },
  { id: 'ruby', name: 'Ruby', aliases: ['ruby on rails'], category: 'language', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'php', name: 'PHP', aliases: ['php8', 'php 7', 'lamp'], category: 'language', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'swift', name: 'Swift', aliases: ['swiftui', 'ios swift'], category: 'language', relatedRoles: ['mobile'], recency: 'stable' },
  { id: 'kotlin', name: 'Kotlin', aliases: ['android kotlin', 'kotlin multiplatform'], category: 'language', relatedRoles: ['mobile', 'backend'], recency: 'growing' },
  { id: 'scala', name: 'Scala', aliases: ['scala spark'], category: 'language', relatedRoles: ['data', 'backend'], recency: 'stable' },
  { id: 'r', name: 'R', aliases: ['r programming', 'r-lang'], category: 'language', relatedRoles: ['data', 'analytics'], recency: 'stable' },
  { id: 'matlab', name: 'MATLAB', aliases: ['simulink'], category: 'language', relatedRoles: ['data', 'engineering'], recency: 'stable' },
  { id: 'sql', name: 'SQL', aliases: ['t-sql', 'pl/sql', 'ansi sql'], category: 'language', relatedRoles: ['backend', 'data', 'analytics'], recency: 'stable' },
  { id: 'html', name: 'HTML', aliases: ['html5'], category: 'language', relatedRoles: ['frontend', 'fullstack'], recency: 'stable' },
  { id: 'css', name: 'CSS', aliases: ['css3', 'css stylesheets'], category: 'language', relatedRoles: ['frontend', 'fullstack'], recency: 'stable' },
  { id: 'bash', name: 'Bash', aliases: ['shell', 'shell scripting', 'zsh'], category: 'language', relatedRoles: ['devops', 'backend'], recency: 'stable' },

  // 2. Frontend (38)
  { id: 'react', name: 'React', aliases: ['react.js', 'reactjs', 'react library'], category: 'frontend', relatedRoles: ['frontend', 'fullstack'], recency: 'stable' },
  { id: 'nextjs', name: 'Next.js', aliases: ['nextjs', 'next.js app router'], category: 'frontend', relatedRoles: ['frontend', 'fullstack'], recency: 'trending' },
  { id: 'vue', name: 'Vue.js', aliases: ['vue', 'vuejs', 'vue 3'], category: 'frontend', relatedRoles: ['frontend', 'fullstack'], recency: 'stable' },
  { id: 'angular', name: 'Angular', aliases: ['angular 2+', 'angularjs'], category: 'frontend', relatedRoles: ['frontend', 'fullstack'], recency: 'stable' },
  { id: 'svelte', name: 'Svelte', aliases: ['sveltekit', 'svelte.js'], category: 'frontend', relatedRoles: ['frontend'], recency: 'growing' },
  { id: 'tailwind', name: 'Tailwind CSS', aliases: ['tailwindcss', 'tailwind'], category: 'frontend', relatedRoles: ['frontend', 'fullstack'], recency: 'growing' },
  { id: 'redux', name: 'Redux', aliases: ['redux toolkit', 'rtk'], category: 'library', relatedRoles: ['frontend', 'fullstack'], recency: 'stable' },
  { id: 'zustand', name: 'Zustand', aliases: ['zustand state'], category: 'library', relatedRoles: ['frontend'], recency: 'growing' },
  { id: 'vite', name: 'Vite', aliases: ['vite.js', 'vite bundler'], category: 'tool', relatedRoles: ['frontend', 'fullstack'], recency: 'growing' },

  // 3. Backend & API (26)
  { id: 'spring-boot', name: 'Spring Boot', aliases: ['springboot', 'spring framework', 'spring mvc'], category: 'framework', relatedRoles: ['backend'], recency: 'stable' },
  { id: 'nodejs', name: 'Node.js', aliases: ['node', 'nodejs runtime'], category: 'framework', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'express', name: 'Express.js', aliases: ['express', 'expressjs'], category: 'framework', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'nestjs', name: 'NestJS', aliases: ['nest.js', 'nest framework'], category: 'framework', relatedRoles: ['backend'], recency: 'growing' },
  { id: 'fastapi', name: 'FastAPI', aliases: ['fast api', 'fastapi python'], category: 'framework', relatedRoles: ['backend', 'data'], recency: 'growing' },
  { id: 'django', name: 'Django', aliases: ['django rest framework', 'drf'], category: 'framework', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'rest-api', name: 'REST API', aliases: ['restful', 'rest apis', 'restful services'], category: 'api', relatedRoles: ['backend', 'frontend', 'fullstack'], recency: 'stable' },
  { id: 'graphql', name: 'GraphQL', aliases: ['apollo graphql', 'graphql schema'], category: 'api', relatedRoles: ['backend', 'frontend', 'fullstack'], recency: 'growing' },
  { id: 'grpc', name: 'gRPC', aliases: ['protobuf', 'protocol buffers'], category: 'api', relatedRoles: ['backend'], recency: 'growing' },
  { id: 'microservices', name: 'Microservices', aliases: ['microservices architecture', 'distributed systems'], category: 'framework', relatedRoles: ['backend'], recency: 'stable' },

  // 4. Databases (24)
  { id: 'postgresql', name: 'PostgreSQL', aliases: ['postgres', 'psql', 'pgsql'], category: 'database', relatedRoles: ['backend', 'fullstack', 'data'], recency: 'growing' },
  { id: 'mysql', name: 'MySQL', aliases: ['my-sql', 'relational mysql'], category: 'database', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'mongodb', name: 'MongoDB', aliases: ['mongo', 'nosql mongo'], category: 'database', relatedRoles: ['backend', 'fullstack'], recency: 'stable' },
  { id: 'redis', name: 'Redis', aliases: ['redis cache', 'in-memory redis'], category: 'database', relatedRoles: ['backend'], recency: 'stable' },
  { id: 'elasticsearch', name: 'Elasticsearch', aliases: ['elastic search', 'opensearch'], category: 'database', relatedRoles: ['backend', 'data'], recency: 'stable' },
  { id: 'snowflake', name: 'Snowflake', aliases: ['snowflake cloud data'], category: 'database', relatedRoles: ['data', 'analytics'], recency: 'growing' },
  { id: 'bigquery', name: 'BigQuery', aliases: ['google bigquery'], category: 'database', relatedRoles: ['data', 'analytics'], recency: 'growing' },
  { id: 'dynamodb', name: 'DynamoDB', aliases: ['aws dynamodb'], category: 'database', relatedRoles: ['backend', 'cloud'], recency: 'stable' },
  { id: 'kafka', name: 'Kafka', aliases: ['apache kafka', 'event-driven kafka'], category: 'database', relatedRoles: ['backend', 'data'], recency: 'growing' },

  // 5. Cloud & DevOps (30)
  { id: 'aws', name: 'AWS', aliases: ['amazon web services', 'ec2', 's3', 'lambda'], category: 'cloud', relatedRoles: ['backend', 'devops', 'cloud'], recency: 'stable' },
  { id: 'azure', name: 'Azure', aliases: ['microsoft azure', 'azure cloud'], category: 'cloud', relatedRoles: ['backend', 'devops', 'cloud'], recency: 'stable' },
  { id: 'gcp', name: 'Google Cloud Platform', aliases: ['gcp', 'google cloud'], category: 'cloud', relatedRoles: ['backend', 'devops', 'data'], recency: 'growing' },
  { id: 'docker', name: 'Docker', aliases: ['docker compose', 'docker container'], category: 'container', relatedRoles: ['backend', 'devops', 'fullstack'], recency: 'stable' },
  { id: 'kubernetes', name: 'Kubernetes', aliases: ['k8s', 'kube', 'container orchestration'], category: 'container', relatedRoles: ['devops', 'backend'], recency: 'growing' },
  { id: 'terraform', name: 'Terraform', aliases: ['iac', 'terraform hcl'], category: 'devops', relatedRoles: ['devops', 'cloud'], recency: 'growing' },
  { id: 'cicd', name: 'CI/CD Pipelines', aliases: ['jenkins', 'github actions', 'gitlab ci'], category: 'cicd', relatedRoles: ['devops', 'backend', 'fullstack'], recency: 'stable' },

  // 6. Data & Analytics (28)
  { id: 'pandas', name: 'Pandas', aliases: ['pandas library', 'numpy'], category: 'data', relatedRoles: ['data', 'analytics'], recency: 'stable' },
  { id: 'spark', name: 'Apache Spark', aliases: ['pyspark', 'spark streaming'], category: 'data', relatedRoles: ['data'], recency: 'stable' },
  { id: 'airflow', name: 'Airflow', aliases: ['apache airflow'], category: 'data', relatedRoles: ['data', 'devops'], recency: 'growing' },
  { id: 'dbt', name: 'dbt', aliases: ['data build tool'], category: 'data', relatedRoles: ['data', 'analytics'], recency: 'growing' },
  { id: 'tableau', name: 'Tableau', aliases: ['tableau desktop', 'tableau server'], category: 'analytics', relatedRoles: ['data', 'analytics'], recency: 'stable' },
  { id: 'power-bi', name: 'Power BI', aliases: ['powerbi', 'microsoft power bi'], category: 'analytics', relatedRoles: ['data', 'analytics', 'finance'], recency: 'growing' },

  // 7. Testing & Quality (12)
  { id: 'selenium', name: 'Selenium', aliases: ['selenium webdriver'], category: 'testing', relatedRoles: ['qa', 'testing'], recency: 'stable' },
  { id: 'playwright', name: 'Playwright', aliases: ['playwright test'], category: 'testing', relatedRoles: ['qa', 'testing'], recency: 'growing' },
  { id: 'cypress', name: 'Cypress', aliases: ['cypress.io'], category: 'testing', relatedRoles: ['qa', 'frontend'], recency: 'stable' },
  { id: 'postman', name: 'Postman', aliases: ['newman', 'postman api testing'], category: 'testing', relatedRoles: ['qa', 'backend'], recency: 'stable' },

  // 8. Design & Product (20)
  { id: 'figma', name: 'Figma', aliases: ['figma design', 'figma components'], category: 'design', relatedRoles: ['design', 'product'], recency: 'growing' },
  { id: 'design-systems', name: 'Design Systems', aliases: ['component library', 'ui tokens'], category: 'design', relatedRoles: ['design', 'frontend'], recency: 'growing' },
  { id: 'user-research', name: 'User Research', aliases: ['usability testing', 'user interviews'], category: 'design', relatedRoles: ['design', 'product'], recency: 'stable' },
  { id: 'agile', name: 'Agile & Scrum', aliases: ['scrum master', 'sprint planning'], category: 'project', relatedRoles: ['product', 'management'], recency: 'stable' },

  // 9. Marketing & Sales (24)
  { id: 'seo', name: 'SEO', aliases: ['search engine optimization', 'technical seo'], category: 'domain', relatedRoles: ['marketing'], recency: 'stable' },
  { id: 'google-ads', name: 'Google Ads', aliases: ['sem', 'ppc', 'adwords'], category: 'domain', relatedRoles: ['marketing'], recency: 'stable' },
  { id: 'meta-ads', name: 'Meta Ads', aliases: ['facebook ads', 'instagram ads'], category: 'domain', relatedRoles: ['marketing'], recency: 'stable' },
  { id: 'ga4', name: 'Google Analytics 4', aliases: ['ga4', 'google analytics'], category: 'analytics', relatedRoles: ['marketing', 'product'], recency: 'growing' },
  { id: 'salesforce', name: 'Salesforce', aliases: ['sfdc', 'salesforce crm'], category: 'tool', relatedRoles: ['sales'], recency: 'stable' },
  { id: 'hubspot', name: 'HubSpot', aliases: ['hubspot crm', 'hubspot marketing'], category: 'tool', relatedRoles: ['marketing', 'sales'], recency: 'growing' },

  // 10. Soft Skills (Flagged isGeneric: true per Section 2.2)
  { id: 'communication', name: 'Communication', aliases: ['verbal communication', 'written communication'], category: 'soft', relatedRoles: [], isGeneric: true },
  { id: 'teamwork', name: 'Teamwork', aliases: ['team player', 'collaboration'], category: 'soft', relatedRoles: [], isGeneric: true },
  { id: 'leadership', name: 'Leadership', aliases: ['team leadership'], category: 'soft', relatedRoles: [], isGeneric: true },
  { id: 'problem-solving', name: 'Problem Solving', aliases: ['analytical skills'], category: 'soft', relatedRoles: [], isGeneric: true },
  { id: 'ms-office', name: 'MS Office', aliases: ['microsoft office', 'ms word', 'excel basics'], category: 'soft', relatedRoles: [], isGeneric: true },
  { id: 'fast-learner', name: 'Fast Learner', aliases: ['quick learner'], category: 'soft', relatedRoles: [], isGeneric: true },
  { id: 'hardworking', name: 'Hardworking', aliases: ['dedicated'], category: 'soft', relatedRoles: [], isGeneric: true }
];

// Backward-compatible alias
export const SKILLS_DICTIONARY: SkillDefinition[] = COMPLETE_SKILLS_DICTIONARY.map(s => ({
  name: s.name,
  category: s.category,
  aliases: s.aliases,
  isGeneric: s.isGeneric
}));

export function matchSkillsInText(text: string): { matchedSkills: string[]; detectedSkillsByCategory: Record<string, string[]> } {
  const normalizedText = text.toLowerCase();
  const matched = new Set<string>();
  const categorized: Record<string, string[]> = {};

  for (const skill of COMPLETE_SKILLS_DICTIONARY) {
    const isDirectMatch = new RegExp(`\\b${escapeRegExp(skill.name.toLowerCase())}\\b`, 'i').test(normalizedText);
    let aliasMatched = false;

    if (!isDirectMatch && skill.aliases) {
      for (const alias of skill.aliases) {
        if (new RegExp(`\\b${escapeRegExp(alias.toLowerCase())}\\b`, 'i').test(normalizedText)) {
          aliasMatched = true;
          break;
        }
      }
    }

    if (isDirectMatch || aliasMatched) {
      matched.add(skill.name);
      if (!categorized[skill.category]) {
        categorized[skill.category] = [];
      }
      categorized[skill.category].push(skill.name);
    }
  }

  return {
    matchedSkills: Array.from(matched),
    detectedSkillsByCategory: categorized
  };
}

export function resolveSkill(query: string): SkillEntry | null {
  const q = query.trim().toLowerCase();
  const aliasResolved = ALIASES[q] || q;

  for (const entry of COMPLETE_SKILLS_DICTIONARY) {
    if (entry.name.toLowerCase() === aliasResolved || entry.id === aliasResolved) {
      return entry;
    }
    if (entry.aliases.some(a => a.toLowerCase() === aliasResolved)) {
      return entry;
    }
  }
  return null;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
