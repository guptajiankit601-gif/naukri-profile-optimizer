export interface SkillDefinition {
  name: string;
  category: string;
  aliases: string[];
  level?: 'core' | 'advanced' | 'booster';
}

export const SKILLS_DICTIONARY: SkillDefinition[] = [
  // Backend & Languages
  { name: 'Java', category: 'Backend Language', aliases: ['core java', 'java 8', 'java 11', 'java 17', 'j2ee'] },
  { name: 'Spring Boot', category: 'Backend Framework', aliases: ['springboot', 'spring-boot', 'spring mvc', 'spring framework'] },
  { name: 'Python', category: 'Backend Language', aliases: ['python3', 'python 3'] },
  { name: 'Node.js', category: 'Backend Runtime', aliases: ['nodejs', 'node', 'node js'] },
  { name: 'Express.js', category: 'Backend Framework', aliases: ['express', 'expressjs'] },
  { name: 'NestJS', category: 'Backend Framework', aliases: ['nest.js', 'nest'] },
  { name: 'Go / Golang', category: 'Backend Language', aliases: ['golang', 'go language'] },
  { name: 'C++', category: 'Systems Language', aliases: ['cpp', 'c/c++'] },
  { name: 'C# / .NET', category: 'Backend Framework', aliases: ['c#', '.net core', 'dotnet', 'asp.net', 'csharp'] },
  { name: 'PHP', category: 'Backend Language', aliases: ['php8', 'lamp'] },
  { name: 'Django', category: 'Backend Framework', aliases: ['django rest framework', 'drf'] },
  { name: 'FastAPI', category: 'Backend Framework', aliases: ['fast api'] },
  { name: 'Microservices', category: 'Architecture', aliases: ['microservices architecture', 'distributed systems', 'micro-services'] },
  { name: 'REST APIs', category: 'API Design', aliases: ['restful apis', 'rest api', 'web services', 'rest'] },
  { name: 'GraphQL', category: 'API Design', aliases: ['graphql api', 'apollo'] },
  { name: 'gRPC', category: 'API Design', aliases: ['protobuf', 'protocol buffers'] },
  { name: 'Kafka', category: 'Event Streaming', aliases: ['apache kafka', 'event-driven architecture'] },
  { name: 'RabbitMQ', category: 'Message Queue', aliases: ['rabbitmq message broker', 'amqp'] },
  { name: 'Redis', category: 'Caching & Store', aliases: ['redis cache', 'in-memory cache'] },
  
  // Databases
  { name: 'PostgreSQL', category: 'Database', aliases: ['postgres', 'postgresql rdbms'] },
  { name: 'MySQL', category: 'Database', aliases: ['my-sql', 'relational database'] },
  { name: 'MongoDB', category: 'NoSQL Database', aliases: ['mongo', 'nosql document store'] },
  { name: 'DynamoDB', category: 'NoSQL Database', aliases: ['aws dynamodb'] },
  { name: 'Elasticsearch', category: 'Search & Analytics', aliases: ['elastic search', 'elk stack'] },
  { name: 'SQL', category: 'Database Query', aliases: ['complex queries', 'stored procedures', 'rdbms query'] },
  { name: 'Cassandra', category: 'NoSQL Database', aliases: ['apache cassandra'] },
  { name: 'Oracle DB', category: 'Database', aliases: ['oracle database', 'pl/sql'] },

  // Frontend
  { name: 'React', category: 'Frontend Library', aliases: ['react.js', 'reactjs'] },
  { name: 'Next.js', category: 'Fullstack Framework', aliases: ['nextjs', 'next js'] },
  { name: 'TypeScript', category: 'Language', aliases: ['ts', 'typescript language'] },
  { name: 'JavaScript', category: 'Language', aliases: ['js', 'es6', 'es6+', 'vanilla js'] },
  { name: 'HTML5 & CSS3', category: 'Web Basics', aliases: ['html', 'css', 'html5', 'css3'] },
  { name: 'Tailwind CSS', category: 'CSS Framework', aliases: ['tailwindcss', 'tailwind'] },
  { name: 'Redux / Zustand', category: 'State Management', aliases: ['redux toolkit', 'rtk', 'zustand', 'mobx'] },
  { name: 'Vue.js', category: 'Frontend Framework', aliases: ['vue', 'vuejs', 'vue 3'] },
  { name: 'Angular', category: 'Frontend Framework', aliases: ['angularjs', 'angular 2+', 'angular 14+'] },
  { name: 'Web Performance Optimization', category: 'Frontend Core', aliases: ['cwv', 'core web vitals', 'lighthouse optimization', 'bundle reduction'] },
  { name: 'Webpack / Vite', category: 'Build Tools', aliases: ['vite', 'webpack', 'rollup', 'turbopack'] },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud Platform', aliases: ['amazon web services', 'ec2', 's3', 'lambda', 'ecs', 'eks', 'iam'] },
  { name: 'Docker', category: 'Containerization', aliases: ['containerization', 'docker compose', 'dockerfile'] },
  { name: 'Kubernetes', category: 'Orchestration', aliases: ['k8s', 'kube', 'helm'] },
  { name: 'CI/CD Pipelines', category: 'DevOps', aliases: ['jenkins', 'github actions', 'gitlab ci', 'argo cd'] },
  { name: 'Terraform', category: 'Infrastructure as Code', aliases: ['iac', 'terraform hcl'] },
  { name: 'Azure', category: 'Cloud Platform', aliases: ['microsoft azure', 'azure devops'] },
  { name: 'GCP', category: 'Cloud Platform', aliases: ['google cloud platform', 'google cloud'] },
  { name: 'Linux / Bash', category: 'Systems', aliases: ['linux', 'shell scripting', 'bash', 'ubuntu'] },
  { name: 'Prometheus & Grafana', category: 'Observability', aliases: ['monitoring', 'grafana', 'prometheus', 'datadog'] },

  // Data Engineering & AI
  { name: 'Apache Spark', category: 'Big Data', aliases: ['pyspark', 'spark streaming', 'spark sql'] },
  { name: 'Snowflake', category: 'Data Warehouse', aliases: ['snowflake cloud warehouse'] },
  { name: 'dbt', category: 'Data Transformation', aliases: ['data build tool'] },
  { name: 'Airflow', category: 'Orchestration', aliases: ['apache airflow', 'data pipelines'] },
  { name: 'Pandas & NumPy', category: 'Data Analysis', aliases: ['pandas', 'numpy', 'scipy'] },
  { name: 'Machine Learning', category: 'AI/ML', aliases: ['scikit-learn', 'ml models', 'supervised learning'] },
  { name: 'Deep Learning', category: 'AI/ML', aliases: ['pytorch', 'tensorflow', 'keras'] },
  { name: 'LLM & GenAI', category: 'AI/ML', aliases: ['langchain', 'rag', 'gemini api', 'openai api', 'prompt engineering'] },
  { name: 'Power BI / Tableau', category: 'BI & Visualization', aliases: ['power bi', 'tableau', 'metabase'] },

  // QA & Testing
  { name: 'Selenium', category: 'Test Automation', aliases: ['selenium webdriver', 'selenium grid'] },
  { name: 'Playwright', category: 'Test Automation', aliases: ['playwright testing'] },
  { name: 'Cypress', category: 'Test Automation', aliases: ['cypress.io', 'e2e testing'] },
  { name: 'JUnit / TestNG', category: 'Unit Testing', aliases: ['junit', 'testng'] },
  { name: 'Postman / Newman', category: 'API Testing', aliases: ['postman', 'api automation'] },
  { name: 'JMeter', category: 'Performance Testing', aliases: ['load testing', 'apache jmeter'] },
  { name: 'Cucumber / BDD', category: 'QA Framework', aliases: ['bdd', 'gherkin'] },

  // Product Management
  { name: 'Product Roadmapping', category: 'Product Strategy', aliases: ['roadmap planning', 'product strategy'] },
  { name: 'PRD & Feature Specs', category: 'Product Execution', aliases: ['product requirement documents', 'user stories', 'acceptance criteria'] },
  { name: 'Agile & Scrum', category: 'Methodology', aliases: ['sprint planning', 'scrum master', 'jira'] },
  { name: 'A/B Testing', category: 'Product Analytics', aliases: ['experimentation', 'split testing', 'growth experiments'] },
  { name: 'User Research', category: 'Product Discovery', aliases: ['customer interviews', 'usability testing', 'voice of customer'] },
  { name: 'Mixpanel / Amplitude', category: 'Product Analytics', aliases: ['amplitude', 'mixpanel', 'cohort analysis', 'funnel analytics'] },

  // UI/UX Design
  { name: 'Figma', category: 'Design Tool', aliases: ['figma design', 'figma components', 'auto-layout'] },
  { name: 'Design Systems', category: 'Design Architecture', aliases: ['component library', 'tokens', 'style guides'] },
  { name: 'Wireframing & Prototyping', category: 'Design Process', aliases: ['high-fidelity prototypes', 'wireframes', 'mockups'] },
  { name: 'Information Architecture', category: 'UX Research', aliases: ['user flows', 'journey mapping', 'sitemaps'] },
  { name: 'Accessibility (WCAG)', category: 'Design Standard', aliases: ['wcag 2.1', 'a11y', 'color contrast'] },

  // Digital Marketing
  { name: 'Search Engine Optimization (SEO)', category: 'Inbound Growth', aliases: ['seo', 'technical seo', 'on-page seo', 'backlinks', 'ahrefs', 'semrush'] },
  { name: 'Google Ads (SEM)', category: 'Paid Acquisition', aliases: ['google adwords', 'ppc campaigns', 'search ads'] },
  { name: 'Meta Ads', category: 'Paid Social', aliases: ['facebook ads', 'instagram ads', 'roas optimization'] },
  { name: 'Conversion Rate Optimization (CRO)', category: 'Growth', aliases: ['cro', 'landing page optimization', 'funnel drop-off reduction'] },
  { name: 'Email Marketing & Automation', category: 'Retention', aliases: ['hubspot', 'mailchimp', 'klaviyo', 'clevertap'] },
  { name: 'Google Analytics 4 (GA4)', category: 'Analytics', aliases: ['ga4', 'google analytics', 'utm tracking', 'event tracking'] },

  // Sales & Business Development
  { name: 'B2B Sales', category: 'Sales Strategy', aliases: ['enterprise sales', 'b2b pipeline', 'outbound sales'] },
  { name: 'Pipeline Management', category: 'Sales Execution', aliases: ['sales funnel', 'lead qualification', 'sql/mql'] },
  { name: 'Cold Outreach & Cadences', category: 'Lead Generation', aliases: ['cold emailing', 'cold calling', 'sales prospecting', 'apollo.io', 'linkedin sales navigator'] },
  { name: 'Salesforce / HubSpot CRM', category: 'Sales Tooling', aliases: ['salesforce', 'hubspot crm', 'pipedrive'] },
  { name: 'Client Demos & Pitching', category: 'Closing', aliases: ['product demonstrations', 'contract negotiation', 'deal closing'] }
];

// Helper to match skill in text
export function matchSkillsInText(text: string): { matchedSkills: string[]; detectedSkillsByCategory: Record<string, string[]> } {
  const normalizedText = text.toLowerCase();
  const matched: Set<string> = new Set();
  const categorized: Record<string, string[]> = {};

  for (const skill of SKILLS_DICTIONARY) {
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

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
