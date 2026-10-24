import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, label: 'Extracting Resume Text & Entity Hierarchy', detail: 'Parsing contact details, company tenures, and education credentials...' },
  { id: 2, label: 'Segmenting Sections & Measuring Confidence', detail: 'Validating ATS single-column parseability and section headers...' },
  { id: 3, label: 'Matching Curated 800-Skill Dictionary & Aliases', detail: 'Detecting must-haves, boosters, and noise keywords...' },
  { id: 4, label: 'Computing 10-Component Weighted Recruiter Score', detail: 'Evaluating headline clarity, bullet metrics, and platform consistency...' },
  { id: 5, label: 'Synthesizing 7-Day Action Plan & Recruiter Timeline', detail: 'Simulating 6-second recruiter human scan and benchmark percentiles...' }
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF7582] via-[#C56C86] to-[#725A7A] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#FF7582]/25 animate-pulse">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-2xl font-black text-white tracking-tight mb-2">
        Simulating Recruiter Scan Engine...
      </h2>
      <p className="text-xs text-slate-400 mb-8">
        Analyzing your profile against 10 Indian market recruiter search vectors
      </p>

      {/* Stepper card */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-6 text-left shadow-2xl space-y-4">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-[#18314A] border border-[#FF7582]/40 shadow-sm'
                  : isDone
                  ? 'bg-[#0F2233]/40'
                  : 'opacity-40'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-[#FF7582] animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                    {step.id}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className={`text-xs font-bold ${isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                  {step.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{step.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
