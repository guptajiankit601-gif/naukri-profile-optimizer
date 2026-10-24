'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog } from './dialog';

export interface CommandItem {
  id: string;
  label: string;
  category?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
}

export function CommandPalette({ open, onOpenChange, items, placeholder = 'Search tools, roles, actions...' }: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="p-0 max-w-lg bg-[#14293C] border-[#24405A]">
      <div className="flex items-center px-4 border-b border-[#24405A]">
        <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          autoFocus
        />
      </div>

      <div className="max-h-72 overflow-y-auto p-2 scrollbar-none">
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">No actions or tools matching "{query}"</div>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onSelect();
                onOpenChange(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-slate-200 hover:text-white hover:bg-[#203A52] transition-colors focus-visible:outline-none focus-visible:bg-[#203A52]"
            >
              <div className="flex items-center gap-2.5">
                {item.icon && <span className="text-[#FF7582]">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              {item.category && (
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  {item.category}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </Dialog>
  );
}
