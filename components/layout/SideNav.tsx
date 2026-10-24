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
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

interface SideNavProps {
  activeTab: string;
  onNavigateTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  onNavigateTab,
  collapsed,
  onToggleCollapse
}) => {
  const sections = [
    {
      title: 'Analyze',
      items: [
        { id: 'recruiter-sim', label: 'Recruiter View', icon: <Eye className="w-4 h-4" /> },
        { id: 'keywords', label: 'Keyword Gap Matrix', icon: <Sparkles className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Improve',
      items: [
        { id: 'rewriter', label: 'Smart Rewriter', icon: <FileEdit className="w-4 h-4" /> },
        { id: 'headlines', label: 'Headline Fixer', icon: <Type className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Plan & Fit',
      items: [
        { id: 'job-fit', label: 'Job Fit Matcher', icon: <Crosshair className="w-4 h-4" /> },
        { id: 'action-plan', label: '7-Day Action Plan', icon: <CheckSquare className="w-4 h-4" /> },
        { id: 'benchmarks', label: 'Peer Benchmark', icon: <Users className="w-4 h-4" /> },
        { id: 'progress', label: 'Progress History', icon: <TrendingUp className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Export',
      items: [
        { id: 'export', label: 'ATS Resume PDF', icon: <Download className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <aside
      className={`h-[calc(100vh-64px)] sticky top-16 bg-[#0B1B2B] border-r border-[var(--border)] transition-all duration-300 z-30 hidden lg:flex flex-col justify-between p-3 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="space-y-5 overflow-y-auto pr-1">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            {!collapsed && (
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E8397] px-3 py-1">
                {sec.title}
              </div>
            )}
            {sec.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF7582]/12 text-[#FF7582] border-l-2 border-[#FF7582] shadow-sm'
                      : 'text-[#A8B8C8] hover:text-[#F2F5F8] hover:bg-[#14293C]'
                  }`}
                >
                  <span className={isActive ? 'text-[#FF7582]' : 'text-[#6E8397]'}>{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Button */}
      <div className="pt-3 border-t border-[var(--border)]">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-[#14293C] hover:bg-[#1A3145] text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2 font-medium">Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
