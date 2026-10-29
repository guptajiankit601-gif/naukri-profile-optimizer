'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Sparkles, Check, CornerDownLeft } from 'lucide-react';
import { 
  searchSkillSuggestions, 
  normalizeSkillInput, 
  AutocompleteSkill 
} from '@/lib/skills/skill-catalog';

interface SkillAutocompleteProps {
  existingSkills: string[];
  onAddSkill: (skillName: string) => void;
  targetRoleId?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const SkillAutocomplete: React.FC<SkillAutocompleteProps> = ({
  existingSkills,
  onAddSkill,
  targetRoleId,
  placeholder = 'Add skill (e.g. Python, React, Next.js, Kafka)...',
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<AutocompleteSkill[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions whenever input or existingSkills change
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const results = searchSkillSuggestions(inputValue, existingSkills, targetRoleId, 8);
      setSuggestions(results);
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [inputValue, existingSkills, targetRoleId]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSkill = (rawName: string) => {
    const normalized = normalizeSkillInput(rawName);
    if (!normalized) return;

    // Check duplicate case-insensitively
    const isDuplicate = existingSkills.some(
      s => s.toLowerCase().trim() === normalized.toLowerCase().trim()
    );

    if (isDuplicate) {
      setFeedback(`"${normalized}" is already added.`);
      setTimeout(() => setFeedback(null), 2500);
      setInputValue('');
      setIsOpen(false);
      return;
    }

    onAddSkill(normalized);
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      if (inputValue.trim()) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectSkill(suggestions[highlightedIndex].name);
      } else if (inputValue.trim()) {
        handleSelectSkill(inputValue);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleManualAddClick = () => {
    if (inputValue.trim()) {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectSkill(suggestions[highlightedIndex].name);
      } else {
        handleSelectSkill(inputValue);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input and Add Button Row */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              if (inputValue.trim().length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-label="Add skill with autocomplete"
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-[#0B1422] transition-colors"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setIsOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
              title="Clear input"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={disabled || !inputValue.trim()}
          onClick={handleManualAddClick}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Duplicate feedback alert */}
      {feedback && (
        <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 animate-in fade-in">
          <span>⚠️ {feedback}</span>
        </div>
      )}

      {/* Suggestions Dropdown (Never clipped, top z-index) */}
      {isOpen && inputValue.trim().length > 0 && (
        <div 
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#142236] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
        >
          {suggestions.length > 0 ? (
            <div className="p-1 space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Matching Skills ({suggestions.length})</span>
                <span className="font-mono text-[9px] flex items-center gap-1 lowercase">
                  <span>use</span>
                  <kbd className="px-1 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">↓</kbd>
                  <kbd className="px-1 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">↑</kbd>
                  <kbd className="px-1 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">enter</kbd>
                </span>
              </div>

              {suggestions.map((item, idx) => {
                const isSelected = idx === highlightedIndex;
                return (
                  <button
                    key={item.name}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectSkill(item.name)}
                    className={`w-full px-3 py-2 text-left rounded-lg text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                      <span className="truncate">{item.name}</span>
                    </div>

                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                      {item.category}
                    </span>
                  </button>
                );
              })}

              {/* Add Custom Entry Option at bottom if not exact match */}
              {!suggestions.some(s => s.name.toLowerCase() === inputValue.toLowerCase().trim()) && (
                <button
                  type="button"
                  onClick={() => handleSelectSkill(inputValue)}
                  className="w-full px-3 py-2 text-left rounded-lg text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 cursor-pointer transition-colors font-medium"
                >
                  <span className="truncate">Add custom skill &ldquo;{inputValue.trim()}&rdquo;</span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <span>Enter</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 text-center space-y-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                No catalog matches for &ldquo;{inputValue.trim()}&rdquo;
              </div>
              <button
                type="button"
                onClick={() => handleSelectSkill(inputValue)}
                className="w-full px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add &ldquo;{inputValue.trim()}&rdquo; as Custom Skill</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
