'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  ClipboardCheck,
  Eye, 
  Sparkles, 
  ShieldCheck, 
  FileEdit, 
  Type, 
  Crosshair, 
  CheckSquare, 
  History, 
  Download,
  Briefcase,
  Settings,
  FolderGit2,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  aliases?: string[];
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Home',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/audit', label: 'Complete Profile Audit', icon: ClipboardCheck, badge: 'Unified', aliases: ['/profile-audit', '/complete-audit'] }
    ]
  },
  {
    title: 'Optimize',
    items: [
      { href: '/screening-audit', label: 'Resume Score', icon: ShieldCheck, aliases: ['/rejection', '/score'] },
      { href: '/job-fit', label: 'Job Match', icon: Crosshair },
      { href: '/keyword-analysis', label: 'Keywords & Skills', icon: Sparkles, aliases: ['/keywords'] },
      { href: '/recruiter-view', label: 'Recruiter Preview', icon: Eye }
    ]
  },
  {
    title: 'Build Your Profile',
    items: [
      { href: '/bullet-rewriter', label: 'Bullet Rewriter', icon: FileEdit, aliases: ['/rewriter'] },
      { href: '/headline-fixer', label: 'Naukri Profile & Headline', icon: Type, aliases: ['/headlines', '/naukri-profile'] },
      { href: '/proof-of-work', label: 'Proof of Work Vault', icon: FolderGit2, badge: 'Vault', aliases: ['/projects'] }
    ]
  },
  {
    title: 'Apply',
    items: [
      { href: '/applications', label: 'Job Applications', icon: Briefcase, aliases: ['/application-tracker'] },
      { href: '/interview-prep', label: 'Interview Preparation', icon: GraduationCap }
    ]
  },
  {
    title: 'Track Progress',
    items: [
      { href: '/action-plan', label: 'Action Plan', icon: CheckSquare },
      { href: '/history', label: 'Version History', icon: History, aliases: ['/score-card'] }
    ]
  },
  {
    title: 'Preferences',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: '/resume-export', label: 'Export Resume', icon: Download, aliases: ['/export'] }
    ]
  }
];

export const SideNav: React.FC = () => {
  const pathname = usePathname();

  const isItemActive = (item: NavItem): boolean => {
    if (pathname === item.href) return true;
    if (item.aliases && item.aliases.includes(pathname)) return true;
    return false;
  };

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="w-60 shrink-0 hidden lg:block sticky top-16 h-[calc(100vh-4rem)] bg-white dark:bg-[#0B1422] border-r border-slate-200 dark:border-slate-800/80 p-4 overflow-y-auto no-print transition-colors duration-200"
    >
      <div className="space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              {section.title}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isItemActive(item);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#142236]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500')} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
