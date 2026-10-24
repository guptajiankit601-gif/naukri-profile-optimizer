import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'accent' | 'info' | 'neutral' | 'glass';
  withDot?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'neutral', withDot = true, children, ...props }, ref) => {
    const variants = {
      success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      danger: 'bg-red-500/15 text-red-300 border-red-500/30',
      accent: 'bg-[#FF7582]/15 text-[#FF7582] border-[#FF7582]/30',
      info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      neutral: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
      glass: 'bg-white/5 backdrop-blur-md text-slate-200 border-white/10',
    };

    const dots = {
      success: 'bg-emerald-400',
      warning: 'bg-amber-400',
      danger: 'bg-red-400',
      accent: 'bg-[#FF7582]',
      info: 'bg-sky-400',
      neutral: 'bg-slate-400',
      glass: 'bg-slate-300',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {withDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />}
        {children}
      </div>
    );
  }
);
Badge.displayName = 'Badge';
