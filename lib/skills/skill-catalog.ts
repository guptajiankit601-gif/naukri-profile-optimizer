export interface AutocompleteSkill {
  name: string;
  category: 
    | 'Programming Languages'
    | 'Frontend'
    | 'Backend & APIs'
    | 'Databases & Caching'
    | 'Cloud & DevOps'
    | 'Data & AI / ML'
    | 'Testing & QA'
    | 'Tools'
    | 'Business & Strategy';
  aliases?: string[];
  popular?: boolean;
}

export const MASTER_SKILL_CATALOG: AutocompleteSkill[] = [
  // Programming Languages
  { name: 'Python', category: 'Programming Languages', aliases: ['py', 'python3', 'python 3'], popular: true },
  { name: 'PyTorch', category: 'Data & AI / ML', aliases: ['pytorch deep learning', 'torch'], popular: true },
  { name: 'PySpark', category: 'Data & AI / ML', aliases: ['pyspark big data', 'spark python'], popular: true },
  { name: 'PyTest', category: 'Testing & QA', aliases: ['pytest testing', 'python test'], popular: true },
  { name: 'Java', category: 'Programming Languages', aliases: ['core java', 'java 17', 'java 21', 'java 8', 'j2ee'], popular: true },
  { name: 'JavaScript', category: 'Programming Languages', aliases: ['js', 'es6', 'vanilla javascript'], popular: true },
  { name: 'TypeScript', category: 'Programming Languages', aliases: ['ts', 'typescript language'], popular: true },
  { name: 'C++', category: 'Programming Languages', aliases: ['cpp', 'c/c++', 'modern c++'], popular: true },
  { name: 'C#', category: 'Programming Languages', aliases: ['csharp', '.net c#'], popular: true },
  { name: 'Go', category: 'Programming Languages', aliases: ['golang', 'go language'], popular: true },
  { name: 'Rust', category: 'Programming Languages', aliases: ['rust-lang'], popular: true },
  { name: 'Ruby', category: 'Programming Languages', aliases: ['ruby on rails'], popular: false },
  { name: 'PHP', category: 'Programming Languages', aliases: ['php8', 'php7'], popular: false },
  { name: 'Swift', category: 'Programming Languages', aliases: ['swiftui', 'ios swift'], popular: true },
  { name: 'Kotlin', category: 'Programming Languages', aliases: ['android kotlin'], popular: true },
  { name: 'SQL', category: 'Programming Languages', aliases: ['structured query language', 'ansi sql'], popular: true },
  { name: 'HTML5 & CSS3', category: 'Programming Languages', aliases: ['html', 'css', 'html5', 'css3'], popular: true },
  { name: 'Bash / Shell', category: 'Programming Languages', aliases: ['bash', 'shell scripting', 'zsh', 'linux shell'], popular: true },
  { name: 'Scala', category: 'Programming Languages', aliases: ['scala spark'], popular: false },
  { name: 'R', category: 'Programming Languages', aliases: ['r-lang', 'r statistical'], popular: false },

  // Frontend
  { name: 'React', category: 'Frontend', aliases: ['reactjs', 'react.js', 'react library'], popular: true },
  { name: 'React Native', category: 'Frontend', aliases: ['react-native', 'rn mobile'], popular: true },
  { name: 'Next.js', category: 'Frontend', aliases: ['nextjs', 'next.js ssr'], popular: true },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vuejs', 'vue 3'], popular: true },
  { name: 'Angular', category: 'Frontend', aliases: ['angularjs', 'angular 14+'], popular: true },
  { name: 'Svelte', category: 'Frontend', aliases: ['sveltekit'], popular: false },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwindcss', 'tailwind'], popular: true },
  { name: 'Redux', category: 'Frontend', aliases: ['redux toolkit', 'rtk'], popular: true },
  { name: 'Zustand', category: 'Frontend', aliases: ['zustand state'], popular: true },
  { name: 'Webpack / Vite', category: 'Frontend', aliases: ['vite', 'webpack', 'bundler'], popular: true },
  { name: 'Web Performance (CWV)', category: 'Frontend', aliases: ['core web vitals', 'lighthouse', 'speed optimization'], popular: true },
  { name: 'Design Systems', category: 'Frontend', aliases: ['component library', 'storybook'], popular: true },

  // Backend & APIs
  { name: 'Node.js', category: 'Backend & APIs', aliases: ['nodejs', 'node runtime'], popular: true },
  { name: 'Express.js', category: 'Backend & APIs', aliases: ['express', 'expressjs'], popular: true },
  { name: 'NestJS', category: 'Backend & APIs', aliases: ['nest.js', 'nest framework'], popular: true },
  { name: 'Spring Boot', category: 'Backend & APIs', aliases: ['springboot', 'spring framework'], popular: true },
  { name: 'FastAPI', category: 'Backend & APIs', aliases: ['fast api', 'fastapi python'], popular: true },
  { name: 'Django', category: 'Backend & APIs', aliases: ['django rest framework', 'drf'], popular: true },
  { name: 'REST APIs', category: 'Backend & APIs', aliases: ['restful apis', 'rest api design', 'web services'], popular: true },
  { name: 'GraphQL', category: 'Backend & APIs', aliases: ['apollo graphql', 'graphql apis'], popular: true },
  { name: 'gRPC', category: 'Backend & APIs', aliases: ['protobuf', 'protocol buffers'], popular: true },
  { name: 'Microservices', category: 'Backend & APIs', aliases: ['microservices architecture', 'distributed systems'], popular: true },
  { name: 'Socket.io', category: 'Backend & APIs', aliases: ['websockets', 'socket io'], popular: false },

  // Databases & Caching
  { name: 'PostgreSQL', category: 'Databases & Caching', aliases: ['postgres', 'psql'], popular: true },
  { name: 'MySQL', category: 'Databases & Caching', aliases: ['my-sql', 'relational mysql'], popular: true },
  { name: 'MongoDB', category: 'Databases & Caching', aliases: ['mongo', 'nosql mongo'], popular: true },
  { name: 'Redis', category: 'Databases & Caching', aliases: ['redis cache', 'in-memory redis'], popular: true },
  { name: 'Elasticsearch', category: 'Databases & Caching', aliases: ['elastic search', 'elk stack', 'opensearch'], popular: true },
  { name: 'DynamoDB', category: 'Databases & Caching', aliases: ['aws dynamodb'], popular: true },
  { name: 'Kafka', category: 'Databases & Caching', aliases: ['apache kafka', 'event streaming'], popular: true },
  { name: 'RabbitMQ', category: 'Databases & Caching', aliases: ['amqp', 'message broker'], popular: false },
  { name: 'Cassandra', category: 'Databases & Caching', aliases: ['apache cassandra'], popular: false },
  { name: 'Snowflake', category: 'Databases & Caching', aliases: ['snowflake warehouse'], popular: true },
  { name: 'BigQuery', category: 'Databases & Caching', aliases: ['google bigquery'], popular: true },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud & DevOps', aliases: ['amazon web services', 'ec2', 's3', 'lambda'], popular: true },
  { name: 'Docker', category: 'Cloud & DevOps', aliases: ['containerization', 'docker compose'], popular: true },
  { name: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['k8s', 'kube', 'container orchestration'], popular: true },
  { name: 'Terraform', category: 'Cloud & DevOps', aliases: ['iac', 'infrastructure as code'], popular: true },
  { name: 'CI/CD Pipelines', category: 'Cloud & DevOps', aliases: ['jenkins', 'github actions', 'gitlab ci'], popular: true },
  { name: 'Azure', category: 'Cloud & DevOps', aliases: ['microsoft azure', 'azure devops'], popular: true },
  { name: 'GCP', category: 'Cloud & DevOps', aliases: ['google cloud platform', 'google cloud'], popular: true },
  { name: 'Linux', category: 'Cloud & DevOps', aliases: ['ubuntu', 'centos', 'redhat'], popular: true },
  { name: 'Prometheus & Grafana', category: 'Cloud & DevOps', aliases: ['prometheus', 'grafana', 'observability'], popular: true },
  { name: 'Nginx', category: 'Cloud & DevOps', aliases: ['reverse proxy', 'nginx config'], popular: false },

  // Data & AI / ML
  { name: 'Pandas & NumPy', category: 'Data & AI / ML', aliases: ['pandas', 'numpy', 'data analysis'], popular: true },
  { name: 'Apache Spark', category: 'Data & AI / ML', aliases: ['spark', 'spark streaming'], popular: true },
  { name: 'Machine Learning', category: 'Data & AI / ML', aliases: ['scikit-learn', 'ml models'], popular: true },
  { name: 'Deep Learning', category: 'Data & AI / ML', aliases: ['neural networks', 'dl'], popular: true },
  { name: 'Generative AI & LLMs', category: 'Data & AI / ML', aliases: ['genai', 'llm', 'langchain', 'rag', 'prompt engineering'], popular: true },
  { name: 'TensorFlow', category: 'Data & AI / ML', aliases: ['keras', 'tf'], popular: true },
  { name: 'Airflow', category: 'Data & AI / ML', aliases: ['apache airflow', 'data pipelines'], popular: true },
  { name: 'dbt', category: 'Data & AI / ML', aliases: ['data build tool'], popular: true },
  { name: 'Power BI', category: 'Data & AI / ML', aliases: ['powerbi', 'dax'], popular: true },
  { name: 'Tableau', category: 'Data & AI / ML', aliases: ['tableau dashboard'], popular: true },

  // Testing & QA
  { name: 'Selenium', category: 'Testing & QA', aliases: ['selenium webdriver'], popular: true },
  { name: 'Playwright', category: 'Testing & QA', aliases: ['playwright testing', 'e2e playwright'], popular: true },
  { name: 'Cypress', category: 'Testing & QA', aliases: ['cypress.io', 'e2e cypress'], popular: true },
  { name: 'JUnit / TestNG', category: 'Testing & QA', aliases: ['junit', 'testng', 'java testing'], popular: true },
  { name: 'Postman / API Testing', category: 'Testing & QA', aliases: ['postman', 'api testing', 'newman'], popular: true },
  { name: 'JMeter', category: 'Testing & QA', aliases: ['load testing', 'performance testing'], popular: false },
  { name: 'Cucumber / BDD', category: 'Testing & QA', aliases: ['cucumber', 'bdd', 'gherkin'], popular: false },

  // Tools
  { name: 'Git & GitHub', category: 'Tools', aliases: ['git', 'github', 'version control', 'gitlab'], popular: true },
  { name: 'Jira', category: 'Tools', aliases: ['jira agile', 'atlassian jira'], popular: true },
  { name: 'Figma', category: 'Tools', aliases: ['figma design', 'ui design'], popular: true },
  { name: 'Postman', category: 'Tools', aliases: ['api client'], popular: true },

  // Business & Strategy
  { name: 'Agile & Scrum', category: 'Business & Strategy', aliases: ['scrum', 'sprint planning', 'kanban'], popular: true },
  { name: 'Product Roadmapping', category: 'Business & Strategy', aliases: ['product management', 'feature roadmap'], popular: true },
  { name: 'System Design', category: 'Business & Strategy', aliases: ['high level design', 'low level design', 'hld', 'lld'], popular: true },
  { name: 'Technical Writing', category: 'Business & Strategy', aliases: ['documentation', 'api docs'], popular: false },
  { name: 'Stakeholder Management', category: 'Business & Strategy', aliases: ['cross-functional collaboration'], popular: false }
];

