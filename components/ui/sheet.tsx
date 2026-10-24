'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  side?: 'right' | 'left' | 'bottom';
}

export function Sheet({ open, onOpenChange, title, description, children, className, side = 'right' }: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onOpenChange(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const sideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      classes: 'top-0 right-0 h-full w-full max-w-md border-l border-[#24405A]',
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      classes: 'top-0 left-0 h-full w-full max-w-md border-r border-[#24405A]',
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      classes: 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t border-[#24405A]',
    },
  };

  const currentVariant = sideVariants[side];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-[#0B1B2B]/75 backdrop-blur-sm"
          />
          <motion.div
            initial={currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            className={cn(
              'fixed z-50 bg-[#1A3145] p-6 shadow-2xl overflow-y-auto',
              currentVariant.classes,
              className
            )}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#24405A]/70">
              <div>
                {title && <h2 className="font-display text-lg font-bold text-white">{title}</h2>}
                {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-[#24405A]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7582]"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
