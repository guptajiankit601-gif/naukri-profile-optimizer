'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useReport } from '@/lib/context/ReportContext';
import { ApplicationTrackerView } from '@/components/applications/ApplicationTrackerView';
import { DemoProfileBanner } from '@/components/shared/DemoProfileBanner';

export default function ApplicationTrackerPage() {
  return (
    <div className="w-full space-y-4">
      <DemoProfileBanner />
      <ApplicationTrackerView />
    </div>
  );
}
