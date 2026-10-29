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
    <div className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#142236] shadow-xs ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Optional AI Polish Tier</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono font-medium">
              Google Gemini 2.0
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            When enabled, only the active bullet text is sent to Google Gemini for phrasing enhancements.
            The deterministic engine remains active 100% of the time as the core baseline.
          </p>
          <ul className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 space-y-1">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Only the bullet text and target role are sent.
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Your name, email, phone, education, and employers are never sent.
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Strict zero-hallucination filter discards invented numbers and unverified claims.
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Turn off anytime — default state is always OFF (India DPDP Act 2023 compliant).
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
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
}
