'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, Link2, ShieldCheck, ArrowRight, UserCheck, AlertCircle, Info, Lock } from 'lucide-react';
import { extractTextFromFile } from '@/services/parser';
import { SEEDED_PROFILES } from '@/data/seeded-profiles';
import { PrivacyNoticeModal } from '@/components/PrivacyNoticeModal';

interface UploadStepProps {
  onParsedTextReady: (text: string, sourceName?: string) => void;
  onSelectSeededProfile: (key: string) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  onParsedTextReady,
  onSelectSeededProfile
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'url'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg('');

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'doc') {
      setErrorMsg('Legacy .doc binary format is not supported. Please save as .docx or .pdf, or paste your resume text directly.');
      setIsProcessing(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`File exceeds the 5MB size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller file or paste text.`);
      setIsProcessing(false);
      return;
    }

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 40) {
        throw new Error('Document contained insufficient readable text. If this is a scanned PDF, please paste your resume text directly.');
      }
      onParsedTextReady(text, file.name);
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || 'Failed to extract text from resume file.');
    } finally {
      setIsProcessing(false);
    }
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
      setErrorMsg('Please paste at least 50 characters of resume text to perform an accurate profile audit.');
      return;
    }
    setErrorMsg('');
    onParsedTextReady(trimmed, 'Pasted Resume');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#725A7A]/30 border border-[#C56C86]/30 text-xs text-[#FF7582] font-semibold">
          <span>Step 1 of 4: Resume Intake</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Find Out Why Recruiters <span className="bg-gradient-to-r from-[#FF7582] via-[#C56C86] to-[#725A7A] bg-clip-text text-transparent">Skip Your Resume</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Simulate how recruiters scan your resume in 6 seconds. Identify missing keywords, fix passive bullets with fact-preserving rewrites, and follow a practical 7-day checklist.
        </p>
      </div>

      {/* Seeded Demo Test Drive Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#13273A] via-[#18314A] to-[#13273A] border border-[#234566] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-[#FF7582]" />
              <span className="text-sm font-bold text-white">Explore Sample Reports (Illustrative Demos)</span>
            </div>
            <p className="text-xs text-slate-400">See how real candidate profiles are evaluated before uploading your own resume:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
            <button
              onClick={() => onSelectSeededProfile('arjun')}
              className="text-left px-3.5 py-2 rounded-xl bg-[#0F2233] hover:bg-[#725A7A]/50 border border-[#234566] hover:border-[#FF7582]/50 transition-all text-xs cursor-pointer group"
            >
              <div className="font-bold text-white group-hover:text-[#FF7582] transition-colors">Arjun (3 Yrs · Java Backend)</div>
              <div className="text-[10px] text-slate-400">Experienced Profile Demo</div>
            </button>
            <button
              onClick={() => onSelectSeededProfile('priya')}
              className="text-left px-3.5 py-2 rounded-xl bg-[#0F2233] hover:bg-[#725A7A]/50 border border-[#234566] hover:border-[#FF7582]/50 transition-all text-xs cursor-pointer group"
            >
              <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">Priya (Fresher · CSE)</div>
              <div className="text-[10px] text-slate-400">Fresher Reweighted Model Demo</div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Intake Box */}
      <div className="bg-[#14273A] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Intake Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => { setActiveTab('upload'); setErrorMsg(''); }}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#FF7582] text-[#FF7582]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload PDF / DOCX
          </button>
          <button
            onClick={() => { setActiveTab('paste'); setErrorMsg(''); }}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'paste'
                ? 'border-[#FF7582] text-[#FF7582]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Resume Text
          </button>
          <button
            onClick={() => { setActiveTab('url'); setErrorMsg(''); }}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'url'
                ? 'border-[#FF7582] text-[#FF7582]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Profile URL Guidance
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: File Upload */}
        {activeTab === 'upload' && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-[#FF7582] bg-[#FF7582]/10 scale-[1.01]'
                  : 'border-white/10 hover:border-[#C56C86] bg-slate-950/40'
              }`}
              onClick={() => document.getElementById('resume-file-input')?.click()}
            >
              <input
                type="file"
                id="resume-file-input"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-[#14273A] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#FF7582]">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {isProcessing ? 'Extracting Resume Text...' : 'Drop your resume file here, or click to browse'}
              </h3>
              <p className="text-xs text-slate-400 mb-4">Supports PDF, DOCX, or TXT up to 5MB (processed locally)</p>
              <button
                type="button"
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 font-bold text-xs shadow-lg shadow-[#FF7582]/20 hover:opacity-95 transition-all cursor-pointer"
              >
                {isProcessing ? 'Processing File...' : 'Select File from Device'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Raw Text */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <label className="font-semibold">
                Paste your full resume text (Summary, Work History, Education, Skills):
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {pastedText.length} characters {pastedText.length >= 50 ? '✓' : '(minimum 50 required)'}
              </span>
            </div>
            <textarea
              rows={10}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="w-full rounded-xl bg-slate-950/60 border border-white/10 p-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF7582]"
            />
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Tip: Copy text directly from your resume document or LinkedIn profile.
              </span>
              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={pastedText.trim().length < 50}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 font-bold text-xs shadow-lg hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <span>Proceed to Data Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: URL Intake Guidance (Honest, No Scraping) */}
        {activeTab === 'url' && (
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 space-y-4 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Lock className="w-4 h-4 text-[#FF7582]" />
              <span>Public Profile Authentication Protection</span>
            </div>
            <p className="leading-relaxed">
              LinkedIn and Naukri protect member profiles behind login authentication and terms of service. We <strong>never request your passwords or attempt unauthorized account scraping</strong>.
            </p>
            <div className="p-4 rounded-xl bg-[#14273A] border border-white/10 space-y-3">
              <h4 className="font-bold text-white text-xs">How to import in under 30 seconds:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#FF7582]">1.</span>
                  <span><strong>From LinkedIn:</strong> Go to your profile &rarr; click <strong>"More"</strong> next to your headline &rarr; select <strong>"Save to PDF"</strong> &rarr; upload the PDF file in the Upload tab.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#FF7582]">2.</span>
                  <span><strong>From Naukri:</strong> Copy your profile summary, experience bullets, and key skills &rarr; paste directly into the <strong>"Paste Resume Text"</strong> tab.</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-xl bg-[#18314A] hover:bg-[#725A7A] text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Switch to PDF Upload
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className="px-4 py-2 rounded-xl bg-[#18314A] hover:bg-[#725A7A] text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Switch to Paste Text
              </button>
            </div>
          </div>
        )}

        {/* Privacy Transparency Footer */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Local in-browser parsing. Zero automated recruiter sharing. No passwords required.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-[#FF7582] hover:underline font-semibold cursor-pointer"
          >
            Privacy Notice & Data Handling
          </button>
        </div>

        <PrivacyNoticeModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      </div>
    </div>
  );
};
