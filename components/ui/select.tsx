import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            'flex h-11 w-full appearance-none rounded-xl border border-[#24405A] bg-[#14293C] px-4 py-2.5 pr-10 text-sm text-slate-100 transition-all duration-150',
            'focus:outline-none focus:border-[#FF7582] focus:ring-2 focus:ring-[#FF7582]/20',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#0F2233]',
            error && 'border-[#F05454]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = 'Select';
