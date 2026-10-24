'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlatformCardProps {
  platform: 'Naukri' | 'LinkedIn' | 'Resume';
  maxChars: number;
  headlineText: string;
  rationale: string;
  onApply?: (text: string) => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  maxChars,
  headlineText,
  rationale,
  onApply
}) => {
  const [copied, setCopied] = useState(false);
  const currentLength = headlineText.length;
  const isOverflow = currentLength > maxChars;

  const handleCopy = () => {
    navigator.clipboard.writeText(headlineText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl bg-[rgba(26,49,69,0.35)] border border-white/10 backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200">{platform} Bound</span>
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className={cn(isOverflow ? 'text-red-400 font-bold' : 'text-slate-400')}>
            {currentLength} / {maxChars} chars
          </span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-slate-950/60 border border-white/5 font-mono text-xs text-slate-100">
        {headlineText}
      </div>

      <p className="text-[11px] text-slate-400 italic">
        {rationale}
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-7 px-2.5 text-xs border-white/10 text-slate-300"
        >
          {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>

        {onApply && (
          <Button
            size="sm"
            onClick={() => onApply(headlineText)}
            className="h-7 px-2.5 text-xs font-bold bg-[#FF7582] text-slate-950 hover:bg-[#FF7582]/90"
          >
            Apply to Profile
          </Button>
        )}
      </div>
    </div>
  );
};
