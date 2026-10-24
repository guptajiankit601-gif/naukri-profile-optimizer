import React, { useState } from 'react';
import { ParsedProfile, RecruiterPersona } from '../types';
import { simulateRecruiterScan } from '../services/recruiter-sim';
import { Clock, Eye, AlertCircle, CheckCircle, Flame, Building2, Briefcase, UserCheck } from 'lucide-react';

interface RecruiterSimulationProps {
  profile: ParsedProfile;
  onNavigateToTab: (tabId: string) => void;
}

export const RecruiterSimulation: React.FC<RecruiterSimulationProps> = ({ profile, onNavigateToTab }) => {
  const [selectedPersona, setSelectedPersona] = useState<RecruiterPersona>('Startup Founder');

  const sim = simulateRecruiterScan(profile, selectedPersona);

  const personas: { id: RecruiterPersona; label: string; icon: React.ReactNode; tag: string }[] = [
    { id: 'Startup Founder', label: 'Startup Founder', icon: <Flame className="w-4 h-4 text-[#FF7582]" />, tag: 'Speed & Scale' },
    { id: 'Enterprise TA', label: 'Enterprise TA', icon: <Building2 className="w-4 h-4 text-sky-400" />, tag: 'Certifications & Cloud' },
    { id: 'Consultancy Recruiter', label: 'Consultancy Recruiter', icon: <Briefcase className="w-4 h-4 text-purple-400" />, tag: 'Keyword Ratecard' },
    { id: 'HR Screen', label: 'HR Screen', icon: <UserCheck className="w-4 h-4 text-emerald-400" />, tag: 'Hygiene & Eligibility' }
  ];

  const allBullets = profile.experiences.flatMap(e => e.bullets).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header and Persona switcher */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#FF7582]" />
              <h3 className="text-lg font-bold text-white">6-Second Recruiter Human Eye Simulation</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Recruiters don't read resumes — they scan them in 6 seconds. Test your profile through 4 different recruiter lenses:
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F2233] border border-[#234566]">
            <Clock className="w-4 h-4 text-[#FF7582] animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Human Eye Scan Window: 6 Seconds</span>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {personas.map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#18314A] to-[#725A7A]/40 border-[#FF7582] shadow-md shadow-[#FF7582]/10 scale-[1.01]'
                    : 'bg-[#0F2233] border-[#234566] hover:border-[#C56C86]/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {p.icon}
                  <span className="text-xs font-bold text-white">{p.label}</span>
                </div>
                <div className="text-[10px] text-slate-400">{p.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Screen Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Cols - Profile Mock Card */}
        <div className="lg:col-span-5 bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#234566] mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Recruiter Quick-View Card</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#18314A] text-slate-300 border border-[#234566]">
                Naukri / LinkedIn Preview
              </span>
            </div>

            {/* Profile Header */}
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#725A7A] to-[#FF7582] flex items-center justify-center text-white font-extrabold text-base shadow flex-shrink-0">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white leading-tight">{profile.name}</h4>
                <p className="text-xs font-medium text-[#FF7582] mt-0.5 leading-snug">{profile.headline}</p>
                <p className="text-[11px] text-slate-400 mt-1">{profile.location} · {profile.experienceBand} yrs exp</p>
              </div>
            </div>

            {/* Scan Area 1: First 3 Experience Bullets */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Top Experience Highlights:
              </div>
              <div className="space-y-2">
                {allBullets.length > 0 ? (
                  allBullets.map((b, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#0F2233] border border-[#234566] text-[11px] text-slate-300 leading-relaxed">
                      <span className="text-[#FF7582] font-bold mr-1">#{idx + 1}</span>
                      {b}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No experience bullets listed.</p>
                )}
              </div>
            </div>

            {/* Scan Area 2: Key Skills Snippet */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Top Skills Snippet (First 8):
              </div>
              <div className="flex flex-wrap gap-1">
                {profile.skills.slice(0, 8).map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-[#18314A] text-slate-300 border border-[#234566]">
                    {s}
                  </span>
                ))}
                {profile.skills.length > 8 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                    +{profile.skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#234566] flex items-center justify-between text-[11px] text-slate-400">
            <span>Simulating {sim.personaTitle}</span>
            <span className="text-slate-500">Focus: {sim.personaFocus}</span>
          </div>
        </div>

        {/* Right: 7 Cols - Second-by-Second Recruiter Timeline & Verdict */}
        <div className="lg:col-span-7 space-y-4">
          {/* Verdict Banner */}
          <div className={`p-5 rounded-2xl border shadow-xl flex items-center justify-between gap-4 ${
            sim.verdict === 'INTEREST'
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : sim.verdict === 'MAYBE'
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-rose-950/40 border-rose-500/40'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {sim.verdict === 'INTEREST' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#FF7582]" />
                )}
                <span className="text-base font-black text-white">
                  6-Second Verdict: <span className={sim.verdict === 'INTEREST' ? 'text-emerald-400' : sim.verdict === 'MAYBE' ? 'text-amber-400' : 'text-[#FF7582]'}>{sim.verdict}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-md">{sim.primaryBlockerOrCatalyst}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">Persona Fit Score</div>
              <div className={`text-3xl font-black ${sim.visibilityScore >= 70 ? 'text-emerald-400' : sim.visibilityScore >= 50 ? 'text-amber-400' : 'text-[#FF7582]'}`}>
                {sim.visibilityScore}/100
              </div>
            </div>
          </div>

          {/* Timeline Steps (0-2s, 2-4s, 4-6s, 6s+) */}
          <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Second-by-Second Eye Movement Timeline
            </h4>
            {sim.timeline.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0F2233] border border-[#234566] hover:border-[#725A7A] transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FF7582]/20 text-[#FF7582] border border-[#FF7582]/30">
                      {step.timeWindow}
                    </span>
                    <span className="text-xs font-bold text-white">{step.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{step.weightText}</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">{step.observation}</div>
              </div>
            ))}
          </div>

          {/* Direct CTA */}
          <div className="p-4 rounded-xl bg-[#18314A] border border-[#234566] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <strong className="text-white">Want to flip this SKIP into an INTEREST?</strong>
              <div className="text-[11px] text-slate-400">Fixing your top 3 bullets and adding cloud keywords will lift your score by +24 points.</div>
            </div>
            <button
              onClick={() => onNavigateToTab('rewriter')}
              className="px-4 py-2 rounded-xl bg-[#FF7582] hover:bg-[#ff5c6d] text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Rewrite Bullets Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
