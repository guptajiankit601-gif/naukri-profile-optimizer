import assert from 'node:assert';
import { detectIntent } from '../lib/rewriter/detect-intent';
import { rewriteBullet, validateRewriteFactualIntegrity } from '../lib/rewriter/engine';

console.log('========================================================');
console.log('🧪 BULLET INTENT & FACT-PRESERVING REWRITER TEST SUITE');
console.log('========================================================\n');

// 1. Critical Bug Test from User Prompt
console.log('--- 1. CRITICAL BUG REPRO & FIX: TECHNICAL BULLET CLASSIFICATION ---');
const technicalBullet = 'Responsible for developing backend REST APIs using Java and Spring Boot for a banking client.';
const detectedIntent = detectIntent(technicalBullet, 'Backend Engineer');

console.log(`Input: "${technicalBullet}"`);
console.log(`Detected Intent: ${detectedIntent}`);

assert.strictEqual(detectedIntent, 'built', `Technical bullet must be classified as 'built', not '${detectedIntent}'`);
assert.notStrictEqual(detectedIntent, 'sold', 'Technical bullet with "banking client" must NEVER be classified as sold!');
console.log('  ✓ PASS: "Responsible for developing backend REST APIs using Java and Spring Boot for a banking client" correctly classified as "built"');

// 2. Safe Variant Fact Preservation
console.log('\n--- 2. FACT-PRESERVATION & ZERO DOMAIN LEAKAGE ---');
const rewriteResult = rewriteBullet(technicalBullet);
const safeVariant = rewriteResult.variants.find(v => v.type === 'SAFE')!;
const metricVariant = rewriteResult.variants.find(v => v.type === 'METRIC')!;
const impactVariant = rewriteResult.variants.find(v => v.type === 'IMPACT')!;

console.log(`SAFE:   ${safeVariant.text}`);
console.log(`METRIC: ${metricVariant.text}`);
console.log(`IMPACT: ${impactVariant.text}`);

// Verify that NO sales or prospecting words appear in the technical rewrite
const lowerSafe = safeVariant.text.toLowerCase();
assert(!lowerSafe.includes('prospecting'), 'Safe variant must NOT introduce "prospecting"');
assert(!lowerSafe.includes('sales pipeline'), 'Safe variant must NOT introduce "sales pipeline"');
assert(!lowerSafe.includes('stakeholder management for client accounts'), 'Safe variant must NOT introduce generic sales patterns');
assert(!lowerSafe.includes('cold call'), 'Safe variant must NOT introduce "cold call"');
console.log('  ✓ PASS: Zero sales/outbound domain leakage in safe variant');

// Verify that ALL original technical facts are preserved
assert(safeVariant.text.includes('backend REST APIs'), 'Safe variant must preserve "backend REST APIs"');
assert(safeVariant.text.includes('Java'), 'Safe variant must preserve "Java"');
assert(safeVariant.text.includes('Spring Boot'), 'Safe variant must preserve "Spring Boot"');
assert(safeVariant.text.includes('banking client'), 'Safe variant must preserve "banking client"');
console.log('  ✓ PASS: All technical skills and client context fully preserved');

// 3. Metric Variant Placeholder & Confirmed Metric Tests
console.log('\n--- 3. METRIC VARIANT PLACEHOLDER & ZERO FABRICATION ---');
assert(metricVariant.text.includes('[add verified metric'), 'Metric variant without user metric must include [add verified metric] placeholder');
assert(!/\b(35%|40%|4x|₹1\.2 Cr|20k TPS)\b/.test(metricVariant.text), 'Must never invent unverified metrics when none provided');
console.log('  ✓ PASS: Explicit placeholder present when metric is not provided; zero hallucinations');

const withConfirmedMetric = rewriteBullet(technicalBullet, '35% latency reduction');
const confirmedMetricVariant = withConfirmedMetric.variants.find(v => v.type === 'METRIC')!;
assert(confirmedMetricVariant.text.includes('35% latency reduction'), 'Confirmed user metric must be faithfully integrated');
console.log('  ✓ PASS: User-provided metric faithfully integrated');

// 4. Genuine Sales Bullets Handled Correctly
console.log('\n--- 4. GENUINE SALES BULLET CLASSIFICATION ---');
const salesBullet = 'Generated ₹2.4 Cr in new ARR by managing outbound prospecting and closing enterprise accounts.';
const salesIntent = detectIntent(salesBullet, 'Sales Development Representative');
assert.strictEqual(salesIntent, 'sold', 'Genuine commercial sales bullet must be classified as "sold"');
console.log('  ✓ PASS: Commercial sales bullet correctly classified as "sold"');

// 5. Fact Validation Check
console.log('\n--- 5. FACT VALIDATION CHECK ---');
const fabricatedVariant = 'Engineered backend REST APIs delivering 95% latency reduction across 10M users.';
const validation = validateRewriteFactualIntegrity(technicalBullet, fabricatedVariant);
assert.strictEqual(validation.isValid, false, 'Validation must fail when unverified numbers exist');
assert(validation.fallbackText.length > 0, 'Must provide faithful fallback on validation failure');
console.log(`  ✓ PASS: Caught fabricated numbers (${validation.issue}); fell back to: "${validation.fallbackText}"`);

console.log('\n========================================================');
console.log('RESULTS: ALL 10 BULLET REWRITER INTEGRITY TESTS PASSED');
console.log('========================================================\n');
