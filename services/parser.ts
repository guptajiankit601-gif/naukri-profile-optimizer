import { ParsedProfile, ExperienceBand, ExperienceItem, EducationItem, ProjectItem } from '@/types';
import { matchSkillsInText } from '@/data/skills-dict';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// 1. Polyfill Uint8Array.prototype.toHex globally for browsers and runtimes where TC39 toHex is not yet native
if (typeof Uint8Array !== 'undefined' && typeof (Uint8Array.prototype as { toHex?: () => string }).toHex !== 'function') {
  (Uint8Array.prototype as unknown as { toHex: () => string }).toHex = function () {
    return Array.from(this, (byte: number) => byte.toString(16).padStart(2, '0')).join('');
  };
}

// 2. Set up same-origin pdfjs worker (served locally from /public/pdf.worker.min.mjs to prevent CORS / CDN blocking)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export interface FileExtractionDetails {
  text: string;
  charCount: number;
  wordCount: number;
  pageCount?: number;
  format: 'pdf' | 'docx' | 'txt';
  isScannedPdf: boolean;
  warnings: string[];
}

export interface ParseResult {
  profile: ParsedProfile;
  metricsFound: string[];
  issues: string[];
}

/**
 * Validates actual binary signature (magic bytes) to catch file masquerading
 */
function inspectFileSignature(buffer: ArrayBuffer): 'pdf' | 'docx' | 'txt' | 'unknown' {
  if (buffer.byteLength < 4) return 'txt';
  const bytes = new Uint8Array(buffer.slice(0, 4));

  // %PDF (0x25, 0x50, 0x44, 0x46)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'pdf';
  }

  // PK\x03\x04 zip archive used by .docx
  if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return 'docx';
  }

  // UTF-8 / ASCII text inspection
  const isAsciiOrUtf8 = Array.from(bytes).every(
    b => b === 9 || b === 10 || b === 13 || (b >= 32 && b <= 126) || b > 127
  );
  if (isAsciiOrUtf8) {
    return 'txt';
  }

  return 'unknown';
}

/**
 * Server-side fallback parsing when client-side environment blocks Web Workers or encounters CSP restrictions
 */
async function fallbackServerParse(file: File): Promise<FileExtractionDetails> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/parse/file', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.error || `Server extraction failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = (data.text || '').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    text,
    charCount: text.length,
    wordCount,
    pageCount: data.pageCount || 1,
    format: data.format || 'pdf',
    isScannedPdf: Boolean(data.isScannedPdf),
    warnings: data.isScannedPdf
      ? ['This document appears to be an image-only or scanned PDF without selectable text. Recruiter ATS systems cannot read scanned resumes. Please paste your resume text directly.']
      : []
  };
}

/**
 * Comprehensive document text extractor supporting PDF, DOCX, and TXT with multi-page handling,
 * line preservation, scanned-PDF detection, and automated server fallback.
 */
