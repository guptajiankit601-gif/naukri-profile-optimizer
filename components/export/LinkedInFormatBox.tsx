'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LinkedInFormatBoxProps {
  headline: string;
  about: string;
}

export const LinkedInFormatBox: React.FC<LinkedInFormatBoxProps> = ({ headline, about }) => {
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
          LinkedIn Ready-to-Paste Blocks
        </h4>
        <span className="text-[10px] text-slate-400">Profile Sections</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>LinkedIn Headline (220c Max)</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(headline, 'li_headline')}
              className="h-6 px-2 text-[10px] text-[#FF7582] hover:bg-[#FF7582]/10"
            >
              {copiedField === 'li_headline' ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
              {copiedField === 'li_headline' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="font-mono text-xs text-slate-200 bg-slate-950/50 p-2.5 rounded-lg border border-white/5">
            {headline}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>About Section (Rich Text with Emojis)</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(about, 'li_about')}
              className="h-6 px-2 text-[10px] text-[#FF7582] hover:bg-[#FF7582]/10"
            >
              {copiedField === 'li_about' ? <Check className="w-3 h-3 mr-1 text-emerald-400" /> : <Copy className="w-3 h-3 mr-1" />}
              {copiedField === 'li_about' ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="font-mono text-xs text-slate-200 bg-slate-950/50 p-2.5 rounded-lg border border-white/5 whitespace-pre-line line-clamp-4">
            {about}
          </p>
        </div>
      </div>
    </div>
  );
};
