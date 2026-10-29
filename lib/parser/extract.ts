import { extractDocumentFromFile, FileExtractionDetails } from '@/services/parser';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface ExtractionResult {
  text: string;
  isScannedPdfAdvisory?: boolean;
  warnings?: string[];
  charCount: number;
  wordCount?: number;
  pageCount?: number;
  format?: 'pdf' | 'docx' | 'txt';
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

export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  const details: FileExtractionDetails = await extractDocumentFromFile(file);
  return {
    text: details.text,
    charCount: details.charCount,
    wordCount: details.wordCount,
    pageCount: details.pageCount,
    format: details.format,
    isScannedPdfAdvisory: details.isScannedPdf,
    warnings: details.warnings
  };
}
