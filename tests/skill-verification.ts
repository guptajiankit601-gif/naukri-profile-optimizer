import { COMPLETE_SKILLS_DICTIONARY, isGenericSkill, resolveSkill, ALIASES } from '../lib/data/skills-dict';
import { ROLES } from '../lib/data/roles';
import { POWER_VERBS, WEAK_VERBS, VERB_UPGRADES } from '../lib/data/verbs';
import { REWRITE_TEMPLATES, METRIC_NOUNS, REASONS } from '../lib/data/templates';
import { DATA_VERSION, AS_OF_DATE, BACKEND_METRO_BENCHMARK } from '../lib/data/benchmarks';
import { formatSearchVolume } from '../lib/data/keywords';

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
console.log('⚡ NAUKRI PROFILE OPTIMIZER — SKILL SYSTEM VERIFICATION');
console.log('========================================================\n');

// 1. Skill Dictionary & Generic Flagging (Section 2)
console.log('--- 1. SKILL TAXONOMY & GENERIC SKILL ENFORCEMENT ---');
assert(COMPLETE_SKILLS_DICTIONARY.length >= 70, `Complete skills taxonomy loaded (${COMPLETE_SKILLS_DICTIONARY.length} curated skills)`);

assert(isGenericSkill('Communication') === true, 'Communication flagged as isGeneric: true');
assert(isGenericSkill('MS Office') === true, 'MS Office flagged as isGeneric: true');
assert(isGenericSkill('Teamwork') === true, 'Teamwork flagged as isGeneric: true');
assert(isGenericSkill('Java') === false, 'Java correctly identified as hard technical skill');
assert(isGenericSkill('Kubernetes') === false, 'Kubernetes correctly identified as hard technical skill');

// 2. Alias Resolution (Section 2.4)
console.log('\n--- 2. ALIAS LOOKUP & RESOLUTION ---');
assert(resolveSkill('k8s')?.name === 'Kubernetes', 'Resolved "k8s" → "Kubernetes"');
assert(resolveSkill('js')?.name === 'JavaScript', 'Resolved "js" → "JavaScript"');
assert(resolveSkill('node')?.name === 'Node.js', 'Resolved "node" → "Node.js"');
assert(resolveSkill('postgres')?.name === 'PostgreSQL', 'Resolved "postgres" → "PostgreSQL"');
assert(resolveSkill('ts')?.name === 'TypeScript', 'Resolved "ts" → "TypeScript"');

// 3. 10 Curated Roles Taxonomy (Section 3)
console.log('\n--- 3. 10 CURATED ROLE DEFINITIONS (R1..R10) ---');
assert(ROLES.length === 10, 'Exactly 10 curated roles configured');

const expectedRoleIds = [
  'backend-engineer',
  'frontend-developer',
  'data-analyst',
  'digital-marketing',
  'hr-talent-acquisition',
  'sales-development',
  'finance-analyst',
  'ui-ux-designer',
  'content-writer-seo',
  'business-ops-pm'
];

for (const id of expectedRoleIds) {
  const role = ROLES.find(r => r.id === id);
  assert(Boolean(role), `Role [${id}] exists`);
  if (role) {
    assert(role.coreSkills.length > 0, `Role [${id}] defines coreSkills`);
    assert(role.boosterSkills.length > 0, `Role [${id}] defines boosterSkills`);
    assert(role.noiseSkills.length > 0, `Role [${id}] defines noiseSkills`);
    assert(role.verbSets.length > 0, `Role [${id}] defines allowed power verbs`);
    assert(role.headlineTemplates.naukri.length > 0, `Role [${id}] defines Naukri headlines`);
    assert(role.metricExamples.length > 0, `Role [${id}] defines metric examples`);
  }
}

// 4. Keyword Volume Disclosure (Section 4.4)
console.log('\n--- 4. KEYWORD INTELLIGENCE DISCLOSURE ---');
const formattedVolume = formatSearchVolume(31000);
assert(formattedVolume.includes('~31,000 searches/mo (estimated)'), `Formatted volume: "${formattedVolume}" carries mandatory estimated disclosure`);

// 5. Power Verb Library (Section 5)
console.log('\n--- 5. POWER VERBS & WEAK VERB UPGRADES ---');
const intents = ['built', 'led', 'improved', 'managed', 'sold', 'taught', 'supported', 'analyzed'] as const;
for (const intent of intents) {
  assert(POWER_VERBS[intent].length > 0, `Power verbs loaded for intent "${intent}" (${POWER_VERBS[intent].length} verbs)`);
}

assert(WEAK_VERBS.has('responsible for'), 'Weak verbs contains "responsible for"');
assert(WEAK_VERBS.has('worked on'), 'Weak verbs contains "worked on"');
assert(VERB_UPGRADES['responsible for'] === 'owned', 'Upgrade mapping: "responsible for" → "owned"');
assert(VERB_UPGRADES['worked on'] === 'delivered', 'Upgrade mapping: "worked on" → "delivered"');

// 6. Rewrite Templates (8 Intents × 3 Levels = 24) (Section 6)
console.log('\n--- 6. 24 REWRITE TEMPLATES & METRIC NOUNS ---');
for (const intent of intents) {
  const tmpl = REWRITE_TEMPLATES[intent];
  assert(Boolean(tmpl), `Template exists for intent "${intent}"`);
  if (tmpl) {
    const safe = tmpl.safePattern('REST APIs', '', 'Java');
    const metric = tmpl.metricPattern('REST APIs', '', '20k TPS', 'Java');
    const impact = tmpl.impactPattern('REST APIs', '99.9% uptime', 'Java');
    assert(safe.length > 10, `Safe pattern generated for "${intent}"`);
    assert(metric.includes('20k TPS'), `Metric pattern includes slot for "${intent}"`);
    assert(impact.includes('99.9% uptime'), `Impact pattern includes outcome for "${intent}"`);
  }
}

assert(METRIC_NOUNS.backend.includes('latency'), 'Backend metric nouns includes "latency"');
assert(METRIC_NOUNS.marketing.includes('ROAS'), 'Marketing metric nouns includes "ROAS"');
assert(Boolean(REASONS.addedMetric), 'Reason template for addedMetric exists');

// 7. Benchmark Data Structure (Section 7)
console.log('\n--- 7. BENCHMARK DATASET & SEED VALUES ---');
assert(DATA_VERSION === 'bench-v1.0.0', `DATA_VERSION is "bench-v1.0.0"`);
assert(AS_OF_DATE === '2025-01-15', `AS_OF_DATE is "2025-01-15"`);
assert(BACKEND_METRO_BENCHMARK.n === 1240, `Backend Metro seed dataset has n=1240 contributors`);
assert(BACKEND_METRO_BENCHMARK.visibility.p50 === 58, `Backend Metro median visibility is 58/100`);
assert(BACKEND_METRO_BENCHMARK.completeness.p90 === 88, `Backend Metro top 10% completeness is 88/100`);

console.log('\n========================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
