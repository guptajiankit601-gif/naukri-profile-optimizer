'use client';

import React from 'react';
import { RewriteVariant } from '@/types';
import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants: RewriteVariant[];
  selectedType?: string;
  onSelectVariant: (variant: RewriteVariant) => void;
  onAcceptVariant: (variant: RewriteVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedType = 'SAFE',
  onSelectVariant,
  onAcceptVariant
}) => {
  return (
    <div className="space-y-3">
      {variants.map((v) => {
        const isSelected = selectedType === v.type;
        const isSafe = v.type === 'SAFE';
        const isMetric = v.type === 'METRIC';
        const isImpact = v.type === 'IMPACT';

        return (
          <div
            key={v.type}
            onClick={() => onSelectVariant(v)}
            className={cn(
              'p-4 rounded-xl border transition-all duration-200 cursor-pointer space-y-2.5',
              isSelected
                ? 'border-[#FF7582] bg-[rgba(255,117,130,0.08)] shadow-lg shadow-[#FF7582]/10'
                : 'border-white/10 bg-[rgba(26,49,69,0.35)] hover:border-white/20'
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                  isSafe
                    ? 'bg-sky-950/60 text-sky-300 border-sky-500/30'
                    : isMetric
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                )}
              >
                {v.type} Variant {isSafe && '· 100% Faithful'}
              </span>

              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcceptVariant(v);
                }}
                className="h-7 px-3 text-[11px] font-bold bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 hover:brightness-110"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Apply Variant
              </Button>
            </div>

            <p className="text-xs font-mono text-slate-100 leading-relaxed">
              {v.text}
            </p>

            <p className="text-[11px] text-slate-400 italic">
              {v.reason}
            </p>
          </div>
        );
      })}
    </div>
  );
};
