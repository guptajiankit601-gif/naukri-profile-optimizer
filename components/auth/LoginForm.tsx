'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, magicLink: isMagicLink })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Authentication failed');
      }

      if (isMagicLink) {
        setSuccessMsg('Check your inbox! We sent you a secure sign-in link.');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[rgba(26,49,69,0.5)] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7582] to-[#725A7A] flex items-center justify-center mx-auto shadow">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-black text-slate-100">Welcome Back</h2>
        <p className="text-xs text-slate-300">
          Sign in to access your saved score history and customized action plans.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-[rgba(255,117,130,0.08)] border border-[rgba(255,117,130,0.2)] flex items-start gap-2.5 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">No Login Required:</span>
          <p className="text-slate-400 text-[11px] mt-0.5">
            You can analyze resumes and view all diagnostics without creating an account.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-slate-300">Work or Personal Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="arjun.sharma@example.com"
            required
            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 text-xs"
          />
        </div>

        {!isMagicLink && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs text-slate-300">Password</Label>
              <button
                type="button"
                onClick={() => setIsMagicLink(true)}
                className="text-[11px] text-[#FF7582] hover:underline"
              >
                Use Magic Link instead
              </button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 text-xs"
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 text-xs font-bold bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 hover:brightness-110 shadow-lg shadow-[#FF7582]/20"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : isMagicLink ? (
            'Send Magic Link'
          ) : (
            'Sign In to Account'
          )}
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#FF7582] font-semibold hover:underline">
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
};
