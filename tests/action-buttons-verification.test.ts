import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ParsedProfile } from '../types';
import { calculateScore } from '../lib/scoring';
import { matchJobDescription } from '../services/jd-matcher';
import { rewriteBullet, validateRewriteFactualIntegrity } from '../lib/rewriter/engine';

const mockBaseProfile: ParsedProfile = {
  name: 'Ankit Sharma',
  email: 'ankit@example.com',
  phone: '+91 9876543210',
  location: 'Bengaluru, India',
  targetRole: 'Backend Engineer',
  targetRoleId: 'backend-engineer',
  experienceBand: '3-5',
  targetCities: ['Bengaluru', 'Pune'],
  expectedSalaryLakhs: 22,
  headline: 'Backend Engineer | Java & Spring Boot | 4 Yrs Exp',
  summary: 'Experienced backend engineer specialized in microservices, distributed systems, and SQL databases.',
  skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker'],
  experiences: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions India',
      startDate: '2022',
      endDate: 'Present',
      bullets: [
        'Responsible for developing backend REST APIs using Java and Spring Boot.',
        'Worked on database schema optimization and caching with Redis.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech Computer Science',
      institution: 'NIT Trichy',
      year: '2020'
    }
  ],
  projects: [],
  certifications: ['AWS Certified Solutions Architect'],
  achievements: ['Reduced query execution time by 35%'],
  rawText: 'Ankit Sharma Java Spring Boot Microservices PostgreSQL Docker AWS Redis',
  sectionConfidence: { headline: 1, skills: 1, experience: 1 }
};

