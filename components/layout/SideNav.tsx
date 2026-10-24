'use client';

import React from 'react';
import { 
  Eye, 
  Sparkles, 
  FileEdit, 
  Type, 
  Crosshair, 
  Users, 
  CheckSquare, 
  Download, 
  TrendingUp,
  AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideNavProps {
  activeTab: string;
  onNavigateTab: (tabId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  onNavigateTab
}) => {
  const sections = [
    {
      title: 'Analyze',
      items: [
        { id: 'recruiter-sim', label: 'Recruiter View (6s)', icon: <Eye className="w-4 h-4" /> },
        { id: 'keywords', label: 'Keyword Gap Radar', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'rejection', label: 'Rejection Predictor', icon: <AlertOctagon className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Optimize Content',
      items: [
        { id: 'rewriter', label: 'Bullet Rewriter', icon: <FileEdit className="w-4 h-4" /> },
        { id: 'headlines', label: 'Headline Fixer', icon: <Type className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Targeting & Strategy',
      items: [
        { id: 'job-fit', label: 'Job Fit Matcher', icon: <Crosshair className="w-4 h-4" /> },
        { id: 'benchmarks', label: 'Peer Benchmarks', icon: <Users className="w-4 h-4" /> },
        { id: 'action-plan', label: '7-Day Action Plan', icon: <CheckSquare className="w-4 h-4" /> },
        { id: 'progress', label: 'Progress History', icon: <TrendingUp className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Deliverables',
      items: [
        { id: 'export', label: 'ATS Resume Export', icon: <Download className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 h-[calc(100vh-80px)] sticky top-20 bg-[#0F2233]/70 backdrop-blur-xl border-r border-white/10 hidden lg:flex flex-col justify-between p-4 z-20">
      <div className="space-y-6 overflow-y-auto pr-1">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8FA3B8] px-3 py-1">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                    isActive
                      ? 'bg-[rgba(255,117,130,0.12)] text-[#FF7582] border-l-2 border-[#FF7582] font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span className={isActive ? 'text-[#FF7582]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10 text-[10px] text-slate-500 text-center">
        <span>Deterministic Scoring Engine</span>
      </div>
    </aside>
  );
};
