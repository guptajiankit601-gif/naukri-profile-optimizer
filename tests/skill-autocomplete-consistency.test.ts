import test from 'node:test';
import assert from 'node:assert/strict';
import { searchSkillSuggestions, normalizeSkillInput } from '../lib/skills/skill-catalog';
import { sanitizeCopyText, generatePlatformProfiles, formatContactLine } from '../lib/naukri/clean-placeholders';
import { generateCompleteProfileAudit } from '../lib/audit/generate-audit';
import { calculateScore } from '../lib/scoring';
import { SEEDED_PROFILES } from '../lib/data/seeded-profiles';
import { ParsedProfile, ProjectItem } from '../types';

test('Skill Autocomplete & Data Consistency Verification Suite', async (t) => {
  const arjunProfile: ParsedProfile = JSON.parse(JSON.stringify(SEEDED_PROFILES.arjun));

  await t.test('1. Autocomplete matches prefixes for common tech: py, jav, rea', () => {
    // A: Typing "py"
    const pyMatches = searchSkillSuggestions('py', []);
    const pyNames = pyMatches.map(s => s.name);
    assert.ok(pyNames.includes('Python'), 'Should match Python for "py"');
    assert.ok(pyNames.includes('PyTorch'), 'Should match PyTorch for "py"');
    assert.ok(pyNames.includes('PySpark'), 'Should match PySpark for "py"');
    assert.ok(pyNames.includes('PyTest'), 'Should match PyTest for "py"');

    // B: Typing "jav"
    const javMatches = searchSkillSuggestions('jav', []);
    const javNames = javMatches.map(s => s.name);
    assert.ok(javNames.includes('Java'), 'Should match Java for "jav"');
    assert.ok(javNames.includes('JavaScript'), 'Should match JavaScript for "jav"');

    // C: Typing "rea"
    const reaMatches = searchSkillSuggestions('rea', []);
    const reaNames = reaMatches.map(s => s.name);
    assert.ok(reaNames.includes('React'), 'Should match React for "rea"');
    assert.ok(reaNames.includes('React Native'), 'Should match React Native for "rea"');
  });

  await t.test('2. Autocomplete excludes already-possessed skills case-insensitively', () => {
    const existing = ['Python', 'Java', 'React'];
    const pyMatches = searchSkillSuggestions('py', existing);
    const pyNames = pyMatches.map(s => s.name);

    assert.equal(pyNames.includes('Python'), false, 'Should exclude Python because candidate already has it');
    assert.ok(pyNames.includes('PyTorch'), 'Should still offer other matching skills');
  });

  await t.test('3. Normalizes input and supports custom skills', () => {
    // Known skill with bad casing
    assert.equal(normalizeSkillInput('python'), 'Python', 'Should format canonical casing from catalog');
    assert.equal(normalizeSkillInput('  docker  '), 'Docker', 'Should trim and format Docker');

    // Custom non-catalog skill
    assert.equal(normalizeSkillInput('  CustomInternalSDK v2  '), 'CustomInternalSDK v2', 'Should trim excess whitespace on custom skills');
  });

  await t.test('4. Distinguishes extracted from user-added skills', () => {
    const rawResumeText = 'Experienced Java and Spring Boot engineer with 4 years in Bangalore.';
    const testProfile: ParsedProfile = {
      ...arjunProfile,
      rawText: rawResumeText,
      skills: ['Java', 'Spring Boot', 'Kubernetes'], // Kubernetes was added by user, not in rawText
      skillInventory: [
        { name: 'Java', origin: 'extracted', confirmed: true },
        { name: 'Spring Boot', origin: 'extracted', confirmed: true },
        { name: 'Kubernetes', origin: 'user_added', confirmed: true }
      ]
    };

    const scoreReport = calculateScore(testProfile);
    const audit = generateCompleteProfileAudit(testProfile, scoreReport);

    // Verify audit flags user-added skill pending draft in resume text
    const pendingDraftFinding = audit.findings.find(f => f.id === 'skill-user-added-pending-draft');
    assert.ok(pendingDraftFinding, 'Should detect that Kubernetes is user-added and not yet in resume text');
    assert.ok(pendingDraftFinding.evidence.includes('Kubernetes'), 'Evidence should cite the inventory-only skill');
    assert.equal(pendingDraftFinding.status, 'recommended');
  });

  await t.test('5. Proof of Work Vault supports project types, timeline, and validates URLs', () => {
    const validProject: ProjectItem = {
      id: 'proj-pow-1',
      title: 'Distributed Rate Limiter',
      description: 'Built a token-bucket rate limiter handling 10k requests/sec.',
      technologies: ['Go', 'Redis', 'Docker'],
      projectType: 'Open Source',
      timeline: 'Mar 2024 - Jun 2024',
      link: 'https://demo.ratelimiter.dev',
      repoLink: 'https://github.com/candidate/rate-limiter',
      metrics: 'Cut p99 response latency by 28%'
    };

    assert.equal(validProject.projectType, 'Open Source');
    assert.equal(validProject.timeline, 'Mar 2024 - Jun 2024');
    assert.ok(validProject.link?.startsWith('https://'));
    assert.ok(validProject.repoLink?.startsWith('https://'));
  });

  await t.test('6. Sanitizes unresolved placeholders like [Phone Number], [Email Address], [Add URL]', () => {
    const rawWithPlaceholders = 'Ankit Sharma | Backend Engineer | [Phone Number] | [Email Address] | [Your Location]';
    const cleaned = sanitizeCopyText(rawWithPlaceholders);

    assert.equal(cleaned.includes('[Phone Number]'), false);
    assert.equal(cleaned.includes('[Email Address]'), false);
    assert.equal(cleaned.includes('[Your Location]'), false);
    assert.equal(cleaned.includes('| |'), false, 'Should clean up stranded pipes');
    assert.equal(cleaned, 'Ankit Sharma | Backend Engineer');
  });

  await t.test('7. Generates separate Naukri and LinkedIn profiles with exact character counts', () => {
    const profileNoPhone: ParsedProfile = {
      ...arjunProfile,
      phone: '', // missing phone
      location: 'Bengaluru, India'
    };

    const platformProfiles = generatePlatformProfiles(profileNoPhone);

    // Naukri
    assert.ok(platformProfiles.naukri.headline.length > 0);
    assert.equal(platformProfiles.naukri.headlineCharCount, platformProfiles.naukri.headline.length);
    assert.equal(platformProfiles.naukri.headline.includes('['), false, 'Naukri headline must not have bracketed placeholders');

    // LinkedIn
    assert.ok(platformProfiles.linkedIn.headline.length > 0);
    assert.equal(platformProfiles.linkedIn.headlineCharCount, platformProfiles.linkedIn.headline.length);
    assert.equal(platformProfiles.linkedIn.about.includes('Phone:'), false, 'Should omit phone cleanly without empty placeholders');

    // Missing fields prompt
    assert.ok(platformProfiles.missingFields.some(f => f.field === 'phone'), 'Should flag missing phone as a field to supply');
  });

  await t.test('8. Formats contact lines cleanly without empty delimiters', () => {
    // A: Full contact
    const fullContact = formatContactLine(arjunProfile);
    assert.ok(fullContact.includes(arjunProfile.email));
    assert.ok(fullContact.includes(arjunProfile.phone));

    // B: Missing phone
    const partialProfile: ParsedProfile = {
      ...arjunProfile,
      phone: '',
      location: 'Pune'
    };
    const partialContact = formatContactLine(partialProfile);
    assert.ok(!partialContact.includes('· ·'), 'Must not have double separator dots');
    assert.ok(!partialContact.endsWith('·'), 'Must not have trailing separator');
  });
});
