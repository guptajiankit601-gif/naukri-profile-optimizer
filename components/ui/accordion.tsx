'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({ id, title, subtitle, children, defaultOpen = false, className }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('border border-[#24405A] rounded-xl overflow-hidden bg-[#1A3145]/70 mb-3', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[#203A52]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7582]"
      >
        <div className="flex-1 pr-4">
          <div className="text-sm font-semibold text-white">{title}</div>
          {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180 text-white')}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-4 pt-1 border-t border-[#24405A]/40 text-sm text-slate-200">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
