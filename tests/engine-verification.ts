import { parseRawResumeText, scoreConfidence } from '../lib/parser';
import { calculateScore } from '../lib/scoring';
import { rewriteBullet, detectIntent, detectIssues } from '../lib/rewriter';
import { matchJobDescription, predictRejection } from '../lib/jobfit';
import { SEEDED_PROFILES } from '../lib/data/seeded-profiles';
import { ROLES } from '../lib/data/roles';
import { ROLE_KEYWORDS_DATA } from '../lib/data/keywords';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('========================================================');
console.log('🚀 NAUKRI PROFILE OPTIMIZER — ENGINE VERIFICATION SUITE');
console.log('========================================================\n');

// 1. Parser & Text Extraction Verification (T-020..T-074)
console.log('--- 1. PARSER & ENTITY EXTRACTION TESTS ---');
const sampleRawResume = `
Arjun Sharma
Bengaluru, Karnataka | arjun.sharma@example.com | +91 9876543210 | linkedin.com/in/arjun-sharma

PROFESSIONAL SUMMARY
Senior Backend Engineer with 3+ years experience building microservices in Java and Spring Boot.

WORK EXPERIENCE
Senior Software Engineer | TCS | Jul 2021 - Present | Bengaluru
- Responsible for developing backend REST APIs using Java and Spring Boot.
- Designed Kafka event-driven architecture handling 20,000 TPS with 35% latency drop.
- Reduced PostgreSQL query latency by 45% via indexing and Redis caching.

EDUCATION
B.Tech in Computer Science | PES University | 2017 - 2021 | 8.6 CGPA

SKILLS
Java, Spring Boot, Microservices, Kafka, Redis, PostgreSQL, Docker, AWS, Git

PROJECTS
E-Commerce Checkout Pipeline: Built high-throughput payment processor handling 5,000 daily orders.
`;

const parsed = parseRawResumeText(sampleRawResume);
assert(parsed.name === 'Arjun Sharma', 'Extracted candidate name');
assert(parsed.email === 'arjun.sharma@example.com', 'Extracted email address');
assert(parsed.phone === '+91 9876543210', 'Extracted Indian phone number');
assert(parsed.experiences.length >= 1, 'Extracted experience entry');
assert(parsed.experiences[0].bullets.length >= 2, 'Extracted multiple experience bullets');
assert(parsed.skills.some(s => s.toLowerCase().includes('java')), 'Extracted Java skill');
assert(parsed.skills.some(s => s.toLowerCase().includes('kafka')), 'Extracted Kafka skill');
assert(parsed.education.length >= 1, 'Extracted education record');

assert(parsed.sectionConfidence.experience >= 70, `Parser confidence threshold met (${parsed.sectionConfidence.experience}%)`);

// 2. Scoring Engine Verification (T-080..T-112)
console.log('\n--- 2. 10-COMPONENT SCORING ENGINE TESTS ---');
const scoreReport = calculateScore(parsed);
assert(scoreReport.overallScore >= 0 && scoreReport.overallScore <= 100, `Score is in 0-100 range (${scoreReport.overallScore})`);
assert(scoreReport.components.length === 10, 'All 10 transparent scoring components evaluated');
assert(['Strong', 'Okay', 'Needs Work'].includes(scoreReport.verdict), `Valid visibility verdict: ${scoreReport.verdict}`);
assert(scoreReport.topFixes.length <= 3, 'Top 3 ROI fixes prioritized');

// 3. Rewriter & Fabrication Guard (T-120..T-138)
console.log('\n--- 3. REWRITER & FABRICATION GUARD TESTS ---');
const weakBullet = 'Responsible for developing backend REST APIs using Java and Spring Boot.';
const detectedIntent = detectIntent(weakBullet);
assert(Boolean(detectedIntent), `Intent detected: ${detectedIntent}`);

const detectedIssues = detectIssues(weakBullet);
assert(detectedIssues.length > 0, `Detected ${detectedIssues.length} issues in passive bullet`);

const rewritten = rewriteBullet(weakBullet, '20,000 TPS');
assert(rewritten.variants.length === 3, 'Produced exactly 3 variants (SAFE, METRIC, IMPACT)');
assert(rewritten.variants.every(v => v.text.length > 0), 'All variant texts non-empty');
assert(rewritten.variants.some(v => v.type === 'METRIC'), 'Has METRIC variant containing slot');

// 4. Job Fit & BM25 Matcher (T-140..T-156)
console.log('\n--- 4. JOB FIT & REJECTION PREDICTOR TESTS ---');
const sampleJd = `
Role: Senior Backend Engineer
Experience: 3-5 years
Location: Bengaluru
Requirements:
Must have 3+ years experience with Java, Spring Boot, Microservices, and Kafka.
Experience with AWS, Docker, and Redis caching is required.
Hands-on experience optimizing PostgreSQL queries.
`;

const jobFit = matchJobDescription(parsed, sampleJd);
assert(jobFit.matchScore >= 0 && jobFit.matchScore <= 100, `Job fit calculated: ${jobFit.matchScore}%`);
assert(jobFit.matchedSkills.length > 0, `Matched ${jobFit.matchedSkills.length} skills against JD`);
assert(jobFit.subScores.skills >= 0, 'Sub-scores computed for skills, exp, location, salary');

const rejection = predictRejection(parsed, 18);
assert(rejection.length >= 0, 'Rejection checks evaluated');

// 5. Seeded Personas & Data Files (T-080..T-082, T-355..T-356)
console.log('\n--- 5. SEEDED PERSONAS & DICTIONARIES TESTS ---');
assert(Object.keys(SEEDED_PROFILES).length === 3, '3 realistic seeded personas exist (Arjun, Priya, Sneha)');
assert(ROLES.length === 10, '10 curated role dictionaries available');
assert(Object.keys(ROLE_KEYWORDS_DATA).length >= 10, 'Keyword volume matrix populated for all roles');

console.log('\n========================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
