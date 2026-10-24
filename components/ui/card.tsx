import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'elevated' | 'interactive' | 'flush' | 'glass';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'base', ...props }, ref) => {
    const variants = {
      base: 'bg-[#1A3145] border border-[#24405A] rounded-2xl p-6 shadow-sm',
      elevated: 'bg-[#203A52] border border-[#2E4A64] rounded-2xl p-6 shadow-md',
      interactive: 'bg-[#1A3145] border border-[#24405A] rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#355C7D] hover:shadow-lg transition-all duration-200 cursor-pointer',
      flush: 'bg-[#1A3145] border border-[#24405A] rounded-2xl p-0 overflow-hidden',
      glass: 'bg-[#1A3145]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass',
    };

    return <div ref={ref} className={cn(variants[variant], className)} {...props} />;
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-display text-lg font-bold text-slate-100 tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-slate-400', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4 border-t border-[#24405A]/60', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
