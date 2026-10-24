'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, Loader2, Sparkles } from 'lucide-react';

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg('Please accept data storage consent under DPDP Act 2023 to create a permanent account.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, consent })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to create account');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || 'Registration failed');
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
        <h2 className="text-xl font-black text-slate-100">Create Free Account</h2>
        <p className="text-xs text-slate-300">
          Save your resume diagnostic revisions across devices. 100% free forever.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs text-slate-300">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Arjun Sharma"
            required
            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs text-slate-300">Email Address</Label>
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

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs text-slate-300">Password (8+ characters)</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 text-xs"
          />
        </div>

        <div className="flex items-start space-x-2 pt-1">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="consent" className="text-[11px] text-slate-400 font-normal leading-tight">
            I consent to encrypted profile storage per India’s DPDP Act 2023. I can permanently delete my data anytime.
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 text-xs font-bold bg-gradient-to-r from-[#FF7582] to-[#C56C86] text-slate-950 hover:brightness-110 shadow-lg shadow-[#FF7582]/20"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            'Create Free Account'
          )}
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[#FF7582] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
