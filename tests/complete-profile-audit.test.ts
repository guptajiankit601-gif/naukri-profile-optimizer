import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCompleteProfileAudit } from '../lib/audit/generate-audit';
import { calculateScore } from '../lib/scoring';
import { SEEDED_PROFILES } from '../lib/data/seeded-profiles';
import { ParsedProfile } from '../types';

test('Complete Profile Audit Verification Suite', async (t) => {
  const arjunProfile: ParsedProfile = JSON.parse(JSON.stringify(SEEDED_PROFILES.arjun));
  const scoreReport = calculateScore(arjunProfile);

  await t.test('1. Generates unified audit report with all 6 categories', () => {
    const audit = generateCompleteProfileAudit(arjunProfile, scoreReport);
    
    assert.ok(audit, 'Audit report should exist');
    assert.equal(audit.overallScore, scoreReport.overallScore, 'Should reuse existing Resume Quality Score');
    assert.equal(audit.candidateName, arjunProfile.name);
    assert.equal(audit.targetRole, arjunProfile.targetRole);
    assert.ok(audit.findings.length > 0, 'Should have findings');

    const categories = new Set(audit.findings.map(f => f.category));
    assert.ok(categories.has('completeness'), 'Should include completeness');
    assert.ok(categories.has('content_quality'), 'Should include content_quality');
    assert.ok(categories.has('skills_keywords'), 'Should include skills_keywords');
    assert.ok(categories.has('professional_profile'), 'Should include professional_profile');
    assert.ok(categories.has('job_alignment'), 'Should include job_alignment');
    assert.ok(categories.has('readability'), 'Should include readability');
  });

  await t.test('2. Handles profile without online profile text (Not Assessed)', () => {
    const profileNoOnline = { ...arjunProfile, professionalProfile: undefined };
    const audit = generateCompleteProfileAudit(profileNoOnline, scoreReport);

    const onlineFinding = audit.findings.find(f => f.category === 'professional_profile');
    assert.ok(onlineFinding, 'Should have professional profile finding');
    assert.equal(onlineFinding.status, 'not_assessed', 'Should be not_assessed when online profile text not provided');
    assert.ok(onlineFinding.whatWeFound.toLowerCase().includes('provided'), 'Should clearly explain not provided');
  });

  await t.test('3. Handles profile with supplied online profile text', () => {
    const profileWithOnline: ParsedProfile = {
      ...arjunProfile,
      professionalProfile: {
        headline: 'Senior Full Stack Engineer | React & Node.js | 5 Yrs Exp',
        summary: 'Experienced web engineer focused on high-throughput microservices.',
        rawText: 'Senior Full Stack Engineer | React & Node.js. 5 years building scalable web systems in Bangalore.'
      }
    };
    const audit = generateCompleteProfileAudit(profileWithOnline, scoreReport);

    const onlineFinding = audit.findings.find(f => f.category === 'professional_profile');
    assert.ok(onlineFinding);
    assert.notEqual(onlineFinding.status, 'not_assessed', 'Should be evaluated once profile text is provided');
  });

  await t.test('4. General audit vs Job-specific audit', () => {
    // A: General audit without JD
    const profileNoJd: ParsedProfile = { ...arjunProfile, targetJobDescription: '' };
    const auditGeneral = generateCompleteProfileAudit(profileNoJd, scoreReport);
    assert.equal(auditGeneral.jobMatchScore, null, 'Job match score should be null when no JD');
    const jdFindingGen = auditGeneral.findings.find(f => f.id === 'job-jd-alignment');
    assert.equal(jdFindingGen?.status, 'not_assessed', 'Should be not_assessed in general mode');
    assert.equal(jdFindingGen?.title, 'No Job Description Added', 'Should state No Job Description Added');

    // B: Job-specific audit with JD
    const sampleJd = `
      Looking for a Senior Backend Engineer in Bengaluru.
      Required: Java, Spring Boot, Microservices, Kafka, Docker, Kubernetes, AWS, SQL.
      Minimum 4 years experience required.
    `;
    const profileWithJd: ParsedProfile = { ...arjunProfile, targetJobDescription: sampleJd };
    const auditJd = generateCompleteProfileAudit(profileWithJd, scoreReport);
    assert.ok(auditJd.jobMatchScore !== null, 'Job match score should be calculated when JD provided');
    assert.ok(auditJd.jobMatchScore > 0 && auditJd.jobMatchScore <= 100);
  });

  await t.test('5. Adapts to Fresher vs Experienced profiles (Projects vs Tenure)', () => {
    // Fresher with 0 projects
    const fresherNoProj: ParsedProfile = {
      ...arjunProfile,
      experienceBand: 'Fresher',
      projects: [],
      experiences: []
    };
    const fresherScore = calculateScore(fresherNoProj);
    const auditFresher = generateCompleteProfileAudit(fresherNoProj, fresherScore);

    const projFinding = auditFresher.findings.find(f => f.id === 'comp-fresher-projects');
    assert.ok(projFinding, 'Fresher should have dedicated proof-of-work project check');
    assert.equal(projFinding.priority, 'high', 'Missing projects should be high priority for freshers');
    assert.equal(projFinding.status, 'needs_attention');
  });

  await t.test('6. Detects passive verbs and unquantified bullets with exact evidence', () => {
    const profilePassive: ParsedProfile = {
      ...arjunProfile,
      experiences: [
        {
          id: 'exp-1',
          title: 'Software Developer',
          company: 'Acme Corp',
          startDate: '2022',
          endDate: 'Present',
          bullets: [
            'Responsible for backend maintenance and bug fixing for the portal.',
            'Assisted in data migration from MySQL to PostgreSQL database.'
          ]
        }
      ]
    };
    const audit = generateCompleteProfileAudit(profilePassive, scoreReport);

    const passiveFinding = audit.findings.find(f => f.id === 'qual-passive-bullets');
    assert.ok(passiveFinding, 'Should detect passive phrasing');
    assert.equal(passiveFinding.status, 'needs_attention');
    assert.ok(passiveFinding.evidence.includes('Responsible for'), 'Should quote actual resume text');
    assert.ok(passiveFinding.actionHref.includes('/bullet-rewriter'), 'Action should link to bullet rewriter');
  });

  await t.test('7. Identifies missing must-have keywords as "not_found"', () => {
    const profileNoSkills: ParsedProfile = {
      ...arjunProfile,
      skills: ['HTML', 'CSS'],
      rawText: 'Frontend developer working with HTML and CSS.'
    };
    const audit = generateCompleteProfileAudit(profileNoSkills, scoreReport);

    const kwFinding = audit.findings.find(f => f.id === 'skill-missing-musthaves');
    assert.ok(kwFinding, 'Should identify missing must-haves');
    assert.equal(kwFinding.status, 'not_found', 'Status should be not_found (Not found in resume)');
    assert.equal(kwFinding.priority, 'high');
  });

  await t.test('8. Allows resolving findings through resolvedIds set', () => {
    // Pick an issue that requires attention
    const profileWithGap: ParsedProfile = {
      ...arjunProfile,
      headline: 'Dev' // brief headline (<15 chars) triggers needs_attention
    };
    const auditBefore = generateCompleteProfileAudit(profileWithGap, scoreReport);
    const headlineBefore = auditBefore.findings.find(f => f.id === 'comp-headline');
    assert.equal(headlineBefore?.status, 'needs_attention');

    const resolvedSet = new Set(['comp-headline']);
    const auditAfter = generateCompleteProfileAudit(profileWithGap, scoreReport, resolvedSet);
    const headlineAfter = auditAfter.findings.find(f => f.id === 'comp-headline');
    assert.equal(headlineAfter?.status, 'resolved', 'Resolved finding should have status resolved');
    assert.ok(auditAfter.summary.resolved >= 1, 'Resolved count should increment');
  });

  await t.test('9. Summary counts and plain English summary match actual numbers', () => {
    const audit = generateCompleteProfileAudit(arjunProfile, scoreReport);
    
    assert.equal(
      audit.summary.total,
      audit.findings.length,
      'Total summary count must match findings array length'
    );
    assert.ok(audit.summary.verified > 0, 'Should have verified findings for valid profile');
    assert.ok(audit.plainEnglishSummary.includes(`${audit.summary.verified} verified section`));
  });
});
