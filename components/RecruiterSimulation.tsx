'use client';

import React, { useState } from 'react';
import { ParsedProfile, RecruiterPersona } from '@/types';
import { simulateRecruiterScan } from '@/services/recruiter-sim';
import { Clock, Eye, AlertCircle, CheckCircle, Flame, Building2, Briefcase, UserCheck, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecruiterSimulationProps {
  profile: ParsedProfile;
  onNavigateToTab: (tabId: string) => void;
}

export const RecruiterSimulation: React.FC<RecruiterSimulationProps> = ({ profile, onNavigateToTab }) => {
  const [selectedPersona, setSelectedPersona] = useState<RecruiterPersona>('Startup Founder');

  const sim = simulateRecruiterScan(profile, selectedPersona);

  const personas: { id: RecruiterPersona; label: string; icon: React.ReactNode; tag: string }[] = [
    { id: 'Startup Founder', label: 'Startup Founder', icon: <Flame className="w-4 h-4 text-[#FF7582]" />, tag: 'Speed & Deliverables' },
    { id: 'Enterprise TA', label: 'Enterprise TA', icon: <Building2 className="w-4 h-4 text-sky-400" />, tag: 'Certifications & Cloud' },
    { id: 'Consultancy Recruiter', label: 'Consultancy Recruiter', icon: <Briefcase className="w-4 h-4 text-purple-400" />, tag: 'Skill Alignment' },
    { id: 'HR Screen', label: 'HR Screen', icon: <UserCheck className="w-4 h-4 text-emerald-400" />, tag: 'Hygiene & Eligibility' }
  ];

  const allBullets = profile.experiences.flatMap(e => e.bullets).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Header & Recruiter Lens Selectors */}
      <div className="bg-[#14273A] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#FF7582]" />
              <h3 className="text-lg font-bold text-white">Illustrative 6-Second Recruiter Glance Simulation</h3>
            </div>
            <p className="text-xs text-slate-300">
              Heuristic simulation modeling how human recruiters rapidly triage resumes across 4 distinct hiring contexts:
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 border border-white/10 shrink-0">
            <Clock className="w-4 h-4 text-[#FF7582]" />
            <span className="text-xs font-semibold text-slate-200">Scan Window: 6 Seconds</span>
          </div>
        </div>

        {/* Methodology & Limitations Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-[#FF7582] shrink-0 mt-0.5" />
          <span>
            <strong>Simulation Note:</strong> This is a rule-based simulation of recruiter scanning behavior, not physical eye-tracking hardware or a certified hiring outcome. Actual recruiters evaluate candidates individually based on role context and company hiring standards.
          </span>
        </div>

        {/* Persona Selectors */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {personas.map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#18314A] border-[#FF7582] shadow-md shadow-[#FF7582]/10 ring-1 ring-[#FF7582]'
                    : 'bg-slate-950/40 border-white/5 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {p.icon}
                  <span className="text-xs font-bold text-white">{p.label}</span>
                </div>
                <div className="text-[10px] text-[#8FA3B8]">{p.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Clean Split View (Left: Applicant Summary Card | Right: Timeline & Verdict) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (5 Cols): Applicant Summary Card */}
        <div className="lg:col-span-5 bg-[#14273A] rounded-2xl border border-white/10 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8FA3B8]">
              Applicant Summary Card
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-950/60 text-slate-300 border border-white/10 font-semibold">
              Recruiter Preview
            </span>
          </div>

          {/* Profile Header */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#725A7A] to-[#FF7582] flex items-center justify-center text-white font-black text-base shadow-lg shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-base font-bold text-white">{profile.name}</h4>
              <p className="text-xs font-semibold text-[#FF7582] leading-snug">{profile.headline}</p>
              <p className="text-[11px] text-slate-400">{profile.location} · {profile.experienceBand} yrs exp</p>
            </div>
          </div>

          {/* Top Experience Highlights */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8FA3B8]">
              Experience Highlights (Top 3):
            </div>
            <div className="space-y-2">
              {allBullets.length > 0 ? (
                allBullets.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-200 leading-relaxed">
                    <span className="text-[#FF7582] font-bold mr-1.5 font-mono">#{idx + 1}</span>
                    {b}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No experience bullets listed.</p>
              )}
            </div>
          </div>

          {/* Top Skills Snippet */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8FA3B8]">
              Top Skills Snippet (First 8):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 8).map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950/60 text-slate-200 border border-white/10 font-medium">
                  {s}
                </span>
              ))}
              {profile.skills.length > 8 && (
                <span className="text-xs px-2 py-1 text-slate-400">
                  +{profile.skills.length - 8} more
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Simulating {sim.personaTitle}</span>
            <span className="text-slate-500">{sim.personaFocus}</span>
          </div>
        </div>

        {/* Right Side (7 Cols): Second-by-Second Eye Movement Timeline & Verdict */}
        <div className="lg:col-span-7 space-y-5">
          {/* Verdict Banner */}
          <div className={`p-6 rounded-2xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            sim.verdict === 'INTEREST'
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : sim.verdict === 'MAYBE'
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-rose-950/40 border-rose-500/40'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {sim.verdict === 'INTEREST' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#FF7582] shrink-0" />
                )}
                <span className="text-base font-black text-white">
                  6-Second Scan Impression:{' '}
                  <span className={sim.verdict === 'INTEREST' ? 'text-emerald-400' : sim.verdict === 'MAYBE' ? 'text-amber-400' : 'text-[#FF7582]'}>
                    {sim.verdict === 'INTEREST' ? 'High Consideration' : sim.verdict === 'MAYBE' ? 'Needs Review' : 'Initial Pass-Over Risk'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-200 max-w-md leading-relaxed">{sim.primaryBlockerOrCatalyst}</p>
            </div>

            <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <div className="text-[10px] uppercase font-bold text-[#8FA3B8]">Heuristic Alignment</div>
              <div className={`text-3xl font-black font-mono ${sim.visibilityScore >= 70 ? 'text-emerald-400' : sim.visibilityScore >= 50 ? 'text-amber-400' : 'text-[#FF7582]'}`}>
                {sim.visibilityScore}/100
              </div>
            </div>
          </div>

          {/* Timeline Steps (0-2s, 2-4s, 4-6s) */}
          <div className="bg-[#14273A] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8FA3B8]">
              Second-by-Second Scan Sequence
            </h4>
            <div className="space-y-3">
              {sim.timeline.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-white/15 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#FF7582]/20 text-[#FF7582] border border-[#FF7582]/30">
                        {step.timeWindow}
                      </span>
                      <span className="text-xs font-bold text-white">{step.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{step.weightText}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.observation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Callout */}
          <div className="p-5 rounded-2xl bg-[#14273A] border border-[#FF7582]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">Elevate Your Recruiter First Impression</p>
              <p className="text-[11px] text-slate-300">Convert passive bullet points into verifiable action deliverables.</p>
            </div>
            <Button
              onClick={() => onNavigateToTab('rewriter')}
              className="px-4 py-2 bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 font-bold text-xs shadow-md hover:brightness-110 shrink-0"
            >
              Rewrite Bullets Now
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
