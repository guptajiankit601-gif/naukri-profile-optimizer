'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  ChevronDown, 
  BarChart3, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  FileCode, 
  FileCheck,
  Layers,
  Crosshair
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { extractDocumentFromFile, FileExtractionDetails } from '@/services/parser';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { PrivacyNoticeModal } from '@/components/PrivacyNoticeModal';

type UploadState = 'idle' | 'validating' | 'extracting' | 'reviewing' | 'error';

interface ResumeIntakeScreenProps {
  onParsedTextReady: (text: string, sourceName?: string, jobDescription?: string, professionalProfileText?: string) => void;
  onSelectDemoProfile: (key: string) => void;
  preserveDestination?: string | null;
}

export const ResumeIntakeScreen: React.FC<ResumeIntakeScreenProps> = ({
  onParsedTextReady,
  onSelectDemoProfile,
  preserveDestination
}) => {
  const [entryJourney, setEntryJourney] = useState<'resume' | 'profile' | 'job_match'>('resume');
  const [optionalJd, setOptionalJd] = useState('');
  const [optionalProfileText, setOptionalProfileText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionDetails, setExtractionDetails] = useState<FileExtractionDetails | null>(null);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploadState = () => {
    setSelectedFile(null);
    setExtractionDetails(null);
    setErrorMsg('');
    setProgressMsg('');
    setUploadState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setErrorMsg('');
    setUploadState('validating');
    setProgressMsg(`Validating ${file.name}...`);

    const ext = file.name.split('.').pop()?.toLowerCase();
    const supportedExts = ['pdf', 'docx', 'txt'];

    if (!ext || !supportedExts.includes(ext)) {
      if (ext === 'doc') {
        setErrorMsg('Legacy binary .doc format is not supported. Please save your file as .docx or .pdf in Word or Google Docs, or paste your resume text directly.');
      } else {
        setErrorMsg(`Unsupported file type (.${ext}). Only PDF, DOCX, and TXT files under 5MB are supported.`);
      }
      setUploadState('error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`File size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds the 5MB limit. Please upload a smaller file or paste text.`);
      setUploadState('error');
      return;
    }

    try {
      setUploadState('extracting');
      setProgressMsg(`Extracting text from ${file.name}...`);

      const details = await extractDocumentFromFile(file);
      setExtractionDetails(details);

      if (details.isScannedPdf) {
        setErrorMsg('This document appears to be an image-only or scanned PDF without selectable text. Recruiter ATS systems cannot read scanned resumes. Please paste your resume text directly or upload a text-based document.');
        setUploadState('error');
        return;
      }

      if (details.text.length < 50) {
        setErrorMsg('The document contains insufficient readable text (fewer than 50 characters). Please paste your resume text directly.');
        setUploadState('error');
        return;
      }

      setUploadState('reviewing');
      setProgressMsg('Text successfully extracted!');
    } catch (err: unknown) {
      const msg = (err as Error)?.message || 'Failed to extract text from resume file.';
      setErrorMsg(msg);
      setUploadState('error');
    }
  };

  const handleConfirmExtraction = () => {
    if (!extractionDetails?.text) return;
    onParsedTextReady(
      extractionDetails.text, 
      selectedFile?.name || 'Uploaded Resume',
      optionalJd.trim() || undefined,
      optionalProfileText.trim() || undefined
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    const trimmed = pastedText.trim();
    if (trimmed.length < 50) {
      setErrorMsg('Please paste at least 50 characters of resume text to evaluate your profile accurately.');
      return;
    }
    setErrorMsg('');
    onParsedTextReady(
      trimmed, 
      'Pasted Resume',
      optionalJd.trim() || undefined,
      optionalProfileText.trim() || undefined
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-2 sm:pt-4 pb-12 px-4 space-y-6 animate-in fade-in duration-150">
      {/* 1. Hero Area */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 font-medium shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{BRAND_CONFIG.name} — {BRAND_CONFIG.tagline}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          Make your resume match the jobs you actually want.
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Understand your resume strengths, discover job-specific gaps, improve your Naukri profile, and prepare more relevant applications.
        </p>

        {preserveDestination && (
          <div className="inline-block text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full font-medium">
            Upload or select a sample to open <strong>{preserveDestination}</strong>.
          </div>
        )}
      </div>

      {/* 2. Focused Intake Panel */}
      <div className="bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* 3 Clear Intake Entry Paths */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pb-2">
          <button
            type="button"
            onClick={() => setEntryJourney('resume')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              entryJourney === 'resume'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-1 ring-blue-600/30'
                : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">1. Review My Resume</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">PDF, DOCX, or text for complete 10-factor profile audit.</p>
          </button>

          <button
            type="button"
            onClick={() => setEntryJourney('profile')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              entryJourney === 'profile'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-1 ring-blue-600/30'
                : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">2. Online Profile Audit</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Add Naukri / LinkedIn text for portal search optimization.</p>
          </button>

          <button
            type="button"
            onClick={() => setEntryJourney('job_match')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              entryJourney === 'job_match'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-1 ring-blue-600/30'
                : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Crosshair className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">3. Match Target Job</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Add a specific job description for opening-specific alignment.</p>
          </button>
        </div>

        {/* Optional Online Profile Textarea if in 'profile' journey */}
        {entryJourney === 'profile' && (
          <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 space-y-2 animate-in fade-in duration-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Online Profile Content (Optional — paste headline, summary, or key skills)</span>
              </span>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">Naukri / LinkedIn</span>
            </div>
            <textarea
              rows={3}
              value={optionalProfileText}
              onChange={(e) => setOptionalProfileText(e.target.value)}
              placeholder="Paste current online profile headline, about/summary, or skills cluster..."
              className="w-full bg-white dark:bg-[#0B1422] border border-purple-200 dark:border-purple-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>
        )}

        {/* Optional Target Job Description Textarea if in 'job_match' journey */}
        {entryJourney === 'job_match' && (
          <div className="p-3.5 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/40 space-y-2 animate-in fade-in duration-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Target Job Description (Optional — uncovers must-have keywords for this specific opening)</span>
              </span>
              <span className="text-[10px] text-teal-700 dark:text-teal-300 font-medium">Job Match Engine</span>
            </div>
            <textarea
              rows={3}
              value={optionalJd}
              onChange={(e) => setOptionalJd(e.target.value)}
              placeholder="Paste the target job description (Required Skills, Responsibilities, Qualifications)..."
              className="w-full bg-white dark:bg-[#0B1422] border border-teal-200 dark:border-teal-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500 font-mono"
            />
          </div>
        )}

        {/* Toggle Mode: Upload vs Paste */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6 pb-2 text-sm font-medium">
          <button
            onClick={() => {
              setActiveTab('upload');
              setErrorMsg('');
            }}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Upload Resume</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('paste');
              setErrorMsg('');
            }}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'border-blue-600 text-slate-900 dark:text-slate-100 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Paste Resume Text</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold">{errorMsg}</p>
              {uploadState === 'error' && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={resetUploadState}
                    className="text-[11px] font-bold text-rose-800 dark:text-rose-200 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Try another file</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('paste');
                      setErrorMsg('');
                    }}
                    className="text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
                  >
                    Paste resume text instead →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Processing State (Validating / Extracting) */}
        {(uploadState === 'validating' || uploadState === 'extracting') && (
          <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center space-y-3 animate-in fade-in">
            <div className="w-7 h-7 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{progressMsg}</p>
            {selectedFile && (
              <p className="text-[11px] text-slate-500 font-mono">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>
        )}

        {/* Reviewing State: File Parsed Successfully Preview */}
        {uploadState === 'reviewing' && extractionDetails && selectedFile && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{selectedFile.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="uppercase font-semibold text-blue-600 dark:text-blue-400">{extractionDetails.format}</span>
                    {extractionDetails.pageCount && extractionDetails.pageCount > 1 && (
                      <>
                        <span>•</span>
                        <span>{extractionDetails.pageCount} pages</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold font-mono">
                  {extractionDetails.wordCount} words extracted
                </span>
                <button
                  onClick={resetUploadState}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                >
                  Replace file
                </button>
              </div>
            </div>

            {/* Extracted Text Snippet Preview */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                <span>Extracted Content Preview:</span>
                <span>{extractionDetails.charCount} characters total</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                {extractionDetails.text.slice(0, 600)}
                {extractionDetails.text.length > 600 && '...'}
              </div>
            </div>

            {/* Confirmation Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">
                Next: Verify role targeting and extracted credentials.
              </span>
              <button
                onClick={handleConfirmExtraction}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue with this Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: File Upload Dropzone (When Idle or Error) */}
        {activeTab === 'upload' && (uploadState === 'idle' || uploadState === 'error') && (
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all cursor-pointer relative ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="resume-file-input"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-3 pointer-events-none">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0B1422] border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Click to select file or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supported formats: <strong>PDF, DOCX, TXT</strong> (Up to 5MB)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Paste Resume Text */}
        {activeTab === 'paste' && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the text of your resume here (Summary, Experience, Education, Skills)..."
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422] resize-y leading-relaxed font-mono"
              />
              <div className="text-[11px] text-slate-400 dark:text-slate-500 text-right mt-1">
                {pastedText.length} characters
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePasteSubmit}
                disabled={pastedText.trim().length < 50}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3. Sample Report Option */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Don&apos;t have your resume file right now?</span>

          <div className="relative">
            <button
              onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Try Sample Report</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-72 bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 px-2.5 py-1.5 tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Select a Sample Report:
                </div>
                {Object.entries(SEEDED_PROFILES).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectDemoProfile(key);
                      setIsDemoDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{p.targetRole} · {p.experienceBand}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Supporting Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Resume Insights</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Understand your strengths, structure, and areas to improve across 10 deterministic criteria.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Keyword & Skill Gaps</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Compare your documented skills with a target role or job description.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Actionable Improvements</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Improve your headline and resume bullets while preserving your real experience.
          </p>
        </div>
      </div>

      {/* 4. Privacy and Data Processing Notice */}
      <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span><strong>Private Processing:</strong> Core analysis runs locally in your session. No personal identifying information is stored or transmitted.</span>
        </div>
        <button
          onClick={() => setIsPrivacyModalOpen(true)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-xs cursor-pointer shrink-0 ml-3"
        >
          Privacy Details
        </button>
      </div>

      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