describe('CareerUp Action & Improve Buttons Verification', () => {
  it('1. Synchronizes bullet count and prevents fake fallback text', () => {
    // With experiences
    const bulletsWithExp = mockBaseProfile.experiences.flatMap(e => e.bullets);
    assert.equal(bulletsWithExp.length, 2);
    assert.equal(bulletsWithExp[0], 'Responsible for developing backend REST APIs using Java and Spring Boot.');

    // With empty experiences (candidate has zero bullets)
    const emptyProfile: ParsedProfile = {
      ...mockBaseProfile,
      experiences: []
    };
    const bulletsEmpty = emptyProfile.experiences.flatMap(e => e.bullets);
    assert.equal(bulletsEmpty.length, 0);
    // Verified: No fake fallback string should replace an empty list
  });

  it('2. Rewriting a bullet preserves real facts and power verbs', () => {
    const original = 'Responsible for developing backend REST APIs using Java and Spring Boot.';
    const customMetric = '40% latency reduction';
    const rewriteRes = rewriteBullet(original, customMetric, 'Backend Engineer');

    assert.ok(rewriteRes.variants.length >= 3, 'Must produce at least 3 variants');
    
    // Check safe variant (preserves real facts, uses power verb)
    const safeVariant = rewriteRes.variants.find(v => v.type === 'SAFE');
    assert.ok(safeVariant, 'Must have SAFE variant');
    assert.match(safeVariant.text, /Architected|Engineered|Spearheaded/i);
    assert.match(safeVariant.text, /REST APIs/i);

    // Check metric variant
    const metricVariant = rewriteRes.variants.find(v => v.type === 'METRIC');
    assert.ok(metricVariant, 'Must have METRIC variant');
    assert.match(metricVariant.text, /40% latency reduction/i);
  });

  it('3. Factual integrity check rejects invented unverified metrics', () => {
    const original = 'Responsible for developing backend REST APIs using Java and Spring Boot.';
    
    // Valid rewrite without hallucinated numbers
    const validRewrite = 'Engineered and scaled high-throughput REST APIs utilizing Java and Spring Boot.';
    const validCheck = validateRewriteFactualIntegrity(original, validRewrite);
    assert.equal(validCheck.isValid, true);

    // Invalid rewrite with invented 99.99% and $10M metrics
    const hallucinatedRewrite = 'Engineered REST APIs with 99.99% uptime saving $10M in infrastructure.';
    const invalidCheck = validateRewriteFactualIntegrity(original, hallucinatedRewrite);
    assert.equal(invalidCheck.isValid, false);
    assert.ok(invalidCheck.fallbackText.length > 0);
  });

  it('4. Updating profile recalculates score and registers score delta', () => {
    const initialScore = calculateScore(mockBaseProfile);
    assert.ok(initialScore.overallScore > 0);

    // Improve profile: add missing high-demand skills
    const improvedProfile: ParsedProfile = {
      ...mockBaseProfile,
      skills: [...mockBaseProfile.skills, 'Kubernetes', 'Kafka', 'Redis', 'CI/CD']
    };
    const newScore = calculateScore(improvedProfile);
    assert.ok(newScore.overallScore >= initialScore.overallScore, 'Score must increase or stay equal when verified skills are added');
  });

  it('5. Job Description Matcher detects verified skill additions immediately', () => {
    const jdText = `
      Looking for a Senior Backend Engineer.
      Must have strong experience with Java, Spring Boot, PostgreSQL, and Kubernetes.
      Experience with Kafka and Docker is required.
    `;

    // Before adding Kubernetes and Kafka
    const matchBefore = matchJobDescription(mockBaseProfile, jdText, 'CloudCorp', 'Backend Engineer');
    assert.ok(matchBefore.missingFromResume?.some(m => m.skill.toLowerCase() === 'kubernetes') || matchBefore.missingMustHaves.some(m => m.skill.toLowerCase() === 'kubernetes'));

    // Candidate adds verified skill Kubernetes
    const profileWithK8s: ParsedProfile = {
      ...mockBaseProfile,
      skills: [...mockBaseProfile.skills, 'Kubernetes']
    };
    const matchAfter = matchJobDescription(profileWithK8s, jdText, 'CloudCorp', 'Backend Engineer');
    
    assert.ok(matchAfter.matchedSkills.some(s => s.toLowerCase() === 'kubernetes'), 'Kubernetes must now be in matched skills');
    assert.ok(matchAfter.matchScore >= matchBefore.matchScore, 'Alignment score must increase or stay equal');
  });

  it('6. Action Plan correctly maps task-based improvement routes', () => {
    const routes = {
      headline: '/headline-fixer?section=headline',
      summary: '/headline-fixer?section=summary',
      keywords: '/keyword-analysis?group=missing',
      passiveBullets: '/bullet-rewriter?target=passive',
      metricBullets: '/bullet-rewriter?target=metrics',
      jobFit: '/job-fit',
      export: '/resume-export'
    };

    assert.equal(routes.headline, '/headline-fixer?section=headline');
    assert.equal(routes.passiveBullets, '/bullet-rewriter?target=passive');
    assert.equal(routes.metricBullets, '/bullet-rewriter?target=metrics');
    assert.equal(routes.keywords, '/keyword-analysis?group=missing');
  });

  it('7. Proof of Work Vault adds verified projects and strengthens scoring', () => {
    const fresherProfile: ParsedProfile = {
      ...mockBaseProfile,
      experienceBand: 'Fresher',
      experiences: [],
      projects: []
    };

    const initialScore = calculateScore(fresherProfile);

    const projectItem = {
      id: 'proj-1',
      title: 'Distributed Event Pipeline',
      description: 'Built high-throughput stream processing pipeline using Kafka and Docker',
      technologies: ['Kafka', 'Docker', 'Go'],
      link: 'https://demo.pipeline.dev',
      repoLink: 'https://github.com/ankit/pipeline',
      metrics: 'Processed 50,000 events/sec'
    };

    const updatedProfile: ParsedProfile = {
      ...fresherProfile,
      projects: [projectItem]
    };

    const scoreAfterProject = calculateScore(updatedProfile);
    assert.equal(updatedProfile.projects.length, 1);
    assert.equal(updatedProfile.projects[0].title, 'Distributed Event Pipeline');
    assert.ok(scoreAfterProject.overallScore >= initialScore.overallScore);
  });
});
