'use client';

import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface AiConsentToggleProps {
  consent: boolean;
  onConsentChange: (granted: boolean) => void;
  className?: string;
}

export function AiConsentToggle({
  consent,
  onConsentChange,
  className = ''
}: AiConsentToggleProps) {
  return (
    <div className={`p-4 rounded-xl border border-white/10 bg-[#1A3145]/70 backdrop-blur-md shadow-md ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF7582]" />
            <h3 className="font-display text-base font-semibold text-slate-100">AI Bullet Polish</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF7582]/20 text-[#FF7582] border border-[#FF7582]/30 font-mono">
              Google Gemini 2.0
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            When enabled, the specific bullet you are rewriting — and nothing else — is sent
            to Google Gemini to generate alternative executive phrasings.
          </p>
          <ul className="text-[11px] text-slate-400 mt-2.5 space-y-1">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Only the bullet text and target role are sent.
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Your name, email, phone, education, and employers are never sent.
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Fabrication filter strictly prevents hallucinated metrics.
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              Turn off anytime — deterministic template engine is always active.
            </li>
          </ul>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="sr-only peer"
            aria-label="Enable AI bullet polish"
          />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7582]"></div>
        </label>
      </div>
    </div>
  );
}
