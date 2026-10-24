import { safeUrl } from '../lib/security/safe-url';
import { isPrivateIp, safeFetch, ALLOWED_HOSTS } from '../lib/security/ssrf';
import { timingSafeEqualStr } from '../lib/security/csrf';
import { rateLimit, checkRouteRateLimit } from '../lib/security/rate-limit';
import { redact, redactPii, sanitizeText } from '../lib/security';
import { AppError, toPublicError } from '../lib/security/error';
import { isAiEnabled, isUrlImportEnabled, isShareEnabled, isAnalysisDisabled } from '../lib/security/kill-switches';
import { validateEnvironment } from '../lib/security/env';
import { createSignedGuestToken, verifyGuestToken, requireProfileAccess } from '../lib/security/auth';

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
console.log('🛡️ NAUKRI PROFILE OPTIMIZER — SECURITY VERIFICATION');
console.log('========================================================\n');

// 1. SSRF Prevention & Safe Fetch Rules (Section 3.3)
console.log('--- 1. SSRF PREVENTION & URL VALIDATION ---');
assert(ALLOWED_HOSTS.has('naukri.com'), 'naukri.com in allowlist');
assert(ALLOWED_HOSTS.has('linkedin.com'), 'linkedin.com in allowlist');
assert(!ALLOWED_HOSTS.has('attacker.com'), 'attacker.com rejected from allowlist');

assert(isPrivateIp('127.0.0.1') === true, 'Blocked 127.0.0.1 loopback IP');
assert(isPrivateIp('10.0.1.5') === true, 'Blocked 10.x.x.x private IP range');
assert(isPrivateIp('192.168.1.1') === true, 'Blocked 192.168.x.x private IP range');
assert(isPrivateIp('169.254.169.254') === true, 'Blocked 169.254.x.x AWS/GCP cloud metadata IP');
assert(isPrivateIp('localhost') === true, 'Blocked localhost hostname');
assert(isPrivateIp('8.8.8.8') === false, 'Permitted public IP 8.8.8.8');

// Test safeFetch rejections
let blockedNonHttps = false;
try {
  await safeFetch('http://www.naukri.com/profile');
} catch (e: any) {
  if (e.code === 'URL_BLOCKED') blockedNonHttps = true;
}
assert(blockedNonHttps, 'safeFetch: strictly blocked non-HTTPS protocol');

let blockedUntrustedHost = false;
try {
  await safeFetch('https://malicious-site.com/profile');
} catch (e: any) {
  if (e.code === 'URL_BLOCKED') blockedUntrustedHost = true;
}
assert(blockedUntrustedHost, 'safeFetch: strictly blocked untrusted external domain');

let blockedCustomPort = false;
try {
  await safeFetch('https://www.naukri.com:8443/profile');
} catch (e: any) {
  if (e.code === 'URL_BLOCKED') blockedCustomPort = true;
}
assert(blockedCustomPort, 'safeFetch: strictly blocked custom port 8443');

// 2. Safe URL Helper & XSS Protocol Neutralization (Section 4)
console.log('\n--- 2. SAFE URL VALIDATION (XSS NEUTRALIZATION) ---');
assert(safeUrl('https://linkedin.com/in/candidate') === 'https://linkedin.com/in/candidate', 'Valid HTTPS URL preserved');
assert(safeUrl('javascript:alert(document.cookie)') === null, 'Blocked javascript: XSS scheme');
assert(safeUrl('data:text/html,<script>alert(1)</script>') === null, 'Blocked data: XSS scheme');
assert(safeUrl('vbscript:msgbox(1)') === null, 'Blocked vbscript: XSS scheme');
assert(safeUrl('file:///etc/passwd') === null, 'Blocked file: local file access scheme');

// 3. CSRF & Timing-Safe Token Comparison (Section 6)
console.log('\n--- 3. CSRF & TIMING-SAFE VERIFICATION ---');
const tokenA = 'f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8';
const tokenB = 'f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8';
const tokenMismatch = '0000000000000000000000000000000000000000000000000000000000000000';

assert(timingSafeEqualStr(tokenA, tokenB) === true, 'Constant-time comparison matches identical tokens');
assert(timingSafeEqualStr(tokenA, tokenMismatch) === false, 'Constant-time comparison rejects mismatch');

// 4. Rate Limiting Limits & Sliding Window (Section 5)
console.log('\n--- 4. RATE LIMITING ENGINE (SECTION 5) ---');
const testIp = '198.51.100.42';
// Test tight route limit: /api/auth/signup (5/hr)
for (let i = 0; i < 5; i++) {
  const res = checkRouteRateLimit('/api/auth/signup', testIp);
  assert(res.allowed === true, `Rate limit request #${i + 1} allowed`);
}
const rateBlocked = checkRouteRateLimit('/api/auth/signup', testIp);
assert(rateBlocked.allowed === false, 'Request #6 blocked: 5/hr signup rate limit strictly enforced');
assert((rateBlocked.retryAfter || 0) > 0, `Returns valid retryAfter (${rateBlocked.retryAfter}s)`);

