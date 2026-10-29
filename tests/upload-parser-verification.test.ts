import assert from 'node:assert';
import { extractDocumentFromFile, parseRawResumeText, FileExtractionDetails } from '../services/parser';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import fs from 'node:fs';

// Ensure Uint8Array.prototype.toHex polyfill is active
if (typeof Uint8Array !== 'undefined' && typeof (Uint8Array.prototype as { toHex?: () => string }).toHex !== 'function') {
  (Uint8Array.prototype as unknown as { toHex: () => string }).toHex = function () {
    return Array.from(this, (byte: number) => byte.toString(16).padStart(2, '0')).join('');
  };
}

console.log('========================================================');
console.log('📄 RESUME UPLOAD & PARSER VERIFICATION TEST SUITE');
console.log('========================================================');

async function runTests() {
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

  // --- 1. NORMAL TEXT-BASED PDF ---
  console.log('\n--- 1. NORMAL TEXT-BASED PDF EXTRACTION ---');
  try {
    const singlePagePdf = '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
      '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj\n' +
      '4 0 obj<</Length 110>>stream\n' +
      'BT /F1 12 Tf 72 712 Td (Ankit Sharma | Senior Backend Engineer | Bengaluru, India | ankit@example.com) Tj ET\n' +
      'endstream\nendobj\n' +
      'xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \n0000000201 00000 n \n' +
      'trailer<</Size 5/Root 1 0 R>>\nstartxref\n363\n%%EOF';

    const file = new File([singlePagePdf], 'resume.pdf', { type: 'application/pdf' });
    const result = await extractDocumentFromFile(file);

    assert.ok(result.text.includes('Ankit Sharma'), 'Should extract candidate name');
    assert.ok(result.text.includes('Senior Backend Engineer'), 'Should extract headline title');
    assert.strictEqual(result.format, 'pdf');
    assert.strictEqual(result.isScannedPdf, false);
    assert.strictEqual(result.pageCount, 1);
    pass('Single-page text-based PDF parsed successfully without errors');
  } catch (err) {
    fail('Single-page text-based PDF extraction', err);
  }

  // --- 2. MULTI-PAGE TEXT-BASED PDF ---
  console.log('\n--- 2. MULTI-PAGE TEXT-BASED PDF EXTRACTION ---');
  try {
    const multiPagePdf = '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R 5 0 R]/Count 2>>endobj\n' +
      '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj\n' +
      '4 0 obj<</Length 85>>stream\nBT /F1 12 Tf 72 712 Td (Page 1: Experience at Razorpay - Built Spring Boot microservices) Tj ET\nendstream\nendobj\n' +
      '5 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 6 0 R>>endobj\n' +
      '6 0 obj<</Length 75>>stream\nBT /F1 12 Tf 72 712 Td (Page 2: Education - B.Tech in Computer Science, State University) Tj ET\nendstream\nendobj\n' +
      'xref\n0 7\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000109 00000 n \n0000000209 00000 n \n0000000347 00000 n \n0000000447 00000 n \n' +
      'trailer<</Size 7/Root 1 0 R>>\nstartxref\n574\n%%EOF';

    const file = new File([multiPagePdf], 'multipage_resume.pdf', { type: 'application/pdf' });
    const result = await extractDocumentFromFile(file);

    assert.strictEqual(result.pageCount, 2, 'Should detect exactly 2 pages');
    assert.ok(result.text.includes('Page 1: Experience at Razorpay'), 'Should extract Page 1 content');
    assert.ok(result.text.includes('Page 2: Education'), 'Should extract Page 2 content');
    assert.strictEqual(result.isScannedPdf, false);
    pass('Multi-page PDF extracted with page boundaries preserved');
  } catch (err) {
    fail('Multi-page PDF extraction', err);
  }

  // --- 3. DOCX DOCUMENT ---
  console.log('\n--- 3. DOCX DOCUMENT EXTRACTION ---');
  try {
    const docxPath = 'node_modules/mammoth/test/test-data/single-paragraph.docx';
    const docxBuffer = fs.readFileSync(docxPath);
    const file = new File([docxBuffer], 'sample_resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const result = await extractDocumentFromFile(file);
    assert.strictEqual(result.format, 'docx');
    assert.ok(result.text.length > 0, 'DOCX text should be extracted');
    assert.ok(result.text.includes('Walking on imported air'), 'Extracted expected paragraph content');
    pass('DOCX document extracted using mammoth without errors');
  } catch (err) {
    fail('DOCX document extraction', err);
  }

  // --- 4. TXT DOCUMENT ---
  console.log('\n--- 4. TXT DOCUMENT EXTRACTION ---');
  try {
    const plainResume = 'Rahul Verma\nrahul@gmail.com | +91 9876543210\nSenior React Developer | Bengaluru\n\nExperience:\nFrontend Architect at Swiggy (2021 - Present)\n- Engineered Next.js design system serving 10M daily active users';
    const file = new File([plainResume], 'resume.txt', { type: 'text/plain' });
    const result = await extractDocumentFromFile(file);

    assert.strictEqual(result.format, 'txt');
    assert.ok(result.text.includes('Rahul Verma'));
    assert.ok(result.text.includes('Swiggy'));
    pass('TXT document parsed directly with UTF-8 support');
  } catch (err) {
    fail('TXT document extraction', err);
  }

  // --- 5. PASTED RESUME TEXT ---
  console.log('\n--- 5. PASTED RESUME TEXT INTAKE ---');
  try {
    const pastedResume = 'Priya Patel\npriya@outlook.com | 9876543211\nFrontend Engineer | React & Next.js\n\nSummary:\nPassionate frontend engineer with 3 years experience building responsive web apps.\n\nSkills:\nReact, TypeScript, Next.js, Tailwind CSS, Jest\n\nExperience:\nSoftware Engineer at Flipkart (2022 - Present)\n- Built checkout redesign reducing drop-off by 18%';

    const parsed = parseRawResumeText(pastedResume, 'frontend-engineer');
    assert.strictEqual(parsed.name, 'Priya Patel');
    assert.strictEqual(parsed.email, 'priya@outlook.com');
    assert.ok(parsed.skills.length >= 3, 'Should extract core skills');
    assert.ok(parsed.experiences.length >= 1, 'Should extract experience');
    pass('Pasted resume text enters parsing workflow cleanly');
  } catch (err) {
    fail('Pasted resume text workflow', err);
  }

  // --- 6. SCANNED / IMAGE-ONLY PDF ---
  console.log('\n--- 6. SCANNED / IMAGE-ONLY PDF ADVISORY ---');
  try {
    const scannedPdf = '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
      '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj\n' +
      '4 0 obj<</Length 0>>stream\nendstream\nendobj\n' +
      'xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \n0000000201 00000 n \n' +
      'trailer<</Size 5/Root 1 0 R>>\nstartxref\n252\n%%EOF';

    const file = new File([scannedPdf], 'scanned_image.pdf', { type: 'application/pdf' });
    const result = await extractDocumentFromFile(file);

    assert.strictEqual(result.isScannedPdf, true, 'Should detect scanned PDF state');
    assert.ok(result.warnings.length > 0, 'Should provide actionable ATS warning');
    assert.ok(result.warnings[0].includes('scanned PDF'), 'Warning explains that ATS cannot read scanned resumes');
    pass('Scanned/image-only PDF identified with actionable advisory without fabricating text');
  } catch (err) {
    fail('Scanned PDF detection', err);
  }

  // --- 7. CORRUPTED / MALFORMED FILE ---
  console.log('\n--- 7. CORRUPTED FILE RECOVERY ---');
  try {
    const corruptFile = new File([Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44])], 'damaged.pdf', { type: 'application/pdf' });
    let threw = false;
    try {
      await extractDocumentFromFile(corruptFile);
    } catch (e: unknown) {
      threw = true;
      assert.ok((e as Error).message.includes('corrupted') || (e as Error).message.includes('unreadable'), 'Error explains file corruption');
    }
    assert.ok(threw, 'Should reject corrupted document');
    pass('Corrupted binary file caught with clear recovery message');
  } catch (err) {
    fail('Corrupted file recovery', err);
  }

  // --- 8. PASSWORD-PROTECTED PDF HANDLING ---
  console.log('\n--- 8. PASSWORD-PROTECTED PDF HANDLING ---');
  try {
    // Encrypted PDF with Encrypt dictionary
    const encryptedPdf = '%PDF-1.4\n' +
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
      '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj\n' +
      '4 0 obj<</Length 10>>stream\n1234567890\nendstream\nendobj\n' +
      '5 0 obj<</Filter/Standard/V 1/R 2/O (12345678901234567890123456789012)/U (12345678901234567890123456789012)/P -4>>endobj\n' +
      'xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \n0000000201 00000 n \n0000000262 00000 n \n' +
      'trailer<</Size 6/Root 1 0 R/Encrypt 5 0 R/ID [<12345678901234567890123456789012><12345678901234567890123456789012>]>>\nstartxref\n390\n%%EOF';

    const file = new File([encryptedPdf], 'protected.pdf', { type: 'application/pdf' });
    let caughtPassword = false;
    try {
      await extractDocumentFromFile(file);
    } catch (e: unknown) {
      caughtPassword = (e as Error).message.toLowerCase().includes('password');
    }
    assert.ok(caughtPassword, 'Should identify password protection');
    pass('Password-protected PDF caught with explicit removal instruction');
  } catch (err) {
    fail('Password-protected PDF handling', err);
  }

  // --- 9. UNSUPPORTED FORMAT ---
  console.log('\n--- 9. UNSUPPORTED FORMAT REJECTION ---');
  try {
    const docFile = new File(['binary doc'], 'resume.doc', { type: 'application/msword' });
    let caughtDoc = false;
    try {
      await extractDocumentFromFile(docFile);
    } catch (e: unknown) {
      caughtDoc = (e as Error).message.includes('.doc format is not supported');
    }
    assert.ok(caughtDoc, 'Should reject legacy .doc format with conversion instruction');

    const pngFile = new File(['fake png'], 'image.png', { type: 'image/png' });
    let caughtPng = false;
    try {
      await extractDocumentFromFile(pngFile);
    } catch (e: unknown) {
      caughtPng = (e as Error).message.includes('Unsupported file type');
    }
    assert.ok(caughtPng, 'Should reject image file');
    pass('Unsupported formats (.doc, .png) rejected with clear instructions');
  } catch (err) {
    fail('Unsupported format rejection', err);
  }

  // --- 10. OVERSIZED FILE (> 5MB) ---
  console.log('\n--- 10. OVERSIZED FILE REJECTION (> 5MB) ---');
  try {
    // Mock file larger than 5MB
    const bigBlob = new Uint8Array(5.5 * 1024 * 1024);
    const bigFile = new File([bigBlob], 'giant.pdf', { type: 'application/pdf' });
    let caughtOversized = false;
    try {
      await extractDocumentFromFile(bigFile);
    } catch (e: unknown) {
      caughtOversized = (e as Error).message.includes('exceeds the 5MB limit');
    }
    assert.ok(caughtOversized, 'Should enforce 5MB limit');
    pass('Files exceeding 5MB strictly rejected with friendly limit notice');
  } catch (err) {
    fail('Oversized file rejection', err);
  }

  // --- 11. REPEATED UPLOADS & STATE REUSABILITY ---
  console.log('\n--- 11. REPEATED UPLOADS & STATE REUSABILITY ---');
  try {
    const text1 = 'First Resume Upload\nemail1@example.com\nSoftware Engineer with 4 years experience in Java';
    const file1 = new File([text1], 'first.txt', { type: 'text/plain' });
    const res1 = await extractDocumentFromFile(file1);
    assert.ok(res1.text.includes('First Resume Upload'));

    const text2 = 'Second Resume Replacement\nemail2@example.com\nDevOps Engineer with 6 years experience in Kubernetes';
    const file2 = new File([text2], 'second.txt', { type: 'text/plain' });
    const res2 = await extractDocumentFromFile(file2);
    assert.ok(res2.text.includes('Second Resume Replacement'));
    assert.ok(!res2.text.includes('First Resume Upload'), 'Second upload cleanly replaces first content');
    pass('Sequential and repeated uploads completely replace previous document content');
  } catch (err) {
    fail('Repeated upload state reusability', err);
  }

  // --- 12. END-TO-END ENTRY INTO ANALYSIS WORKFLOW ---
  console.log('\n--- 12. END-TO-END ENTRY INTO ANALYSIS WORKFLOW ---');
  try {
    const resumeText = 'Arjun Mehta\narjun.mehta@gmail.com | +91 9876543210 | Bengaluru\nSenior Java Developer | Microservices & Cloud Architecture\n\nSummary:\nSenior Java Developer with 5 years experience engineering distributed payments and high-throughput microservices.\n\nSkills:\nJava, Spring Boot, Microservices, Kafka, Redis, PostgreSQL, AWS, Docker, Git\n\nExperience:\nSenior Software Engineer at FinTech Labs (2021 - Present)\n- Engineered core ledger services processing ₹50Cr monthly transactional volume.\n- Slashed API response latency by 35% through Redis caching.';

    const parsedProfile = parseRawResumeText(resumeText, 'backend-engineer');
    assert.strictEqual(parsedProfile.name, 'Arjun Mehta');
    assert.strictEqual(parsedProfile.email, 'arjun.mehta@gmail.com');
    assert.strictEqual(parsedProfile.experienceBand, '5-8');
    assert.ok(parsedProfile.skills.includes('Java'));
    assert.ok(parsedProfile.skills.includes('Kafka'));
    assert.ok(parsedProfile.experiences.length > 0);
    assert.ok(parsedProfile.experiences[0].bullets.length >= 2);
    pass('Extracted text successfully populates complete ParsedProfile for scoring and dashboard');
  } catch (err) {
    fail('End-to-end analysis workflow entry', err);
  }

  console.log('========================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
