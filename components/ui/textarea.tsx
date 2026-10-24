import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'flex min-h-[96px] w-full rounded-xl border border-[#24405A] bg-[#14293C] p-4 text-sm text-slate-100 placeholder:text-[#6E8397] transition-all duration-150',
            'focus:outline-none focus:border-[#FF7582] focus:ring-2 focus:ring-[#FF7582]/20',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#0F2233]',
            error && 'border-[#F05454] focus:border-[#F05454] focus:ring-[#F05454]/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400 flex items-center gap-1.5 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
