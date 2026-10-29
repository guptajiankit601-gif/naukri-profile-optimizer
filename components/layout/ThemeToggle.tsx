'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, Theme } from '@/lib/context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-blue-400" /> },
    { value: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-slate-400" /> },
  ];

  const currentIcon = resolvedTheme === 'dark'
    ? <Moon className="w-4 h-4 text-blue-400" />
    : <Sun className="w-4 h-4 text-amber-500" />;

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Theme selector: currently ${theme} mode`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="h-8 px-2.5 rounded-lg bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1A2E48] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs text-xs font-medium"
      >
        {currentIcon}
        <span className="hidden sm:inline capitalize">{theme}</span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Color theme options"
          className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map((opt) => {
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
