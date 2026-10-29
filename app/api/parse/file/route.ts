import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Polyfill Uint8Array.prototype.toHex if not natively available in runtime
if (typeof Uint8Array !== 'undefined' && typeof (Uint8Array.prototype as { toHex?: () => string }).toHex !== 'function') {
  (Uint8Array.prototype as unknown as { toHex: () => string }).toHex = function () {
    return Array.from(this, (byte: number) => byte.toString(16).padStart(2, '0')).join('');
  };
}

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 400 });
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();

    if (extension === 'txt') {
      const text = Buffer.from(arrayBuffer).toString('utf-8');
      return NextResponse.json({
        success: true,
        text,
        charCount: text.length,
        format: 'txt',
        isScannedPdf: false
      });
    }

    if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
      const text = result.value || '';
      return NextResponse.json({
        success: true,
        text,
        charCount: text.length,
        format: 'docx',
        isScannedPdf: false
      });
    }

    if (extension === 'pdf') {
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer)
        });
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
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

        const trimmed = fullText.trim();
        const isScanned = trimmed.length < 50;

        return NextResponse.json({
          success: true,
          text: trimmed,
          charCount: trimmed.length,
          pageCount: pdf.numPages,
          format: 'pdf',
          isScannedPdf: isScanned
        });
      } catch (pdfErr: unknown) {
        const errObj = pdfErr as { name?: string; message?: string };
        if (errObj?.name === 'PasswordException' || errObj?.message?.includes('Password')) {
          return NextResponse.json({ error: 'This PDF is password-protected. Please remove the password and re-upload.' }, { status: 422 });
        }
        return NextResponse.json({ error: errObj?.message || 'Failed to parse PDF document.' }, { status: 422 });
      }
    }

    return NextResponse.json({ error: `Unsupported file extension (.${extension})` }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error)?.message || 'Internal parsing error' }, { status: 500 });
  }
}
