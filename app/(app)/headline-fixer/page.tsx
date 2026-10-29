'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { HeadlineFixerView } from '@/components/HeadlineFixerView';
import { NaukriProfileAuditView } from '@/components/naukri/NaukriProfileAuditView';
import { EmptyReportState } from '@/components/shared/EmptyReportState';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';
import { Layers, Type } from 'lucide-react';

function HeadlineFixerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams?.get('section');
  const { profile, updateProfile } = useReport();

  const [activeTab, setActiveTab] = useState<'naukri' | 'headline'>(() => {
    if (sectionParam === 'headline') return 'headline';
    return 'naukri';
  });

  useEffect(() => {
    if (sectionParam === 'headline') {
      setActiveTab('headline');
    } else if (sectionParam === 'summary') {
      setActiveTab('naukri');
    }
  }, [sectionParam]);

  if (!profile) {
    return <EmptyReportState onGoToUpload={() => router.push('/')} />;
  }

  return (
    <div className="w-full space-y-6">
      <DemoProfileBanner />

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('naukri')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'naukri'
                ? 'bg-white dark:bg-[#142236] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Naukri Profile Audit &amp; Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('headline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'headline'
                ? 'bg-white dark:bg-[#142236] text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Headline Formula Studio</span>
          </button>
        </div>
      </div>

      {activeTab === 'naukri' ? (
        <NaukriProfileAuditView
          profile={profile}
          onUpdateProfile={(updated, reason) => updateProfile(updated, reason || 'Updated Profile')}
        />
      ) : (
        <HeadlineFixerView
          profile={profile}
          onUpdateProfile={(updated, reason) => updateProfile(updated, reason || 'Updated Headline')}
        />
      )}
    </div>
  );
}

export default function HeadlineFixerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading headline optimizer...</div>}>
      <HeadlineFixerContent />
    </Suspense>
  );
}
