'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

interface AnalysisProgressProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, label: 'Reading Resume Content & Section Hierarchy', detail: 'Parsing contact details, company tenures, and education credentials...' },
  { id: 2, label: 'Evaluating Structural Quality & Readability', detail: 'Checking ATS parseability, header standards, and bullet formatting...' },
  { id: 3, label: 'Auditing Skill Inventory & Target Alignment', detail: 'Detecting must-have technical skills, keywords, and domain coverage...' },
  { id: 4, label: 'Computing 10-Component Quality Score', detail: 'Reconciling transparent component weights to a 100-point total...' },
  { id: 5, label: 'Preparing Workspace & Actionable Recommendations', detail: 'Generating fact-preserving rewrite suggestions and priority checklist...' }
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
          }, 350);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-150">
      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 shadow-xs">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Analyzing your resume...
        </h2>
        <p className="text-xs text-slate-500">
          Running {BRAND_CONFIG.name}'s deterministic 10-criteria assessment
        </p>
      </div>

      {/* Stepper card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 text-left shadow-xs space-y-3">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${
                isCurrent
                  ? 'bg-blue-50/60 border border-blue-200'
                  : 'bg-transparent'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
              </div>

              <div className="min-w-0">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-blue-900'
                      : isDone
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </div>
                {isCurrent && (
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
