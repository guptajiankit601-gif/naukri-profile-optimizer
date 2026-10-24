import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7582] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2233] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary: 'bg-gradient-to-r from-[#FF7582] to-[#E55260] text-slate-950 font-bold shadow-md hover:brightness-110 hover:shadow-glow',
      secondary: 'bg-[#1A3145] text-slate-100 border border-[#24405A] hover:bg-[#203A52] hover:border-[#355C7D]',
      ghost: 'bg-transparent text-slate-300 hover:bg-[#24405A]/60 hover:text-white',
      outline: 'bg-transparent border border-[#24405A] text-slate-200 hover:bg-[#1A3145] hover:text-white',
      danger: 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30',
      glass: 'bg-[#1A3145]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#1A3145]/80 hover:border-white/20',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base font-semibold gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="sr-only">Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
