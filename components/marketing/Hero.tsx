'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted?: () => void;
  onSelectPersona?: (personaKey: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onSelectPersona }) => {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#FF7582]/15 via-[#C56C86]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(255,117,130,0.1)] border border-[rgba(255,117,130,0.25)] text-[#FF7582] text-xs font-semibold tracking-wide backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free · No Signup Required · Indian Job Board Heuristics</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-100 tracking-tight leading-[1.1]">
            Optimize Your Resume for{' '}
            <span className="bg-gradient-to-r from-[#FF7582] via-[#C56C86] to-[#725A7A] bg-clip-text text-transparent">
              Indian Tech Recruiters
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Simulate how recruiters scan your resume in 6 seconds. Identify missing keywords, fix passive bullets with fact-preserving rewrites, and follow a practical 7-day checklist.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-lg mx-auto">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 hover:brightness-110 shadow-lg shadow-[#FF7582]/20 cursor-pointer"
          >
            Analyze My Resume
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            onClick={() => onSelectPersona?.('arjun')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto px-6 py-6 text-sm font-semibold border-white/20 text-white hover:bg-white/10 cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-2 text-[#FF7582]" />
            Try Sample Report
          </Button>
        </div>

        {/* Trust Chips */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Local Browser Processing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#FF7582]" />
            <span>Fact-Preserving Rewrites</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>10 Transparent Criteria (100 Pts)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
