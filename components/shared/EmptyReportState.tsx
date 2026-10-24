'use client';

import React from 'react';
import { UploadCloud, FileText, UserCheck, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useReport } from '@/lib/context/ReportContext';

interface EmptyReportStateProps {
  onGoToUpload?: () => void;
}

export const EmptyReportState: React.FC<EmptyReportStateProps> = ({ onGoToUpload }) => {
  const { loadDemoProfile, setCurrentStep } = useReport();

  const handleStartUpload = () => {
    setCurrentStep('upload');
    onGoToUpload?.();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-200">
      {/* Hero Empty State Banner */}
      <div className="bg-[#14273A] rounded-3xl border border-white/10 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF7582]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#725A7A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FF7582] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profile Audit Standby</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          No Resume Loaded Yet
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Upload your resume (PDF, DOCX, TXT) or paste text to generate your deterministic recruiter audit, keyword gap analysis, and fact-preserving rewrites. Or test drive an illustrative sample report below.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
          <button
            onClick={handleStartUpload}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 font-bold text-sm shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resume / Paste Text</span>
          </button>
        </div>

        {/* Illustrative Demo Profiles */}
        <div className="pt-8 border-t border-white/5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <UserCheck className="w-4 h-4 text-[#FF7582]" />
            <span>Or Explore An Illustrative Sample Report (Demo Profiles)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
            <button
              onClick={() => loadDemoProfile('arjun')}
              className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-[#FF7582]/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#FF7582] transition-colors">
                  Arjun Sharma
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5 font-semibold">
                  3 Yrs · Experienced
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Backend Java Developer @ TCS. 43 cluttered skills, passive bullets, high score headroom (+42 pts).
              </p>
            </button>

            <button
              onClick={() => loadDemoProfile('priya')}
              className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-[#FF7582]/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#FF7582] transition-colors">
                  Priya Patel
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                  Fresher CSE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Fresher Full Stack Developer. Evaluated using the Fresher reweighted model with focus on projects & proof.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Process Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { step: '01', title: 'Resume Intake', desc: 'Secure local parsing of PDF, DOCX, or pasted text.' },
          { step: '02', title: 'Data Review', desc: 'Inspect and correct parsed entities and skills.' },
          { step: '03', title: 'Profile Audit', desc: '10 transparent criteria totaling exactly 100 points.' },
          { step: '04', title: 'Optimized Plan', desc: 'Fact-preserving rewrites and 7-day checklist.' }
        ].map((item) => (
          <div key={item.step} className="p-4 rounded-2xl bg-[#14273A]/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-[#FF7582] font-mono">STEP {item.step}</span>
            <h4 className="text-xs font-bold text-white">{item.title}</h4>
            <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
