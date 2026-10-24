'use client';

import React, { useState } from 'react';
import { Eye, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RecruiterVsCandidate: React.FC = () => {
  const [viewMode, setViewMode] = useState<'recruiter' | 'candidate'>('recruiter');

  return (
    <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
          The 6-Second Glance Reality Check
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Recruiters review hundreds of candidate profiles daily. Toggle below to compare what candidates see versus how recruiters scan during initial triage.
        </p>

        {/* View Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[rgba(26,49,69,0.6)] border border-white/10 mt-4 backdrop-blur-md">
          <button
            onClick={() => setViewMode('candidate')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
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
              'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'recruiter'
                ? 'bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            Recruiter Perspective (Scan Sequence)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Unoptimized View */}
        <div className="p-6 rounded-2xl bg-[rgba(26,49,69,0.35)] border border-red-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Unoptimized Profile (Score: 48 / 100)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-500/30">
              High Screening Friction
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Headline</span>
              <p className="font-semibold text-slate-200 mt-0.5">Software Engineer at TCS</p>
              {viewMode === 'recruiter' && (
                <p className="text-[11px] text-red-400 mt-1">✗ Missing target role, primary stack, and specialization.</p>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Experience Bullet</span>
              <p className="font-semibold text-slate-200 mt-0.5">Responsible for developing REST APIs in Java.</p>
              {viewMode === 'recruiter' && (
                <p className="text-[11px] text-red-400 mt-1">✗ Passive phrasing. Zero metrics or architectural context.</p>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Skills Section</span>
              <p className="font-semibold text-slate-200 mt-0.5">43 skills listed including MS Word, Typing, Eclipse, Java...</p>
              {viewMode === 'recruiter' && (
                <p className="text-[11px] text-red-400 mt-1">✗ Cluttered list dilutes primary search keywords.</p>
              )}
            </div>
          </div>
        </div>

        {/* Optimized View */}
        <div className="p-6 rounded-2xl bg-[rgba(26,49,69,0.35)] border border-emerald-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Optimized Profile (Score: 88 / 100)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
              Clear Consideration
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Headline</span>
              <p className="font-semibold text-white mt-0.5">Backend Engineer | Java & Spring Boot Microservices | 3+ Yrs Exp</p>
              {viewMode === 'recruiter' && (
                <p className="text-[11px] text-emerald-400 mt-1">✓ Primary keywords indexed immediately in recruiter search.</p>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Experience Bullet</span>
              <p className="font-semibold text-white mt-0.5">Architected Spring Boot APIs and Kafka queues, reducing query latency by 35%.</p>
              {viewMode === 'recruiter' && (
                <p className="text-[11px] text-emerald-400 mt-1">✓ Strong active verb with verified quantitative outcome.</p>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Skills Section</span>
              <p className="font-semibold text-white mt-0.5">16 curated skills (Java, Spring Boot, Kafka, Docker, PostgreSQL, AWS...)</p>
              {viewMode === 'recruiter' && (
                <p className="text-[11px] text-emerald-400 mt-1">✓ Focused tier-1 competencies that match role requirements.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
