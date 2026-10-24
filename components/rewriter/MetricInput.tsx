'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Sparkles, TrendingUp } from 'lucide-react';

interface MetricInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MetricInput: React.FC<MetricInputProps> = ({
  value,
  onChange,
  placeholder = 'e.g. 35% latency reduction, 20k TPS, ₹15 Lakhs',
  className
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <label className="font-semibold text-slate-300 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#FF7582]" />
          Inject Real Verification Metric (%, ₹, TPS, scale):
        </label>
        <span className="text-[10px] text-emerald-400 font-mono">Zero Hallucination Guaranteed</span>
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-950/60 border-white/10 text-white text-xs placeholder:text-slate-500 font-mono"
      />
    </div>
  );
};
