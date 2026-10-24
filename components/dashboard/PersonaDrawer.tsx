'use client';

import React from 'react';
import { ParsedProfile } from '@/types';
import { evaluateAllPersonas, RecruiterPersonaKey } from '@/lib/scoring/personas';
import { cn } from '@/lib/utils';
import { Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PersonaDrawerProps {
  profile: ParsedProfile;
  selectedPersona?: RecruiterPersonaKey;
  onSelectPersona?: (persona: RecruiterPersonaKey) => void;
}

export const PersonaDrawer: React.FC<PersonaDrawerProps> = ({
  profile,
  selectedPersona = 'startup',
  onSelectPersona
}) => {
  const personas = evaluateAllPersonas(profile);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#FF7582]" />
          Recruiter Persona Verdicts
        </h3>
        <span className="text-[11px] text-slate-400">4 Recruitment Lenses</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(personas).map(([key, p]) => {
          const isSelected = selectedPersona === key;
          const isPass = p.verdict === 'Pass';
          const isBorderline = p.verdict === 'Borderline';

          return (
            <div
              key={key}
              onClick={() => onSelectPersona?.(key as RecruiterPersonaKey)}
              className={cn(
                'p-4 rounded-xl border cursor-pointer transition-all duration-200 bg-[rgba(26,49,69,0.35)] backdrop-blur-md space-y-2.5',
                isSelected
                  ? 'border-[#FF7582] bg-[rgba(255,117,130,0.08)] shadow-lg shadow-[#FF7582]/10'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{p.avatar}</span>
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    isPass
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      : isBorderline
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      : 'bg-red-950/60 text-red-300 border-red-500/30'
                  )}
                >
                  {p.verdict} ({p.weightedScore}/100)
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-200">{p.personaName}</p>
                <p className="text-[10px] text-slate-400 truncate">{p.personaTitle}</p>
              </div>

              <p className="text-[11px] text-slate-300 italic line-clamp-2">
                &ldquo;{p.verdictQuote}&rdquo;
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
