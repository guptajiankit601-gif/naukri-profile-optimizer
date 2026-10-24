'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GuestBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[rgba(255,117,130,0.15)] via-[rgba(197,108,134,0.15)] to-[rgba(114,90,122,0.15)] border-b border-[#FF7582]/20 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-200">
          <Clock className="w-4 h-4 text-[#FF7582] shrink-0" />
          <span>
            <strong className="font-semibold text-white">Guest Session Active:</strong> Your diagnostic score and rewrites will expire in 24 hours per DPDP auto-purge.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/signup">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-[11px] font-bold border-[#FF7582]/40 text-[#FF7582] hover:bg-[#FF7582]/10"
            >
              Save Permanently (Free)
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-slate-400 hover:text-slate-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