// 5. PII Redaction & Sanitization (Section 11)
console.log('\n--- 5. LOGGING & PII REDACTION (SECTION 11) ---');
const confidentialPayload = {
  name: 'Arjun Sharma',
  email: 'arjun.sharma@tcs.com',
  phone: '+91 9876543210',
  rawText: 'Full confidential resume text with salary information',
  resumeText: 'Full confidential resume text line 2',
  jdText: 'Confidential client JD text',
  prompt: 'Confidential AI prompt containing sensitive data',
  parsed: { name: 'Arjun' },
  password: 'plaintext-secret-password',
  status: 200,
  requestId: 'req_12345'
};

const redacted = redact(confidentialPayload);
assert(!('rawText' in redacted), 'Redacted payload: rawText completely stripped');
assert(!('resumeText' in redacted), 'Redacted payload: resumeText completely stripped');
assert(!('jdText' in redacted), 'Redacted payload: jdText completely stripped');
assert(!('prompt' in redacted), 'Redacted payload: prompt completely stripped');
assert(!('password' in redacted), 'Redacted payload: password completely stripped');
assert(redacted.parsed === '[redacted]', 'Redacted payload: parsed marked [redacted]');
assert(String(redacted.phone).startsWith('***'), 'Redacted payload: phone number masked (***3210)');
assert(!String(redacted.email).includes('arjun.sharma'), 'Redacted payload: email username hashed');

assert(sanitizeText('<script>alert(1)</script>Software Engineer') === 'Software Engineer', 'HTML tags stripped by sanitizeText');
assert(redactPii('Contact me at candidate@example.com or 9876543210') === 'Contact me at [REDACTED_EMAIL] or [REDACTED_PHONE]', 'PII scrubber redacts email and Indian phone');

// 6. Error Handling Without Information Leaks (Section 13)
console.log('\n--- 6. ERROR SANITIZATION & LEAK PREVENTION ---');
const appErr = new AppError('PROFILE_NOT_FOUND', 'The requested profile does not exist or has expired.', 404);
const publicAppErr = toPublicError(appErr);
assert(publicAppErr.code === 'PROFILE_NOT_FOUND', 'AppError preserves error code');
assert(publicAppErr.status === 404, 'AppError preserves status');
assert(publicAppErr.message === 'The requested profile does not exist or has expired.', 'AppError returns publicMessage');

const fatalDbError = new Error('FATAL: password authentication failed for user "postgres" at line 42 SELECT * FROM users');
const publicFatalErr = toPublicError(fatalDbError);
assert(publicFatalErr.code === 'INTERNAL_ERROR', 'Unexpected DB error replaced with INTERNAL_ERROR');
assert(publicFatalErr.status === 500, 'Unexpected DB error returns status 500');
assert(!publicFatalErr.message.includes('postgres') && !publicFatalErr.message.includes('SELECT'), 'Zero SQL/internal details leaked to client');

// 7. HMAC Signed Guest Sessions & Authorization (Section 2)
console.log('\n--- 7. HMAC GUEST SESSIONS & AUTHORIZATION ---');
const signedGuestToken = createSignedGuestToken();
assert(signedGuestToken.includes('.'), 'Signed guest token contains signature separator');
assert(verifyGuestToken(signedGuestToken) === true, 'Valid signed guest token successfully verified');
assert(verifyGuestToken('tampered-token.invalid-signature') === false, 'Tampered guest token rejected');

// Ownership checks
assert(requireProfileAccess('user-1', null, 'user-1', null) === true, 'Owner access allowed for matching userId');
let idorBlocked = false;
try {
  requireProfileAccess('user-1', 'hash-1', 'user-attacker', 'token-attacker');
} catch (e: any) {
  if (e.code === 'FORBIDDEN') idorBlocked = true;
}
assert(idorBlocked, 'IDOR blocked: Non-owner access denied with 403 Forbidden');

// 8. Incident Response Kill Switches (Section 19)
console.log('\n--- 8. INCIDENT RESPONSE KILL SWITCHES ---');
assert(isAiEnabled() === true, 'AI active by default when ENABLE_AI is not false');
assert(isUrlImportEnabled() === true, 'URL import active by default');
assert(isShareEnabled() === true, 'Share card active by default');
assert(isAnalysisDisabled() === false, 'Analysis running normally');

// 9. Environment Secrets Validation (Section 8)
console.log('\n--- 9. ENVIRONMENT SECRETS VALIDATION ---');
const envCheck = validateEnvironment();
assert(typeof envCheck.valid === 'boolean', 'Environment validation executed cleanly');

console.log('\n========================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
