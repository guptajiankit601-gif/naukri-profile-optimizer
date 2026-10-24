'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'danger' | 'points';
  pointsGained?: number;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = 'default', pointsGained }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant, pointsGained }]);
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md',
                t.variant === 'points' && 'bg-[#1A3145]/95 border-l-4 border-l-[#FF7582] border-white/10 shadow-glow',
                t.variant === 'success' && 'bg-[#1A3145]/95 border-emerald-500/40 text-emerald-200',
                t.variant === 'danger' && 'bg-[#1A3145]/95 border-red-500/40 text-red-200',
                t.variant === 'default' && 'bg-[#1A3145]/95 border-[#24405A] text-slate-100'
              )}
            >
              {t.variant === 'points' && (
                <div className="p-1.5 rounded-lg bg-[#FF7582]/20 text-[#FF7582]">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              {t.variant === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {t.variant === 'danger' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              {t.variant === 'default' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}

              <div className="flex-1 min-w-0">
                {t.pointsGained && (
                  <span className="inline-block text-xs font-bold text-[#FF7582] uppercase tracking-wider mb-0.5">
                    +{t.pointsGained} Points Unlocked
                  </span>
                )}
                {t.title && <h4 className="text-sm font-semibold text-white">{t.title}</h4>}
                {t.description && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{t.description}</p>}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
