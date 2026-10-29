'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  ClipboardCheck,
  Eye, 
  FileEdit, 
  Crosshair, 
  MoreHorizontal,
  X,
  CheckSquare,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_SECTIONS } from './SideNav';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryItems = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/audit', label: 'Audit', icon: ClipboardCheck, aliases: ['/profile-audit', '/complete-audit'] },
    { href: '/recruiter-view', label: '6s View', icon: Eye },
    { href: '/bullet-rewriter', label: 'Rewrite', icon: FileEdit, aliases: ['/rewriter'] },
    { href: '/job-fit', label: 'Job Fit', icon: Crosshair },
  ];

  const isPrimaryActive = (item: typeof primaryItems[0]) => {
    if (pathname === item.href) return true;
    if (item.aliases && item.aliases.includes(pathname)) return true;
    return false;
  };

  return (
    <>
      {/* Fixed Bottom Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1422]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-16 px-2 flex items-center justify-around lg:hidden pb-[env(safe-area-inset-bottom)] shadow-sm"
      >
        {primaryItems.map((item) => {
          const active = isPrimaryActive(item);
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-[50px] min-h-[44px] rounded-lg transition-colors',
                active ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-[10px] font-semibold mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* More Tools Drawer Trigger */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-1">Tools</span>
        </button>
      </nav>

      {/* Full Tools Mobile Sheet Drawer */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden flex flex-col justify-end">
          <div className="bg-white dark:bg-[#142236] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl max-h-[80vh] overflow-y-auto p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">All CareerUp Tools</span>
              <div className="flex items-center gap-2">
                <Link
                  href="/settings"
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  title="Settings & Preferences"
                  aria-label="Settings & Preferences"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {NAV_SECTIONS.map((sec) => (
                <div key={sec.title} className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">
                    {sec.title}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {sec.items.map((item) => {
                      const active = pathname === item.href || (item.aliases && item.aliases.includes(pathname));
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMoreOpen(false)}
                          className={cn(
                            'p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all',
                            active
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          )}
                        >
                          <IconComponent className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
