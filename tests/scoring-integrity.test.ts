import { calculateScore, calculateCompletenessScore } from '../lib/scoring';
import { STANDARD_SCORE_WEIGHTS, FRESHER_SCORE_WEIGHTS, normalizeWeights } from '../lib/scoring/weights';
import { SEEDED_PROFILES } from '../lib/data/seeded-profiles';
import { ParsedProfile } from '../types';

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
console.log('📊 SCORING ARITHMETIC & DATA INTEGRITY TEST SUITE');
console.log('========================================================\n');

// 1. Weight Configuration Verification
console.log('--- 1. CONFIGURABLE WEIGHT SUMS ---');
const standardSum = Object.values(STANDARD_SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
assert(standardSum === 100, `Standard weights sum to exactly 100 (actual: ${standardSum})`);

const fresherSum = Object.values(FRESHER_SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
assert(fresherSum === 100, `Fresher weights sum to exactly 100 (actual: ${fresherSum})`);

// 2. Standard Profile Arithmetic (Arjun)
console.log('\n--- 2. EXPERIENCED CANDIDATE ARITHMETIC (Arjun Sharma) ---');
const arjunReport = calculateScore(SEEDED_PROFILES.arjun);

const arjunComponentMaxSum = arjunReport.components.reduce((sum, c) => sum + c.max, 0);
assert(arjunComponentMaxSum === 100, `Component maxima sum to exactly 100 (actual: ${arjunComponentMaxSum})`);

const arjunComponentScoreSum = arjunReport.components.reduce((sum, c) => sum + c.score, 0);
assert(arjunComponentScoreSum === arjunReport.overallScore, `Component points (${arjunComponentScoreSum}) equal overall score (${arjunReport.overallScore})`);

assert(arjunReport.headroomTotal === 100 - arjunReport.overallScore, `Headroom total strictly equals 100 - score (${arjunReport.headroomTotal})`);

arjunReport.components.forEach(c => {
  assert(c.score <= c.max, `Component "${c.name}" score (${c.score}) <= max (${c.max})`);
  assert(c.score >= 0, `Component "${c.name}" score is non-negative`);
  const expectedHeadroom = c.max - c.score;
  assert(c.headroom === expectedHeadroom, `Component "${c.name}" headroom (${c.headroom}) matches max - score (${expectedHeadroom})`);
});

// 3. Fresher Candidate Dynamic Reweighting (Priya)
console.log('\n--- 3. FRESHER DYNAMIC REWEIGHTING (Priya Patel) ---');
const priyaReport = calculateScore(SEEDED_PROFILES.priya);

assert(priyaReport.isFresher === true, 'Priya correctly classified under Fresher model');

const priyaComponentMaxSum = priyaReport.components.reduce((sum, c) => sum + c.max, 0);
assert(priyaComponentMaxSum === 100, `Fresher component maxima sum to exactly 100 (actual: ${priyaComponentMaxSum})`);

const priyaComponentScoreSum = priyaReport.components.reduce((sum, c) => sum + c.score, 0);
assert(priyaComponentScoreSum === priyaReport.overallScore, `Fresher points (${priyaComponentScoreSum}) equal overall score (${priyaReport.overallScore})`);

const projComponent = priyaReport.components.find(c => c.key === 'projectsPortfolio');
assert(projComponent !== undefined && projComponent.max === 19, `Projects reweighted to 19 points for fresher (actual: ${projComponent?.max})`);

const expComponent = priyaReport.components.find(c => c.key === 'experienceRelevance');
assert(expComponent !== undefined && expComponent.max === 5, `Experience weight adjusted to 5 points for fresher (actual: ${expComponent?.max})`);

// 4. Edge Case: Minimal / Empty Profile
console.log('\n--- 4. EDGE CASE: EMPTY RESUME PROFILE ---');
const emptyProfile: ParsedProfile = {
  id: 'empty-test',
  name: 'Blank Candidate',
  email: '',
  phone: '',
  location: '',
  targetRole: 'Backend Engineer',
  targetRoleId: 'backend-engineer',
  experienceBand: 'Fresher',
  targetCities: [],
  headline: '',
  summary: '',
  skills: [],
  experiences: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
  rawText: '',
  sectionConfidence: {}
};

const emptyReport = calculateScore(emptyProfile);
assert(!isNaN(emptyReport.overallScore), `Empty profile score is not NaN (actual: ${emptyReport.overallScore})`);
assert(emptyReport.overallScore >= 0 && emptyReport.overallScore <= 100, `Empty profile score is in range 0-100 (${emptyReport.overallScore})`);

const emptyMaxSum = emptyReport.components.reduce((sum, c) => sum + c.max, 0);
assert(emptyMaxSum === 100, `Empty profile component maxima total exactly 100 (actual: ${emptyMaxSum})`);

const emptyScoreSum = emptyReport.components.reduce((sum, c) => sum + c.score, 0);
assert(emptyScoreSum === emptyReport.overallScore, `Empty profile component scores sum to overall score`);
assert(emptyReport.headroomTotal === 100 - emptyReport.overallScore, `Empty profile headroom equals 100 - score`);

// 5. Weight Normalization Function (Active Subset)
console.log('\n--- 5. PROPORTIONAL WEIGHT NORMALIZATION ALGORITHM ---');
const activeKeys: (keyof typeof STANDARD_SCORE_WEIGHTS)[] = [
  'headlineClarity',
  'summaryQuality',
  'skillKeywordRelevance',
  'experienceRelevance',
  'projectsPortfolio'
];
const { normalized, note } = normalizeWeights(STANDARD_SCORE_WEIGHTS, activeKeys);
const normalizedSum = Object.values(normalized).reduce((a, b) => a + b, 0);
assert(normalizedSum === 100, `Normalized weights sum to exactly 100 (actual: ${normalizedSum})`);
assert(note.includes('100 pts'), `Normalization note explains method clearly: "${note}"`);

// 6. Top Fixes Simulation & Headroom Capping
console.log('\n--- 6. PROJECTED GAINS & HEADROOM INTEGRITY ---');
arjunReport.topFixes.forEach(fix => {
  const comp = arjunReport.components.find(c => c.key === fix.componentKey);
  if (comp) {
    const compHeadroom = comp.max - comp.score;
    assert(fix.points <= compHeadroom, `Projected fix "${fix.title}" gain (${fix.points} pts) does not exceed component headroom (${compHeadroom} pts)`);
  }
  assert((fix.projectedScore ?? 0) <= 100, `Projected score (${fix.projectedScore}) does not exceed 100`);
});

console.log('\n========================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
