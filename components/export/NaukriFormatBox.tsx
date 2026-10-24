'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NaukriFormatBoxProps {
  headline: string;
  skills: string;
  summary: string;
}

export const NaukriFormatBox: React.FC<NaukriFormatBoxProps> = ({ headline, skills, summary }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-5 rounded-2xl bg-[rgba(26,49,69,0.35)] border border-white/10 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Naukri Profile Ready-to-Paste
        </h4>
        <span className="text-[10px] text-slate-400">Direct Paste Format</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>Resume Headline (250c Max)</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(headline, 'headline')}
              className="h-6 px-2 text-[10px] text-[#FF7582] hover:bg-[#FF7582]/10"
            >
              {copiedField === 'headline' ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
              {copiedField === 'headline' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="font-mono text-xs text-slate-200 bg-slate-950/50 p-2.5 rounded-lg border border-white/5">
            {headline}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>Key Skills Tags (Comma Separated)</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(skills, 'skills')}
              className="h-6 px-2 text-[10px] text-[#FF7582] hover:bg-[#FF7582]/10"
            >
              {copiedField === 'skills' ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
              {copiedField === 'skills' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="font-mono text-xs text-slate-200 bg-slate-950/50 p-2.5 rounded-lg border border-white/5">
            {skills}
          </p>
        </div>
      </div>
    </div>
  );
};
