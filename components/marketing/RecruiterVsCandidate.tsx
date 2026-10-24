'use client';

import React, { useState } from 'react';
import { Eye, User, Briefcase, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RecruiterVsCandidate: React.FC = () => {
  const [viewMode, setViewMode] = useState<'recruiter' | 'candidate'>('recruiter');

  return (
    <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
          The 6-Second Reality Check
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Recruiters on Naukri process 200+ profiles before lunch. Toggle below to see why qualified candidates get auto-skipped.
        </p>

        {/* View Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[rgba(26,49,69,0.6)] border border-white/10 mt-4 backdrop-blur-md">
          <button
            onClick={() => setViewMode('candidate')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              viewMode === 'candidate'
                ? 'bg-white/10 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <User className="w-3.5 h-3.5" />
            Candidate Perspective
          </button>
          <button
            onClick={() => setViewMode('recruiter')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              viewMode === 'recruiter'
                ? 'bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Recruiter Perspective (What Actually Happens)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Before / Raw View */}
        <div className="p-6 rounded-2xl bg-[rgba(26,49,69,0.35)] border border-red-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Standard Profile (Score: 48 / 100)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-500/30">
              Verdict: 92% Skip Rate
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-sans">Headline</p>
              <p className="text-slate-200">Software Engineer at TCS</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-sans">Experience Bullet</p>
              <p className="text-slate-200">
                - Responsible for developing backend APIs using Java and Spring Boot.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-2 pt-2">
            <p className="font-semibold text-red-300">Why Recruiters Pass in 4s:</p>
            <ul className="space-y-1 list-disc pl-4 text-slate-400 text-[11px]">
              <li>Zero quantification: No throughput, latency, users, or volume mentioned.</li>
              <li>"Responsible for" sounds like passive assigned duty, not achievement.</li>
              <li>Missing high-salary keywords: Kafka, Redis, Docker, Microservices.</li>
            </ul>
          </div>
        </div>

        {/* After / Optimized View */}
        <div className="p-6 rounded-2xl bg-[rgba(26,49,69,0.35)] border border-emerald-500/30 backdrop-blur-md space-y-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Optimized with NPO (Score: 88 / 100)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
              Verdict: Top 10% Shortlist
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-sans">Headline</p>
              <p className="text-emerald-300 font-semibold">
                Senior Backend Engineer (3+ Yrs) | Java, Spring Boot, Kafka | Scaled 20k TPS APIs
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-sans">Experience Bullet</p>
              <p className="text-slate-100">
                - Architected event-driven Kafka microservices handling 20,000 TPS, slashing p99 latency by 35%.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-2 pt-2">
            <p className="font-semibold text-emerald-300">Recruiter Reaction:</p>
            <ul className="space-y-1 list-disc pl-4 text-slate-300 text-[11px]">
              <li>Instant 6-second hook: Senior title, exact stack, and 20k TPS verified proof.</li>
              <li>Appears in 85% more search queries for high-bracket ₹18L-₹28L LPA roles.</li>
              <li>Pre-clears recruiter phone screen criteria before the first call.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
