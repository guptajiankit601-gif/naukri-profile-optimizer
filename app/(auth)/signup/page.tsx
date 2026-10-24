'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0A1722] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#13273A] border border-[#234566] rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF7582] to-[#725A7A] flex items-center justify-center mx-auto mb-3 shadow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">Create Free Profile Save</h2>
          <p className="text-xs text-slate-400 mt-1">Zero subscriptions. 100% free tool.</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F2233] border border-[#234566] text-xs text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>No signup required! Profiles are stored locally in your browser.</span>
        </div>

        <Link
          href="/"
          className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-900 font-extrabold text-xs text-center shadow-lg hover:opacity-95"
        >
          Proceed to Optimizer (Instant Access)
        </Link>
      </div>
    </div>
  );
}
