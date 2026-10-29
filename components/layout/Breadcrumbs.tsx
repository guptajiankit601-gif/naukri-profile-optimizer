'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

interface RouteBreadcrumb {
  label: string;
  category?: string;
}

const ROUTE_MAP: Record<string, RouteBreadcrumb> = {
  '/dashboard': { label: 'Dashboard', category: 'Overview' },
  '/audit': { label: 'Complete Profile Audit', category: 'Overview' },
  '/profile-audit': { label: 'Complete Profile Audit', category: 'Overview' },
  '/screening-audit': { label: 'Resume Score', category: 'Analyze' },
  '/rejection': { label: 'Resume Score', category: 'Analyze' },
  '/recruiter-view': { label: 'Recruiter View', category: 'Analyze' },
  '/keyword-analysis': { label: 'Keywords & Skills', category: 'Analyze' },
  '/keywords': { label: 'Keywords & Skills', category: 'Analyze' },
  '/job-fit': { label: 'Job Match', category: 'Analyze' },
  '/bullet-rewriter': { label: 'Bullet Rewriter', category: 'Improve' },
  '/rewriter': { label: 'Bullet Rewriter', category: 'Improve' },
  '/headline-fixer': { label: 'Headline & Summary', category: 'Improve' },
  '/headlines': { label: 'Headline & Summary', category: 'Improve' },
  '/action-plan': { label: 'Action Plan', category: 'Plan' },
  '/history': { label: 'Version History', category: 'Plan' },
  '/score-card': { label: 'Version History', category: 'Plan' },
  '/resume-export': { label: 'Export Resume', category: 'Plan' },
  '/export': { label: 'Export Resume', category: 'Plan' },
  '/applications': { label: 'Application Studio', category: 'Applications' },
  '/application-tracker': { label: 'Application Tracker', category: 'Applications' },
  '/interview-prep': { label: 'Interview Preparation', category: 'Applications' },
  '/benchmarks': { label: 'Peer Benchmarks', category: 'Analyze' },
  '/benchmark': { label: 'Peer Benchmarks', category: 'Analyze' },
  '/settings': { label: 'Settings', category: 'System' },
  '/welcome': { label: 'Intake', category: 'Welcome' },
};

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const current = ROUTE_MAP[pathname] || { label: 'Workspace', category: BRAND_CONFIG.name };

  if (pathname === '/welcome' || pathname === '/') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 no-print">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{BRAND_CONFIG.name}</span>
      </Link>
      
      {current.category && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
          <span className="text-slate-400 dark:text-slate-500">{current.category}</span>
        </>
      )}

      <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
      <span className="text-slate-900 dark:text-slate-100 font-medium">{current.label}</span>
    </nav>
  );
};
