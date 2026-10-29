'use client';

import React, { useState } from 'react';
import { UploadCloud, UserCheck, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { useReport } from '@/lib/context/ReportContext';
import { SEEDED_PROFILES } from '@/lib/data/seeded-profiles';
import { BRAND_CONFIG } from '@/config/brand';

interface EmptyReportStateProps {
  onGoToUpload?: () => void;
  destinationLabel?: string;
}

export const EmptyReportState: React.FC<EmptyReportStateProps> = ({ onGoToUpload, destinationLabel }) => {
  const { loadDemoProfile, setCurrentStep } = useReport();
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  const handleStartUpload = () => {
    setCurrentStep('upload');
    onGoToUpload?.();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs space-y-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 shadow-xs">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            No resume loaded yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Upload your resume or paste text to generate your {BRAND_CONFIG.name} report{destinationLabel ? ` and open ${destinationLabel}` : ''}. You can also explore an optional sample report below.
          </p>
        </div>

        {/* Primary Action: Go to Intake */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartUpload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resume or Paste Text</span>
          </button>
        </div>

        {/* Optional Sample Report Picker */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="text-xs text-slate-500 font-medium">
            Or test drive with a sample persona:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <button
              onClick={() => loadDemoProfile('arjun')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors text-left group cursor-pointer"
            >
              <div className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                Arjun Sharma
              </div>
              <div className="text-[11px] text-slate-500">
                Backend Engineer · 3 Yrs Exp
              </div>
            </button>

            <button
              onClick={() => loadDemoProfile('priya')}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors text-left group cursor-pointer"
            >
              <div className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                Priya Patel
              </div>
              <div className="text-[11px] text-slate-500">
                Fresher Full Stack · Entry Level
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
