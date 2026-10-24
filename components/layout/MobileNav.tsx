'use client';

import React from 'react';
import { Eye, Sparkles, FileEdit, Crosshair, CheckSquare } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onNavigateTab: (tabId: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onNavigateTab }) => {
  const items = [
    { id: 'recruiter-sim', label: '6s View', icon: <Eye className="w-5 h-5" /> },
    { id: 'keywords', label: 'Keywords', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'rewriter', label: 'Rewrite', icon: <FileEdit className="w-5 h-5" /> },
    { id: 'job-fit', label: 'Job Fit', icon: <Crosshair className="w-5 h-5" /> },
    { id: 'action-plan', label: 'Action Plan', icon: <CheckSquare className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1B2B]/95 backdrop-blur-md border-t border-[var(--border)] h-16 px-2 flex items-center justify-around md:hidden pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigateTab(item.id)}
            className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-[#FF7582]' : 'text-[#6E8397] hover:text-[#A8B8C8]'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-[10px] font-semibold mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
