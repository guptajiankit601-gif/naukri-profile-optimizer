'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { extractTextFromFile, MAX_FILE_SIZE_BYTES } from '@/lib/parser/extract';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onTextExtracted: (text: string, filename: string) => void;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onTextExtracted, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setWarningMsg(null);
    setFileName(file.name);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 5MB limit.`);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await extractTextFromFile(file);
      if (result.isScannedPdfAdvisory && result.warnings?.[0]) {
        setWarningMsg(result.warnings[0]);
      }
      onTextExtracted(result.text, file.name);
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || 'Failed to extract text from file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          'bg-[rgba(26,49,69,0.35)] backdrop-blur-md',
          isDragging
            ? 'border-[#FF7582] bg-[rgba(255,117,130,0.08)] scale-[1.01]'
            : 'border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,117,130,0.5)] hover:bg-[rgba(26,49,69,0.5)]',
          isProcessing && 'pointer-events-none opacity-80'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[rgba(255,117,130,0.1)] border border-[rgba(255,117,130,0.2)] flex items-center justify-center text-[#FF7582]">
            {isProcessing ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : fileName && !errorMsg ? (
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-semibold text-slate-100">
              {isProcessing
                ? 'Extracting text and structure...'
                : fileName && !errorMsg
                ? `Uploaded: ${fileName}`
                : 'Drop your resume here, or browse'}
            </h4>
            <p className="text-xs text-slate-400">
              Supports PDF, DOCX, TXT · Maximum file size 5MB
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <FileText className="w-3.5 h-3.5 text-[#FF7582]" />
            <span>100% Client-Side or Server-Side in-memory · Zero disk storage</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Extraction Error</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {warningMsg && (
        <div className="mt-3 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">Scanned Document Advisory</p>
            <p>{warningMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};