/**
 * Filter suggestions matching user query with smart scoring:
 * - Exact prefix on name gets highest rank (e.g. "py" -> "Python", "PyTorch", "PySpark", "PyTest")
 * - Word boundary match gets second rank
 * - Substring match gets third rank
 * - Alias match gets fourth rank
 * - Role relevance boost
 */
export function searchSkillSuggestions(
  query: string,
  existingSkills: string[] = [],
  targetRoleId?: string,
  limit: number = 8
): AutocompleteSkill[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const existingLowerSet = new Set(existingSkills.map(s => s.toLowerCase().trim()));

  const scored: { skill: AutocompleteSkill; score: number }[] = [];

  for (const skill of MASTER_SKILL_CATALOG) {
    const skillNameLower = skill.name.toLowerCase();

    // Skip if already in candidate's skills
    if (existingLowerSet.has(skillNameLower)) continue;

    let matchScore = 0;

    if (skillNameLower.startsWith(cleanQuery)) {
      // Direct prefix match: highest priority
      matchScore = 100 - (skillNameLower.length - cleanQuery.length);
    } else if (skillNameLower.includes(` ${cleanQuery}`) || skillNameLower.includes(`/${cleanQuery}`)) {
      // Word prefix match (e.g. "Native" in "React Native")
      matchScore = 75;
    } else if (skillNameLower.includes(cleanQuery)) {
      // Substring match
      matchScore = 50;
    } else if (skill.aliases && skill.aliases.some(a => a.toLowerCase().startsWith(cleanQuery))) {
      // Alias prefix match (e.g. "py" in alias)
      matchScore = 40;
    } else if (skill.aliases && skill.aliases.some(a => a.toLowerCase().includes(cleanQuery))) {
      // Alias substring match
      matchScore = 20;
    }

    if (matchScore > 0) {
      // Popular boost
      if (skill.popular) matchScore += 10;

      // Role relevance boost
      if (targetRoleId) {
        if (targetRoleId.includes('backend') && (skill.category === 'Backend & APIs' || skill.category === 'Databases & Caching')) {
          matchScore += 15;
        } else if (targetRoleId.includes('frontend') && skill.category === 'Frontend') {
          matchScore += 15;
        } else if (targetRoleId.includes('data') && skill.category === 'Data & AI / ML') {
          matchScore += 15;
        } else if (targetRoleId.includes('devops') && skill.category === 'Cloud & DevOps') {
          matchScore += 15;
        }
      }

      scored.push({ skill, score: matchScore });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(item => item.skill);
}

/**
 * Normalizes user skill input (trims, prevents duplicates case-insensitively)
 */
export function normalizeSkillInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // If there's an exact case-insensitive match in our master catalog, use the catalog's canonical title casing!
  const catalogMatch = MASTER_SKILL_CATALOG.find(
    s => s.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (catalogMatch) {
    return catalogMatch.name;
  }

  // Otherwise clean excess inner spaces
  return trimmed.replace(/\s+/g, ' ');
}
