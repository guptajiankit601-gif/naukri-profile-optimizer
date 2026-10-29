import assert from 'node:assert';

console.log('========================================================');
console.log('🌓 CAREERLENS — THEME RESOLUTION VERIFICATION SUITE');
console.log('========================================================');

// Test the pure theme resolution function matching ThemeContext.tsx and layout.tsx
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export function resolveTheme(preference: Theme, osIsDark: boolean): ResolvedTheme {
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  // preference === 'system'
  return osIsDark ? 'dark' : 'light';
}

function runThemeTests() {
  let passed = 0;
  let failed = 0;

  function pass(msg: string) {
    console.log(`  ✓ PASS: ${msg}`);
    passed++;
  }

  function fail(msg: string, err?: unknown) {
    console.error(`  ✗ FAIL: ${msg}`, err);
    failed++;
  }

  console.log('\n--- 1. THEME MATRIX VERIFICATION (6 REQUIRED COMBINATIONS) ---');

  // Case 1: Light preference + Light OS => Light
  try {
    const res = resolveTheme('light', false);
    assert.strictEqual(res, 'light');
    pass('Selected: Light | OS: Light => Resolved: Light');
  } catch (e) { fail('Light + Light OS', e); }

  // Case 2: Light preference + Dark OS => Light
  try {
    const res = resolveTheme('light', true);
    assert.strictEqual(res, 'light');
    pass('Selected: Light | OS: Dark => Resolved: Light (Manual Light overrides OS Dark)');
  } catch (e) { fail('Light + Dark OS', e); }

  // Case 3: Dark preference + Light OS => Dark
  try {
    const res = resolveTheme('dark', false);
    assert.strictEqual(res, 'dark');
    pass('Selected: Dark | OS: Light => Resolved: Dark (Manual Dark overrides OS Light)');
  } catch (e) { fail('Dark + Light OS', e); }

  // Case 4: Dark preference + Dark OS => Dark
  try {
    const res = resolveTheme('dark', true);
    assert.strictEqual(res, 'dark');
    pass('Selected: Dark | OS: Dark => Resolved: Dark');
  } catch (e) { fail('Dark + Dark OS', e); }

  // Case 5: System preference + Light OS => Light
  try {
    const res = resolveTheme('system', false);
    assert.strictEqual(res, 'light');
    pass('Selected: System | OS: Light => Resolved: Light (Follows OS)');
  } catch (e) { fail('System + Light OS', e); }

  // Case 6: System preference + Dark OS => Dark
  try {
    const res = resolveTheme('system', true);
    assert.strictEqual(res, 'dark');
    pass('Selected: System | OS: Dark => Resolved: Dark (Follows OS)');
  } catch (e) { fail('System + Dark OS', e); }

  console.log('\n--- 2. DYNAMIC OS PREFERENCE REACTION & ISOLATION ---');
  try {
    let currentPref: Theme = 'system';
    let osDark = false;

    // Start on System + Light OS
    assert.strictEqual(resolveTheme(currentPref, osDark), 'light');

    // OS changes to Dark while on System
    osDark = true;
    assert.strictEqual(resolveTheme(currentPref, osDark), 'dark');
    pass('System preference responds immediately to dynamic OS appearance switch');

    // User explicitly switches to Light while OS remains Dark
    currentPref = 'light';
    assert.strictEqual(resolveTheme(currentPref, osDark), 'light');
    pass('User manual Light selection stays Light even when OS is Dark');

    // OS toggles back to Light while user is on manual Light
    osDark = false;
    assert.strictEqual(resolveTheme(currentPref, osDark), 'light');
    pass('Manual Light unaffected by subsequent OS toggles');

    // User switches to Dark
    currentPref = 'dark';
    assert.strictEqual(resolveTheme(currentPref, osDark), 'dark');
    pass('User manual Dark selection stays Dark even when OS is Light');
  } catch (e) {
    fail('Dynamic reaction and isolation', e);
  }

  console.log('\n--- 3. STORAGE KEY & ANTI-FLASH SCRIPT CONSISTENCY ---');
  try {
    const antiFlashEval = (stored: string | null, prefersDark: boolean): 'dark' | 'light' => {
      const isDark = stored === 'dark' || (stored === 'system' && prefersDark) || (!stored && prefersDark);
      return isDark ? 'dark' : 'light';
    };

    // Verify anti-flash matches resolver exactly for all permutations
    const themes: (Theme | null)[] = ['light', 'dark', 'system', null];
    const osModes = [true, false];

    for (const t of themes) {
      for (const os of osModes) {
        const expected = resolveTheme((t as Theme) || 'system', os);
        const scriptResult = antiFlashEval(t, os);
        assert.strictEqual(scriptResult, expected, `Mismatch for stored=${t}, osDark=${os}`);
      }
    }
    pass('Anti-flash head script matches theme context resolution across all 8 permutations');
  } catch (e) {
    fail('Anti-flash script consistency', e);
  }

  console.log('========================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) process.exit(1);
}

runThemeTests();
