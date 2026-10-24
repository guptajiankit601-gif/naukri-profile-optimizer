import mammoth from 'mammoth';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface ExtractionResult {
  text: string;
  isScannedPdfAdvisory?: boolean;
  warnings?: string[];
  charCount: number;
}

export function validateFileSize(sizeInBytes: number): { valid: boolean; error?: string } {
  if (sizeInBytes > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(sizeInBytes / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller file.`
    };
  }
  return { valid: true };
}

export async function extractDocxFromBuffer(buffer: ArrayBuffer | Buffer): Promise<string> {
  const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
  return result.value || '';
}

export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  const sizeValidation = validateFileSize(file.size);
  if (!sizeValidation.valid) {
    throw new Error(sizeValidation.error);
  }

  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    const text = await file.text();
    return {
      text,
      charCount: text.length
    };
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractDocxFromBuffer(arrayBuffer);
    return {
      text,
      charCount: text.length
    };
  }

  if (extension === 'pdf') {
    try {
      // Dynamic import to avoid SSR errors
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      }
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      const trimmed = fullText.trim();
      if (trimmed.length < 50) {
        return {
          text: trimmed,
          isScannedPdfAdvisory: true,
          warnings: ['This document appears to be an image-only or scanned PDF. Recruiter ATS systems cannot read scanned resumes. We recommend pasting text directly.'],
          charCount: trimmed.length
        };
      }

      return {
        text: trimmed,
        charCount: trimmed.length
      };
    } catch (err: unknown) {
      const msg = (err as Error)?.message || '';
      if (msg.includes('Password') || (err as { name?: string })?.name === 'PasswordException') {
        throw new Error('This PDF is password-protected. Please remove the password and re-upload, or paste your resume text.');
      }
      throw new Error(`Unable to extract text from PDF: ${msg || 'Unknown error'}. Please paste your resume text directly.`);
    }
  }

  throw new Error(`Unsupported file type (.${extension}). Please upload a PDF, DOCX, or TXT file.`);
}
