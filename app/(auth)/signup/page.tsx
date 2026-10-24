import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0A1722] flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <SignupForm />
    </div>
  );
}
