'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { ShieldCheck } from 'lucide-react';
import { PrivacyNoticeModal } from '@/components/PrivacyNoticeModal';

export const Footer: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <footer className="border-t border-white/10 bg-[rgba(10,23,34,0.95)] pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-2">
            <Logo size="md" />
            <p className="text-xs text-slate-400 max-w-sm">
              100% free, transparent resume and profile optimization intelligence for Indian tech job seekers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">
              Analyze Resume
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/benchmark" className="hover:text-white transition-colors">
              Benchmarks
            </Link>
            <Link href="/keywords" className="hover:text-white transition-colors">
              Keywords
            </Link>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Privacy Notice
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            Disclaimer: Naukri Profile Optimizer is an independent diagnostic instrument and is not affiliated with, sponsored by, or endorsed by Info Edge (India) Ltd. or Naukri.com.
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <span>Built with precision for Indian freshers & professionals</span>
          </div>
        </div>
      </div>

      <PrivacyNoticeModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </footer>
  );
};