export async function extractDocumentFromFile(file: File): Promise<FileExtractionDetails> {
  // 1. File Size Guard (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`File size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds the 5MB limit. Please upload a smaller document.`);
  }

  const rawExt = file.name.split('.').pop()?.toLowerCase();
  const allowedExts = ['pdf', 'docx', 'txt'];
  if (!rawExt || !allowedExts.includes(rawExt)) {
    if (rawExt === 'doc') {
      throw new Error('Legacy binary .doc format is not supported. Please save your file as .docx or .pdf in Word or Google Docs, or paste your resume text directly.');
    }
    throw new Error(`Unsupported file type (.${rawExt || 'unknown'}). Only PDF, DOCX, and TXT documents under 5MB are supported.`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const detectedType = inspectFileSignature(arrayBuffer);

  // 2. Plain Text Handling
  if (rawExt === 'txt') {
    const text = new TextDecoder('utf-8').decode(arrayBuffer).trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return {
      text,
      charCount: text.length,
      wordCount,
      pageCount: 1,
      format: 'txt',
      isScannedPdf: false,
      warnings: []
    };
  }

  // 3. Word Document (.docx) Handling
  if (rawExt === 'docx') {
    try {
      const mammothOptions = typeof Buffer !== 'undefined'
        ? { buffer: Buffer.from(arrayBuffer) }
        : { arrayBuffer };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await mammoth.extractRawText(mammothOptions as any);
      const text = (result.value || '').trim();
      const wordCount = text.split(/\s+/).filter(Boolean).length;

      if (text.length < 10) {
        throw new Error('Word document contains insufficient readable text. Please paste your resume text directly.');
      }

      return {
        text,
        charCount: text.length,
        wordCount,
        pageCount: 1,
        format: 'docx',
        isScannedPdf: false,
        warnings: result.messages?.map(m => m.message) || []
      };
    } catch (docxErr: unknown) {
      if (typeof window !== 'undefined') {
        try {
          return await fallbackServerParse(file);
        } catch {
          // continue to throw clean message
        }
      }
      throw new Error((docxErr as Error)?.message || 'Failed to extract text from Word document. Please verify the document is not corrupted.');
    }
  }

  // 4. PDF Document Handling
  if (rawExt === 'pdf' || detectedType === 'pdf') {
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer)
      });

      const pdf = await loadingTask.promise;
      let fullText = '';
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageLines: string[] = [];
        let currentLine = '';
        let lastY: number | null = null;

        for (const item of textContent.items) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const textItem = item as any;
          const str = textItem.str || '';
          const transform = textItem.transform;
          const y = transform ? transform[5] : null;

          if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
            if (currentLine.trim()) {
              pageLines.push(currentLine.trim());
            }
            currentLine = str;
          } else {
            currentLine += (currentLine ? ' ' : '') + str;
          }
          lastY = y;
        }

        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }

        fullText += pageLines.join('\n') + '\n\n';
      }

      const trimmedText = fullText.trim();
      const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
      const isScannedPdf = trimmedText.length < 50;

      if (isScannedPdf) {
        return {
          text: trimmedText,
          charCount: trimmedText.length,
          wordCount,
          pageCount: totalPages,
          format: 'pdf',
          isScannedPdf: true,
          warnings: ['This document appears to be an image-only or scanned PDF without selectable text. Recruiter ATS systems cannot read scanned resumes. Please paste your resume text directly.']
        };
      }

      return {
        text: trimmedText,
        charCount: trimmedText.length,
        wordCount,
        pageCount: totalPages,
        format: 'pdf',
        isScannedPdf: false,
        warnings: []
      };
    } catch (clientErr: unknown) {
      const errObj = clientErr as { name?: string; message?: string };

      // Password Protected
      if (errObj?.name === 'PasswordException' || errObj?.message?.toLowerCase().includes('password')) {
        throw new Error('This PDF is password-protected. Please remove password protection and re-upload, or paste your resume text.');
      }

      // Invalid / Corrupt PDF
      if (errObj?.name === 'InvalidPDFException' || errObj?.message?.toLowerCase().includes('corrupted')) {
        throw new Error('The uploaded PDF appears corrupted or unreadable. Please check that the file opens correctly on your device and re-upload.');
      }

      // Try automated server fallback if in browser
      if (typeof window !== 'undefined') {
        try {
          return await fallbackServerParse(file);
        } catch {
          // continue to throw actionable error below
        }
      }

      throw new Error('Unable to extract selectable text from this PDF. If this document was generated by a scanner or contains flattened images, please paste your resume text directly.');
    }
  }

  throw new Error(`Unsupported file type (.${rawExt}). Only PDF, DOCX, and TXT documents under 5MB are supported.`);
}

