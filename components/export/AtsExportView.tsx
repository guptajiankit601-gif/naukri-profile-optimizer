'use client';

import React from 'react';
import { ExportView as BaseExportView } from '@/components/ExportView';
import { ParsedProfile } from '@/types';

interface AtsExportViewProps {
  profile: ParsedProfile;
}

export const AtsExportView: React.FC<AtsExportViewProps> = ({ profile }) => {
  return <BaseExportView profile={profile} />;
};
