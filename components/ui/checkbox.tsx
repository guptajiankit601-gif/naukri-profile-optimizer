'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({ checked = false, onCheckedChange, disabled = false, className, id }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'peer h-5 w-5 shrink-0 rounded-md border border-[#24405A] transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7582] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2233]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-gradient-to-r from-[#FF7582] to-[#E55260] border-transparent text-slate-950 shadow-sm' : 'bg-[#14293C] hover:border-[#355C7D]',
        className
      )}
    >
      {checked && <Check className="w-3.5 h-3.5 mx-auto stroke-[3]" />}
    </button>
  );
}