/**
 * Backwards-compatible text extractor
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const result = await extractDocumentFromFile(file);
  if (result.isScannedPdf) {
    throw new Error('This document appears to be an image-only or scanned PDF without selectable text. Recruiter ATS systems cannot read scanned resumes. Please paste your resume text directly.');
  }
  return result.text;
}

// Sweep text for numeric proof, %, currency, scale metrics
export function extractMetricsFromText(text: string): string[] {
  const metricRegexes = [
    /\b\d+(\.\d+)?\s*%/g,                             // Percentages: 45%, 99.9%
    /(?:₹|Rs\.?|INR)\s*\d+(\.\d+)?\s*(?:Cr|L|Lakh|K)?/gi, // Indian Currency: ₹18L, ₹2.4 Cr
    /\$\s*\d+(\.\d+)?\s*(?:M|K|B)?/gi,                 // USD: $120k
    /\b\d+(\.\d+)?\s*x\b/gi,                           // Multipliers: 3.8x, 10x
    /\b\d+\+?\s*(?:req\/sec|tps|rps|dau|mau|users|clients|engineers|queries|tickets)\b/gi // Quantities
  ];

  const found: Set<string> = new Set();
  for (const regex of metricRegexes) {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => found.add(m.trim()));
    }
  }
  return Array.from(found);
}

// Smart section segmentation & entity extraction
export function parseRawResumeText(rawText: string, defaultRole: string = 'backend-engineer'): ParsedProfile {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract email, phone
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  const email = emailMatch ? emailMatch[0] : '';
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract name: usually first non-empty line
  const name = lines[0] && lines[0].length < 40 ? lines[0] : 'Candidate';

  // Section regexes
  const sectionHeaders: Record<string, RegExp> = {
    summary: /^(summary|about|objective|professional summary|profile summary|about me)$/i,
    experience: /^(experience|work experience|employment history|professional experience|internship|internships)$/i,
    education: /^(education|academic background|academics|qualifications)$/i,
    skills: /^(skills|technical skills|key skills|core competencies|technologies)$/i,
    projects: /^(projects|personal projects|key projects|academic projects)$/i,
    certifications: /^(certifications|licenses & certifications|courses|certifications & achievements)$/i
  };

  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  let currentSection = 'header';

  for (const line of lines) {
    let matchedSection = false;
    for (const [secKey, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line.replace(/[:\-_]/g, '').trim())) {
        currentSection = secKey;
        matchedSection = true;
        break;
      }
    }

    if (!matchedSection) {
      sections[currentSection].push(line);
    }
  }

  // Extract headline from header or summary
  let headline = '';
  if (sections.header.length > 1) {
    headline = sections.header.slice(1, 3).filter(l => !l.includes('@') && !l.match(/\d{5,}/)).join(' | ');
  }
  if (!headline) {
    headline = lines.find(l => l.length < 90 && (l.toLowerCase().includes('engineer') || l.toLowerCase().includes('developer') || l.toLowerCase().includes('manager'))) || 'Software Professional';
  }

  // Parse skills via dictionary
  const skillExtraction = matchSkillsInText(rawText);
  let skills = skillExtraction.matchedSkills;
  if (skills.length === 0 && sections.skills.length > 0) {
    skills = sections.skills.join(',').split(/[,|•·\n]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
  }

  // Parse Experience
  const experiences: ExperienceItem[] = [];
  const expLines = sections.experience;
  let currentExp: Partial<ExperienceItem> | null = null;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    const isDateLine = /\b(19\d\d|20\d\d|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(line);
    const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.startsWith('·');

    if (!isBullet && (line.includes(' - ') || line.includes(' | ') || isDateLine || currentExp === null)) {
      if (currentExp && currentExp.title) {
        experiences.push({
          id: `exp-${experiences.length + 1}`,
          title: currentExp.title || 'Engineer',
          company: currentExp.company || 'Technology Company',
          startDate: currentExp.startDate || '2022',
          endDate: currentExp.endDate || 'Present',
          bullets: currentExp.bullets || []
        });
      }
      currentExp = {
        title: line.split(/[-–|]/)[0]?.trim() || line,
        company: line.split(/[-–|]/)[1]?.trim() || 'Company',
        startDate: '2022',
        endDate: 'Present',
        bullets: []
      };
    } else if (currentExp) {
      const cleanBullet = line.replace(/^[-•*·]\s*/, '').trim();
      if (cleanBullet.length > 10) {
        currentExp.bullets = currentExp.bullets || [];
        currentExp.bullets.push(cleanBullet);
      }
    }
  }
  if (currentExp && currentExp.title) {
    experiences.push({
      id: `exp-${experiences.length + 1}`,
      title: currentExp.title,
      company: currentExp.company || 'Company',
      startDate: currentExp.startDate || '2022',
      endDate: currentExp.endDate || 'Present',
      bullets: currentExp.bullets || []
    });
  }

  // Parse Education
  const education: EducationItem[] = [];
  const eduLines = sections.education;
  for (const line of eduLines) {
    if (line.match(/(b\.?tech|b\.?e|m\.?tech|mca|bca|b\.?sc|mba|bachelor|master|diploma)/i)) {
      education.push({
        id: `edu-${education.length + 1}`,
        degree: line.split(/[-–|,]/)[0]?.trim() || line,
        institution: line.split(/[-–|,]/)[1]?.trim() || 'University',
        year: line.match(/20\d\d/)?.[0] || '2023',
        score: line.match(/\b\d+(\.\d+)?\s*(?:CGPA|%)\b/i)?.[0] || ''
      });
    }
  }

  // Parse Projects
  const projects: ProjectItem[] = [];
  const projLines = sections.projects;
  let currentProj: Partial<ProjectItem> | null = null;

  for (const line of projLines) {
    if (!line.startsWith('-') && !line.startsWith('•') && line.length < 60) {
      if (currentProj && currentProj.title) {
        projects.push({
          id: `proj-${projects.length + 1}`,
          title: currentProj.title,
          description: currentProj.description || '',
          technologies: currentProj.technologies || []
        });
      }
      currentProj = {
        title: line,
        description: '',
        technologies: []
      };
    } else if (currentProj) {
      const cleanLine = line.replace(/^[-•*·]\s*/, '').trim();
      currentProj.description = (currentProj.description ? currentProj.description + ' ' : '') + cleanLine;
      const techMatch = cleanLine.match(/technologies|tools|stack|using\s*[:\s](.*)/i);
      if (techMatch && techMatch[1]) {
        currentProj.technologies = techMatch[1].split(/[,|]/).map(t => t.trim());
      }
    }
  }
  if (currentProj && currentProj.title) {
    projects.push({
      id: `proj-${projects.length + 1}`,
      title: currentProj.title,
      description: currentProj.description || '',
      technologies: currentProj.technologies || []
    });
  }

  // Infer experience band
  let expBand: ExperienceBand = 'Fresher';
  const yearsMatch = rawText.match(/(\d+)\+?\s*years?(?:\s*of)?\s*experience/i);
  if (yearsMatch) {
    const yrs = parseInt(yearsMatch[1], 10);
    if (yrs >= 8) expBand = '8+';
    else if (yrs >= 5) expBand = '5-8';
    else if (yrs >= 3) expBand = '3-5';
    else if (yrs >= 1) expBand = '1-3';
  } else if (experiences.length >= 2) {
    expBand = '3-5';
  } else if (experiences.length === 1 && !experiences[0].title.toLowerCase().includes('intern')) {
    expBand = '1-3';
  }

  // Calculate Section Confidence scores (0 - 100)
  const sectionConfidence: Record<string, number> = {
    headline: headline && headline.length > 15 ? 90 : 55,
    summary: sections.summary.length > 0 ? 85 : 45,
    experience: experiences.length > 0 && experiences[0].bullets.length > 0 ? 85 : 50,
    skills: skills.length > 5 ? (skills.length > 35 ? 65 : 90) : 50,
    education: education.length > 0 ? 95 : 60,
    projects: projects.length > 0 ? 85 : 55
  };

  return {
    name,
    email,
    phone,
    location: 'Bengaluru, India',
    targetRole: defaultRole,
    targetRoleId: defaultRole,
    experienceBand: expBand,
    targetCities: ['Bangalore / Bengaluru', 'Hyderabad', 'Pune'],
    expectedSalaryLakhs: expBand === 'Fresher' ? 6 : expBand === '1-3' ? 10 : expBand === '3-5' ? 18 : 25,
    headline,
    summary: sections.summary.join(' ') || lines.slice(1, 4).join(' '),
    skills,
    experiences,
    education,
    projects,
    certifications: sections.certifications.filter(c => c.length > 4),
    achievements: [],
    rawText,
    sectionConfidence
  };
}
